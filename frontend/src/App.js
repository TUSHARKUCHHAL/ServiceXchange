import React from 'react';
import Home from './Pages/Home/Home';
import NGODashboard from './Pages/NGODashboard/NGODashboard';
import Footer from "./Components/Footer";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar'; 
import Login from './Pages/Login/Login';
import Signup from './Pages/SignUp/SignUp';
import About from './Pages/About/About';
import Services from './Pages/Services/Services';
import TaskList from './Pages/TaskList/TaskList';
import Contact from './Pages/Contact/Contact';
import Restaurant from "./Pages/Restaurant/Restaurant";
import ExcessFoodRequest from "./Pages/Restaurant/ExcessFoodRequest";
import Volunteer from "./Pages/Volunteer/Volunteer";  // Ensure correct path
import VolunteerRes from "./Pages/Restaurant/VolunteerRes";
import Hospital from './Pages/Hospital/Hospital';
import NeedBlood from './Pages/Hospital/NeedBlood';
import DonateBlood from './Pages/Hospital/DonateBlood';
import TermsOfService from './Utils/TermsOfService/TermsOfService';
import PrivacyPolicy from './Utils/PrivacyPolicy/PrivacyPolicy';
import ForgotPassword from './Pages/Login/ForgotPassword';
import ResetPassword from './Pages/Login/ResetPassword';
import Sign_Up from './Pages/Restaurant/SignUp';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY; 

const App = () => {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/NGODashboard" element={<NGODashboard />} />
          <Route path="/TaskList" element={<TaskList />} />
          <Route path='/Contact' element={<Contact />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/About" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/hospital" element={<Hospital />} />
          <Route path="/hospital/need-blood" element={<NeedBlood />} />
          <Route path="/hospital/donate-blood" element={<DonateBlood />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/restaurant/signup" element={<Sign_Up />} />
          <Route path="/restaurant/excess-food" element={<ExcessFoodRequest />} />
          <Route path="/volunteer" element={<Volunteer />} />  
          <Route path="/restaurant/volunteer-r" element={<VolunteerRes />} />  
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
        <Footer />
      </Router>
  );
};

export default App;
