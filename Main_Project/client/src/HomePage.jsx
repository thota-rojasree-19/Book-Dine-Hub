import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import API from "./api";

const teamMembers = [
    { img: '/manager.jpeg', name: 'John Doe', role: 'Manager' },
    { img: '/chef.jpeg', name: 'Jane Smith', role: 'Chief Chef' },
    { img: '/it.jpeg', name: 'Robert Brown', role: 'IT Staff' },
    { img: '/server.jpeg', name: 'Emily Johnson', role: 'Server' },
    { img: '/cash.jpeg', name: 'Sophia', role: 'Cashier' }
];

const reviews = [
    { text: "GlitterRestos has exceeded our expectations in every way. The platform is not only easy to use but also highly efficient. We love the floor plan view and the ability to manage reservations from any device, which has improved our team's productivity", name: "Priya Sharma", city: "Hyderabad" },
    { text: "The seamless booking system made it easy for my family to reserve a table. The staff was well-prepared for our visit, and we had a wonderful dining experience.", name: "Arjun Patel", city: "Bengaluru" },
    { text: "The platform's ease of use allowed us to handle multiple reservations seamlessly. Our team productivity has greatly improved.", name: "Sneha Reddy", city: "Visakhapatnam" },
    { text: "Our experience with GlitterRestos was fantastic! The customer support is exceptional, and the booking process is incredibly smooth.", name: "Rajesh Kumar", city: "Guntur" }
];


const HomePage = () => {
    return (
        <div>
        
            
        <section className="home">

            
            <div className="container">
                <h1>GlitterRestos</h1>
                <h2>Welcome to Our Restaurant Table Booking System</h2>
                <p>"All You need is <i>GlitterRestos</i> for Online Table Booking Management of our Restaurant."</p>
            </div>
        </section>
        

        
            <section id="services">
                <h1>Available Restaurants in Andhra Pradesh</h1>
                <div className="restaurant-list" id="restaurantList">
                    {[{
                        name: "Dwaraka", city: "Kadapa", img: "rest1.jpeg"
                    }, {
                        name: "Spicy Bites", city: "Vijayawada", img: "rest2.jpeg"
                    }, {
                        name: "Coastal Flavors", city: "Visakhapatnam", img: "rest3.jpeg"
                    },{
                        name: "Andhra Spice", city: "Guntur", img: "rest4.jpeg"
                    },{
                        name: "Southern Spice", city: "Tirupati", img: "rest5.jpeg"
                    },{
                        name: "Naidu Gari Kunda Biriyani", city: "Nellore", img: "rest6.jpeg"
                    },{
                        name: "SS Palace Multicuisine Restaurant ", city: "Anantapur", img: "rest7.jpeg"
                    },{
                        name: "Mom's Kitchen Mini Restaurant", city: "Chitoor", img: "rest8.jpeg"
                    }].map((restaurant, index) => (
                        <div className="restaurant" key={index}>
                            <img src={restaurant.img} alt={restaurant.name} />
                            <div className="restaurant-info">
                                <h3><a href="#">{restaurant.name}</a></h3>
                                <p>{restaurant.city}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            


            <div className="home-page">
            <section className="content">
                <h1 className="text-red-600 text-4xl font-bold text-center my-4">Craving Something?</h1>
                <h6 className="text-xl italic text-center mb-2">Let's get you started!</h6>
                <p className="text-center mb-4">
                    Experience a delightful dining atmosphere with exquisite flavours and world-class services. 
                    Secure your reservation now!!
                </p>
                <div className="flex justify-center">
                    <img src="jump2.jpeg" alt="Dining Experience" className="rounded-full w-80 h-80 shadow-lg" />
                </div>
            </section>
            </div>


        
            <section id="gallery">
                <h1>Our Gallery</h1>
                <div className="gallery-list">
                    {[...Array(8)].map((_, index) => (
                        <div className="gallery" key={index}>
                            <img src={`gal${index + 1}.jpeg`} alt={`Gallery ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </section>


           
           <section id="team">
            <h1>Our Team</h1>
            <div className="team-container">
                {teamMembers.map((member, index) => (
                    <div className="team-member" key={index}>
                        <img src={member.img} alt={member.name} />
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                    </div>
                ))}
            </div>
        </section>
        <section className="about-page">
            <div className="about-content">
                <h1>About Us</h1>
                <p>
                    Welcome to our Restaurant Table Booking System! We are dedicated to providing an easy-to-use platform for booking your favorite dining spots. Our mission is to connect food lovers with the best restaurants in town, ensuring a seamless dining experience.
                </p>
                <p>
                    Our system allows you to browse restaurants, view available tables, and book your desired table with ease. Whether you're planning a romantic dinner, a family gathering, or a business meeting, we've got you covered.
                </p>
                <p>
                    Experience the best dining experience with us — where convenience meets delicious memories!
                </p>
                <h1>Our Commitment</h1>
                <p>
                    We are dedicated to enhancing your dining journey by making restaurant bookings smooth, reliable, and enjoyable. Join us in revolutionizing the way people dine — one table at a time!
                </p>
                </div>
        </section>

        <section id="reviews">
            <h1>Customer experiences with GlitterRestos</h1>
            <div className="reviews-container">
                {reviews.map((review, index) => (
                    <div className="review-card" key={index}>
                        <div className="stars">★★★★★</div>
                        <p className="review-text">"{review.text}"</p>
                        <div className="customer-info">
                            <div>
                                <strong>{review.name}</strong><br/>
                                {review.city}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
        <section className="contact-section">
                <h1>Contact Us</h1>
                <div className="contact-info">
                    <p className="info">📞 <strong>Phone:</strong> +91 96764 93824</p>
                    <p className="info">✉️ <strong>Email:</strong> support@glitterrestos.com</p>
                    <p className="info">🌐 <strong>Website:</strong> <a href="https://www.GlitterRestos.com" target="_blank" rel="noopener noreferrer">www.GlitterRestos.com</a></p>
                    <p className="info">🕒 <strong>Working Hours:</strong> Mon - Sun | 10:00 AM - 11:00 PM</p>
                </div>
            </section>

            {/* Footer Section */}
            <section id="last">
                <div className="hero-section">
                    <h1>Streamline your restaurant operations today</h1>
                    <div className="btn-container">
                        <Link to="/login" className="btn btn-green">Get started</Link>
                    </div>
                </div>

                <div className="footer">
                    <div className="logo">GlitterRestos</div>
                    <p>Empowering restaurants, one table at a time. Discover seamless dining with GlitterRestos.</p>
                    <div className="social-icons">
                        <i className="fa-brands fa-instagram"></i>
                        <i className="fa-brands fa-facebook"></i>
                        <i className="fa-brands fa-twitter"></i>
                        <i className="fa-brands fa-youtube"></i>
                        <i className="fa-brands fa-linkedin"></i>
                    </div>
                    <div className="copyright">
                        &copy; 2025 Restaurant Table Booking System. All rights reserved.
                    </div>
                </div>
            </section>
        </div>
    );
};



export default HomePage;