import React from "react";
import "./ContactPage.css";

const ContactPage = () => {
    return (
        <div className="contact-page">
            <div className="contact-card">
                <div className="contact-image">
                    <img src="/contact.jpeg" alt="Contact Image" />
                </div>
                <div className="contact-title">
                    <h1><u>CONTACT US</u></h1>
                </div>
                <ul className="contact-info">
                    <li><i className="fa-solid fa-phone"></i> <h3>+123-456-7890</h3></li>
                    <li><i className="fas fa-envelope"></i> <h3>rtbs1049@gmail.com</h3></li>
                    <li><i className="fas fa-map-marker-alt"></i> <h3>Kadapa, AP, India, 516330</h3></li>
                </ul>
                <div className="social-handle">
                    <i className="fa-regular fa-copyright"></i>
                    @restaurant_table_booking_system_2025
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
