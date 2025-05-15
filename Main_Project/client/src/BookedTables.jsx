import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookedTables.css';

const BookedTables = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        const fetchBookings = async () => {
            if (!userEmail) {
                setError("User email not found. Please log in again.");
                return;
            }

            try {
                console.log("Fetching bookings for:", userEmail);
                const response = await axios.get(`http://localhost:5000/api/booked-tables?email=${userEmail}`);
                setBookings(response.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setError("Failed to fetch bookings. Please try again.");
            }
        };

        fetchBookings();
    }, [userEmail]);

    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/cancel-booking/${bookingId}`);
            
            if (response.data.success) {
                setBookings(bookings.filter((booking) => booking._id !== bookingId));
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Error canceling booking:", error);
            setError("Failed to cancel booking. Please try again.");
        }
    };

    return (
        <div className="booked-tables-container">
            <div className="sidebar">
                <h2>Dashboard</h2>
                <div onClick={() => window.location.href = "/booked-tables"}>Booked Tables</div>
                <div onClick={() => window.location.href = "/ordered-foods"}>Ordered Foods</div>
                <div onClick={() => window.location.href = "/booked-rooms"}>Booked Rooms</div>
                <button 
                    className="back-btn"
                    onClick={() => window.location.href = "/restaurant"}
                >
                    Back now
                </button>
            </div>
            
            <div className="main-content">
                <h2 className="text-2xl font-bold mb-6">Your Booked Tables</h2>

                {error && <p className="text-red-500">{error}</p>}

                {bookings.length === 0 && !error ? (
                    <p className="text-gray-500 italic">No bookings found.</p>
                ) : (
                    <div>
                        {bookings.map((booking) => (
                            <div key={booking._id} className="booking-card">
                                <h3>Table: {booking.tableName}</h3>
                                <p><strong>Customer:</strong> {booking.customerName}</p>
                                <p><strong>Email:</strong> {booking.email}</p>
                                <p><strong>Quantity:</strong> {booking.quantity}</p>
                                <p><strong>Restaurant:</strong> {booking.restaurantName}</p>
                                <p><strong>Table Number:</strong> {booking.tableNumber}</p>
                                <p><strong>City:</strong> {booking.city}</p>
                                <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                                <p><strong>Total Cost:</strong> ₹{booking.totalCost}</p>
                                <button 
                                    className="cancel-btn"
                                    onClick={() => handleCancelBooking(booking._id)}
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookedTables;







