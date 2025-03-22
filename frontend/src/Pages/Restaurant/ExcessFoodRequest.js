import { useState } from "react";
import "./ExcessFoodRequest.css";

const ExcessFoodRequest = () => {
  const [foodDetails, setFoodDetails] = useState({
    name: "",
    quantity: "",
    location: "",
    image: null,
  });

  const handleChange = (e) => {
    setFoodDetails({ ...foodDetails, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoodDetails({ ...foodDetails, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Food Donation Details:", foodDetails);
    alert("Food donation request submitted successfully!");
  };

  return (
    <div className="excess-food-container">
      <h1>Excess Food Donation</h1>
      <form className="food-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Food Name" onChange={handleChange} required />
        <input type="text" name="quantity" placeholder="Quantity (e.g., 10 plates)" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Pickup Location" onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleImageUpload} required />
        <button type="submit">Submit Request</button>
      </form>
      {foodDetails.image && (
        <div className="food-preview">
          <h3>Uploaded Image:</h3>
          <img src={foodDetails.image} alt="Food Preview" />
        </div>
      )}
    </div>
  );
};

export default ExcessFoodRequest;
