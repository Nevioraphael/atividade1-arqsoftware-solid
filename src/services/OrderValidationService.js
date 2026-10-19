
class OrderValidationService {
  validate(order) {
    if (!order.customer) {
      throw new Error("Cliente obrigatorio.");
    }

    if (
      !order.customer.email ||
      !order.customer.email.includes("@")
    ) {
      throw new Error("E-mail do cliente invalido.");
    }

    if (!order.items || order.items.length === 0) {
      throw new Error("Pedido sem itens.");
    }

    if (!order.customer.address) {
      throw new Error("Endereco do cliente obrigatorio.");
    }

    if (!order.customer.address.region) {
      throw new Error("Regiao do cliente obrigatoria.");
    }

    for (const item of order.items) {
      if (!item.product) {
        throw new Error("Item sem produto.");
      }

      if (
        !Number.isFinite(item.quantity) ||
        item.quantity <= 0
      ) {
        throw new Error("Quantidade invalida.");
      }
    }
  }
}

module.exports = OrderValidationService;
