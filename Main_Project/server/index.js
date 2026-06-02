require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
app.use(cors());
app.use(express.json());




// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ Database connection error:", err));
const User = require("./models/User");
const Booking = require("./models/Booking");



// ✅ RoomBooking Schema
const roomSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  restaurantName: String,
  city: String,
  roomName: String,
  roomType: String,
  price: Number,
  bookingDate: String,
});
const RoomBooking = mongoose.model("RoomBooking", roomSchema, "rooms");


const orderSchema = new mongoose.Schema({
  customerName: String,
  userEmail: String,
  restaurantName: String,
  city: String,
  foodItems: [{ name: String, quantity: Number, totalCost: Number }],
  totalCost: Number,
  orderDate: String,
});

const Order = mongoose.model("Order", orderSchema);


// Auth Routes
const authRoutes = require("./routes/auth.js");
app.use("/auth", authRoutes);




// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Account already exists!" });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ error: "Server error!" });
  }
});











// ✅ Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password!" });
    }

    res.json({
      message: "Login successful",
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

// ✅ Book Table
app.post("/api/book-table", async (req, res) => {
  try {
    const requiredFields = [
      "customerName", "email", "restaurantName", "city",
      "tableName", "tableNumber", "bookingDate", "quantity", "totalCost"
    ];

    const missingField = requiredFields.find(field => !req.body[field]);
    if (missingField) {
      return res.status(400).json({ error: `Missing: ${missingField}` });
    }

    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: "Booking saved successfully!", booking: newBooking });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ error: "Failed to book a table" });
  }
});

// ✅ Get Booked Tables
app.get("/api/booked-tables", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const bookings = await Booking.find({ email });
    res.json(bookings);
  } catch (error) {
    console.error("❌ Fetching bookings error:", error);
    res.status(500).json({ error: "Failed to retrieve bookings" });
  }
});

// ✅ Cancel Table Booking
app.delete("/api/cancel-booking/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ success: true, message: "Booking canceled successfully!" });
  } catch (error) {
    console.error("❌ Cancel booking error:", error);
    res.status(500).json({ error: "Error canceling booking!" });
  }
});

app.post('/api/check-table-availability', async (req, res) => {
  try {
      const { tableNumber, restaurantName, bookingDate } = req.body;
      // Check if a booking already exists for this table on this date
      const existingBooking = await Booking.findOne({
          tableNumber,
          restaurantName,
          bookingDate
      });
      res.json({ isAvailable: !existingBooking });
  } catch (error) {
      console.error("Error checking table availability:", error);
      res.status(500).json({ isAvailable: false, error: "Server error" });
  }
});

// ✅ Get User Info
app.get("/api/get-user-details", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error("❌ Error fetching user details:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/get-user", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ name: user.name });
  } catch (error) {
    console.error("❌ Fetch user error:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

// ✅ Store Food Order
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order saved successfully!" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
});

app.get("/api/orders", async (req, res) => {
  const { email } = req.query;

  try {
      if (!email) {
          return res.status(400).json({ message: "Email is required" });
      }

      const allOrders = await Order.find({});
      console.log("All Orders in DB:", allOrders); 

      const orders = await Order.find({ userEmail: email });
      console.log("Filtered Orders:", orders); 

      res.json(orders);
  } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Server error" });
  }
});

app.delete('/api/cancel-order/:orderId', async (req, res) => {
  try {
      const orderId = req.params.orderId;
      const result = await Order.findByIdAndDelete(orderId);
      if (!result) {
          return res.status(404).json({ success: false, message: "Order not found" });
      }
      res.json({ success: true, message: "Order canceled successfully" });
  } catch (error) {
      console.error("Error canceling order:", error);
      res.status(500).json({ success: false, message: "Error canceling the order" });
  }
});



app.post("/api/book-room", async (req, res) => {
  const {
    customerName,
    customerEmail,
    restaurantName,
    city,
    roomName,
    roomType,
    price,
    bookingDate,
  } = req.body;

  const formattedDate = new Date(bookingDate).toISOString().split("T")[0];
  console.log("📆 Received bookingDate:", bookingDate);
  console.log("📆 Formatted bookingDate:", formattedDate);

  try {
    const existingBooking = await RoomBooking.findOne({
      roomName,
      restaurantName,
      bookingDate: formattedDate,
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Room is already booked on this date" });
    }

    const newBooking = new RoomBooking({
      customerName,
      customerEmail,
      restaurantName,
      city,
      roomName,
      roomType,
      price,
      bookingDate: formattedDate,
    });

    await newBooking.save();
    console.log("✅ Room booking saved:", newBooking);
    res.status(201).json({ message: "Room booked successfully" });
  } catch (error) {
    console.error("❌ Room booking failed:", error);
    res.status(500).json({ message: "Server error while booking room" });
  }
});

app.get('/api/booked-rooms', async (req, res) => {
  const customerEmail = req.query.email;
  try {
      const bookings = await RoomBooking.find({ customerEmail });
      res.json(bookings);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
});





app.delete('/api/cancel-room/:id', async (req, res) => {
  try {
    const result = await RoomBooking.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      return res.json({ success: true });
    } else {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
  } catch (error) {
    console.error("Error deleting room booking:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


app.post("/api/check-room-availability", async (req, res) => {
  const { roomName, restaurantName, bookingDate } = req.body;
  const formattedDate = new Date(bookingDate).toISOString().split("T")[0];

  try {
    const existingBooking = await RoomBooking.findOne({
      roomName,
      restaurantName,
      bookingDate: formattedDate,
    });

    res.json({ isAvailable: !existingBooking });
  } catch (error) {
    console.error("Error checking room availability:", error);
    res.status(500).json({ message: "Server error while checking availability" });
  }
});



app.post("/api/send-booking-email", async (req, res) => {
  const { email, bookingDetails } = req.body;

  if (!email || !bookingDetails) {
    return res.status(400).json({ message: "Missing email or booking details." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Table Booking Confirmation",
      html: `
        <h3>Hi ${bookingDetails.customerName},</h3>
        <p>Your table booking is confirmed with the following details:</p>
        <ul>
          <li><strong>Restaurant:</strong> ${bookingDetails.restaurantName} in ${bookingDetails.city}</li>
          <li><strong>Table:</strong> ${bookingDetails.tableName} (${bookingDetails.tableNumber})</li>
          <li><strong>Date:</strong> ${bookingDetails.bookingDate}</li>
          <li><strong>Quantity:</strong> ${bookingDetails.quantity}</li>
          <li><strong>Total Cost:</strong> ₹${bookingDetails.totalCost}</li>
        </ul>
        <p>Thank you for booking with us!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Confirmation email sent!" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Email sending failed." });
  }
});

app.post("/api/send-room-booking-email", async (req, res) => {
  const {
    customerName,
    customerEmail,
    restaurantName,
    city,
    roomName,
    roomType,
    price,
    bookingDate,
  } = req.body;

  if (
    !customerName || !customerEmail || !restaurantName ||
    !city || !roomName || !roomType || !price || !bookingDate
  ) {
    return res.status(400).json({ error: "Missing required booking details" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: "Room Booking Confirmation",
      html: `
        <h3>Hi ${customerName},</h3>
        <p>Your room booking is confirmed with the following details:</p>
        <ul>
          <li><strong>Restaurant:</strong> ${restaurantName} in ${city}</li>
          <li><strong>Room:</strong> ${roomName} (${roomType})</li>
          <li><strong>Date:</strong> ${bookingDate}</li>
          <li><strong>Price:</strong> ₹${price}</li>
        </ul>
        <p>Thank you for booking with us!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Room booking email sent!" });
  } catch (err) {
    console.error("❌ Failed to send room booking email:", err);
    res.status(500).json({ error: "Email sending failed" });
  }
});







app.post("/api/send-food-order-email", async (req, res) => {
  const {
    customerName,
    customerEmail,
    restaurantName,
    city,
    foodItems,
    totalCost,
    orderDate,
  } = req.body;

  if (!customerName || !customerEmail || !restaurantName || !city || !foodItems || !totalCost || !orderDate) {
    return res.status(400).json({ error: "Missing required order details" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: "Food Order Confirmation",
      html: `
        <h3>Hi ${customerName},</h3>
        <p>Your food order has been successfully placed at ${restaurantName} in ${city}. Here are the details:</p>
        <ul>
          ${foodItems.map(
            item => `
            <li><strong>${item.name}</strong> (x${item.quantity}) - ₹${item.totalCost}</li>
          `).join('')}
        </ul>
        <p><strong>Total Cost:</strong> ₹${totalCost}</p>
        <p><strong>Order Date:</strong> ${new Date(orderDate).toDateString()}</p>
        <p>We will deliver your food on the selected date. Thank you for choosing ${restaurantName}!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Food order email sent!" });
  } catch (err) {
    console.error("❌ Failed to send food order email:", err);
    res.status(500).json({ error: "Email sending failed" });
  }
});


import path from "path";
import { fileURLToPath } from "url";

// Add these two lines at the top of index.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// after all your API routes, add this:
import express from "express";
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
