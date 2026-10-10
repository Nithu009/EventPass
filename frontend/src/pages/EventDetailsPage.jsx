import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, MapPin, Tag, Shield, ArrowRight } from 'lucide-react';
import { Loader } from '../components/common/Loader';

export const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullPage message="Loading event details..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="card">
        <h1>{event ? event.title : `Event #${id}`}</h1>
        <p style={{ color: '#94a3b8', margin: '1rem 0 2rem' }}>
          {event?.description || 'Event details and seat configuration will be retrieved from the backend.'}
        </p>
        <Link to={`/events/${id}/seats`} className="btn btn-primary">
          Select Seats <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
