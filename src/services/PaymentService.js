const PixPayment = require("./payments/PixPayment");
const CreditCardPayment = require("./payments/CreditCardPayment");
const BoletoPayment = require("./payments/BoletoPayment");

class PaymentService {
  constructor() {
    this.paymentMethods = {
      pix: new PixPayment(),
      credit_card: new CreditCardPayment(),
      boleto: new BoletoPayment()
    };
  }

  processPayment(order, subtotal) {
    const paymentMethod = this.paymentMethods[order.paymentMethod];

    if (!paymentMethod) {
      throw new Error("Forma de pagamento invalida.");
    }

    return paymentMethod.process(order, subtotal);
  }
}

module.exports = PaymentService;
