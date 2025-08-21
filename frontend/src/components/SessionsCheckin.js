import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

const SessionsCheckin = ({ selectedSessionId }) => {
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    if (selectedSessionId) {
      // Dummy data for testing
      setCheckins([
        { id: 1, player_name: 'John Doe', shirt_color: 'Light', is_training: false, check_in_time: '2025-08-21T18:00:00' },
        { id: 2, player_name: 'Jane Smith', shirt_color: 'Dark', is_training: true, check_in_time: '2025-08-21T18:05:00' },
      ]);
      // Future backend call
      // const token = localStorage.getItem('token');
      // axios.get(`http://localhost:5000/api/sessions/${selectedSessionId}/checkins`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // }).then(res => setCheckins(res.data)).catch(err => console.error(err));
    } else {
      setCheckins([]);
    }
  }, [selectedSessionId]);

  if (!selectedSessionId) {
    return <p>No session is selected, there is no data to show.</p>;
  }

  return (
    <div>
      <h2>Check-Ins for Session {selectedSessionId}</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Shirt Color</th>
            <th>Is Training</th>
            <th>Check-in Time</th>
          </tr>
        </thead>
        <tbody>
          {checkins.map(checkin => (
            <tr key={checkin.id}>
              <td>{checkin.player_name}</td>
              <td>{checkin.shirt_color}</td>
              <td>{checkin.is_training ? 'Yes' : 'No'}</td>
              <td>{new Date(checkin.check_in_time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SessionsCheckin;