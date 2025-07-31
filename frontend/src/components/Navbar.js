import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">Ultimate Disc</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
            <Nav.Link as={Link} to="/login">Log In</Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;