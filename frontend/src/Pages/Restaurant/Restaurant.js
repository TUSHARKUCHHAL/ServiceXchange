import { useNavigate } from "react-router-dom";
import "./Restaurant.css";

const Restaurant = () => {
  const navigate = useNavigate();

  return (
    <div className="restaurant-container">
      {/* Banner Section */}
      <div className="restaurant-banner">
        <h1>Join Hands to Fight Hunger!</h1>
        <p>“Your surplus can be someone’s survival.”</p>
      </div>

      {/* Main Content Section */}
      <div className="restaurant-content">
        <h2>Partner with a Restaurant</h2>
        <p>Make a difference by donating excess food or volunteering to distribute meals.</p>

        {/* Buttons Section */}
        <div className="restaurant-buttons">
          <button onClick={() => navigate("/restaurant/excess-food")}>
            <i className="fas fa-utensils"></i> Donate Excess Food
          </button>

          <button onClick={() => navigate("/restaurant/volunteer")}>
            <i className="fas fa-hands-helping"></i> Become a Volunteer
          </button>
        </div>

        {/* Image Section */}
        <div className="restaurant-image">
          <img
            src="https://source.unsplash.com/600x300/?food,charity"
            alt="Food Donation"
          />
        </div>

        {/* Motivational Section */}
        <div className="motivational-section">
          <h3>Every Meal Matters 🍽️</h3>
          <p>Millions of people go hungry every day while food goes to waste. Be the change today!</p>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
