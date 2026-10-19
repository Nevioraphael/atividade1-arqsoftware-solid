
class OrderCalculationService {
  calculateSubtotal(items) {
    return items.reduce((subtotal, item) => {
      return subtotal + item.product.price * item.quantity;
    }, 0);
  }

  calculateTotalWeight(items) {
    return items.reduce((totalWeight, item) => {
      return totalWeight + item.product.weight * item.quantity;
    }, 0);
  }
}

module.exports = OrderCalculationService;
