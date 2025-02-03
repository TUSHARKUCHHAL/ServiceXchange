// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar'; // Make sure to import the Navbar
import Login from './Pages/Login/Login';

const App = () => {
  return (
    <Router>
      {/* Include Navbar so it's available on all pages */}
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
