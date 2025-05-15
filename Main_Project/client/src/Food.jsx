// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./Food.css";

// const Food = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const params = new URLSearchParams(location.search);
//     const restaurantName = params.get("name") || "Restaurant";
//     const city = params.get("city") || "City";

//     const getCartKey = (email, restaurant) => `cart_${email || "guest"}_${restaurant || "unknown"}`;

//     const [cart, setCart] = useState([]);
//     const [customerName, setCustomerName] = useState("Guest User");
//     const [userEmail, setUserEmail] = useState(null);
//     const [showOrderDialog, setShowOrderDialog] = useState(false);
//     const [orderSummary, setOrderSummary] = useState(null);
//     const [orderDate, setOrderDate] = useState("");
//     const [orderSuccess, setOrderSuccess] = useState(false);
//     const [selectedQuantity, setSelectedQuantity] = useState(1);

//     useEffect(() => {
//         const storedEmail = localStorage.getItem("userEmail");
//         if (storedEmail) setUserEmail(storedEmail);
//     }, []);

//     useEffect(() => {
//         if (userEmail) {
//             const fetchUserName = async () => {
//                 try {
//                     const response = await fetch(`http://localhost:5000/api/get-user?email=${userEmail}`);
//                     const data = await response.json();
//                     if (data.name) setCustomerName(data.name);
//                 } catch (error) {
//                     console.error(error);
//                 }
//             };
//             fetchUserName();
//         }
//     }, [userEmail]);

//     useEffect(() => {
//         const cartKey = getCartKey(userEmail, restaurantName);
//         const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
//         setCart(storedCart);
//     }, [userEmail, restaurantName]);

//     const foodItems = [
//         { name: 'Pizza', cost: 250, img: 'pizza.jpeg' },
//         { name: 'Burger', cost: 150, img: 'burger.jpeg' },
//         { name: 'Hyderabad Biriyani', cost: 350, img: 'biriyani3.jpeg' },
//         { name: 'Chicken Mandi', cost: 550, img: 'mandi.jpeg' },
//         { name: 'Panipuri', cost: 100, img: 'pani.jpeg' },
//         { name: 'Veg Thali', cost: 300, img: 'thali.jpeg' },
//         { name: 'Mushroom Biriyani', cost: 280, img: 'mushroom2.jpeg' },
//         { name: 'Ice Cream', cost: 180, img: 'ice.jpeg' },
//         { name: 'Mocktails', cost: 320, img: 'mock.jpeg' },
//         { name: 'Desserts', cost: 350, img: 'desserts.jpeg' }
//     ];

//     const addToCart = (item) => {
//         const cartKey = getCartKey(userEmail, restaurantName);
//         let currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
//         const existingItem = currentCart.find(cartItem => cartItem.name === item.name);
//         if (existingItem) {
//             existingItem.quantity += 1;
//         } else {
//             currentCart.push({ ...item, quantity: 1 });
//         }
//         localStorage.setItem(cartKey, JSON.stringify(currentCart));
//         setCart([...currentCart]);
//     };

//     const handleMakeOrder = (food) => {
//         const defaultQuantity = 1;
//         setSelectedQuantity(defaultQuantity);
//         setOrderDate("");
//         setOrderSuccess(false);
//         setOrderSummary({
//             customerName,
//             userEmail,
//             restaurantName,
//             city,
//             foodItems: [{
//                 name: food.name,
//                 quantity: defaultQuantity,
//                 totalCost: defaultQuantity * food.cost
//             }],
//             totalCost: defaultQuantity * food.cost
//         });
//         setShowOrderDialog(true);
//     };

//     const handleQuantityChange = (e) => {
//         const quantity = parseInt(e.target.value);
//         setSelectedQuantity(quantity);
//         if (orderSummary) {
//             const updatedTotal = quantity * orderSummary.foodItems[0].totalCost / orderSummary.foodItems[0].quantity;
//             const updatedFoodItem = {
//                 ...orderSummary.foodItems[0],
//                 quantity,
//                 totalCost: updatedTotal
//             };
//             setOrderSummary({
//                 ...orderSummary,
//                 foodItems: [updatedFoodItem],
//                 totalCost: updatedTotal
//             });
//         }
//     };

//     const handleConfirmOrder = async () => {
//         if (!orderDate) return;
//         const orderData = {
//             ...orderSummary,
//             orderDate
//         };
//         try {
//             const response = await fetch("http://localhost:5000/api/orders", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(orderData)
//             });
//             if (!response.ok) throw new Error("Failed to place order");
//             setOrderSuccess(true);
//             setTimeout(() => {
//                 setShowOrderDialog(false);
//                 setOrderSuccess(false);
//             }, 2000);
//         } catch (error) {
//             alert("Failed to place order. Please try again.");
//         }
//     };

//     return (
//         <div className="food-container">
//             <p style={{ fontSize: "20px", color: "black", marginTop: "5px" }}>
//                 To order multiple items, please add them to the cart.
//             </p>

//             <div className="header">
//                 <h1>Order Food at {restaurantName} in {city}</h1>
//                 <button className="cart-btn" onClick={() => navigate('/cart', { state: { cart, customerName, userEmail, restaurantName, city } })}>
//                     🛒 Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
//                 </button>
//             </div>

//             <div className="food-grid">
//                 {foodItems.map((food, index) => (
//                     <div key={index} className="food-item">
//                         <img src={food.img} alt={food.name} />
//                         <h3>{food.name}</h3>
//                         <p>Cost: ₹{food.cost}</p>
//                         <button className="btn add-to-cart-btn" onClick={() => addToCart(food)}>Add to Cart</button>
//                         <button className="btn make-order-btn" onClick={() => handleMakeOrder(food)}>Make Order</button>
//                     </div>
//                 ))}
//             </div>

//             {/* Order Summary Dialog */}
//             {showOrderDialog && orderSummary && (
//                 <div className="dialog-overlay">
//                     <div className="dialog-box">
//                         <h3>Order Summary</h3>
//                         <p><b>Customer Name:</b> {orderSummary.customerName}</p>
//                         <p><b>Email:</b> {orderSummary.userEmail}</p>
//                         <p><b>Restaurant Name:</b> {orderSummary.restaurantName}</p>
//                         <p><b>City:</b> {orderSummary.city}</p>
//                         <p><b>Food Item:</b> {orderSummary.foodItems[0].name}</p>

//                         <label><b>Quantity:</b>
//                             <select value={selectedQuantity} onChange={handleQuantityChange} style={{ marginLeft: "10px" }}>
//                                 {[...Array(10).keys()].map(num => (
//                                     <option key={num + 1} value={num + 1}>{num + 1}</option>
//                                 ))}
//                             </select>
//                         </label>

//                         <br /><br />
//                         <label>
//                             <b>Select Date:</b>
//                             <input
//                                 type="date"
//                                 value={orderDate}
//                                 min={new Date().toISOString().split("T")[0]}
//                                 onChange={(e) => setOrderDate(e.target.value)}
//                                 required
//                                 style={{ marginLeft: "10px" }}
//                             />
//                         </label>

//                         <p><b>Date:</b> {orderDate ? new Date(orderDate).toLocaleDateString() : "--"}</p>
//                         <p><b>Total Cost:</b> ₹{orderSummary.totalCost}</p>

//                         {!orderSuccess ? (
//                             <>
//                                 <button
//                                     className="btn"
//                                     onClick={handleConfirmOrder}
//                                     disabled={!orderDate}
//                                     style={{ marginRight: "10px" }}
//                                 >
//                                     Confirm Order
//                                 </button>
//                                 <button className="btn" onClick={() => setShowOrderDialog(false)}>Close</button>
//                             </>
//                         ) : (
//                             <p style={{ color: "green", fontWeight: "bold", marginTop: "15px" }}>
//                                 Your food is ordered successfully!
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Food;










import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Food.css";

const Food = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const restaurantName = params.get("name") || "Restaurant";
    const city = params.get("city") || "City";

    const getCartKey = (email, restaurant) => `cart_${email || "guest"}_${restaurant || "unknown"}`;

    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState("Guest User");
    const [userEmail, setUserEmail] = useState(null);
    const [showOrderDialog, setShowOrderDialog] = useState(false);
    const [orderSummary, setOrderSummary] = useState(null);
    const [orderDate, setOrderDate] = useState("");
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) setUserEmail(storedEmail);
    }, []);

    useEffect(() => {
        if (userEmail) {
            const fetchUserName = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/get-user?email=${userEmail}`);
                    const data = await response.json();
                    if (data.name) setCustomerName(data.name);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchUserName();
        }
    }, [userEmail]);

    useEffect(() => {
        const cartKey = getCartKey(userEmail, restaurantName);
        const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        setCart(storedCart);
    }, [userEmail, restaurantName]);

    const foodItems = [
        { name: 'Pizza', cost: 250, img: 'pizza.jpeg' },
        { name: 'Burger', cost: 150, img: 'burger.jpeg' },
        { name: 'Hyderabad Biriyani', cost: 350, img: 'biriyani3.jpeg' },
        { name: 'Chicken Mandi', cost: 550, img: 'mandi.jpeg' },
        { name: 'Panipuri', cost: 100, img: 'pani.jpeg' },
        { name: 'Veg Thali', cost: 300, img: 'thali.jpeg' },
        { name: 'Mushroom Biriyani', cost: 280, img: 'mushroom2.jpeg' },
        { name: 'Ice Cream', cost: 180, img: 'ice.jpeg' },
        { name: 'Mocktails', cost: 320, img: 'mock.jpeg' },
        { name: 'Desserts', cost: 350, img: 'desserts.jpeg' }
    ];

    const addToCart = (item) => {
        const cartKey = getCartKey(userEmail, restaurantName);
        let currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const existingItem = currentCart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            currentCart.push({ ...item, quantity: 1 });
        }
        localStorage.setItem(cartKey, JSON.stringify(currentCart));
        setCart([...currentCart]);
    };

    const handleMakeOrder = (food) => {
        const defaultQuantity = 1;
        setSelectedQuantity(defaultQuantity);
        setOrderDate("");
        setOrderSuccess(false);
        setOrderSummary({
            customerName,
            userEmail,
            restaurantName,
            city,
            foodItems: [{
                name: food.name,
                quantity: defaultQuantity,
                totalCost: defaultQuantity * food.cost
            }],
            totalCost: defaultQuantity * food.cost
        });
        setShowOrderDialog(true);
    };

    const handleQuantityChange = (e) => {
        const quantity = parseInt(e.target.value);
        setSelectedQuantity(quantity);
        if (orderSummary) {
            const updatedTotal = quantity * orderSummary.foodItems[0].totalCost / orderSummary.foodItems[0].quantity;
            const updatedFoodItem = {
                ...orderSummary.foodItems[0],
                quantity,
                totalCost: updatedTotal
            };
            setOrderSummary({
                ...orderSummary,
                foodItems: [updatedFoodItem],
                totalCost: updatedTotal
            });
        }
    };

    const handleConfirmOrder = async () => {
        if (!orderDate) return;

        const today = new Date();
        const selected = new Date(orderDate);
        selected.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (selected < today) {
            alert("Please select a valid date. You can't order for a past date.");
            return;
        }

        const orderData = {
            ...orderSummary,
            orderDate
        };

        try {
            const response = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });
            if (!response.ok) throw new Error("Failed to place order");
            setOrderSuccess(true);
            setTimeout(() => {
                setShowOrderDialog(false);
                setOrderSuccess(false);
            }, 2000);
        } catch (error) {
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <div className="food-container">
            <p style={{ fontSize: "20px", color: "black", marginTop: "5px" }}>
                To order multiple items, please add them to the cart.
            </p>

            <div className="header">
                <h1>Order Food at {restaurantName} in {city}</h1>
                <button className="cart-btn" onClick={() => navigate('/cart', {
                    state: { cart, customerName, userEmail, restaurantName, city }
                })}>
                    🛒 Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
                </button>
            </div>

            <div className="food-grid">
                {foodItems.map((food, index) => (
                    <div key={index} className="food-item">
                        <img src={food.img} alt={food.name} />
                        <h3>{food.name}</h3>
                        <p>Cost: ₹{food.cost}</p>
                        <button className="btn add-to-cart-btn" onClick={() => addToCart(food)}>Add to Cart</button>
                        <button className="btn make-order-btn" onClick={() => handleMakeOrder(food)}>Make Order</button>
                    </div>
                ))}
            </div>

            {/* Order Summary Dialog */}
            {showOrderDialog && orderSummary && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <h3>Order Summary</h3>
                        <p><b>Customer Name:</b> {orderSummary.customerName}</p>
                        <p><b>Email:</b> {orderSummary.userEmail}</p>
                        <p><b>Restaurant Name:</b> {orderSummary.restaurantName}</p>
                        <p><b>City:</b> {orderSummary.city}</p>
                        <p><b>Food Item:</b> {orderSummary.foodItems[0].name}</p>

                        <label><b>Quantity:</b>
                            <select value={selectedQuantity} onChange={handleQuantityChange} style={{ marginLeft: "10px" }}>
                                {[...Array(10).keys()].map(num => (
                                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                                ))}
                            </select>
                        </label>

                        <br /><br />
                        <label>
                            <b>Select Date:</b>
                            <input
                                type="date"
                                value={orderDate}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setOrderDate(e.target.value)}
                                required
                                style={{ marginLeft: "10px" }}
                            />
                        </label>

                        <p><b>Date:</b> {orderDate ? new Date(orderDate).toLocaleDateString() : "--"}</p>
                        <p><b>Total Cost:</b> ₹{orderSummary.totalCost}</p>

                        {!orderSuccess ? (
                            <>
                                <button
                                    className="btn"
                                    onClick={handleConfirmOrder}
                                    disabled={!orderDate}
                                    style={{ marginRight: "10px" }}
                                >
                                    Confirm Order
                                </button>
                                <button className="btn" onClick={() => setShowOrderDialog(false)}>Close</button>
                            </>
                        ) : (
                            <p style={{ color: "green", fontWeight: "bold", marginTop: "15px" }}>
                                Your food is ordered successfully!
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Food;
