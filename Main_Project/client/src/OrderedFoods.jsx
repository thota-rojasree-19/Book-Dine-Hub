import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderedFoods.css';

const OrderedFoods = () => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [userEmail] = useState(localStorage.getItem("userEmail") || "");
    console.log("Fetching orders for:", userEmail);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userEmail) {
                setError("User email not found. Please log in again.");
                return;
            }

            try {
                console.log("Fetching orders for:", userEmail);
                const response = await axios.get(`http://localhost:5000/api/orders?email=${userEmail}`);
                console.log("Fetched orders data:", response.data);

                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    setError("Invalid response format.");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to fetch orders.");
            }
        };

        fetchOrders();
    }, [userEmail]);

    const cancelOrder = async (orderId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/cancel-order/${orderId}`);

            if (response.data.success) {
                setOrders(orders.filter(order => order._id !== orderId));
                setMessage("Order canceled successfully!");
                setError("");
            } else {
                setError("Failed to cancel order.");
            }
        } catch (error) {
            console.error("Error canceling order:", error);
            setError("Error while canceling the order.");
        }
    };

    return (
        <div className="ordered-foods-container">
            <div className="sidebar">
                <h2>Dashboard</h2>
                <div onClick={() => window.location.href = "/booked-tables"}>Booked Tables</div>
                <div onClick={() => window.location.href = "/ordered-foods"}>Ordered Foods</div>
                <div onClick={() => window.location.href = "/booked-rooms"}>Booked Rooms</div>
            </div>

            <div className="main-content">
                <h2>Your Orders</h2>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                {orders.length === 0 && !error ? (
                    <p className="text-gray-500 italic">No orders found.</p>
                ) : (
                    <div>
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <h3>
                                    {order.type === 'food' ? 'Restaurant' : order.type === 'room' ? 'Room' : 'Table'}: 
                                    {order.restaurantName || order.roomName || order.tableName}
                                </h3>

                                <p><strong>Customer:</strong> {order.customerName}</p>
                                <p><strong>Email:</strong> {order.userEmail}</p>
                                <p><strong>City:</strong> {order.city}</p>

                                {/* FOOD ORDERS */}
                                {order.foodItems && Array.isArray(order.foodItems) && order.foodItems.length > 0 && (
                                    <>
                                        <h4>Ordered Items:</h4>
                                        <ul>
                                            {order.foodItems.map((item, index) => (
                                                <li key={index}>
                                                    {item.name} (x{item.quantity}) - ₹{item.totalCost}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                {/* ROOM ORDER */}
                                {order.type === 'room' && (
                                    <p><strong>Room Type:</strong> {order.roomType}</p>
                                )}

                                {/* TABLE ORDER */}
                                {order.type === 'table' && (
                                    <p><strong>Table Number:</strong> {order.tableNumber}</p>
                                )}

                                <p><strong>Total Cost:</strong> ₹{order.totalCost}</p>
                                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>

                                <button
                                    className="cancel-button"
                                    onClick={() => cancelOrder(order._id)}
                                >
                                    Cancel Order
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderedFoods;





