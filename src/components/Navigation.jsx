import { useNavigate } from 'react-router-dom';

import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { useAuth } from './AuthContext';

function Navigation() {

  // Using AuthContext to maintain user authentication state across multiple components
  const { user } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error(err);
    };
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="/">StudentEvents</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link href="/">Home</Nav.Link>
              {user ? (
                <>
                  <Nav.Link href="/newevent">New Event</Nav.Link>
                  <Nav.Link href="/myevents">My Events</Nav.Link>
                  <Nav.Link href="/schedule">Schedule</Nav.Link>
                </>
              ) : null}
            </Nav>
            {!user ? (
              <Nav.Link className="d-flex" href="/login">Login</Nav.Link>
            ) : null}
            {user ? (
              <Nav.Link className="d-flex" onClick={logout}>
                <img
                  src={user.photoURL ? user.photoURL : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                  alt={user.displayName} 
                  style={{ width: '30px', height: '30px', marginRight: '5px', borderRadius: '50%' }}
                />
                {user.displayName ? user.displayName : user.email} (Logout)
              </Nav.Link>
              ) : null}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
    </>
  );
}

export default Navigation;