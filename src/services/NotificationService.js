
class NotificationService {
  sendOrderConfirmation(customer, orderId, total) {
    console.log("\n=== CONFIRMAÇÃO DO PEDIDO ===");
    console.log(`Cliente: ${customer.name}`);
    console.log(`E-mail: ${customer.email}`);
    console.log(`Pedido: ${orderId}`);
    console.log(`Valor total: R$ ${total.toFixed(2)}`);
    console.log("Notificação de confirmação enviada.");
    console.log("=============================\n");
  }
}

module.exports = NotificationService;
