
const ShippingService = require("../src/services/ShippingService");

describe("ShippingService", () => {
  let shippingService;

  beforeEach(() => {
    shippingService = new ShippingService();
  });

  const criarPedido = (region, couponCode = null) => ({
    couponCode,
    customer: {
      address: {
        region
      }
    }
  });

  test("deve calcular o frete para a região Sudeste", () => {
    const order = criarPedido("sudeste");

    expect(shippingService.calculateFreight(order, 5)).toBe(40);
  });

  test("deve calcular o frete para a região Sul", () => {
    const order = criarPedido("sul");

    expect(shippingService.calculateFreight(order, 5)).toBe(53);
  });

  test("deve calcular o frete para a região Centro-Oeste", () => {
    const order = criarPedido("centro-oeste");

    expect(shippingService.calculateFreight(order, 5)).toBe(65);
  });

  test("deve calcular o frete para a região Nordeste", () => {
    const order = criarPedido("nordeste");

    expect(shippingService.calculateFreight(order, 5)).toBe(80);
  });

  test("deve calcular o frete para a região Norte", () => {
    const order = criarPedido("norte");

    expect(shippingService.calculateFreight(order, 5)).toBe(105);
  });

  test("deve calcular o frete padrão para uma região desconhecida", () => {
    const order = criarPedido("outra-regiao");

    expect(shippingService.calculateFreight(order, 5)).toBe(90);
  });

  test("deve oferecer frete grátis com o cupom FRETEGRATIS", () => {
    const order = criarPedido("sudeste", "FRETEGRATIS");

    expect(shippingService.calculateFreight(order, 5)).toBe(0);
  });

  test("deve calcular o frete sem peso adicional", () => {
    const order = criarPedido("sudeste");

    expect(shippingService.calculateFreight(order, 0)).toBe(20);
  });

  test("deve calcular o frete para peso fracionado", () => {
    const order = criarPedido("sudeste");

    expect(shippingService.calculateFreight(order, 2.5)).toBe(30);
  });
});
