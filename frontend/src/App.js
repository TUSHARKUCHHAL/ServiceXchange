import React from 'react';
import Home from './Pages/Home/Home';
import Footer from "./Components/Footer";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar'; 
import RestaurantLogin from './Pages/Restaurant/RestaurantLogin';
import Signup from './Pages/SignUp/SignUp';
import Login from './Pages/Login/Login';
import About from './Pages/About/About';
import Services from './Pages/Services/Services';

import Contact from './Pages/Contact/Contact';
import Restaurant from "./Pages/Restaurant/Restaurant";
import ExcessFoodRequest from "./Pages/Restaurant/FoodDonationForm";
import Volunteer from "./Pages/Volunteer/Volunteer";
import VolunteerRes from "./Pages/Restaurant/VolunteerRes";
import Hospital from './Pages/Hospital/Hospital';
import NeedBlood from './Pages/Hospital/NeedBlood';
import TermsOfService from './Utils/TermsOfService/TermsOfService';
import PrivacyPolicy from './Utils/PrivacyPolicy/PrivacyPolicy';
import Sign_Up from './Pages/Restaurant/RestaurantSignUp';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import ForgotPassword from './Pages/Login/ForgotPassword';
import ForgotPasswordRes from './Pages/Restaurant/ForgotPassword';
import ResetPasswordRes from './Pages/Restaurant/ResetPassword';
import ResetPassword from './Pages/Login/ResetPassword';
import BloodDonation from "./Pages/Hospital/DonorPage";
import ManageRequests from './Pages/Hospital/ManageRequests';
import FoodDonationForm from './Pages/Restaurant/FoodDonationForm';
import MyDonations from './Pages/Restaurant/MyDonation';
import DonationDetails from './Pages/Restaurant/DonationDetails';
import EditDonation from './Pages/Restaurant/EditDonation';
import DashboardHome from './Pages/NGODashboard/DashboardHome';
import NGOSignup from './Pages/NGO/ngosign';
import NGOLogin from './Pages/NGO/ngologin';
import NGO from './Pages/NGO/ngo';


const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/Contact' element={<Contact />} />
            <Route path="/Services" element={<Services />} />
            <Route path="/About" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ngo-login" element={<NGOLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/ngo-signup" element={<NGOSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/restaurant/login" element={<RestaurantLogin />} />
            <Route path="/restaurant/forgot-password" element={<ForgotPasswordRes />} />
            <Route path="/restaurant/reset-password/:token" element={<ResetPasswordRes />} />
            <Route path="/restaurant/donate" element={<FoodDonationForm />} />
            <Route path="/restaurant/my-donations" element={<MyDonations />} />
            <Route path="/donations/:id" element={<DonationDetails />} />
            <Route path="/donations/edit/:id" element={<EditDonation />} />
            <Route path="/hospital" element={<Hospital />} />
            <Route path="/hospital/need-blood" element={<NeedBlood />} />
            <Route path="/hospital/donate-blood" element={<BloodDonation />} />
            <Route path="/hospital/manage-requests" element={<ManageRequests />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/restaurant/signup" element={<Sign_Up />} />
            <Route path="/restaurant/excess-food" element={<ExcessFoodRequest />} />
            <Route path="/volunteer" element={<Volunteer />} />  
            <Route path="/restaurant/volunteer-r" element={<VolunteerRes />} /> 
            <Route path="/ngo" element={<NGO />} /> 
            <Route path="/ngo-dashboard" element={<DashboardHome />} /> 
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;