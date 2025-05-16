import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import eventService from "../services/eventService";

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    eventService.getEvents().then((data) => setEvents(data));
  }, []);

  return (
    <div>
      <h1>Upcoming Events</h1>
      <div className="event-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Home;
