import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { db, auth } from '../config/firebase';
import { getDocs, collection, doc, deleteDoc, query, where } from 'firebase/firestore';

import { useAuth } from '../components/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

function MyEvents() {
  // Using AuthContext to maintain user authentication state across multiple components
  const { user } = useAuth();
  const navigate = useNavigate();

  const [eventList, setEventList] = useState([]);

  const handleDelete = async (eventId) => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this item?");
  
    // Check if the user confirmed the deletion
    if (isConfirmed) {
      // Delete document in collection by id
      await deleteDoc(doc(db, "events", eventId));
      // Reload page
      location.reload();
    } else {
      // Do nothing if the user cancels the deletion
      console.log("Deletion canceled");
    };
  };

  const handleEdit = async (eventId) => {
    navigate(`/myevents/edit/${eventId}`);
  };

  const getEventlist = async() => {

    const eventCollectionRef = collection(db, "events");

    try {
      // Read events data from database
      const data = await getDocs(query(eventCollectionRef, where('userId', '==', auth.currentUser.uid)));
      // Organise events data only for the events of the current user
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      // Assign to the eventList useState the newly organised combined event and user data
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
      {console.log(auth.currentUser)}
      <Navigation />
      <Container>
        <h2>My Events</h2>
        <p>Check your own events</p>
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
                  {/* Edit Button */}
                  <Button variant="primary" className="me-2" onClick={() => handleEdit(event.id)}>
                    Edit
                  </Button>
                  {/* Delete Button */}
                  <Button variant="danger" onClick={() => handleDelete(event.id)}>
                    Delete
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

export default MyEvents;