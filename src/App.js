
import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import RequirementsCRUD from "./components/RequirementsCRUD";
import Footer from "./components/Footer";
import { auth } from './firebase-config/firebase';


function App() {

  const [firebaseUser, setFirebaseUser] = useState(false);

  useEffect(() => {

    auth.onAuthStateChanged(user => {
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
      }
    })

  }, [])


  return firebaseUser != false ? (
    <div className="background-container">
      <Router>
        <Navbar firebaseUser={firebaseUser} />
        <div className="container">
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/FireBase-React-Login" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/requests" element={<RequirementsCRUD />} />\

          </Routes>
        </div>

        <Footer />

      </Router>

      <h3></h3>
    </div>


  ) : (<p>Loading....</p>);
}

export default App;
