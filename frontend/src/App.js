import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import DashboardPlayer from './components/DashboardPlayer';
import CheckInPlayer from './components/CheckInPlayer';
import HistoryPlayer from './components/HistoryPlayer';

function App() {
  console.log('App rendering');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isPlayerView = localStorage.getItem('isPlayerView') === 'true';
  const navCollapse = useRef(null);
  const navToggle = useRef(null);

  useEffect(() => {
    // Ensure navToggle is set after render
    if (navToggle.current) {
      console.log('navToggle set:', navToggle.current);
    }
  }, []);

  const handleNavLinkClick = () => {
    if (navToggle.current) {
      navToggle.current.click(); // Simulate toggle button click to close the navbar
      console.log('Toggled navbar');
    } else {
      console.log('navToggle.current is null');
    }
  };

  return (
    <Router>
      <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <BootstrapNavbar.Brand as={Link} to="/">Ultimate Disc</BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle ref={navToggle} aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse ref={navCollapse} id="basic-navbar-nav">
            {!isAuthenticated && (
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                <Nav.Link as={Link} to="/login">Log In</Nav.Link>
              </Nav>
            )}
            {isAuthenticated && isPlayerView && (
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/player/dashboard" onClick={handleNavLinkClick}>Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/player/checkin" onClick={handleNavLinkClick}>Check In</Nav.Link>
                <Nav.Link as={Link} to="/player/history" onClick={handleNavLinkClick}>History</Nav.Link>
              </Nav>
            )}
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      <div style={{ paddingTop: '56px', minHeight: 'calc(100vh - 56px)', overflowX: 'hidden' }}>
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/player/dashboard" element={<DashboardPlayer />} />
            <Route path="/player/checkin" element={<CheckInPlayer />} />
            <Route path="/player/history" element={<HistoryPlayer />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;