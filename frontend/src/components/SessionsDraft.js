import React from 'react';

const SessionsDraft = ({ selectedSessionId }) => {
  return (
    <div>
      <h2>Drafting</h2>
      {selectedSessionId ? (
        <p>Drafting data for session {selectedSessionId} will go here.</p>
      ) : (
        <p>No session is selected, there is no data to show.</p>
      )}
    </div>
  );
};

export default SessionsDraft;