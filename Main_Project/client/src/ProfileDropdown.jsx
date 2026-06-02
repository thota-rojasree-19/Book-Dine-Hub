import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

const ProfileDropdown = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the logged-in user's email from local storage
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setUserEmail(storedEmail);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn"); // Remove login status
        localStorage.removeItem("userEmail");  // Remove user email
        navigate("/login", { replace: true }); // Redirect to login page
    };

    return (
        <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: "1000" }}>
            {/* Profile Circle */}
            <div
                style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "2px solid #ccc",
                    background: "transparent"
                }}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
            >
                <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="User"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
                <div
                    style={{
                        position: "absolute",
                        top: "60px",
                        right: "0",
                        background: "white",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                        padding: "10px",
                        width: "180px",
                        textAlign: "center",
                        zIndex: "1000",
                        border: "1px solid #ddd",
                        display: "flex",
                        flexDirection: "column"
                    }}
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                >
                    <p style={{ margin: "0", fontSize: "14px", color: "#333", padding: "5px 0" }}>
                        {userEmail || "Guest"}
                    </p>
                    <button
                        onClick={() => navigate("/booked-tables")}  // Redirect to Dashboard
                        style={{
                            width: "100%",
                            padding: "8px",
                            border: "none",
                            backgroundColor: "#f0f0f0",
                            color: "#333",
                            cursor: "pointer",
                            borderRadius: "4px",
                            marginBottom: "5px"
                        }}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            padding: "8px",
                            border: "none",
                            backgroundColor: "red",
                            color: "white",
                            cursor: "pointer",
                            borderRadius: "4px",
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
