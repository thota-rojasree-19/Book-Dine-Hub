import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookedRooms.css';
import API from "./api";

const BookedRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [userEmail] = useState(localStorage.getItem("userEmail") || "");
    useEffect(() => {
        const fetchRooms = async () => {
            console.log("Fetching rooms for:", userEmail); // Log the email
            try {
                const response = await API.get(`/booked-rooms?email=${userEmail}`);
                console.log("Fetched data:", response.data); // Log the data
                setRooms(response.data || []);
            } catch (error) {
                console.error("Error fetching booked rooms:", error);
                setError("Failed to fetch booked rooms.");
            }
        };
    
        fetchRooms();
    }, [userEmail]);
    
    const cancelRoomBooking = async (bookingId) => {
        try {
            const response = await API.delete(`/cancel-room/${bookingId}`);

            if (response.data.success) {
                setRooms(rooms.filter(room => room._id !== bookingId));
                setMessage("Room booking cancelled successfully!");
                setError("");
            } else {
                setError("Failed to cancel room booking.");
            }
        } catch (error) {
            console.error("Error cancelling room booking:", error);
            setError("Error while cancelling the room booking.");
        }
    };

    return (
        <div className="booked-rooms-container">
            <div className="sidebar">
                <h2>Dashboard</h2>
                <div onClick={() => window.location.href = "/booked-tables"}>Booked Tables</div>
                <div onClick={() => window.location.href = "/ordered-foods"}>Ordered Foods</div>
                <div onClick={() => window.location.href = "/booked-rooms"}>Booked Rooms</div>
            </div>

            <div className="main-content">
                <h2>Your Booked Rooms</h2>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                {rooms.length === 0 && !error ? (
                    <p className="text-gray-500 italic">No room bookings found.</p>
                ) : (
                    <div>
                        {rooms.map((room) => (
                            <div key={room._id} className="room-card">
                                <h3>Restaurant: {room.restaurantName}</h3>
                                <p><strong>Customer:</strong> {room.customerName}</p>
                                <p><strong>Email:</strong> {room.customerEmail || "Not provided"}</p>
                                <p><strong>City:</strong> {room.city}</p>
                                <p><strong>Room:</strong> {room.roomName}</p>
                                <p><strong>Room Type:</strong> {room.roomType}</p>
                                <p><strong>Booking Date:</strong> {room.bookingDate ? new Date(room.bookingDate).toLocaleDateString() : "N/A"}</p>
                                <p><strong>Total Cost:</strong> ₹{room.price}</p>

                                <button
                                    className="cancel-button"
                                    onClick={() => cancelRoomBooking(room._id)}
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

export default BookedRooms;








