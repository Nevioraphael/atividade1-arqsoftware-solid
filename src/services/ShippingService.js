
class ShippingService {
  calculateFreight(order, totalWeight) {
    if (order.couponCode === "FRETEGRATIS") {
      return 0;
    }

    const region = order.customer.address.region;

    switch (region) {
      case "sudeste":
        return 20 + totalWeight * 4;

      case "sul":
        return 28 + totalWeight * 5;

      case "centro-oeste":
        return 35 + totalWeight * 6;

      case "nordeste":
        return 45 + totalWeight * 7;

      case "norte":
        return 60 + totalWeight * 9;

      default:
        return 50 + totalWeight * 8;
    }
  }
}

module.exports = ShippingService;
