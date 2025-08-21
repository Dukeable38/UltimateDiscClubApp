import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import backgroundImage from '../background_image.jpg';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', gender: 'Male', student_number: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.student_number) {
      alert('All fields are required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      localStorage.setItem('token', response.data.token); // Store token
      alert('Signup successful! Redirecting to login.');
      window.location.href = '/login';
    } catch (err) {
      console.error('Signup error:', err);
      alert('Signup failed: ' + (err.response?.data || 'Server Error'));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          position: 'fixed',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '100vh', position: 'relative', zIndex: 1, color: 'white' }}
      >
        <h1 className="text-center mb-4">Sign Up</h1>
        <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
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
            <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            Sign Up
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Signup;