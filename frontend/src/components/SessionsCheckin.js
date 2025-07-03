import React, { useState, useEffect } from 'react';
     import axios from 'axios';
     import { Table, Button, Form, Modal, Dropdown, DropdownButton } from 'react-bootstrap';

     const SessionsCheckin = () => {
       const [sessions, setSessions] = useState([]);
       const [selectedSession, setSelectedSession] = useState(null);
       const [players, setPlayers] = useState([]);
       const [checkIns, setCheckIns] = useState([]);
       const [search, setSearch] = useState('');
       const [showCheckInModal, setShowCheckInModal] = useState(false);
       const [showConfirmModal, setShowConfirmModal] = useState(false);
       const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
       const [selectedPlayer, setSelectedPlayer] = useState(null);
       const [formData, setFormData] = useState({
         is_training: false,
         shirt_color: 'black',
       });
       const [sessionForm, setSessionForm] = useState({
         name: '',
         date: '',
         time: '',
         status: 'upcoming',
       });

       // Fetch sessions and players on mount
       useEffect(() => {
         axios.get('http://localhost:5000/api/sessions')
           .then(res => setSessions(res.data))
           .catch(err => console.error(err));
         axios.get('http://localhost:5000/api/players')
           .then(res => setPlayers(res.data))
           .catch(err => console.error(err));
       }, []);

       // Fetch check-ins when a session is selected
       useEffect(() => {
         if (selectedSession) {
           axios.get(`http://localhost:5000/api/sessions/${selectedSession.session_id}/checkins`)
             .then(res => setCheckIns(res.data))
             .catch(err => console.error(err));
         }
       }, [selectedSession]);

       const handleSelectSession = (session) => {
         setSelectedSession(session);
         setCheckIns([]);
       };

       const handleOpenCheckInModal = () => {
         setShowCheckInModal(true);
         setSearch('');
       };

       const handleOpenConfirmModal = (player) => {
         setSelectedPlayer(player);
         setFormData({ is_training: false, shirt_color: 'black' });
         setShowCheckInModal(false);
         setShowConfirmModal(true);
       };

       const handleOpenCreateSessionModal = () => {
         setShowCreateSessionModal(true);
         setSessionForm({ name: '', date: '', time: '', status: 'upcoming' });
       };

       const handleCloseModals = () => {
         setShowCheckInModal(false);
         setShowConfirmModal(false);
         setShowCreateSessionModal(false);
         setSelectedPlayer(null);
       };

       const handleCheckIn = async () => {
         if (!selectedSession || !selectedPlayer) {
           alert('Session or player not selected');
           return;
         }
         try {
           const response = await axios.post(
             `http://localhost:5000/api/sessions/${selectedSession.session_id}/checkins`,
             { player_id: selectedPlayer.id, is_training: formData.is_training, shirt_color: formData.shirt_color }
           );
           setCheckIns([...checkIns, { ...response.data, name: selectedPlayer.name }]);
           handleCloseModals();
         } catch (err) {
           console.error(err);
           alert(err.response?.data || 'Error checking in player');
         }
       };

       const handleUncheck = async (checkInId) => {
         if (!selectedSession) return;
         try {
           await axios.delete(`http://localhost:5000/api/sessions/${selectedSession.session_id}/checkins/${checkInId}`);
           setCheckIns(checkIns.filter(c => c.check_in_id !== checkInId));
         } catch (err) {
           console.error(err);
           alert(err.response?.data || 'Error removing check-in');
         }
       };

       const handleSessionFormChange = (e) => {
         const { name, value } = e.target;
         setSessionForm({ ...sessionForm, [name]: value });
       };

       const handleCreateSession = async (e) => {
         e.preventDefault();
         try {
           const response = await axios.post('http://localhost:5000/api/sessions', sessionForm);
           setSessions([response.data, ...sessions]);
           setShowCreateSessionModal(false);
           setSessionForm({ name: '', date: '', time: '', status: 'upcoming' });
         } catch (err) {
           console.error(err);
           alert(err.response?.data || 'Error creating session');
         }
       };

       const handleChange = (e) => {
         const { name, value, type, checked } = e.target;
         setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
       };

       const filteredPlayers = players.filter(player =>
         player.name.toLowerCase().includes(search.toLowerCase()) ||
         player.student_number.includes(search)
       );

       return (
         <div>
           <h2>Checkin</h2>
           <Button variant="primary" className="mb-3" onClick={handleOpenCreateSessionModal}>
             Create Session
           </Button>

           <DropdownButton
             id="dropdown-session"
             title={selectedSession ? `${selectedSession.name || selectedSession.date} ${selectedSession.time || ''}` : 'Select Session'}
             className="mb-3"
           >
             {sessions.map(session => (
               <Dropdown.Item
                 key={session.session_id}
                 onClick={() => handleSelectSession(session)}
               >
                 {session.name || `${session.date} ${session.time || ''}`}
               </Dropdown.Item>
             ))}
           </DropdownButton>

           {selectedSession && (
             <>
               <Button variant="primary" className="mb-3" onClick={handleOpenCheckInModal}>
                 Manual Check-in
               </Button>

               <h3>Checked-In Players</h3>
               <Table striped bordered hover>
                 <thead>
                   <tr>
                     <th>Name</th>
                     <th>Shirt Color</th>
                     <th>Training</th>
                     <th>Check-In Time</th>
                     <th>Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {checkIns.map(checkIn => (
                     <tr key={checkIn.check_in_id}>
                       <td>{checkIn.name}</td>
                       <td>{checkIn.shirt_color}</td>
                       <td>{checkIn.is_training ? 'Yes' : 'No'}</td>
                       <td>{new Date(checkIn.check_in_time).toLocaleString()}</td>
                       <td>
                         <Button
                           variant="danger"
                           size="sm"
                           onClick={() => handleUncheck(checkIn.check_in_id)}
                         >
                           X
                         </Button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </Table>
             </>
           )}

           {/* Create Session Modal */}
           <Modal show={showCreateSessionModal} onHide={handleCloseModals}>
             <Modal.Header closeButton>
               <Modal.Title>Create New Session</Modal.Title>
             </Modal.Header>
             <Modal.Body>
               <Form onSubmit={handleCreateSession}>
                 <Form.Group className="mb-2">
                   <Form.Label>Session Name</Form.Label>
                   <Form.Control
                     type="text"
                     name="name"
                     value={sessionForm.name}
                     onChange={handleSessionFormChange}
                     placeholder="e.g., Week 1 Practice"
                     required
                   />
                 </Form.Group>
                 <Form.Group className="mb-2">
                   <Form.Label>Date</Form.Label>
                   <Form.Control
                     type="date"
                     name="date"
                     value={sessionForm.date}
                     onChange={handleSessionFormChange}
                     required
                   />
                 </Form.Group>
                 <Form.Group className="mb-2">
                   <Form.Label>Time (Optional)</Form.Label>
                   <Form.Control
                     type="time"
                     name="time"
                     value={sessionForm.time}
                     onChange={handleSessionFormChange}
                   />
                 </Form.Group>
                 <Form.Group className="mb-2">
                   <Form.Label>Status</Form.Label>
                   <Form.Select name="status" value={sessionForm.status} onChange={handleSessionFormChange}>
                     <option value="upcoming">Upcoming</option>
                     <option value="ongoing">Ongoing</option>
                     <option value="completed">Completed</option>
                   </Form.Select>
                 </Form.Group>
                 <Button variant="primary" type="submit">
                   Create Session
                 </Button>
               </Form>
             </Modal.Body>
             <Modal.Footer>
               <Button variant="secondary" onClick={handleCloseModals}>
                 Cancel
               </Button>
             </Modal.Footer>
           </Modal>

           {/* Player Selection Modal */}
           <Modal show={showCheckInModal} onHide={handleCloseModals}>
             <Modal.Header closeButton>
               <Modal.Title>Select Player to Check In</Modal.Title>
             </Modal.Header>
             <Modal.Body>
               <Form.Group className="mb-3">
                 <Form.Control
                   type="text"
                   placeholder="Search by name or student number"
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                 />
               </Form.Group>
               <Table striped bordered hover>
                 <thead>
                   <tr>
                     <th>Name</th>
                     <th>Student Number</th>
                     <th>Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredPlayers.map(player => (
                     <tr key={player.id}>
                       <td>{player.name}</td>
                       <td>{player.student_number}</td>
                       <td>
                         <Button
                           variant="success"
                           onClick={() => handleOpenConfirmModal(player)}
                           disabled={checkIns.some(c => c.player_id === player.id)}
                         >
                           Check In
                         </Button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </Table>
             </Modal.Body>
             <Modal.Footer>
               <Button variant="secondary" onClick={handleCloseModals}>
                 Close
               </Button>
             </Modal.Footer>
           </Modal>

           {/* Confirmation Modal */}
           <Modal show={showConfirmModal} onHide={handleCloseModals}>
             <Modal.Header closeButton>
               <Modal.Title>Confirm Check-In for {selectedPlayer?.name}</Modal.Title>
             </Modal.Header>
             <Modal.Body>
               <Form>
                 <Form.Group className="mb-3">
                   <Form.Label>Shirt Color</Form.Label>
                   <Form.Select name="shirt_color" value={formData.shirt_color} onChange={handleChange}>
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
                     checked={formData.is_training}
                     onChange={handleChange}
                   />
                 </Form.Group>
               </Form>
             </Modal.Body>
             <Modal.Footer>
               <Button variant="secondary" onClick={handleCloseModals}>
                 Cancel
               </Button>
               <Button variant="primary" onClick={handleCheckIn}>
                 Confirm Check-In
               </Button>
             </Modal.Footer>
           </Modal>
         </div>
       );
     };

     export default SessionsCheckin;