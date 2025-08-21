import React from 'react';

const SessionsFinal = ({ selectedSessionId }) => {
  return (
    <div>
      <h2>Final Allocations</h2>
      {selectedSessionId ? (
        <p>Final allocation data for session {selectedSessionId} will go here.</p>
      ) : (
        <p>No session is selected, there is no data to show.</p>
      )}
    </div>
  );
};

export default SessionsFinal;