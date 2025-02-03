// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
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
  );
};

export default App;
