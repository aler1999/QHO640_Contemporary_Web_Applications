import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import { db, auth } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { useAuth } from '../components/AuthContext';

function NewEvent() {

  // Using AuthContext to maintain user authentication state across multiple components
  const { user } = useAuth();

  const navigate = useNavigate();

  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime_Start, setNewTime_Start] = useState("");
  const [newTime_End, setNewTime_End] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState(null);

  const eventCollectionRef = collection(db, "events");

  const storage = getStorage();

  const onSubmitEvent = async () => {
    try {
      // Upload image to firebase
      if(!newImage) return;
      // Creating image reference, adding same day timestamp to have a unique image name on server
      const imagesUploadRef = ref(storage, `images/${new Date().toISOString() + newImage.name}`);
      await uploadBytes(imagesUploadRef, newImage);

      // Get the download URL
      const downloadURL = await getDownloadURL(imagesUploadRef);

      // Create a new document for the new event
      await addDoc(eventCollectionRef, {
        name: newName, 
        date: newDate, 
        time_start: newTime_Start, 
        time_end: newTime_End, 
        location: newLocation, 
        price: parseFloat(newPrice),
        participants: [],
        userId: auth?.currentUser?.uid,
        image: downloadURL
      });
      navigate('/');
    } catch(err) {
      console.error(err);
    };
  };

  return (
    <>
      <Navigation />
      <Container>
        {user ? (
          <>
            <h2>Create a new event!</h2>
            <p>Inspire other student and let them join your party</p>
            <Stack gap={2}>
              <div>
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  placeholder="Name..." 
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <Form.Label htmlFor="date">Date</Form.Label>
                <Form.Control
                  type="date"
                  id="date"
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div>
                <Form.Label htmlFor="time_start">Time Start</Form.Label>
                <Form.Control
                  type="time"
                  id="time_start"
                  placeholder="Time Start..." 
                  onChange={(e) => setNewTime_Start(e.target.value)}
                />
              </div>
              <div>
                <Form.Label htmlFor="time_end">Time End</Form.Label>
                <Form.Control
                  type="time"
                  id="time_end"
                  placeholder="Time End..." 
                  onChange={(e) => setNewTime_End(e.target.value)}
                />
              </div>
              <div>
                <Form.Label htmlFor="name">Location</Form.Label>
                <Form.Control
                  type="text"
                  id="location"
                  placeholder="Location..." 
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>
              <div>
                <Form.Label htmlFor="price">Price (£)</Form.Label>
                <Form.Control
                  type="number"
                  id="price"
                  placeholder="Price..." 
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
              <div>
                <Form.Label htmlFor="image">Image</Form.Label>
                <Form.Control
                  type="file"
                  id="image"
                  onChange={(e) => setNewImage(e.target.files[0])}
                />
              </div>
              <br />
              <Button className="mx-auto" style={{width: '200px'}} variant="primary" onClick={onSubmitEvent}>Create</Button>
            </Stack>
          </>
        ) : (
          <p>You need to be logged in to create a new event.</p>
        )}
      </Container>
      <br />
      <Footer />
    </>
  );
};

export default NewEvent;