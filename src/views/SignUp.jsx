import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, auth, GoogleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, setDoc, doc } from 'firebase/firestore';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Message from '../components/Message';

import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function SignUp() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const usersCollectionRef = collection(db, "users");

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(cred => {
        return setDoc(doc(usersCollectionRef, cred.user.uid), {
          email: email,
          registrationDate: new Date()
        });
      });
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        setMessage('Invalid email.');
      } else if (err.code === 'auth/missing-password') {
        setMessage('Missing password.');
      } else if (err.code === 'auth/weak-password') {
        setMessage('Weak password, should be at least 6 characters.');
      } else if (err.code === 'auth/email-already-in-use') {
        setMessage('Email already in use.');
      } else {
        console.log(err.code)
        console.log('Error signing in:', err.message);
      }
    };
  };

  const signUpWithGoogle = async () => {
    try {
      await signInWithPopup(auth, GoogleProvider).then(cred => {
        return setDoc(doc(usersCollectionRef, cred.user.uid), {
          email: cred.user.email,
          registrationDate: new Date()
        });
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    };
  };

  return (
    <>
      <Navigation />
      <Container>
      {message ? (
        <Message variant={'danger'} message={message} />
      ) : null}
        <h2>Sign up to our faboulus website!</h2>
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
          <Button className="mx-auto" style={{width: '200px'}} variant="primary" onClick={signUp}>Sign up</Button>
          <Button className="mx-auto" style={{width: '200px'}} variant="primary" onClick={signUpWithGoogle}>Sign in with google</Button>
        </Stack>
      </Container>
      <br />
      <Footer />
    </>
  )
}

export default SignUp;