import React, { useState, useEffect } from 'react';
     import axios from 'axios';
     import { Table, Button, Form, Modal, Dropdown, DropdownButton } from 'react-bootstrap';

     const SessionsDraft = () => {
       const [sessions, setSessions] = useState([]);
       const [selectedSession, setSelectedSession] = useState(null);
       const [checkIns, setCheckIns] = useState([]);
       const [draftAssignments, setDraftAssignments] = useState([]);
       const [showAssignModal, setShowAssignModal] = useState(false);
       const [selectedPlayer, setSelectedPlayer] = useState(null);
       const [formData, setFormData] = useState({ team: 'black' });

       // Fetch sessions on mount
       useEffect(() => {
         axios.get('http://localhost:5000/api/sessions')
           .then(res => setSessions(res.data))
           .catch(err => console.error(err));
       }, []);

       // Fetch check-ins and draft assignments when a session is selected
       useEffect(() => {
         if (selectedSession) {
           axios.get(`http://localhost:5000/api/sessions/${selectedSession.session_id}/checkins`)
             .then(res => setCheckIns(res.data))
             .catch(err => console.error(err));
           axios.get(`http://localhost:5000/api/sessions/${selectedSession.session_id}/draft`)
             .then(res => setDraftAssignments(res.data))
             .catch(err => console.error(err));
         }
       }, [selectedSession]);

       const handleSelectSession = (session) => {
         setSelectedSession(session);
         setCheckIns([]);
         setDraftAssignments([]);
       };

       const handleOpenAssignModal = () => {
         setShowAssignModal(true);
         setSelectedPlayer(null);
         setFormData({ team: 'black' });
       };

       const handleSelectPlayer = (player) => {
         setSelectedPlayer(player);
       };

       const handleAssign = async () => {
         if (!selectedSession || !selectedPlayer) {
           alert('Session or player not selected');
           return;
         }
         try {
           const response = await axios.post(
             `http://localhost:5000/api/sessions/${selectedSession.session_id}/draft`,
             { player_id: selectedPlayer.player_id, team: formData.team }
           );
           setDraftAssignments([...draftAssignments.filter(a => a.player_id !== selectedPlayer.player_id), { ...response.data, name: selectedPlayer.name }]);
           setShowAssignModal(false);
         } catch (err) {
           console.error(err);
           alert(err.response?.data || 'Error assigning player');
         }
       };

       const handleRemoveAssignment = async (playerId) => {
         if (!selectedSession) return;
         try {
           await axios.delete(`http://localhost:5000/api/sessions/${selectedSession.session_id}/draft/${playerId}`);
           setDraftAssignments(draftAssignments.filter(a => a.player_id !== playerId));
         } catch (err) {
           console.error(err);
           alert(err.response?.data || 'Error removing assignment');
         }
       };

       const handleChange = (e) => {
         setFormData({ team: e.target.value });
       };

       return (
         <div>
           <h2>Draft</h2>
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
               <Button variant="primary" className="mb-3" onClick={handleOpenAssignModal}>
                 Assign Players
               </Button>

               <h3>Draft Assignments</h3>
               <Table striped bordered hover>
                 <thead>
                   <tr>
                     <th>Name</th>
                     <th>Team</th>
                     <th>Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {draftAssignments.map(assignment => (
                     <tr key={assignment.draft_id}>
                       <td>{assignment.name}</td>
                       <td>{assignment.team}</td>
                       <td>
                         <Button
                           variant="danger"
                           size="sm"
                           onClick={() => handleRemoveAssignment(assignment.player_id)}
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

           {/* Assign Player Modal */}
           <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
             <Modal.Header closeButton>
               <Modal.Title>Assign Player to Team</Modal.Title>
             </Modal.Header>
             <Modal.Body>
               <h4>Checked-In Players</h4>
               <Table striped bordered hover>
                 <thead>
                   <tr>
                     <th>Name</th>
                     <th>Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {checkIns
                     .filter(checkIn => !checkIn.is_training) // Exclude training players
                     .map(checkIn => (
                       <tr key={checkIn.player_id}>
                         <td>{checkIn.name}</td>
                         <td>
                           <Button
                             variant={selectedPlayer?.player_id === checkIn.player_id ? 'primary' : 'outline-primary'}
                             onClick={() => handleSelectPlayer(checkIn)}
                             disabled={checkIn.is_training}
                           >
                             Select
                           </Button>
                         </td>
                       </tr>
                     ))}
                 </tbody>
               </Table>
               {selectedPlayer && (
                 <Form>
                   <Form.Group className="mb-3">
                     <Form.Label>Team for {selectedPlayer.name}</Form.Label>
                     <Form.Select name="team" value={formData.team} onChange={handleChange}>
                       <option value="black">Black</option>
                       <option value="white">White</option>
                     </Form.Select>
                   </Form.Group>
                 </Form>
               )}
             </Modal.Body>
             <Modal.Footer>
               <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
                 Cancel
               </Button>
               <Button variant="primary" onClick={handleAssign} disabled={!selectedPlayer}>
                 Assign
               </Button>
             </Modal.Footer>
           </Modal>
         </div>
       );
     };

     export default SessionsDraft;