import React, { useState } from 'react';
     import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
     import { Nav, Navbar, Collapse } from 'react-bootstrap';
     import 'bootstrap/dist/css/bootstrap.min.css';
     import PlayerList from './components/PlayerList';
     import Admins from './components/Admins';
     import SessionsCheckin from './components/SessionsCheckin';
     import SessionsDraft from './components/SessionsDraft';
     import SessionsFinal from './components/SessionsFinal';
     import ResultsPending from './components/ResultsPending';
     import ResultsConfirmed from './components/ResultsConfirmed';
     import './Sidebar.css';

     function App() {
       const [openPlayerAdmin, setOpenPlayerAdmin] = useState(false);
       const [openSessions, setOpenSessions] = useState(false);
       const [openResults, setOpenResults] = useState(false);

       return (
         <Router>
           <div className="d-flex">
             <Navbar className="flex-column sidebar bg-dark" variant="dark">
               <Navbar.Brand as={Link} to="/" className="p-3">Ultimate Disc Admin</Navbar.Brand>
               <Nav className="flex-column">
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
             <div className="container mt-3 flex-grow-1">
               <Routes>
                 <Route exact path="/admin/players" element={<PlayerList />} />
                 <Route exact path="/admin/admins" element={<Admins />} />
                 <Route exact path="/admin/sessions/checkin" element={<SessionsCheckin />} />
                 <Route exact path="/admin/sessions/draft" element={<SessionsDraft />} />
                 <Route exact path="/admin/sessions/final" element={<SessionsFinal />} />
                 <Route exact path="/admin/results/pending" element={<ResultsPending />} />
                 <Route exact path="/admin/results/confirmed" element={<ResultsConfirmed />} />
                 <Route path="/" element={<h2>Welcome to Ultimate Disc Admin</h2>} />
               </Routes>
             </div>
           </div>
         </Router>
       );
     }

     export default App;