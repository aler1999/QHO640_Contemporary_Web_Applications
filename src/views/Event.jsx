import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

import BannerWithText from '../components/BannerWithText';
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
      <Navigation />
      <body style={{ backgroundColor: '#F0F2F5' }}>
        <BannerWithText imageUrl={eventData.image} title={eventData.name} />
        <Container style={{ width: '80%' }} className="text-center">
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
      </body>
      <Footer />
    </>
  );
}

export default Event;
