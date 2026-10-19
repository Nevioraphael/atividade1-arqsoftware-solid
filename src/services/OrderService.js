const ProductRepository = require("../repositories/ProductRepository");
const OrderRepository = require("../repositories/OrderRepository");
const NotificationService = require("./NotificationService");
const Logger = require("../utils/Logger");
const DiscountService = require("./DiscountService");
const ShippingService = require("./ShippingService");
const OrderValidationService = require("./OrderValidationService");
const OrderCalculationService = require("./OrderCalculationService");
const PaymentService = require("./PaymentService");
const OrderSummaryPrinter = require("./OrderSummaryPrinter");

class OrderService {
  constructor(dependencies = {}) {
    this.productRepository =
      dependencies.productRepository ?? new ProductRepository();

    this.orderRepository =
      dependencies.orderRepository ?? new OrderRepository();

    this.notificationService =
      dependencies.notificationService ?? new NotificationService();

    this.logger =
      dependencies.logger ?? new Logger();

    this.discountService =
      dependencies.discountService ?? new DiscountService();

    this.shippingService =
      dependencies.shippingService ?? new ShippingService();

    this.orderValidationService =
      dependencies.orderValidationService ?? new OrderValidationService();

    this.orderCalculationService =
      dependencies.orderCalculationService ?? new OrderCalculationService();

    this.paymentService =
      dependencies.paymentService ?? new PaymentService();

    this.orderSummaryPrinter =
      dependencies.orderSummaryPrinter ?? new OrderSummaryPrinter();
  }

  process(order) {
    this.logger.info(
      `Iniciando processamento do pedido ${order.id}.`
    );

    // 1. Validar os dados do pedido
    this.orderValidationService.validate(order);

    // 2. Validar a existência dos produtos e o estoque
    for (const item of order.items) {
      const product = this.productRepository.findById(
        item.product.id
      );

      if (!product) {
        throw new Error(
          `Produto ${item.product.id} nao encontrado.`
        );
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Estoque insuficiente para ${product.name}.`
        );
      }
    }

    // 3. Calcular subtotal e peso
    const subtotal =
      this.orderCalculationService.calculateSubtotal(order.items);

    const totalWeight =
      this.orderCalculationService.calculateTotalWeight(order.items);

    // 4. Calcular frete
    const freight = this.shippingService.calculateFreight(
      order,
      totalWeight
    );

    // 5. Processar o pagamento
    const paymentResult = this.paymentService.processPayment(
      order,
      subtotal
    );

    const paymentFee = paymentResult.paymentFee;
    const paymentStatus = paymentResult.paymentStatus;

    // 6. Calcular descontos
    const discount =
      this.discountService.calculateDiscount(order, subtotal) +
      paymentResult.discount;

    // 7. Calcular o total
    const total = Number(
      (subtotal - discount + freight + paymentFee).toFixed(2)
    );

    if (!Number.isFinite(total) || total <= 0) {
      throw new Error("Total do pedido invalido.");
    }

    // 8. Atualizar o estoque
    for (const item of order.items) {
      this.productRepository.updateStock(
        item.product.id,
        item.quantity
      );
    }

    // 9. Definir o status do pedido
    order.status =
      paymentStatus === "approved"
        ? "confirmed"
        : "waiting_payment";

    // 10. Montar o resumo
    const orderSummary = {
      id: order.id,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      city: order.customer.getCity(),
      state: order.customer.getState(),

      items: order.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        subtotal: item.getSubtotal()
      })),

      subtotal,
      discount: Number(discount.toFixed(2)),
      freight: Number(freight.toFixed(2)),
      paymentFee: Number(paymentFee.toFixed(2)),
      total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt
    };

    // 11. Salvar o pedido
    this.orderRepository.save(orderSummary);

    // 12. Notificar o cliente
    if (order.status === "confirmed") {
      this.notificationService.sendOrderConfirmation(
        order.customer,
        order.id,
        total
      );
    } else {
      this.logger.warn(
        `Pedido ${order.id} aguardando pagamento.`
      );
    }

    // 13. Exibir o resumo
    this.orderSummaryPrinter.print(orderSummary);

    return orderSummary;


  }
}

module.exports = OrderService;
