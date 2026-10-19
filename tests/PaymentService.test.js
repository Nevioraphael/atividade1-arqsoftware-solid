
const PaymentService = require("../src/services/PaymentService");

describe("PaymentService", () => {
  let paymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  test("deve aprovar pagamento via Pix e aplicar desconto de 3%", () => {
    const order = {
      paymentMethod: "pix"
    };

    const result = paymentService.processPayment(order, 1000);

    expect(result.paymentStatus).toBe("approved");
    expect(result.paymentFee).toBe(0);
    expect(result.discount).toBe(30);
  });

  test("deve aprovar pagamento com cartão de crédito à vista sem taxa", () => {
    const order = {
      paymentMethod: "credit_card",
      installments: 1
    };

    const result = paymentService.processPayment(order, 1000);

    expect(result.paymentStatus).toBe("approved");
    expect(result.paymentFee).toBe(0);
    expect(result.discount).toBe(0);
  });

  test("deve aplicar taxa de 2,5% no cartão parcelado", () => {
    const order = {
      paymentMethod: "credit_card",
      installments: 3
    };

    const result = paymentService.processPayment(order, 1000);

    expect(result.paymentStatus).toBe("approved");
    expect(result.paymentFee).toBe(25);
    expect(result.discount).toBe(0);
  });

  test("deve aguardar pagamento via boleto", () => {
    const order = {
      paymentMethod: "boleto"
    };

    const result = paymentService.processPayment(order, 1000);

    expect(result.paymentStatus).toBe("waiting_payment");
    expect(result.paymentFee).toBe(0);
    expect(result.discount).toBe(0);
  });

  test("deve rejeitar uma forma de pagamento inválida", () => {
    const order = {
      paymentMethod: "dinheiro"
    };

    expect(() => {
      paymentService.processPayment(order, 1000);
    }).toThrow("Forma de pagamento invalida.");
  });

  test("deve retornar desconto zero para cartão de crédito", () => {
    const order = {
      paymentMethod: "credit_card",
      installments: 2
    };

    const result = paymentService.processPayment(order, 2000);

    expect(result.discount).toBe(0);
  });

  test("deve calcular corretamente a taxa para um subtotal de R$ 2.500", () => {
    const order = {
      paymentMethod: "credit_card",
      installments: 5
    };

    const result = paymentService.processPayment(order, 2500);

    expect(result.paymentFee).toBe(62.5);
  });

  test("deve processar Pix com subtotal zero", () => {
    const order = {
      paymentMethod: "pix"
    };

    const result = paymentService.processPayment(order, 0);

    expect(result.paymentStatus).toBe("approved");
    expect(result.paymentFee).toBe(0);
    expect(result.discount).toBe(0);
  });
});
