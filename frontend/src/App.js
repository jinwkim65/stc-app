import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar';
import Home from './components/pages/home';
import Update from './components/pages/update';
import Footer from './components/footer';
import About from "./components/pages/about";
import Profile from "./components/pages/profile";
import Map from "./components/pages/map";
import Inventory from './components/pages/inventory';
import Percent from './components/pages/percent';
import Login from './components/pages/Login';
import Report from './components/pages/report';
import Tasks from './components/pages/tasks';
import Assign from './components/pages/assign';



function App() {
  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Determine which zone to display in the inventory table
  const [displayZone, setDisplayZone] = useState('all');
  // Function to set the zone to display
  const handleZoneChange = (zone) => {
    setDisplayZone(zone);
  };
  // Handle login status
  const handleLoginStatus = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <>
      <Router>
        <NavBar handleZoneChange={handleZoneChange} setLoginStatus={handleLoginStatus} loginStatus={isLoggedIn} />
        <Routes>
          <Route path="/" element={<Home currentZone={displayZone} />} />
          <Route path="/percent" element={<Percent />} />
          <Route path="/update/:id" element={<Update />} />
          <Route path="/about" element={<About />} />
          <Route path="/map" element={<Map />} />
          <Route path="/inventory" element={<Inventory currentZone={displayZone} />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/profile" element={<Profile setLoginStatus={handleLoginStatus} loginStatus={isLoggedIn} />} />
          <Route path="/report" element={<Report />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/assign" element={<Assign />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
