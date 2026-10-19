
class OrderSummaryPrinter {
  print(orderSummary) {
    console.log("\nResumo do pedido");
    console.log(`Cliente: ${orderSummary.customerName}`);
    console.log(
      `Cidade: ${orderSummary.city}/${orderSummary.state}`
    );

    const totalItems = orderSummary.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    console.log(`Itens: ${totalItems}`);
    console.log(`Subtotal: R$ ${orderSummary.subtotal.toFixed(2)}`);
    console.log(`Desconto: R$ ${orderSummary.discount.toFixed(2)}`);
    console.log(`Frete: R$ ${orderSummary.freight.toFixed(2)}`);
    console.log(`Taxas: R$ ${orderSummary.paymentFee.toFixed(2)}`);
    console.log(`Total: R$ ${orderSummary.total.toFixed(2)}`);
  }
}

module.exports = OrderSummaryPrinter;
