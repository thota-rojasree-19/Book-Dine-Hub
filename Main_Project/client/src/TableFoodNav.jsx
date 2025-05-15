import { useNavigate, useLocation } from 'react-router-dom';
import './TableFoodNav.css';

const TableFoodNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

   
    const restaurantName = queryParams.get("name") || "Restaurant";
    const city = queryParams.get("city") || "";

    const handleNavigation = (path) => {
        navigate(`${path}?name=${restaurantName}&city=${city}`);
    };

    return (
        <div className="table-food-nav-page">
            <div className="page-background">
                <div className="content-container">
                    <p>Welcome to {restaurantName} {city} </p>
                    <p>Book your Tables, Food Items, and Rooms here...</p>               
                    <div className="container3">
                        <div className="section" onClick={() => handleNavigation('/tables')}>
                            <img src="tables.jpeg" alt="Tables" />
                            <h3>Tables</h3>
                            <p>Reserve your dining table</p>
                        </div>
                        <div className="section" onClick={() => handleNavigation('/food')}>
                            <img src="food.jpeg" alt="Food Items" />
                            <h3>Food Items</h3>
                            <p>Order delicious meals</p>
                        </div>
                        <div className="section" onClick={() => handleNavigation('/rooms')}>
                            <img src="room.jpeg" alt="Rooms" />
                            <h3>Rooms</h3>
                            <p>Book comfortable stays</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableFoodNav;
