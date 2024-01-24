import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';

import BannerWithText from '../components/BannerWithText';
import Card from '../components/Card';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import { db } from '../config/firebase';
import { getDocs, collection } from 'firebase/firestore';

function Home() {

  const [originalEventList, setOriginalEventList] = useState([]);
  const [eventList, setEventList] = useState([]);

  const eventCollectionRef = collection(db, "events");
  const usersCollectionRef = collection(db, "users");

  const getEventlist = async() => {

    try {
      // Read events data from database
      const eventData = await getDocs(eventCollectionRef);
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
      getEventlist();
  }, []);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;

    // Filter the original eventList based on the search string
    const filteredEvents = originalEventList.filter((event) =>
      event.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Update the eventList state with the filtered events
    setEventList(filteredEvents);
  };

  return (
    <>
      <Navigation />

      <body style={{ backgroundColor: '#F0F2F5' }}>
        <BannerWithText imageUrl={"https://images.unsplash.com/photo-1530541930197-ff16ac917b0e"} title={"Student Events App"} description={"The app that brings students together"} />
        <br />
        <Container style={{ width: '80%' }}>
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
          <Row xs={1} md={2} lg={4} className="g-4">
            {eventList.map((event) => (
              <Col key={event.id}>
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
      </body>

      <Footer />
    </>
  );
}

export default Home;