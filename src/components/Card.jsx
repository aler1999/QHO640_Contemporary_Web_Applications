import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, auth } from '../config/firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

import { useAuth } from '../components/AuthContext';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function CardComponent({eventId, name, date, time_start, time_end, location, price, owner, image}) {

  const { user } = useAuth();
  const navigate = useNavigate();
  const [participantsArray, setParticipantsArray] = useState([]);
  const eventDocumentRef = doc(db, "events", eventId);

  useEffect(() => {
    // Fetch the current participants from the database
    const fetchParticipants = async () => {
      const docSnap = await getDoc(eventDocumentRef);
      if (docSnap.exists()) {
        setParticipantsArray(docSnap.data().participants || []);
      }
    };

    fetchParticipants();
  }, [eventDocumentRef]);

  const handleParticipant = async () => {
    const currentUserID = auth.currentUser.uid;

    // Check if the user is already a participant
    if (!participantsArray.includes(currentUserID)) {
      // If not, update the document and useState
      const updatedParticipants = [...participantsArray, currentUserID];
      await updateDoc(eventDocumentRef, { participants: updatedParticipants });
      setParticipantsArray(updatedParticipants);
    } else {
      // Handle the case where the user is already a participant
      alert(`${auth.currentUser.email} is already a participant.`);
    }
  };

  return (
    <Card style={{ width: '18rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '0', right: '0', background: 'rgba(255, 255, 255, 0.8)', padding: '5px' }}>
        <b>£{price}</b>
      </div>
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          <p>Date: {date}</p>
          <p>Start: {time_start} - End: {time_end}</p> 
          <p>Location: {location}</p>
          <p>Participants: {participantsArray.length}</p>
          <p>
            Organiser:<br />
            {owner}
          </p> 
        </Card.Text>
        {user ? (
          <Button variant="primary" onClick={handleParticipant}>Participate</Button>
        ) : (
          <Button variant="primary" onClick={() => navigate('/login')}>Login to participate</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default CardComponent;