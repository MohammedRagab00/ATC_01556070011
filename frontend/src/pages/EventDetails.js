import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import eventService from "../services/eventService";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    eventService.getEvent(id).then((data) => setEvent(data));
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h1>{event.name}</h1>
      <p>{event.description}</p>
      <p>{event.eventDate}</p>
      <button>Book Now</button>
    </div>
  );
};

export default EventDetails;
