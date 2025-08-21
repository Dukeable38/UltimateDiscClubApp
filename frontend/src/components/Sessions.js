import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Table } from 'react-bootstrap';

const Sessions = ({ selectedSessionId, handleSelectSession }) => {
  const [sessions, setSessions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', datetime: '' });

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in as an admin to view sessions');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/sessions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(response.data);
      } catch (err) {
        console.error('Error fetching sessions:', err.response?.data || err.message);
        alert('Error fetching sessions: ' + (err.response?.data || err.message));
      }
    };
    fetchSessions();
  }, []);

  const handleCreateSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in as an admin to create sessions');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/sessions', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions([response.data, ...sessions]);
      setShowCreateModal(false);
      setFormData({ name: '', datetime: '' });
    } catch (err) {
      console.error('Error creating session:', err.response?.data || err.message);
      alert('Error creating session: ' + (err.response?.data || err.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setShowCreateModal(false);
  };

  const onSelect = (id) => {
    if (selectedSessionId === id) {
      handleSelectSession(null);
    } else {
      handleSelectSession(id);
    }
  };

  return (
    <div>
      <h2>Sessions & Selections</h2>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search sessions"
          // Add search logic if needed
        />
      </Form.Group>
      <Button variant="primary" className="mb-3" onClick={() => setShowCreateModal(true)}>
        Add Session
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Datetime</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(session => (
            <tr key={session.session_id}>
              <td>{session.name}</td>
              <td>{new Date(session.datetime).toLocaleString()}</td>
              <td>{session.status}</td>
              <td>
                <Button
                  variant={selectedSessionId === session.session_id ? 'success' : 'outline-primary'}
                  onClick={() => onSelect(session.session_id)}
                >
                  {selectedSessionId === session.session_id ? 'Selected' : 'Select'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showCreateModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Session</Modal.Title>
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
              <Form.Label>Datetime</Form.Label>
              <Form.Control
                type="datetime-local"
                name="datetime"
                value={formData.datetime}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateSession}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sessions;