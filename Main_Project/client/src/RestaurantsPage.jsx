import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown'; // Import ProfileDropdown
import './RestaurantsPage.css';
import API from "./api";

const restaurantsData = [
    { name: 'Dwaraka', city: 'Kadapa', image: 'rest1.jpeg' },
    { name: 'Spicy Bites', city: 'Vijayawada', image: 'rest2.jpeg' },
    { name: 'Coastal Flavors', city: 'Visakhapatnam', image: 'rest3.jpeg' },
    { name: 'Andhra Spice', city: 'Guntur', image: 'rest4.jpeg' },
    { name: 'Robo Dinner', city: 'Tirupati', image: 'rest5.jpeg' },
    { name: 'BBQ', city: 'Nellore', image: 'rest6.jpeg' },
    { name: 'SS Palace', city: 'Anantapur', image: 'rest7.jpeg' },
    { name: "Mom's Kitchen", city: 'Chittoor', image: 'rest8.jpeg' }
];



const RestaurantsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('all');
    const navigate = useNavigate();

    const filteredRestaurants = restaurantsData.filter(({ name, city }) => {
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = selectedCity === 'all' || city.toLowerCase() === selectedCity.toLowerCase();
        return matchesSearch && matchesCity;
    });

    return (
        <div className="restaurants-background">
            <ProfileDropdown />

            <h1>Restaurants in Andhra Pradesh</h1>

            

            <div className="restaurant-list">
                {filteredRestaurants.map((restaurant, index) => (
                    <div 
                        key={index} 
                        className="restaurant" 
                        onClick={() => navigate(`/table-food-nav?name=${restaurant.name}&city=${restaurant.city}`)}
                        

                    >
                        <img src={restaurant.image} alt={restaurant.name} />
                        <div className="restaurant-info">
                            <h3>{restaurant.name}</h3>
                            <p>{restaurant.city}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantsPage;
