import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { db, auth } from '../config/firebase';
import { getDocs, collection, doc, updateDoc, arrayRemove, query, where } from 'firebase/firestore';

import { useAuth } from '../components/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

function Schedule() {
  // Using AuthContext to maintain user authentication state across multiple components
  const { user } = useAuth();

  const [eventList, setEventList] = useState([]);
  const eventCollectionRef = collection(db, "events");

  const handleWithdraw = async (eventId) => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to withdraw from this event?");
    
    // Check if the user confirmed the withdrawal
    if (isConfirmed) {
      try {
        // Remove the user from the participants array in Firestore
        await updateDoc(doc(db, 'events', eventId), {
          participants: arrayRemove(user.uid)
        });
  
        location.reload()
      } catch (error) {
        console.error('Error withdrawing from event:', error);
      }
    }
  };

  const getEventlist = async() => {
    try {
      const data = await getDocs(
        query(
          eventCollectionRef,
          where('participants', 'array-contains', user.uid)
        )
      );
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      setEventList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getEventlist();
  }, [user]);

  return (
    <>
    {console.log("refresh!")}
      <Navigation />
      <Container>
        <h2>Schedule</h2>
        <p>Check your event schedule</p>
        <br />
          <Stack gap={3}>
            {eventList.map((event) => (
              <Card>
              <Card.Body>
                <Card.Title>{event.name}</Card.Title>
                <Card.Subtitle>Location: {event.location}</Card.Subtitle>
                <Card.Text>
                  <p>
                    Date: {event.date},
                    Start Time: {event.time_start},
                    End Time: {event.time_end},
                    Price: £{event.price},
                    Participants: {event.participants.length}
                  </p>
                </Card.Text>
                {/* Withdraw Button */}
                <Button variant="danger" onClick={() => handleWithdraw(event.id)}>
                  Withdraw
                </Button>
              </Card.Body>
            </Card>
            ))}
          </Stack>
      </Container>
      <br />
      <Footer />
    </>
  );
};

export default Schedule;