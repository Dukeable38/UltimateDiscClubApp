import React, { useState } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';

const CheckInPlayer = () => {
  console.log('CheckInPlayer rendering');

  // Simulated session data (updated with names, no type)
  const sessions = [
    { id: 1, date: '2025-07-20', status: 'Closed', name: 'Week 1 Social League' },
    { id: 2, date: '2025-07-31', status: 'Ready', name: 'Week 2 Social League' },
    { id: 3, date: '2025-08-05', status: 'Upcoming', name: 'Week 3 Social League' },
  ];

  // Find the next relevant session
  const currentDate = new Date();
  let showcasedSession = sessions.find(s => s.status === 'Ready');
  if (!showcasedSession) {
    showcasedSession = sessions
      .filter(s => s.status === 'Upcoming')
      .reduce((closest, current) => 
        new Date(current.date) > new Date(closest.date) ? current : closest, 
        sessions.filter(s => s.status === 'Upcoming')[0]
      );
  }

  // State for check-in and form fields
  const [checkedIn, setCheckedIn] = useState(false);
  const [trainingOrPlaying, setTrainingOrPlaying] = useState('Playing');
  const [shirtSelection, setShirtSelection] = useState('Both');
  const [showPopup, setShowPopup] = useState(false);
  const [popupCheckedIn, setPopupCheckedIn] = useState(false);

  const handleCheckIn = () => {
    if (showcasedSession.status === 'Ready' && !checkedIn) {
      setCheckedIn(true);
    }
  };

  const handlePopupCheckIn = () => {
    if (showcasedSession.status === 'Ready' && !popupCheckedIn) {
      setPopupCheckedIn(true);
      setCheckedIn(true); // Sync with top-half state (simulated)
      setShowPopup(false);
    }
  };

  // Sort sessions: Upcoming, Ready, Past
  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.status === 'Upcoming' && b.status !== 'Upcoming') return -1;
    if (a.status !== 'Upcoming' && b.status === 'Upcoming') return 1;
    if (a.status === 'Ready' && b.status !== 'Ready') return -1;
    if (a.status !== 'Ready' && b.status === 'Ready') return 1;
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      {/* Top Half: Showcase Section in Card */}
      <Container>
        <Card
          style={{
            marginTop: '25px',
            marginBottom: '20px',
            borderColor: checkedIn ? '#28a745' : '#000',
            backgroundColor: checkedIn ? '#e6ffe6' : '#fff',
          }}
        >
          <Card.Header style={{ fontWeight: 'bold' }}>{showcasedSession.name}</Card.Header>
          <Card.Body>
            <Card.Text>
              <p>Date: {showcasedSession.date}</p>
              <p>Status: {showcasedSession.status}</p>
            </Card.Text>
            <Form.Group className="mb-3">
              <Form.Label>Training or Playing</Form.Label>
              <Form.Select
                value={trainingOrPlaying}
                onChange={(e) => setTrainingOrPlaying(e.target.value)}
                disabled={showcasedSession.status !== 'Ready' || checkedIn}
              >
                <option value="Playing">Playing</option>
                <option value="Training">Training</option>
              </Form.Select>
            </Form.Group>
            <div className="mb-3">
              <Button
                variant={shirtSelection === 'Both' ? 'primary' : 'outline-primary'}
                onClick={() => { if (showcasedSession.status === 'Ready' && !checkedIn) setShirtSelection('Both'); }}
                disabled={showcasedSession.status !== 'Ready' || checkedIn}
                style={{ marginRight: '5px' }}
              >
                Both
              </Button>
              <Button
                variant={shirtSelection === 'Light' ? 'primary' : 'outline-primary'}
                onClick={() => { if (showcasedSession.status === 'Ready' && !checkedIn) setShirtSelection('Light'); }}
                disabled={showcasedSession.status !== 'Ready' || checkedIn}
                style={{ marginRight: '5px' }}
              >
                Light
              </Button>
              <Button
                variant={shirtSelection === 'Dark' ? 'primary' : 'outline-primary'}
                onClick={() => { if (showcasedSession.status === 'Ready' && !checkedIn) setShirtSelection('Dark'); }}
                disabled={showcasedSession.status !== 'Ready' || checkedIn}
              >
                Dark
              </Button>
            </div>
            <Button
              variant={checkedIn ? 'success' : showcasedSession.status === 'Ready' ? 'primary' : 'secondary'}
              onClick={handleCheckIn}
              disabled={showcasedSession.status !== 'Ready' || checkedIn}
            >
              {checkedIn ? 'Checked In!' : showcasedSession.status === 'Ready' ? 'Check In' : 'Session not open'}
            </Button>
          </Card.Body>
        </Card>
      </Container>

      {/* Bottom Half: Sessions Table */}
      <Container>
        <h4>Sessions</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Check-in</th>
            </tr>
          </thead>
          <tbody>
            {sortedSessions.map(session => (
              <tr
                key={session.id}
                style={{
                  color: session.status === 'Closed' ? '#6c757d' : session.status === 'Ready' ? '#90ee90' : 'inherit',
                  backgroundColor: session.status === 'Ready' ? '#e6ffe6' : 'inherit',
                }}
              >
                <td>{session.name}</td>
                <td>{session.status}</td>
                <td>{session.date}</td>
                <td>
                  <Button
                    variant="secondary"
                    disabled={session.status !== 'Ready'}
                    onClick={() => { if (session.status === 'Ready') setShowPopup(true); }}
                  >
                    {session.status === 'Closed' ? 'Missed' : session.status === 'Upcoming' ? 'Not open yet' : 'Check In'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {/* Popup for Check-in */}
      <Modal show={showPopup} onHide={() => setShowPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{showcasedSession.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card
            style={{
              borderColor: popupCheckedIn ? '#28a745' : '#000',
              backgroundColor: popupCheckedIn ? '#e6ffe6' : '#fff',
            }}
          >
            <Card.Body>
              <Card.Text>
                <p>Date: {showcasedSession.date}</p>
                <p>Status: {showcasedSession.status}</p>
              </Card.Text>
              <Form.Group className="mb-3">
                <Form.Label>Training or Playing</Form.Label>
                <Form.Select
                  value={trainingOrPlaying}
                  onChange={(e) => setTrainingOrPlaying(e.target.value)}
                  disabled={popupCheckedIn}
                >
                  <option value="Playing">Playing</option>
                  <option value="Training">Training</option>
                </Form.Select>
              </Form.Group>
              <div className="mb-3">
                <Button
                  variant={shirtSelection === 'Both' ? 'primary' : 'outline-primary'}
                  onClick={() => { if (!popupCheckedIn) setShirtSelection('Both'); }}
                  disabled={popupCheckedIn}
                  style={{ marginRight: '5px' }}
                >
                  Both
                </Button>
                <Button
                  variant={shirtSelection === 'Light' ? 'primary' : 'outline-primary'}
                  onClick={() => { if (!popupCheckedIn) setShirtSelection('Light'); }}
                  disabled={popupCheckedIn}
                  style={{ marginRight: '5px' }}
                >
                  Light
                </Button>
                <Button
                  variant={shirtSelection === 'Dark' ? 'primary' : 'outline-primary'}
                  onClick={() => { if (!popupCheckedIn) setShirtSelection('Dark'); }}
                  disabled={popupCheckedIn}
                >
                  Dark
                </Button>
              </div>
              <Button
                variant={popupCheckedIn ? 'success' : 'primary'}
                onClick={handlePopupCheckIn}
                disabled={popupCheckedIn}
              >
                {popupCheckedIn ? 'Checked In!' : 'Check In'}
              </Button>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CheckInPlayer;