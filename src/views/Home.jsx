import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';

import Card from '../components/Card';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import { db } from '../config/firebase';
import { getDocs, collection } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';

function Home() {

  const [originalEventList, setOriginalEventList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [searchString, setSearchString] = useState([]);

  const getEventlist = async() => {

    const eventCollectionRef = collection(db, "events");
    const usersCollectionRef = collection(db, "users");

    try {
      // Read events data from database
      const eventData = await getDocs(eventCollectionRef);
      console.log("I am in getEventList function")
      // Read users data from database
      const users = await getDocs(usersCollectionRef);
      
      // Organise users data
      const filteredUsers = users.docs.map((doc) => ({
        ...doc.data(), 
        id: doc.id
      }));

      // Organise events data combining for each event its owner finding it in the filteredUsers array through its id
      const filteredEventData = eventData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        email: filteredUsers.find((item) => item.id === doc.data().userId).email,
      }));
      
      // Assign to the eventList useState the newly organised combined event and user data
      setOriginalEventList(filteredEventData);
      setEventList(filteredEventData);
    } catch (err) {
      console.error(err);
    }
  };
  

  useEffect(() => {
    console.log("fetched")
    console.log("I m here")
    getEventlist();
  }, []);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchString(searchValue);

    // Filter the original eventList based on the search string
    const filteredEvents = originalEventList.filter((event) =>
      event.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Update the eventList state with the filtered events
    setEventList(filteredEvents);
  };

  return (
    <>
    {console.log(eventList)}
      <Navigation />
      <Container>
        <h2>Welcome to the Student Events App</h2>
        <p>The app that brings students together</p>
        <Form.Label htmlFor="search">Search</Form.Label>
        <Stack gap={2}>
          <Form.Control
            type="text"
            id="search"
            placeholder="Event name..."
            onChange={handleSearchChange}
          />
        </Stack>
        <br />
        <Row>
          {eventList.map((event) => (
            <Col key={event.id} style={{ width: '100%' }}> 
              <Card 
                key={event.id}
                eventId={event.id}
                name={event.name}
                date={event.date}
                time_start={event.time_start}
                time_end={event.time_end}
                location={event.location}
                price={event.price}
                owner={event.email}
                image={event.image} 
              />
            </Col>
          ))}
        </Row>
      </Container>
      <br />
      <Footer />
    </>
  )
};

export default Home;