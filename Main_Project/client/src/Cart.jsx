import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState(null);
  const [restaurantName, setRestaurantName] = useState("Unknown Restaurant");
  const [city, setCity] = useState("Unknown City");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateError, setDateError] = useState("");

  const getCartKey = (email, restaurant) =>
    `cart_${email || "guest"}_${restaurant || "unknown"}`;

  useEffect(() => {
    if (location.state) {
      setCustomerName(location.state.customerName || "Guest User");
      setUserEmail(location.state.userEmail || "guest");
      setRestaurantName(location.state.restaurantName || "Unknown Restaurant");
      setCity(location.state.city || "Unknown City");

      const cartKey = getCartKey(location.state.userEmail, location.state.restaurantName);
      const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
      setCart(storedCart);
    }
  }, [location.state]);

  const updateQuantity = (foodName, quantity) => {
    const updatedCart = cart.map(item =>
      item.name === foodName ? { ...item, quantity: Math.max(quantity, 1) } : item
    );
    setCart(updatedCart);
    localStorage.setItem(getCartKey(userEmail, restaurantName), JSON.stringify(updatedCart));
  };

  const removeItem = (foodName) => {
    const updatedCart = cart.filter(item => item.name !== foodName);
    setCart(updatedCart);
    localStorage.setItem(getCartKey(userEmail, restaurantName), JSON.stringify(updatedCart));
  };

  const getTotalCost = () => cart.reduce((total, item) => total + item.cost * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowDateModal(true); // Show calendar modal
  };

  // Checks if selected date is in the future (ignoring time)
  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate > today;
  };

  const confirmDateAndPlaceOrder = async () => {
    if (!isFutureDate(selectedDate)) {
      setDateError("❌ Please select a future date for food delivery.");
      return;
    }

    const orderData = {
      customerName,
      userEmail,
      restaurantName,
      city,
      foodItems: cart.map(({ name, quantity, cost }) => ({
        name,
        quantity,
        totalCost: cost * quantity,
      })),
      totalCost: getTotalCost(),
      orderDate: selectedDate.toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to place order");

      await sendOrderConfirmationEmail(orderData);

      setShowDateModal(false);
      setIsPaymentSuccessful(true);

      setTimeout(() => {
        localStorage.removeItem(getCartKey(userEmail, restaurantName));
        setCart([]);
        setIsPaymentSuccessful(false);
        navigate("/restaurant");
      }, 3000);
    } catch (error) {
      console.error("Order submission failed:", error);
    }
  };

  const sendOrderConfirmationEmail = async (orderData) => {
    try {
      const emailData = {
        customerName,
        customerEmail: userEmail,
        restaurantName,
        city,
        foodItems: cart.map(({ name, quantity, cost }) => ({
          name,
          quantity,
          totalCost: cost * quantity,
        })),
        totalCost: getTotalCost(),
        orderDate: selectedDate.toISOString(),
      };

      const response = await fetch("http://localhost:5000/api/send-food-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Format date as dd-MM-yyyy for display
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="cart-container">
      <h1>{customerName}'s Cart</h1>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to Food</button>

      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div className="cart-content">
          <div className="cart-details">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.img} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>₹{item.cost} x {item.quantity} = ₹{item.cost * item.quantity}</p>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item.name, parseInt(e.target.value))}
                  />
                  <button className="remove-btn" onClick={() => removeItem(item.name)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Cart Summary</h2>
            <p><strong>Customer:</strong> {customerName}</p>
            <p><strong>Email:</strong> {userEmail}</p>
            <p><strong>Restaurant:</strong> {restaurantName}</p>
            <p><strong>City:</strong> {city}</p>
            <h3>Food Items:</h3>
            <ul>
              {cart.map((item, index) => (
                <li key={index}>{item.name} (x{item.quantity}) - ₹{item.cost * item.quantity}</li>
              ))}
            </ul>
            <p><strong>Total Cost:</strong> ₹{getTotalCost()}</p>
            <button className="checkout-btn" onClick={handleCheckout}>Pay Now</button>
          </div>
        </div>
      )}

      {/* Date Selection Modal */}
      {showDateModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Select Date for Your Food Order</h2>
            <div className="datepicker-wrapper">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setDateError("");
                }}
                // Allow all dates (past and future)
                dateFormat="dd-MM-yyyy" // Display format
                placeholderText="Select a date"
                className="datepicker-input"
                calendarClassName="custom-calendar"
              />
            </div>
            {selectedDate && (
              <p style={{ textAlign: "center", marginBottom: "10px" }}>
                Selected Date: <strong>{formatDate(selectedDate)}</strong>
              </p>
            )}
            {dateError && <p style={{ color: "red", marginTop: "10px" }}>{dateError}</p>}
            <div className="modal-buttons">
              <button
                onClick={confirmDateAndPlaceOrder}
                style={{ backgroundColor: "green", color: "white" }}
              >
                OK
              </button>
              <button
                onClick={() => {
                  setShowDateModal(false);
                  setDateError("");
                }}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {isPaymentSuccessful && (
        <div className="popup">
          <div className="popup-content">
            <h2>✅ Your Food is Ordered Successfully!</h2>
            <p>We’ll deliver on <strong>{formatDate(selectedDate)}</strong>. Enjoy your meal! 🍽️</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;











