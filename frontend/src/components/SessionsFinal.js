import React, { useState, useEffect } from 'react';
     import axios from 'axios';
     import { Table, Button, Dropdown, DropdownButton } from 'react-bootstrap';

     const SessionsFinal = () => {
       const [sessions, setSessions] = useState([]);
       const [selectedSession, setSelectedSession] = useState(null);
       const [draftAssignments, setDraftAssignments] = useState([]);
       const [finalAssignments, setFinalAssignments] = useState([]);
       const [isFinalized, setIsFinalized] = useState(false);

       // Fetch sessions on mount
       useEffect(() => {
         axios.get('http://localhost:5000/api/sessions')
           .then(res => setSessions(res.data))
           .catch(err => console.error(err));
       }, []);

       // Fetch draft and final assignments when a session is selected
       useEffect(() => {
         if (selectedSession) {
           axios.get(`http://localhost:5000/api/sessions/${selectedSession.session_id}/draft`)
             .then(res => setDraftAssignments(res.data))
             .catch(err => console.error(err));
           axios.get(`http://localhost:5000/api/sessions/${selectedSession.session_id}/final`)
             .then(res => {
               setFinalAssignments(res.data);
               setIsFinalized(res.data.length > 0);
             })
             .catch(err => console.error(err));
         }
       }, [selectedSession]);

       const handleSelectSession = (session) => {
         setSelectedSession(session);
         setDraftAssignments([]);
         setFinalAssignments([]);
         setIsFinalized(false);
       };

       const handleFinalize = async () => {
         if (!selectedSession) return;
         try {
           const response = await axios.post(`http://localhost:5000/api/sessions/${selectedSession.session_id}/finalize`);
           setFinalAssignments(response.data.assignments);
           setDraftAssignments([]);
           setIsFinalized(true);
         } catch (err) {
           console.error(err);
           alert(err.response?.data || 'Error finalizing assignments');
         }
       };

       return (
         <div>
           <h2>Final</h2>
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
               {!isFinalized && draftAssignments.length > 0 && (
                 <>
                   <h3>Draft Assignments</h3>
                   <Table striped bordered hover>
                     <thead>
                       <tr>
                         <th>Name</th>
                         <th>Team</th>
                       </tr>
                     </thead>
                     <tbody>
                       {draftAssignments.map(assignment => (
                         <tr key={assignment.draft_id}>
                           <td>{assignment.name}</td>
                           <td>{assignment.team}</td>
                         </tr>
                       ))}
                     </tbody>
                   </Table>
                   <Button variant="success" onClick={handleFinalize}>
                     Finalize Assignments
                   </Button>
                 </>
               )}

               {isFinalized && (
                 <>
                   <h3>Finalized Assignments</h3>
                   <Table striped bordered hover>
                     <thead>
                       <tr>
                         <th>Name</th>
                         <th>Team</th>
                       </tr>
                     </thead>
                     <tbody>
                       {finalAssignments.map(assignment => (
                         <tr key={assignment.draft_id}>
                           <td>{assignment.name}</td>
                           <td>{assignment.team}</td>
                         </tr>
                       ))}
                     </tbody>
                   </Table>
                 </>
               )}

               {!isFinalized && draftAssignments.length === 0 && (
                 <p>No draft assignments available. Create assignments in the Draft tab first.</p>
               )}
             </>
           )}
         </div>
       );
     };

     export default SessionsFinal;