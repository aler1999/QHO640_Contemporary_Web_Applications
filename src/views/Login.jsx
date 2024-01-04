import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, auth, GoogleProvider } from '../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, setDoc, getDoc, doc } from 'firebase/firestore';

import { useAuth } from '../components/AuthContext';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Message from '../components/Message';

import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setMessage('User not found.');
      } else if (err.code === 'auth/wrong-password') {
        setMessage('Invalid password.');
      } else if (err.code === 'auth/invalid-email') {
        setMessage('Invalid email.');
      } else if (err.code === 'auth/invalid-login-credentials') {
        setMessage('Invalid email or password.');
      } else if (err.code === 'auth/missing-password') {
        setMessage('Missing password.');
      } else {
        console.log(err.code)
        console.log('Error signing in:', err.message);
      }
    }
  };

  const loginWithGoogle = async () => {

    const usersCollectionRef = collection(db, "users");

    try {
      const cred = await signInWithPopup(auth, GoogleProvider);
      // Check if the user already exists in the database
      const userDoc = doc(usersCollectionRef, cred.user.uid);
      const docSnap = await getDoc(userDoc);
      if (!docSnap.exists()) {
        // If not, add the user to the database
        await setDoc(userDoc, {
          email: cred.user.email,
          registrationDate: new Date()
        });
      }
      navigate('/');
    } catch (err) {
      setMessage(err);
    }
  };

  return (
    <>
      <Navigation />
      <Container>
      {message ? (
        <Message variant={'danger'} message={message} />
      ) : null}
        <h2>Login back to our faboulus website!</h2>
        <p>You can use your e-mail or your google account</p>
        <Stack gap={2}>
          <div>
            <Form.Label htmlFor="email">E-mail</Form.Label>
            <Form.Control
              type="text"
              id="email"
              placeholder="E-mail..." 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              type="password"
              id="password"
              placeholder="Password..." 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="mx-auto" style={{width: '200px'}} variant="primary" onClick={login}>Login</Button>
          <Button className="mx-auto" style={{width: '200px'}} variant="primary" onClick={loginWithGoogle}>Login with google</Button>
          <Button className="mx-auto" style={{width: '200px'}} variant="primary" onClick={() => navigate('/signup')}>Don't have an account? Sign up!</Button>
        </Stack>
      </Container>
      <br />
      <Footer />
    </>
  )
}

export default Login;