const Customer = require("../src/domain/Customer");
const Address = require("../src/domain/Address");

const OrderService = require("../src/services/OrderService");

describe("OrderService", () => {
  let orderService;
  let dependencies;
  let order;

  beforeEach(() => {
    dependencies = {
      productRepository: {
        findById: jest.fn((id) => {
          const products = {
            p1: {
              id: "p1",
              name: "Notebook Pro 14",
              price: 1000,
              weight: 2,
              stock: 8
            },
            p2: {
              id: "p2",
              name: "Mouse Sem Fio",
              price: 120,
              weight: 0.2,
              stock: 30
            },
            p3: {
              id: "p3",
              name: "Monitor 27",
              price: 1450,
              weight: 5.4,
              stock: 12
            },
            p4: {
              id: "p4",
              name: "Teclado Mecanico",
              price: 380,
              weight: 0.9,
              stock: 15
            }
          };

          return products[id];
        }),

        updateStock: jest.fn()
      },

      orderRepository: {
        save: jest.fn((orderSummary) => orderSummary)
      },

      notificationService: {
        sendOrderConfirmation: jest.fn()
      },

      logger: {
        info: jest.fn(),
        warn: jest.fn()
      },

      discountService: {
        calculateDiscount: jest.fn().mockReturnValue(80)
      },

      shippingService: {
        calculateFreight: jest.fn().mockReturnValue(30)
      },

      orderValidationService: {
        validate: jest.fn()
      },

      orderCalculationService: {
        calculateSubtotal: jest.fn().mockReturnValue(1000),
        calculateTotalWeight: jest.fn().mockReturnValue(2)
      },

      paymentService: {
        processPayment: jest.fn().mockReturnValue({
          paymentFee: 25,
          paymentStatus: "approved",
          discount: 0
        })
      }
    };

    orderService = new OrderService(dependencies);

    order = {
      id: "o1001",

      customer: new Customer(
        "c1",
        "Ana Souza",
        "ana.souza@example.com",
        "11999999999",
        "vip",
        new Address(
          "Rua das Flores",
          "100",
          "Presidente Prudente",
          "SP",
          "19000-000",
          "sudeste"
        )
      ),

      items: [
        {
          product: {
            id: "p1",
            name: "Notebook Pro 14",
            price: 1000,
            weight: 2
          },
          quantity: 1,
          getSubtotal: jest.fn().mockReturnValue(1000)
        }
      ],

      couponCode: null,
      paymentMethod: "credit_card",
      installments: 3,
      status: "pending",
      createdAt: new Date("2026-10-17T12:00:00Z"),

      getTotalItems: jest.fn().mockReturnValue(1)
    };
  });

  test("deve validar o pedido antes de processá-lo", () => {
    orderService.process(order);

    expect(dependencies.orderValidationService.validate)
      .toHaveBeenCalledWith(order);
  });

  test("deve calcular o subtotal e o peso total", () => {
    orderService.process(order);

    expect(dependencies.orderCalculationService.calculateSubtotal)
      .toHaveBeenCalledWith(order.items);

    expect(dependencies.orderCalculationService.calculateTotalWeight)
      .toHaveBeenCalledWith(order.items);
  });

  test("deve calcular o frete utilizando o peso total", () => {
    orderService.process(order);

    expect(dependencies.shippingService.calculateFreight)
      .toHaveBeenCalledWith(order, 2);
  });

  test("deve processar o pagamento", () => {
    orderService.process(order);

    expect(dependencies.paymentService.processPayment)
      .toHaveBeenCalledWith(order, 1000);
  });

  test("deve calcular corretamente o total do pedido", () => {
    const result = orderService.process(order);

    expect(result.subtotal).toBe(1000);
    expect(result.discount).toBe(80);
    expect(result.freight).toBe(30);
    expect(result.paymentFee).toBe(25);
    expect(result.total).toBe(975);
  });

  test("deve atualizar o estoque dos produtos", () => {
    orderService.process(order);

    expect(dependencies.productRepository.updateStock)
      .toHaveBeenCalledWith("p1", 1);
  });

  test("deve salvar o pedido no repositório", () => {
    const result = orderService.process(order);

    expect(dependencies.orderRepository.save)
      .toHaveBeenCalledWith(result);
  });

  test("deve confirmar o pedido quando o pagamento for aprovado", () => {
    const result = orderService.process(order);

    expect(result.status).toBe("confirmed");
    expect(order.status).toBe("confirmed");
  });

  test("deve enviar uma notificação após a confirmação", () => {
    orderService.process(order);

    expect(dependencies.notificationService.sendOrderConfirmation)
      .toHaveBeenCalledWith(
        order.customer,
        order.id,
        975
      );
  });

  test("deve deixar o pedido aguardando pagamento quando necessário", () => {
    dependencies.paymentService.processPayment.mockReturnValue({
      paymentFee: 0,
      paymentStatus: "waiting_payment",
      discount: 0
    });

    const result = orderService.process(order);

    expect(result.status).toBe("waiting_payment");

    expect(dependencies.notificationService.sendOrderConfirmation)
      .not.toHaveBeenCalled();

    expect(dependencies.logger.warn)
      .toHaveBeenCalled();
  });

  test("deve interromper o processamento se a validação falhar", () => {
    dependencies.orderValidationService.validate.mockImplementation(() => {
      throw new Error("Pedido inválido.");
    });

    expect(() => orderService.process(order))
      .toThrow("Pedido inválido.");

    expect(dependencies.orderRepository.save)
      .not.toHaveBeenCalled();

    expect(dependencies.productRepository.updateStock)
      .not.toHaveBeenCalled();
  });

  test("deve rejeitar um pedido com total inválido", () => {
    dependencies.discountService.calculateDiscount.mockReturnValue(2000);

    expect(() => orderService.process(order))
      .toThrow("Total do pedido invalido.");

    expect(dependencies.orderRepository.save)
      .not.toHaveBeenCalled();
  });
});
