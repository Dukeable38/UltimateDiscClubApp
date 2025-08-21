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
    email: '',
    password: '',
    gender: 'Male',
    student_number: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
      alert('Please log in as an admin to manage players');
      return;
    }
    axios.get('http://localhost:5000/api/players', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setPlayers(res.data))
      .catch(err => console.error('Error fetching players:', err.response?.data || err.message));
  }, []);

  const handleEdit = (player) => {
    setCurrentPlayer(player);
    setFormData({
      name: player.name,
      email: player.email,
      password: '', // Password not editable, will be hashed on update if provided
      gender: player.gender,
      student_number: player.student_number,
      payment: player.payment,
      class: player.class,
      skill: player.skill,
      player_status: player.player_status,
    });
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      gender: 'Male',
      student_number: '',
    });
    setShowAddModal(true);
  };

  const handleClose = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setCurrentPlayer(null);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
      alert('Please log in as an admin to save players');
      return;
    }

    try {
      const url = currentPlayer
        ? `http://localhost:5000/api/players/${currentPlayer.id}`
        : 'http://localhost:5000/api/players';
      const method = currentPlayer ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: {
          ...formData,
          student_number: formData.student_number || currentPlayer?.student_number, // Use existing for edits
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedPlayer = { ...response.data, class: response.data.class || 'Novice' };
      setPlayers(currentPlayers =>
        currentPlayer
          ? currentPlayers.map(p => (p.id === currentPlayer.id ? updatedPlayer : p))
          : [...currentPlayers, updatedPlayer]
      );
      handleClose();
    } catch (err) {
      console.error('Error saving player:', err.response?.data || err.message);
      alert('Error saving player: ' + (err.response?.data || err.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(search.toLowerCase()) ||
    player.student_number.includes(search) ||
    player.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Players</h2>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name, student number, or email"
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
            <th>Email</th>
            <th>Student Number</th>
            <th>Gender</th>
            <th>Payment</th>
            <th>Class</th>
            <th>Skill</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map(player => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.email}</td>
              <td>{player.student_number}</td>
              <td>{player.gender}</td>
              <td>{player.payment}</td>
              <td>{player.class}</td>
              <td>{player.skill}</td>
              <td>{player.player_status}</td>
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep existing"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Student Number</Form.Label>
              <Form.Control
                type="text"
                name="student_number"
                value={formData.student_number}
                onChange={handleChange}
                required={!currentPlayer} // Required for new players, optional for edits
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Form.Group>
            {currentPlayer && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Payment</Form.Label>
                  <Form.Select name="payment" value={formData.payment} onChange={handleChange}>
                    <option value="Weekly">Weekly</option>
                    <option value="Semester">Semester</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Select name="class" value={formData.class} onChange={handleChange}>
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
                    max="9"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="player_status" value={formData.player_status} onChange={handleChange}>
                    <option value="New">New</option>
                    <option value="Processed">Processed</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}
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