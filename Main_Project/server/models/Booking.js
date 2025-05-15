const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  restaurantName: { type: String, required: true },
  city: { type: String, required: true },
  tableName: { type: String, required: true },
  tableNumber: { type: String, required: true },
  bookingDate: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalCost: { type: Number, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
