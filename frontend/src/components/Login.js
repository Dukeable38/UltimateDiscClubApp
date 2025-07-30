import React, { useState } from 'react';
     import axios from 'axios';
     import { Form, Button, Container, Alert } from 'react-bootstrap';
     import { useNavigate } from 'react-router-dom';

     const Login = () => {
       const [formData, setFormData] = useState({ email: '', password: '' });
       const [error, setError] = useState('');
       const navigate = useNavigate();

       const handleChange = (e) => {
         setFormData({ ...formData, [e.target.name]: e.target.value });
       };

       const handleSubmit = async (e) => {
         e.preventDefault();
         try {
           const response = await axios.post('http://localhost:5000/api/auth/login', formData);
           localStorage.setItem('token', response.data.token);
           navigate('/player');
         } catch (err) {
           setError(err.response?.data || 'Error logging in');
         }
       };

       return (
         <Container>
           <h2>Player Login</h2>
           {error && <Alert variant="danger">{error}</Alert>}
           <Form onSubmit={handleSubmit}>
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
             <Button variant="primary" type="submit">
               Log In
             </Button>
           </Form>
         </Container>
       );
     };

     export default Login;