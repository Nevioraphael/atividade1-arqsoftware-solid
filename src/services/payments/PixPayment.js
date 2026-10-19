
class PixPayment {
  process(order, subtotal) {
    return {
      paymentFee: 0,
      paymentStatus: "approved",
      discount: subtotal * 0.03
    };
  }
}

module.exports = PixPayment;

