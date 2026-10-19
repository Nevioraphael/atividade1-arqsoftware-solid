
class CreditCardPayment {
  process(order, subtotal) {
    let paymentFee = 0;

    if (order.installments > 1) {
      paymentFee = subtotal * 0.025;
    }

    return {
      paymentFee,
      paymentStatus: "approved",
      discount: 0
    };
  }
}

module.exports = CreditCardPayment;
