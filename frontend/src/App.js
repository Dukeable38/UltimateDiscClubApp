import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import PlayerDashboard from './components/PlayerDashboard';
import PlayerList from './components/PlayerList';
import Admins from './components/Admins';
import SessionsCheckin from './components/SessionsCheckin';
import SessionsDraft from './components/SessionsDraft';
import SessionsFinal from './components/SessionsFinal';
import ResultsPending from './components/ResultsPending';
import ResultsConfirmed from './components/ResultsConfirmed';
import './Sidebar.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [openPlayerAdmin, setOpenPlayerAdmin] = useState(false);
  const [openSessions, setOpenSessions] = useState(false);
  const [openResults, setOpenResults] = useState(false);

  // Sync authentication state with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Toggle authentication for testing
  const toggleAuth = () => {
    if (isAuthenticated) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', 'test-token');
    }
    setIsAuthenticated(!isAuthenticated);
  };

  return (
    <Router>
      {/* Navbar - Always present on all pages */}
      <Navbar bg="light" expand="lg" fixed="top" className="shadow-sm">
        <Container fluid className="px-0">
          <Navbar.Brand as={Link} to="/" className="ms-3 fw-bold">Ultimate Disc</Navbar.Brand>
          <Nav className="ms-auto">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                <Nav.Link as={Link} to="/login">Log In</Nav.Link>
              </>
            ) : (
              <Nav.Link href="#profile">
                <i className="fas fa-user"></i> {/* Requires Font Awesome */}
              </Nav.Link>
            )}
            <Nav.Link onClick={toggleAuth}>
              {isAuthenticated ? 'Log Out' : 'Log In (Test)'}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Main Layout */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)', marginTop: '56px', overflowX: 'hidden' }}>
        {/* Sidebar - Only on authenticated routes */}
        {isAuthenticated && (
          <Navbar className="flex-column sidebar bg-dark" variant="dark" style={{ width: '250px', height: '100%' }}>
            <Navbar.Brand as={Link} to="/player" className="p-3">Ultimate Disc</Navbar.Brand>
            <Nav className="flex-column w-100">
              <Nav.Link as={Link} to="/player" className="text-white">Home</Nav.Link>
              <Nav.Link as={Link} to="/player/profile" className="text-white">Profile</Nav.Link>
              <Nav.Link as={Link} to="/player/sessions" className="text-white">Sessions</Nav.Link>
              <Nav.Link as={Link} to="/logout" className="text-white">Logout</Nav.Link>
              {localStorage.getItem('is_admin') === 'true' && (
                <Nav.Link as={Link} to="/admin" className="text-white">Switch to Admin</Nav.Link>
              )}
              <Nav.Link
                onClick={() => setOpenPlayerAdmin(!openPlayerAdmin)}
                aria-controls="player-admin-collapse"
                aria-expanded={openPlayerAdmin}
                className="text-white"
              >
                Player Admin
              </Nav.Link>
              <Collapse in={openPlayerAdmin}>
                <div id="player-admin-collapse" className="ms-3">
                  <Nav.Link as={Link} to="/admin/players" className="text-white">Players</Nav.Link>
                  <Nav.Link as={Link} to="/admin/admins" className="text-white">Admins</Nav.Link>
                </div>
              </Collapse>
              <Nav.Link
                onClick={() => setOpenSessions(!openSessions)}
                aria-controls="sessions-collapse"
                aria-expanded={openSessions}
                className="text-white"
              >
                Sessions
              </Nav.Link>
              <Collapse in={openSessions}>
                <div id="sessions-collapse" className="ms-3">
                  <Nav.Link as={Link} to="/admin/sessions/checkin" className="text-white">Checkin</Nav.Link>
                  <Nav.Link as={Link} to="/admin/sessions/draft" className="text-white">Draft</Nav.Link>
                  <Nav.Link as={Link} to="/admin/sessions/final" className="text-white">Final</Nav.Link>
                </div>
              </Collapse>
              <Nav.Link
                onClick={() => setOpenResults(!openResults)}
                aria-controls="results-collapse"
                aria-expanded={openResults}
                className="text-white"
              >
                Results
              </Nav.Link>
              <Collapse in={openResults}>
                <div id="results-collapse" className="ms-3">
                  <Nav.Link as={Link} to="/admin/results/pending" className="text-white">Pending Trophies</Nav.Link>
                  <Nav.Link as={Link} to="/admin/results/confirmed" className="text-white">Confirmed Trophies</Nav.Link>
                </div>
              </Collapse>
            </Nav>
          </Navbar>
        )}

        {/* Main Content */}
        <div style={{ 
          flex: 1, 
          padding: '20px', 
          marginLeft: isAuthenticated ? '250px' : '0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 56px)'
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/player/*" element={<PlayerDashboard />} />
            <Route path="/admin/players" element={<PlayerList />} />
            <Route path="/admin/admins" element={<Admins />} />
            <Route path="/admin/sessions/checkin" element={<SessionsCheckin />} />
            <Route path="/admin/sessions/draft" element={<SessionsDraft />} />
            <Route path="/admin/sessions/final" element={<SessionsFinal />} />
            <Route path="/admin/results/pending" element={<ResultsPending />} />
            <Route path="/admin/results/confirmed" element={<ResultsConfirmed />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;