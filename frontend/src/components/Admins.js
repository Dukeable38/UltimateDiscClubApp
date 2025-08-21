import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
      alert('Please log in as an admin to manage admins');
      return;
    }
    axios.get('http://localhost:5000/api/players', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setAdmins(res.data.filter(player => player.is_admin));
        setAvailablePlayers(res.data.filter(player => !player.is_admin));
      })
      .catch(err => console.error('Error fetching players:', err.response?.data || err.message));
  }, []);

  const handleEdit = (admin) => {
    setCurrentAdmin(admin);
    setShowRemoveModal(true);
  };

  const handleRemoveAdmin = async () => {
    if (!window.confirm(`Are you sure you want to remove ${currentAdmin.name} as an admin?`)) {
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/players/${currentAdmin.id}/admin`,
        { is_admin: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmins(admins.filter(a => a.id !== currentAdmin.id));
      setAvailablePlayers([...availablePlayers, { ...currentAdmin, is_admin: false }]);
      setShowRemoveModal(false);
      setCurrentAdmin(null);
    } catch (err) {
      console.error('Error removing admin:', err.response?.data || err.message);
      alert('Error removing admin: ' + (err.response?.data || err.message));
    }
  };

  const handleAddAdmin = () => {
    setShowAddModal(true);
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
  };

  const handleConfirmAddAdmin = async () => {
    if (!selectedPlayer) return;
    if (!window.confirm(`Are you sure you want to add ${selectedPlayer.name} as an admin?`)) {
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/players/${selectedPlayer.id}/admin`,
        { is_admin: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmins([...admins, { ...selectedPlayer, is_admin: true }]);
      setAvailablePlayers(availablePlayers.filter(p => p.id !== selectedPlayer.id));
      setShowAddModal(false);
      setSelectedPlayer(null);
    } catch (err) {
      console.error('Error adding admin:', err.response?.data || err.message);
      alert('Error adding admin: ' + (err.response?.data || err.message));
    }
  };

  const handleClose = () => {
    setShowRemoveModal(false);
    setShowAddModal(false);
    setCurrentAdmin(null);
    setSelectedPlayer(null);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(search.toLowerCase()) ||
    admin.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Admins</h2>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Form.Group>
      <Button variant="success" className="mb-3" onClick={handleAddAdmin}>
        Add Admin
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.map(admin => (
            <tr key={admin.id}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(admin)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showRemoveModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove {currentAdmin?.name} as an admin?</p>
          <Button variant="danger" onClick={handleRemoveAdmin}>
            Remove Admin
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {availablePlayers.map(player => (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{player.email}</td>
                  <td>
                    <Button variant="success" onClick={() => handleSelectPlayer(player)}>
                      Add
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {selectedPlayer && (
            <div className="mt-3">
              <p>Selected: {selectedPlayer.name}</p>
              <Button variant="primary" onClick={handleConfirmAddAdmin}>
                Confirm Add Admin
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminList;