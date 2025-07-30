import React, { useState, useEffect } from 'react';
     import axios from 'axios';
     import { Tabs, Tab, Container, Button, Card, Modal, Form, Table, Badge } from 'react-bootstrap';
     import { useNavigate } from 'react-router-dom';

     const PlayerDashboard = () => {
       const [player, setPlayer] = useState(null);
       const [sessions, setSessions] = useState([]);
       const [openSession, setOpenSession] = useState(null);
       const [showCheckInModal, setShowCheckInModal] = useState(false);
       const [checkInForm, setCheckInForm] = useState({ is_training: false, shirt_color: 'black' });
       const navigate = useNavigate();

       useEffect(() => {
         const token = localStorage.getItem('token');
         if (!token) {
           navigate('/login');
           return;
         }
         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
         // Fetch player profile
         axios.get('http://localhost:5000/api/players/profile')
           .then(res => setPlayer(res.data))
           .catch(err => {
             console.error(err);
             navigate('/login');
           });
         // Fetch sessions
         axios.get('http://localhost:5000/api/players/sessions')
           .then(res => {
             setSessions(res.data);
             const open = res.data.find(s => s.status === 'upcoming' && !s.checked_in);
             setOpenSession(open);
           })
           .catch(err => console.error(err));
       }, [navigate]);

       const handleCheckIn = async () => {
         if (!openSession) return;
         try {
           await axios.post(`http://localhost:5000/api/players/checkin/${openSession.session_id}`, checkInForm);
           setOpenSession({ ...openSession, checked_in: true });
           setShowCheckInModal(false);
         } catch (err) {
           console.error(err);
           alert(err.response?.data || 'Error checking in');
         }
       };

       const handleCheckInModalOpen = () => {
         setShowCheckInModal(true);
         setCheckInForm({ is_training: false, shirt_color: 'black' });
       };

       const handleCheckInFormChange = (e) => {
         const { name, value, type, checked } = e.target;
         setCheckInForm({ ...checkInForm, [name]: type === 'checkbox' ? checked : value });
       };

       if (!player) return <div>Loading...</div>;

       return (
         <Container>
           <h2>Welcome, {player.name}</h2>
           <Tabs defaultActiveKey="home" id="player-tabs" className="mb-3">
             <Tab eventKey="home" title="Home">
               <h3>Home</h3>
               {openSession ? (
                 <Card className="mb-3">
                   <Card.Body>
                     <Card.Title>{openSession.name || `${openSession.date} ${openSession.time}`}</Card.Title>
                     <Card.Text>
                       {openSession.checked_in ? (
                         <Badge bg="success">Checked In</Badge>
                       ) : (
                         <Button variant="primary" onClick={handleCheckInModalOpen}>
                           Check In
                         </Button>
                       )}
                     </Card.Text>
                   </Card.Body>
                 </Card>
               ) : (
                 <p>No open sessions for check-in.</p>
               )}
               <h4>Stats</h4>
               <p>Total Wins: {sessions.filter(s => s.checked_in && s.team && (s.team === 'black' ? s.black_score > s.white_score : s.white_score > s.black_score)).length}</p>
               <p>MVP Nominations: {player.mvp_nominations}</p>
               <p>Latest Trophy: {player.custom_trophies[0] || 'None'}</p>
             </Tab>
             <Tab eventKey="profile" title="Profile">
               <h3>Profile</h3>
               <p>Name: {player.name}</p>
               <p>Email: {player.email}</p>
               <p>Profile Picture: (Not implemented)</p>
               <p>Payment Type: {player.payment_type}</p>
               <p>Class: {player.class}</p>
               <p>Total Check-Ins This Semester: {player.total_checkins}</p>
               <p>MVP Nominations: {player.mvp_nominations}</p>
               <p>Custom Trophies:</p>
               <ul>
                 {player.custom_trophies.map((trophy, index) => (
                   <li key={index}>{trophy}</li>
                 ))}
               </ul>
             </Tab>
             <Tab eventKey="sessions" title="Sessions">
               <h3>Sessions</h3>
               <Table striped bordered hover>
                 <thead>
                   <tr>
                     <th>Session</th>
                     <th>Date</th>
                     <th>Team</th>
                     <th>Score</th>
                     <th>Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {sessions.map(session => (
                     <tr key={session.session_id}>
                       <td>{session.name || `${session.date} ${session.time}`}</td>
                       <td>{session.date}</td>
                       <td>{session.checked_in ? session.team || 'Training' : 'Not Checked In'}</td>
                       <td>
                         {session.black_score !== null && session.white_score !== null
                           ? `Black ${session.black_score} - White ${session.white_score}`
                           : 'No Score'}
                       </td>
                       <td>
                         {session.status === 'upcoming' && !session.checked_in ? (
                           <Button variant="primary" onClick={handleCheckInModalOpen}>
                             Check In
                           </Button>
                         ) : session.checked_in ? (
                           <Badge bg="success">Checked In</Badge>
                         ) : (
                           'Not Checked In'
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </Table>
             </Tab>
           </Tabs>

           {/* Check-In Modal */}
           <Modal show={showCheckInModal} onHide={() => setShowCheckInModal(false)}>
             <Modal.Header closeButton>
               <Modal.Title>Check In to {openSession?.name || openSession?.date}</Modal.Title>
             </Modal.Header>
             <Modal.Body>
               <Form>
                 <Form.Group className="mb-3">
                   <Form.Label>Shirt Color</Form.Label>
                   <Form.Select name="shirt_color" value={checkInForm.shirt_color} onChange={handleCheckInFormChange}>
                     <option value="black">Black</option>
                     <option value="white">White</option>
                     <option value="both">Both</option>
                   </Form.Select>
                 </Form.Group>
                 <Form.Group className="mb-3">
                   <Form.Check
                     type="checkbox"
                     label="Training"
                     name="is_training"
                     checked={checkInForm.is_training}
                     onChange={handleCheckInFormChange}
                   />
                 </Form.Group>
               </Form>
             </Modal.Body>
             <Modal.Footer>
               <Button variant="secondary" onClick={() => setShowCheckInModal(false)}>
                 Cancel
               </Button>
               <Button variant="primary" onClick={handleCheckIn}>
                 Confirm Check-In
               </Button>
             </Modal.Footer>
           </Modal>
         </Container>
       );
     };

     export default PlayerDashboard;