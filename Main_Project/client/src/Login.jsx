import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import API from "./api";

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            setErrorMessage("Email and Password are required.");
            return;
        }

        // --- Admin bypass logic ---
        if (
            formData.email === "admin123@gmail.com" &&
            formData.password === "Iamadmin@123"
        ) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", formData.email);
            localStorage.setItem("username", "Admin");
            navigate('/admindashboard', { replace: true });
            return;
        }
        // --- End admin bypass logic ---

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log("Server Response:", data); 

            if (response.ok) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userEmail", data.email || formData.email);
                localStorage.setItem("username", data.username || "User"); 

                console.log("Login successful for:", data.username);
                navigate('/restaurant', { replace: true });
            } else {
                if (data.error === "User not found" || data.message === "No user exists") {
                    setErrorMessage("User not registered. Please Register First.");
                } else {
                    setErrorMessage(data.error || "Invalid email or password.");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("Server error! Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Login</h1>
                {errorMessage && <p className="error-text">{errorMessage}</p>}
                <div className="input-group">
                    <label>
                        <FaUserAlt className="icon" /> Email:
                    </label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Enter Email" 
                        value={formData.email} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="input-group">
                    <label>
                        <FaLock className="icon" /> Password:
                    </label>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Enter Password" 
                        value={formData.password} 
                        onChange={handleChange} 
                    />
                </div>
                <button className="login-btn" onClick={handleLogin}>Login</button>
                <p>Don't have an account?</p>
                <button className="register-btn" onClick={() => navigate('/register')}>Register</button>
            </div>
        </div> 
    );
};

export default Login;
