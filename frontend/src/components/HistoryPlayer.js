import React, { useState } from 'react';
import { Container, Table, Modal, Button } from 'react-bootstrap';

const HistoryPlayer = () => {
  console.log('HistoryPlayer rendering');

  // Simulated past session data
  const pastSessions = [
    { id: 1, title: 'Week 1 Social League', date: '2025-07-20', winningTeam: 'Black', attended: true },
    { id: 2, title: 'Week 2 Social League', date: '2025-07-27', winningTeam: 'White', attended: false },
  ];

  // State for popup
  const [selectedSession, setSelectedSession] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleRowClick = (session) => {
    setSelectedSession(session);
    setShowPopup(true);
  };

  return (
    <Container>
      <h4>Past Sessions</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Winning Team</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {pastSessions.map(session => (
            <tr key={session.id} onClick={() => handleRowClick(session)} style={{ cursor: 'pointer' }}>
              <td>{session.title}</td>
              <td>{session.date}</td>
              <td>{session.winningTeam}</td>
              <td>{session.attended ? 'Attended' : 'Missed'}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showPopup} onHide={() => setShowPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedSession?.title} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Date:</strong> {selectedSession?.date}</p>
          <p><strong>Winning Team:</strong> {selectedSession?.winningTeam}</p>
          <p><strong>Score:</strong> [Placeholder: e.g., Black 10 - White 7]</p>
          <p><strong>MVP Nominations:</strong> [Placeholder: e.g., 3 nominations]</p>
          <p><strong>Other Info:</strong> [Placeholder: Additional details to be added]</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPopup(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HistoryPlayer;