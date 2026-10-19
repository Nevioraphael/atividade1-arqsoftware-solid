

const DiscountService = require("../src/services/DiscountService");

describe("DiscountService", () => {
  let discountService;

  beforeEach(() => {
    discountService = new DiscountService();
  });

  test("deve aplicar 8% de desconto para cliente VIP", () => {
    const order = {
      customer: { type: "vip" },
      couponCode: null,
      paymentMethod: "credit_card"
    };

    expect(discountService.calculateDiscount(order, 1000)).toBe(80);
  });

  test("deve aplicar 15% de desconto para funcionário", () => {
    const order = {
      customer: { type: "employee" },
      couponCode: null,
      paymentMethod: "credit_card"
    };

    expect(discountService.calculateDiscount(order, 1000)).toBe(150);
  });

  test("deve aplicar 10% de desconto com o cupom TECH10", () => {
    const order = {
      customer: { type: "regular" },
      couponCode: "TECH10",
      paymentMethod: "credit_card"
    };

    expect(discountService.calculateDiscount(order, 1000)).toBe(100);
  });

  test("deve aplicar R$ 250 de desconto para subtotal acima de R$ 8.000", () => {
    const order = {
      customer: { type: "regular" },
      couponCode: null,
      paymentMethod: "credit_card"
    };

    expect(discountService.calculateDiscount(order, 9000)).toBe(250);
  });

  test("não deve aplicar o desconto fixo quando o subtotal for R$ 8.000", () => {
    const order = {
      customer: { type: "regular" },
      couponCode: null,
      paymentMethod: "credit_card"
    };

    expect(discountService.calculateDiscount(order, 8000)).toBe(0);
  });

  test("não deve aplicar desconto de Pix neste serviço", () => {
    const order = {
      customer: { type: "regular" },
      couponCode: null,
      paymentMethod: "pix"
    };

    expect(discountService.calculateDiscount(order, 1000)).toBe(0);
  });

  test("deve combinar desconto VIP e cupom sem incluir desconto de Pix", () => {
    const order = {
      customer: { type: "vip" },
      couponCode: "TECH10",
      paymentMethod: "pix"
    };

    // VIP: R$ 80 + cupom: R$ 100
    expect(discountService.calculateDiscount(order, 1000)).toBe(180);
  });

  test("deve arredondar o desconto para duas casas decimais", () => {
    const order = {
      customer: { type: "vip" },
      couponCode: null,
      paymentMethod: "credit_card"
    };

    expect(discountService.calculateDiscount(order, 10.05)).toBe(0.8);
  });
});
