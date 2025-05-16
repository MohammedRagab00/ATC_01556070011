import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import EventDetails from "./pages/EventDetails";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "styled-components";
import theme from "./config/theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar /> {/* Displays Navbar on every page */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/event/:id" element={<EventDetails />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
