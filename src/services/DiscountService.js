
class DiscountService {
  calculateDiscount(order, subtotal) {
    let discount = 0;

    if (order.customer.type === "vip") {
      discount += subtotal * 0.08;
    }

    if (order.customer.type === "employee") {
      discount += subtotal * 0.15;
    }

    if (order.couponCode === "TECH10") {
      discount += subtotal * 0.10;
    }

    if (subtotal > 8000) {
      discount += 250;
    }

    return Number(discount.toFixed(2));
  }
}

module.exports = DiscountService;
