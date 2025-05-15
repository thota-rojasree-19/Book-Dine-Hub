import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaEnvelope, FaLock, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateName = (name) => {
        const nameRegex = /^[A-Za-z\s]+$/;
        return nameRegex.test(name);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required!";
        } else if (!validateName(formData.name)) {
            newErrors.name = "Name should contain only letters and spaces.";
        }

        if (!validateEmail(formData.email)) {
            newErrors.email = "Enter a valid email (e.g., user@example.com)";
        }

        if (!validatePassword(formData.password)) {
            newErrors.password = "Password must be at least 8 characters, contain one uppercase letter, one number, and one special character.";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match!";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Registration successful! Redirecting...");
                setTimeout(() => navigate('/login', { replace: true }), 2000);
            } else {
                setErrorMessage(data.error);
            }
        } catch (error) {
            setErrorMessage("Server error! Please try again.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Register</h1>
                {errorMessage && <p className="error-text">{errorMessage}</p>}
                {successMessage && <p className="success-text">{successMessage}</p>}
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label>
                            <FaUserAlt className="icon" /> Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            pattern="[A-Za-z\s]+"
                            title="Name should contain only letters and spaces."
                        />
                        {errors.name && <p className="error-text">{errors.name}</p>}
                    </div>
                    <div className="input-group">
                        <label>
                            <FaEnvelope className="icon" /> Email
                        </label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        {errors.email && <p className="error-text">{errors.email}</p>}
                    </div>
                    <div className="input-group">
                        <label>
                            <FaLock className="icon" /> Password
                        </label>
                        <div className="password-input">
                            <input 
                                type={showPassword ? "text" : "password"}
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword((prev) => !prev)}
                                style={{ cursor: "pointer", marginLeft: "8px" }}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                tabIndex={0}
                                role="button"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            <FaKey className="static-icon" />
                        </div>
                        {errors.password && <p className="error-text">{errors.password}</p>}
                    </div>
                    <div className="input-group">
                        <label>
                            <FaLock className="icon" /> Confirm Password
                        </label>
                        <div className="password-input">
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                required 
                            />
                            <span
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                style={{ cursor: "pointer", marginLeft: "8px" }}
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                tabIndex={0}
                                role="button"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            <FaKey className="static-icon" />
                        </div>
                        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                    </div>
                    <button type="submit" className="register-btn">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
