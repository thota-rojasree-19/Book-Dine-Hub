import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Tables.css";

const Tables = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const restaurantName = params.get("name") || "Unknown Restaurant";
    const city = params.get("city") || "Unknown City";

    const [showDateDialog, setShowDateDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [bookingDetails, setBookingDetails] = useState({});
    const [isBooked, setIsBooked] = useState(false);
    const [customerName, setCustomerName] = useState("Guest User");
    const [userEmail, setUserEmail] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [bookingDate, setBookingDate] = useState("");
    const [availabilityError, setAvailabilityError] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) setUserEmail(storedEmail);
    }, []);

    useEffect(() => {
        if (userEmail) {
            const fetchUserName = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/get-user?email=${userEmail}`);
                    const data = await res.json();
                    if (data.name) setCustomerName(data.name);
                } catch (error) {
                    console.error("Error fetching user name:", error);
                }
            };
            fetchUserName();
        }
    }, [userEmail]);

    const handleBookTable = (tableName, cost, tableNumber) => {
        const quantity = document.getElementById(`quantity-${tableNumber}`).value;
        setSelectedTable({ tableName, cost, tableNumber, quantity });
        setAvailabilityError("");
        setShowDateDialog(true);
    };

    const handleDateConfirm = async () => {
        if (!bookingDate) {
            alert("Please select a date for booking.");
            return;
        }

        const selectedDate = new Date(bookingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // reset today's time to 00:00

        if (selectedDate < today) {
            setAvailabilityError("You cannot book a table for a past date.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/check-table-availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tableNumber: selectedTable.tableNumber,
                    restaurantName,
                    bookingDate,
                }),
            });

            if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);

            const data = await response.json();

            if (!data.isAvailable) {
                setAvailabilityError("Table is already booked on this date, try on another date.");
                return;
            }

            const totalCost = selectedTable.cost * selectedTable.quantity;
            const newBookingDetails = {
                customerName,
                email: userEmail,
                restaurantName,
                city,
                tableName: selectedTable.tableName,
                tableNumber: selectedTable.tableNumber,
                bookingDate,
                quantity: selectedTable.quantity,
                totalCost,
            };

            setBookingDetails(newBookingDetails);
            setShowDateDialog(false);
            setShowPaymentDialog(true);
        } catch (error) {
            console.error("Availability check failed:", error);
            setAvailabilityError("Failed to check availability. Please try again.");
        }
    };

    const payNow = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/book-table", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingDetails),
            });

            if (!response.ok) throw new Error("Failed to save booking");

            await fetch("http://localhost:5000/api/send-booking-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: bookingDetails.email, bookingDetails }),
            });

            setShowPaymentDialog(false);
            setShowConfirmationDialog(true);
            setIsBooked(true);
            setTimeout(() => navigate("/restaurant"), 2000);
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Booking failed. Please try again.");
        }
    };

    const cancelBooking = async () => {
        if (isBooked) {
            try {
                const response = await fetch(`http://localhost:5000/api/cancel-booking/${bookingDetails._id}`, {
                    method: "DELETE",
                });

                if (!response.ok) throw new Error("Failed to cancel booking");

                setShowCancelDialog(true);
                setIsBooked(false);
            } catch (error) {
                console.error("Cancellation failed:", error);
                alert("Failed to cancel booking. Please try again.");
            }
        }
    };

    return (
        <div className="tables-container">
            <h1>Table Booking at {restaurantName} in {city}</h1>
            <div className="table-list">
                {[
                    { name: "For Two Persons", cost: 500, number: "T01", img: "tab1.jpeg" },
                    { name: "For Three Persons", cost: 700, number: "T02", img: "tab2.jpeg" },
                    { name: "For Four Persons", cost: 900, number: "T03", img: "tab3.jpeg" },
                    { name: "Family Table", cost: 1500, number: "T04", img: "tab4.jpeg" },
                ].map(({ name, cost, number, img }) => (
                    <div key={number} className="table-item">
                        <div className="table-image">
                            <img src={img} alt={name} />
                        </div>
                        <div className="table-details">
                            <h3>{name}</h3>
                            <p>Cost: ₹{cost}</p>
                            <p>Table Number: {number}</p>
                            <label>
                                Quantity: <input type="number" id={`quantity-${number}`} min="1" defaultValue="1" />
                            </label>
                            <button className="book-button" onClick={() => handleBookTable(name, cost, number)}>
                                Book Table
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Select Date Dialog */}
            {showDateDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <h3>Select Booking Date</h3>
                        <input
                            type="date"
                            value={bookingDate}
                            onChange={(e) => {
                                setBookingDate(e.target.value);
                                setAvailabilityError("");
                            }}
                            min={new Date().toISOString().split("T")[0]}
                        />
                        <br />
                        {availabilityError && <p className="error-text">{availabilityError}</p>}
                        <button onClick={handleDateConfirm}>OK</button>
                        <button onClick={() => {
                            setShowDateDialog(false);
                            setAvailabilityError("");
                        }}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Payment Dialog */}
            {showPaymentDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <h3>Payment Details</h3>
                        <p>
                            <b>Customer Name:</b> {bookingDetails.customerName}<br />
                            <b>Email:</b> {bookingDetails.email}<br />
                            <b>Restaurant Name:</b> {bookingDetails.restaurantName}<br />
                            <b>City:</b> {bookingDetails.city}<br />
                            <b>Table Name:</b> {bookingDetails.tableName}<br />
                            <b>Table Number:</b> {bookingDetails.tableNumber}<br />
                            <b>Booking Date:</b> {bookingDetails.bookingDate}<br />
                            <b>Total Cost:</b> ₹{bookingDetails.totalCost}
                        </p>
                        <button onClick={payNow}>Pay Now</button>
                        <button onClick={() => setShowPaymentDialog(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {showConfirmationDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <h3>Booking Confirmed</h3>
                        <p>Your table booking has been successfully confirmed!</p>
                        <button onClick={() => setShowConfirmationDialog(false)}>OK</button>
                    </div>
                </div>
            )}

            {/* Cancellation Dialog */}
            {showCancelDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <h3>Booking Canceled</h3>
                        <p>Your table booking has been successfully canceled.</p>
                        <button onClick={() => setShowCancelDialog(false)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tables;

