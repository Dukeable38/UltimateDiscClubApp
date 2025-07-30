import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <>
      <Navbar bg="light" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">Ultimate Disc</Navbar.Brand>
          <Nav className="ms-auto">
            <Button as={Link} to="/signup" variant="primary" className="me-2">Sign Up</Button>
            <Button as={Link} to="/login" variant="outline-primary">Log In</Button>
          </Nav>
        </Container>
      </Navbar>
      <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
        <h1 className="text-center mb-4">Welcome to Ultimate Disc</h1>
        <div>
          <Button as={Link} to="/signup" variant="primary" className="me-2">Sign Up</Button>
          <Button as={Link} to="/login" variant="outline-primary">Log In</Button>
        </div>
      </Container>
    </>
  );
};

export default Home;