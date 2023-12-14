import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const Footer = () => {
  return (
    <Navbar className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/">
          Student Events
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Footer;