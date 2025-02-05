import React from 'react';
import Home from './Pages/Home/Home'
import Footer from "./Components/Footer"
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
          <Route path="/" element={<Home />} />
          
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer/>
      </Router>
    </ClerkProvider>

  );
}

export default App;
