// src/App.js
import React from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your page components
import Home from "./Pages/Home/Home";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Main Home Page */}
        <Route path="/" element={<Home />} />
      
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
