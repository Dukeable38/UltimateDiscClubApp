import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import PlayerDashboard from './components/PlayerDashboard';
import CheckInPlayer from './components/CheckInPlayer';
import HistoryPlayer from './components/HistoryPlayer';
import DashboardAdmin from './components/DashboardAdmin';
import Admins from './components/Admins';
import PlayerList from './components/PlayerList';
import Sessions from './components/Sessions';
import Results from './components/Results';
import ResultsConfirmed from './components/ResultsConfirmed';
import ResultsPending from './components/ResultsPending';
import SessionsCheckin from './components/SessionsCheckin';
import SessionsDraft from './components/SessionsDraft';
import SessionsFinal from './components/SessionsFinal';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [isPlayerView, setIsPlayerView] = useState(localStorage.getItem('isPlayerView') === 'true');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true'); // New state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  console.log('App rendering');
  console.log('isAuthenticated:', isAuthenticated, 'isPlayerView:', isPlayerView, 'isAdmin:', isAdmin);

  useEffect(() => {
    const updateAuth = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
      setIsPlayerView(localStorage.getItem('isPlayerView') === 'true');
      setIsAdmin(localStorage.getItem('isAdmin') === 'true'); // Update isAdmin
      console.log('Updated - isAuthenticated:', localStorage.getItem('isAuthenticated'), 'isPlayerView:', localStorage.getItem('isPlayerView'), 'isAdmin:', localStorage.getItem('isAdmin'));
    };
    window.addEventListener('storage', updateAuth);
    return () => window.removeEventListener('storage', updateAuth);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isPlayerView');
    localStorage.removeItem('isAdmin'); // Clear isAdmin
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsPlayerView(true);
    setIsAdmin(false); // Reset for safety
    window.location.href = '/';
  };

  const handleSwitchView = () => {
    const newIsPlayerView = !isPlayerView;
    setIsPlayerView(newIsPlayerView);
    localStorage.setItem('isPlayerView', newIsPlayerView.toString());
    window.location.href = newIsPlayerView ? '/player/dashboard' : '/admin/dashboard';
  };

  return (
    <Router>
      <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <BootstrapNavbar.Brand as={Link} to="/">Ultimate Disc</BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            {!isAuthenticated && (
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                <Nav.Link as={Link} to="/login">Log In</Nav.Link>
              </Nav>
            )}
            {isAuthenticated && (
              <Nav className="ms-auto">
                {isPlayerView && (
                  <>
                    <Nav.Link as={Link} to="/player/dashboard" onClick={toggleSidebar}>Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/player/checkin" onClick={toggleSidebar}>Check In</Nav.Link>
                    <Nav.Link as={Link} to="/player/history" onClick={toggleSidebar}>History</Nav.Link>
                  </>
                )}
                {!isPlayerView && (
                  <Nav.Link as={Link} to="/admin/dashboard" onClick={toggleSidebar}>Admin Dashboard</Nav.Link>
                )}
                <Nav.Item>
                  <Button variant="outline-danger" onClick={handleSignOut} className="ms-2" style={{ whiteSpace: 'nowrap' }}>
                    Sign Out
                  </Button>
                </Nav.Item>
                {isAuthenticated && isAdmin && ( // Show switch button for admins only
                  <Nav.Item>
                    <Button variant="outline-secondary" onClick={handleSwitchView} className="ms-2" style={{ whiteSpace: 'nowrap' }}>
                      Switch to {isPlayerView ? 'Admin' : 'Player'} View
                    </Button>
                  </Nav.Item>
                )}
              </Nav>
            )}
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)', marginTop: '56px', overflowX: 'hidden' }}>
        {isAuthenticated && (
          <nav
            className="bg-dark text-white"
            style={{
              width: sidebarCollapsed ? '0' : '250px',
              minHeight: 'calc(100vh - 56px)',
              padding: sidebarCollapsed ? '0' : '1rem',
              transition: 'width 0.3s, padding 0.3s',
              overflow: 'hidden',
              position: 'relative',
              display: isPlayerView ? 'none' : 'block',
            }}
          >
            {!sidebarCollapsed && !isPlayerView && (
              <>
                <button
                  onClick={toggleSidebar}
                  className="btn btn-light mb-3"
                  style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1 }}
                >
                  Hide Sidebar
                </button>
                <h4 className="text-white mb-3">Admin Menu</h4>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <strong>Admins</strong>
                    <ul className="list-unstyled ms-3">
                      <li className="mb-1">
                        <Link to="/admin/admins" className="text-white text-decoration-none">
                          Manage Admins
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="mb-2">
                    <strong>Players</strong>
                    <ul className="list-unstyled ms-3">
                      <li className="mb-1">
                        <Link to="/admin/players" className="text-white text-decoration-none">
                          Manage Players
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="mb-2">
                    <strong>Sessions</strong>
                    <ul className="list-unstyled ms-3">
                      <li className="mb-1">
                        <Link to="/admin/sessions" className="text-white text-decoration-none">
                          Manage Sessions
                        </Link>
                      </li>
                      <li className="mb-1">
                        <Link to="/admin/sessions/checkin" className="text-white text-decoration-none">
                          Check-in Sessions
                        </Link>
                      </li>
                      <li className="mb-1">
                        <Link to="/admin/sessions/draft" className="text-white text-decoration-none">
                          Draft Sessions
                        </Link>
                      </li>
                      <li className="mb-1">
                        <Link to="/admin/sessions/final" className="text-white text-decoration-none">
                          Final Sessions
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="mb-2">
                    <strong>Results</strong>
                    <ul className="list-unstyled ms-3">
                      <li className="mb-1">
                        <Link to="/admin/results" className="text-white text-decoration-none">
                          Manage Results
                        </Link>
                      </li>
                      <li className="mb-1">
                        <Link to="/admin/results/confirmed" className="text-white text-decoration-none">
                          Confirmed Results
                        </Link>
                      </li>
                      <li className="mb-1">
                        <Link to="/admin/results/pending" className="text-white text-decoration-none">
                          Pending Results
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </>
            )}
          </nav>
        )}
        <div
          style={{
            flex: 1,
            padding: '0',
            marginLeft: isAuthenticated && !sidebarCollapsed ? '250px' : '0',
          }}
        >
          <div style={{ padding: '20px' }}>
            <div className="container-fluid" style={{ marginLeft: 0, paddingLeft: 0 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/player/dashboard" element={<PlayerDashboard />} />
                <Route path="/player/checkin" element={<CheckInPlayer />} />
                <Route path="/player/history" element={<HistoryPlayer />} />
                <Route path="/admin/dashboard" element={<DashboardAdmin />} />
                <Route path="/admin/admins" element={<Admins />} />
                <Route path="/admin/players" element={<PlayerList />} />
                <Route path="/admin/sessions" element={<Sessions />} />
                <Route path="/admin/sessions/checkin" element={<SessionsCheckin />} />
                <Route path="/admin/sessions/draft" element={<SessionsDraft />} />
                <Route path="/admin/sessions/final" element={<SessionsFinal />} />
                <Route path="/admin/results" element={<Results />} />
                <Route path="/admin/results/confirmed" element={<ResultsConfirmed />} />
                <Route path="/admin/results/pending" element={<ResultsPending />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;