import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import { db, auth } from '../config/firebase';
import { collection, getDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { useAuth } from '../components/AuthContext';

function EditEvent() {

  // Get eventId from the URL param eventId
  const { eventId } = useParams();

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

  const storage = getStorage();

  const onSubmitEvent = async () => {

    const eventDocumentRef = doc(db, "events", eventId);

    try {
      // If image got changed upload it to firebase
      if(newImage) {
        // Creating image reference, adding same day timestamp to have a unique image name on server
        const imagesUploadRef = ref(storage, `images/${new Date().toISOString() + newImage.name}`);
        await uploadBytes(imagesUploadRef, newImage);
        // Get the download URL
        const downloadURL = await getDownloadURL(imagesUploadRef);
        // Update document with image URL as well
        await updateDoc(eventDocumentRef, {
          name: newName, 
          date: newDate, 
          time_start: newTime_Start, 
          time_end: newTime_End, 
          location: newLocation, 
          price: parseFloat(newPrice),
          userId: auth?.currentUser?.uid,
          image: downloadURL
        });
      } else {
        // Update document without image URL
        await updateDoc(eventDocumentRef, {
          name: newName, 
          date: newDate, 
          time_start: newTime_Start, 
          time_end: newTime_End, 
          location: newLocation, 
          price: parseFloat(newPrice),
          userId: auth?.currentUser?.uid
        });
      }
      navigate('/myevents');
    } catch(err) {
      console.error(err);
    };
  }

  const getEvent = async () => {
    try {
      // Read event data from the database
      const data = await getDoc(eventDocumentRef);

      // Check if the document exists
      if (data.exists()) {
        // Access other data in the document
        const eventData = data.data();
        // Assign to the eventList useState the newly organized combined event and user data
        setNewName(eventData.name);
        setNewDate(eventData.date);
        setNewTime_Start(eventData.time_start);
        setNewTime_End(eventData.time_end);
        setNewLocation(eventData.location);
        setNewPrice(eventData.price);
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.error('Error getting document:', error);
    }
  };

  useEffect(() => {
    getEvent();
  }, []);

  return (
    <>
      <Navigation />
      <Container>
        {user ? (
          <>
            <h2>Edit your event!</h2>
            <p>Make changes to the event details</p>
            <Stack gap={2}>
              <div>
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <Form.Label htmlFor="date">Date</Form.Label>
                <Form.Control
                  type="date"
                  id="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div>
                <Form.Label htmlFor="time_start">Time Start</Form.Label>
                <Form.Control
                  type="time"
                  id="time_start"
                  value={newTime_Start}
                  onChange={(e) => setNewTime_Start(e.target.value)}
                />
              </div>
              <div>
                <Form.Label htmlFor="time_end">Time End</Form.Label>
                <Form.Control
                  type="time"
                  id="time_end"
                  value={newTime_End} 
                  onChange={(e) => setNewTime_End(e.target.value)}
                />
              </div>
              <div>
                <Form.Label htmlFor="name">Location</Form.Label>
                <Form.Control
                  type="text"
                  id="location"
                  value={newLocation} 
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>
              <div>
                <Form.Label htmlFor="price">Price (£)</Form.Label>
                <Form.Control
                  type="number"
                  id="price"
                  value={newPrice}
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
              <Button className="mx-auto" style={{width: '200px'}} variant="primary" onClick={onSubmitEvent}>Update</Button>
            </Stack>
          </>
        ) : (
          <p>You need to be logged in to edit an event.</p>
        )}
      </Container>
      <br />
      <Footer />
    </>
  )
}

export default EditEvent;