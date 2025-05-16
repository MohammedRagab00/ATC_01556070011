import React from "react";
import styled from "styled-components";

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

const EventCard = ({ event }) => {
  return (
    <Card>
      <h3>{event.name}</h3>
      <p>{event.description}</p>
      <p>{event.eventDate}</p>
      {event.isBooked ? <span>Booked</span> : <button>Book Now</button>}
    </Card>
  );
};

export default EventCard;
