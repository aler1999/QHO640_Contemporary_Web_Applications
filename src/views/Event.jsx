import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import { db } from '../config/firebase';
import { getDocs, getDoc, doc, collection } from 'firebase/firestore';

function Event() {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState([]);
  const usersCollectionRef = collection(db, 'users');

  const getEventDetails = async () => {
    try {
      const eventDocRef = doc(db, 'events', eventId);
      const eventSnapshot = await getDoc(eventDocRef);

      if (eventSnapshot.exists()) {
        const eventDetails = eventSnapshot.data();

        // Read users data from the database
        const users = await getDocs(usersCollectionRef);

        // Organize users data
        const filteredUsers = users.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Combine event data with owner's email
        const eventDataWithOwnerEmail = {
          ...eventDetails,
          id: eventSnapshot.id,
          email: filteredUsers.find((user) => user.id === eventDetails.userId).email,
        };

        // Set the event data in the state
        setEventData(eventDataWithOwnerEmail);
      } else {
        console.log('Document does not exist!');
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  useEffect(() => {
    getEventDetails();
  }, []);

  return (
    <>
      {console.log(eventData)}
      <Navigation />
      <Container className="text-center">
        <div style={{ position: 'relative', height: '350px', overflow: 'hidden' }}>
          <Image
            src={eventData.image}
            className="img-fluid"
            alt="Responsive image"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          <div 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              color: 'white', 
              textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'
            }}
          >
            <h2 style={{ fontSize: '40px', fontWeight: 'bold' }}>
              {eventData.name}
            </h2>
          </div>
        </div>
        <br />
        <h3>Description</h3>
        <br />
        <p>{eventData.description}</p>
        <br />
        <h3>When is happening?</h3>
        <br />
        <p>On {new Date(eventData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}, from {eventData.time_start} to {eventData.time_end}</p>
        <br />
        <h3>Where is happening?</h3>
        <br />
        <p>📍 { eventData.location }</p>
      </Container>
      <br />
      <Footer />
    </>
  );
}

export default Event;
