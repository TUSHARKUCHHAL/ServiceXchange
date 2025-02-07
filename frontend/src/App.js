import React from 'react';
import Home from './Pages/Home/Home'
import NGODashboard from './Pages/NGODashboard/NGODashboard'
import Footer from "./Components/Footer"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ClerkProvider} from '@clerk/clerk-react';
import Navbar from './Components/Navbar'; // Ensure Navbar is correctly imported
import Login from './Pages/Login/Login';
import About from './Pages/About/About';
import Services from './Pages/Services/Services';
import Contact from './Pages/Contact/Contact';
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
          <Route path='/Contact' element={<Contact />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/About" element={<About />} />
          <Route path="/lgin" element={<Login />} />
        </Routes>
        <Footer/>
      </Router>
    </ClerkProvider>

  );
}

export default App;
