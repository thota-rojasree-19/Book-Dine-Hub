import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./HomePage";
import Login from './Login';
import RestaurantsPage from './RestaurantsPage';
import TableFoodNav from './TableFoodNav';
import Tables from './Tables';
import Food from './Food';
import Register from './Register';
import BookedTables from './BookedTables';
import OrderedFoods from "./OrderedFoods";
import Cart from './Cart';
import Rooms from './Rooms';
import BookedRooms from './BookedRooms';



function App() {
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        // Retrieve user email from localStorage
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser?.email) {
            setUserEmail(loggedInUser.email);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/restaurant" element={<RestaurantsPage />} />
                <Route path="/table-food-nav" element={<TableFoodNav />} />
                <Route path="/tables" element={<Tables />} />
                <Route path="/food" element={<Food />} />
                <Route path="/register" element={<Register />} />
                <Route path="/booked-tables" element={<BookedTables userEmail={userEmail} />} />
                <Route path="/ordered-foods" element={<OrderedFoods />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/booked-rooms" element={<BookedRooms />} />
                
               

            </Routes>
        </Router>
    );
}

export default App;
