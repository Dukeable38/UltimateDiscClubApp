import React, { useState } from 'react';
     import axios from 'axios';
     import { Form, Button, Container, Alert } from 'react-bootstrap';
     import { useNavigate } from 'react-router-dom';

     const Signup = () => {
       const [formData, setFormData] = useState({ name: '', email: '', password: '', student_number: '', gender: 'other' });
       const [error, setError] = useState('');
       const navigate = useNavigate();

       const handleChange = (e) => {
         setFormData({ ...formData, [e.target.name]: e.target.value });
       };

       const handleSubmit = async (e) => {
         e.preventDefault();
         try {
           const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
           localStorage.setItem('token', response.data.token);
           navigate('/player');
         } catch (err) {
           setError(err.response?.data || 'Error signing up');
         }
       };

       return (
         <Container>
           <h2>Player Signup</h2>
           {error && <Alert variant="danger">{error}</Alert>}
           <Form onSubmit={handleSubmit}>
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
               <Form.Label>Gender</Form.Label>
               <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                 <option value="male">Male</option>
                 <option value="female">Female</option>
                 <option value="other">Other</option>
               </Form.Select>
             </Form.Group>
             <Button variant="primary" type="submit">
               Sign Up
             </Button>
           </Form>
         </Container>
       );
     };

     export default Signup;