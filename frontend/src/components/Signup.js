// src/components/Signup.js
import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import backgroundImage from '../background_image.jpg';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', student_number: '', gender: '', skill: '', class: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Signup successful! Please log in.');
      window.location.href = '/login';
    } catch (err) {
      console.error('Signup error:', err);
      alert('Signup failed: ' + (err.response?.data || 'Server Error'));
    }
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Student Number</Form.Label>
            <Form.Control
              type="text"
              value={formData.student_number}
              onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              type="text"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Skill (1-10)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="10"
              value={formData.skill}
              onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Class</Form.Label>
            <Form.Control
              type="text"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            />
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