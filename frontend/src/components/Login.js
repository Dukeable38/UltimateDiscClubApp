import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import backgroundImage from '../background_image.jpg';

const Login = () => {
  console.log('Login rendering');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
    // Set flag to indicate logged-in state
    localStorage.setItem('isAuthenticated', 'true'); // Simple flag
    localStorage.setItem('isPlayerView', 'true'); // Assume player role
    window.location.href = '/player/dashboard'; // Redirect to dashboard
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
        <h1 className="text-center mb-4">Log In</h1>
        <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Log In
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Login;