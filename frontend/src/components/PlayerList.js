import React, { useState, useEffect } from 'react';
     import axios from 'axios';
     import { Table, Button, Form, Modal } from 'react-bootstrap';

     const PlayerList = () => {
       const [players, setPlayers] = useState([]);
       const [search, setSearch] = useState('');
       const [showEditModal, setShowEditModal] = useState(false);
       const [showAddModal, setShowAddModal] = useState(false);
       const [currentPlayer, setCurrentPlayer] = useState(null);
       const [formData, setFormData] = useState({
         name: '',
         student_number: '',
         payment: 'Weekly',
         playerClass: 'Novice',
         skill: 1,
         gender: '',
         is_admin: false,
       });

       useEffect(() => {
         axios.get('http://localhost:5000/api/players')
           .then(res => setPlayers(res.data))
           .catch(err => console.error(err));
       }, []);

       const handleEdit = (player) => {
         setCurrentPlayer(player);
         setFormData({
           name: player.name,
           student_number: player.student_number,
           payment: player.payment,
           playerClass: player.class,
           skill: player.skill,
           gender: player.gender,
           is_admin: player.is_admin,
         });
         setShowEditModal(true);
       };

       const handleAdd = () => {
         setFormData({
           name: '',
           student_number: '',
           payment: 'Weekly',
           playerClass: 'Novice',
           skill: 1,
           gender: '',
           is_admin: false,
         });
         setShowAddModal(true);
       };

       const handleClose = () => {
         setShowEditModal(false);
         setShowAddModal(false);
         setCurrentPlayer(null);
       };

       const handleSave = async () => {
         try {
           if (currentPlayer) {
             // Edit existing player
             await axios.put(`http://localhost:5000/api/players/${currentPlayer.id}`, formData);
             setPlayers(players.map(p => (p.id === currentPlayer.id ? { ...p, ...formData, class: formData.playerClass } : p)));
           } else {
             // Add new player
             const response = await axios.post('http://localhost:5000/api/players', formData);
             setPlayers([...players, { ...response.data, class: response.data.class }]);
           }
           handleClose();
         } catch (err) {
           console.error(err);
           alert('Error saving player');
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
           <h2>Players</h2>
           <Form.Group className="mb-3">
             <Form.Control
               type="text"
               placeholder="Search by name or student number"
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
           </Form.Group>
           <Button variant="success" className="mb-3" onClick={handleAdd}>
             Add Player
           </Button>
           <Table striped bordered hover>
             <thead>
               <tr>
                 <th>Name</th>
                 <th>Student Number</th>
                 <th>Payment</th>
                 <th>Class</th>
                 <th>Skill</th>
                 <th>Gender</th>
                 <th>Admin</th>
                 <th>Actions</th>
               </tr>
             </thead>
             <tbody>
               {filteredPlayers.map(player => (
                 <tr key={player.id}>
                   <td>{player.name}</td>
                   <td>{player.student_number}</td>
                   <td>{player.payment}</td>
                   <td>{player.class}</td>
                   <td>{player.skill}</td>
                   <td>{player.gender}</td>
                   <td>{player.is_admin ? 'Yes' : 'No'}</td>
                   <td>
                     <Button variant="primary" onClick={() => handleEdit(player)}>
                       Edit
                     </Button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </Table>

           <Modal show={showEditModal || showAddModal} onHide={handleClose}>
             <Modal.Header closeButton>
               <Modal.Title>{currentPlayer ? 'Edit Player' : 'Add Player'}</Modal.Title>
             </Modal.Header>
             <Modal.Body>
               <Form>
                 <Form.Group className="mb-3">
                   <Form.Label>Name</Form.Label>
                   <Form.Control
                     type="text"
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                   />
                 </Form.Group>
                 <Form.Group className="mb-3">
                   <Form.Label>Student Number</Form.Label>
                   <Form.Control
                     type="text"
                     name="student_number"
                     value={formData.student_number}
                     onChange={handleChange}
                     required
                   />
                 </Form.Group>
                 <Form.Group className="mb-3">
                   <Form.Label>Payment</Form.Label>
                   <Form.Select name="payment" value={formData.payment} onChange={handleChange}>
                     <option value="Weekly">Weekly</option>
                     <option value="Semester">Semester</option>
                   </Form.Select>
                 </Form.Group>
                 <Form.Group className="mb-3">
                   <Form.Label>Class</Form.Label>
                   <Form.Select name="playerClass" value={formData.playerClass} onChange={handleChange}>
                     <option value="Novice">Novice</option>
                     <option value="Experienced">Experienced</option>
                     <option value="Pro">Pro</option>
                   </Form.Select>
                 </Form.Group>
                 <Form.Group className="mb-3">
                   <Form.Label>Skill</Form.Label>
                   <Form.Control
                     type="number"
                     name="skill"
                     value={formData.skill}
                     onChange={handleChange}
                     min="1"
                     max="10"
                     required
                   />
                 </Form.Group>
                 <Form.Group className="mb-3">
                   <Form.Label>Gender</Form.Label>
                   <Form.Control
                     type="text"
                     name="gender"
                     value={formData.gender}
                     onChange={handleChange}
                   />
                 </Form.Group>
                 <Form.Group className="mb-3">
                   <Form.Check
                     type="checkbox"
                     label="Admin"
                     name="is_admin"
                     checked={formData.is_admin}
                     onChange={handleChange}
                   />
                 </Form.Group>
               </Form>
             </Modal.Body>
             <Modal.Footer>
               <Button variant="secondary" onClick={handleClose}>
                 Close
               </Button>
               <Button variant="primary" onClick={handleSave}>
                 Save Changes
               </Button>
             </Modal.Footer>
           </Modal>
         </div>
       );
     };

     export default PlayerList;