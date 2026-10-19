
class Customer {
  constructor(id, name, email, phone, type, address) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.type = type;
    this.address = address;
  }

  getCity() {
    return this.address.getCity();
  }

  getState() {
    return this.address.getState();
  }
}

module.exports = Customer;
