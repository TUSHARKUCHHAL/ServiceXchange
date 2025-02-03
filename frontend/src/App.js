// src/App.js
<<<<<<< HEAD
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
=======
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ClerkProvider} from '@clerk/clerk-react';
import Navbar from './Components/Navbar'; // Ensure Navbar is correctly imported
import Login from './Pages/Login/Login';

const clerkPubKey = "pk_test_bXVzaWNhbC1hbW9lYmEtOTIuY2xlcmsuYWNjb3VudHMuZGV2JA"; // Replace with your actual Clerk public key

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Navbar /> {/* Navbar will be present on all pages */}
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </ClerkProvider>
>>>>>>> 562e3d7bfeeb2535ebf1c98afe8372a0a67af20d
  );
}

export default App;
