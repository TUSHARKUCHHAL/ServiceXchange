import React from 'react';
import Home from './Pages/Home/Home';
import NGODashboard from './Pages/NGODashboard/NGODashboard';
import Footer from "./Components/Footer";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ClerkProvider, SignUp } from '@clerk/clerk-react';
import Navbar from './Components/Navbar'; // Ensure Navbar is correctly imported
import Login from './Pages/Login/Login';
import Signup from './Pages/SignUp/SignUp';
import About from './Pages/About/About';
import Services from './Pages/Services/Services';
import TaskList from './Pages/TaskList/TaskList';
import Contact from './Pages/Contact/Contact';
import Restaurant from "./Pages/Restaurant/Restaurant";
import ExcessFoodRequest from "./Pages/Restaurant/ExcessFoodRequest";
import Volunteer from "./Pages/Restaurant/Volunteer";
import Hospital from './Pages/Hospital/Hospital';
import NeedBlood from './Pages/Hospital/NeedBlood';
import DonateBlood from './Pages/Hospital/DonateBlood';
import TermsOfService from './Utils/TermsOfService/TermsOfService';
import PrivacyPolicy from './Utils/PrivacyPolicy/PrivacyPolicy';

import axios from 'axios';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY; // Access Clerk public key from environment variable

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Navbar /> {/* Navbar will be present on all pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/NGODashboard" element={<NGODashboard />} />
          <Route path="/TaskList" element={<TaskList />} />
          <Route path='/Contact' element={<Contact />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/About" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/hospital" element={<Hospital />} />
          <Route path="/hospital/need-blood" element={<NeedBlood />} />
          <Route path="/hospital/donate-blood" element={<DonateBlood />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/restaurant/excess-food" element={<ExcessFoodRequest />} />
          <Route path="/restaurant/volunteer" element={<Volunteer />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
        <Footer />
      </Router>
    </ClerkProvider>
  );
};

export default App;
