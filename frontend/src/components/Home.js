import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import backgroundImage from '../background_image.jpg'; // Relative to src/

const Home = () => {
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
        <h1 className="text-center mb-4">Welcome to Ultimate Disc</h1>
        <div>
          <Button as={Link} to="/signup" variant="primary" className="me-2">Sign Up</Button>
          <Button as={Link} to="/login" variant="outline-light">Log In</Button>
        </div>
      </Container>
    </>
  );
};

export default Home;