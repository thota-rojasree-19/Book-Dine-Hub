import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Rooms.css';
import axios from 'axios';

const roomsData = [
  { name: 'Deluxe Room', price: 1500, ac: true, image: 'room1.jpeg' },
  { name: 'Standard Room', price: 900, ac: false, image: 'room2.jpeg' },
  { name: 'Suite', price: 2000, ac: true, image: 'room3.jpeg' },
  { name: 'Basic Room', price: 800, ac: false, image: 'room4.jpeg' },
  { name: 'Executive Room', price: 1700, ac: true, image: 'room5.jpeg' },
  { name: 'Economy Room', price: 600, ac: false, image: 'room6.jpeg' },
];

const Rooms = () => {
  const [filter, setFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState('Guest');
  const [customerEmail, setCustomerEmail] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [availabilityError, setAvailabilityError] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [pendingRoom, setPendingRoom] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restaurantName = queryParams.get('name') || 'Our Restaurant';
  const city = queryParams.get('city') || 'Unknown';

  useEffect(() => {
    const fetchUser = async () => {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) {
        try {
          const res = await axios.get(`http://localhost:5000/api/get-user-details?email=${storedEmail}`);
          setCustomerName(res.data.name);
          setCustomerEmail(res.data.email);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, []);

  const filteredRooms = roomsData.filter((room) => {
    if (filter === 'ac') return room.ac;
    if (filter === 'non-ac') return !room.ac;
    if (filter === 'under-1000') return room.price < 1000;
    return true;
  });

  const handleBook = (room) => {
    setPendingRoom(room);
    setShowDateModal(true);
  };

  const handleDateConfirm = async () => {
    setAvailabilityError('');
    try {
      const response = await axios.post('http://localhost:5000/api/check-room-availability', {
        roomName: pendingRoom.name,
        restaurantName,
        bookingDate,
      });

      if (response.data.isAvailable) {
        setSelectedRoom(pendingRoom);
        setShowDateModal(false);
        setShowModal(true);
      } else {
        setAvailabilityError("The room is already booked on this date. Try another date.");
        setShowDateModal(false);
      }
    } catch (err) {
      console.error("Availability check failed", err);
      setAvailabilityError("Something went wrong. Please try again.");
      setShowDateModal(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  const handlePayment = async () => {
    const bookingDetails = {
      customerName,
      customerEmail,
      restaurantName,
      city,
      roomName: selectedRoom.name,
      roomType: selectedRoom.ac ? 'AC' : 'Non AC',
      price: selectedRoom.price,
      bookingDate: bookingDate.toISOString().split("T")[0],
    };

    try {
      // 1. Store in database (RoomBooking.js schema handles it)
      await axios.post('http://localhost:5000/api/book-room', bookingDetails);

      // 2. Send email confirmation
      await axios.post('http://localhost:5000/api/send-room-booking-email', bookingDetails);

      setBookingSuccess(true);
      setTimeout(() => navigate('/restaurant'), 2000);
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Failed to save booking. Please try again.");
    }
  };

  return (
    <div className="rooms-page">
      <div className="sidebar">
        <h2>Filter Rooms</h2>
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Rooms</button>
        <button className={`filter-btn ${filter === 'ac' ? 'active' : ''}`} onClick={() => setFilter('ac')}>AC Rooms</button>
        <button className={`filter-btn ${filter === 'non-ac' ? 'active' : ''}`} onClick={() => setFilter('non-ac')}>Non AC Rooms</button>
        <button className={`filter-btn ${filter === 'under-1000' ? 'active' : ''}`} onClick={() => setFilter('under-1000')}>Under ₹1000</button>
      </div>

      <div className="rooms-content">
        <div className="rooms-header">
          <h2>Available Rooms at <span style={{ color: '#2c3e50' }}>{restaurantName}</span></h2>
        </div>

        {availabilityError && (
          <p style={{ color: 'red', textAlign: 'center' }}>{availabilityError}</p>
        )}

        <div className="rooms-grid">
          {filteredRooms.map((room, index) => (
            <div key={index} className="room-card">
              <img src={room.image} alt={room.name} />
              <h3>{room.name}</h3>
              <p>₹{room.price}/night</p>
              <div className="room-type">{room.ac ? 'AC Room' : 'Non AC Room'}</div>
              <button className="book-btn" onClick={() => handleBook(room)}>Book Room</button>
            </div>
          ))}
        </div>
      </div>

      {showDateModal && pendingRoom && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Select date to book your room</h2>
            <DatePicker
              selected={bookingDate}
              onChange={(date) => setBookingDate(date)}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
            />
            <div className="modal-buttons">
              <button onClick={handleDateConfirm} style={{ backgroundColor: 'green', color: 'white' }}>
                OK
              </button>
              <button onClick={() => setShowDateModal(false)} style={{ backgroundColor: 'red', color: 'white' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Booking Summary</h2>
            <p><strong>Customer Name:</strong> {customerName}</p>
            <p><strong>Email:</strong> {customerEmail}</p>
            <p><strong>Restaurant Name:</strong> {restaurantName}</p>
            <p><strong>City:</strong> {city}</p>
            <p><strong>Room Name:</strong> {selectedRoom.name}</p>
            <p><strong>Room Type:</strong> {selectedRoom.ac ? 'AC' : 'Non AC'}</p>
            <p><strong>Price:</strong> ₹{selectedRoom.price}</p>
            <p className="date"><strong>Booking Date:</strong> {bookingDate.toDateString()}</p>

            <div className="modal-buttons">
              <button onClick={handlePayment} style={{ backgroundColor: 'green', color: 'white' }}>
                Make Payment
              </button>
              <button onClick={closeModal} style={{ backgroundColor: 'red', color: 'white' }}>
                Close
              </button>
            </div>

            {bookingSuccess && (
              <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>
                Your Room is Booked Successfully!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;










