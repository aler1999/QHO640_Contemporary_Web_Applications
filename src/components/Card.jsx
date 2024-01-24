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
  }, []);

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
    <Card style={{ width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '0', right: '0', background: 'rgba(255, 255, 255, 0.8)', padding: '5px' }}>
        <b>£{price}</b>
      </div>
      <Card.Img variant="top" src={image} style={{ cursor: 'pointer' }} onClick={() => navigate(`/event/${eventId}`)} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          <p>📅 {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p>⏰ {time_start} - {time_end}</p> 
          <p>📍 {location}</p>
          <p>👥 {participantsArray.length}</p>
          <p>📧 {owner}</p> 
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