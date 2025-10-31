import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { Event } from '../types/event';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { formatDate, getEventStatus, isPastEvent, isEventFull } from '../utils/helpers';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const fetchEvent = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!id || !event) return;

    try {
      setRegistering(true);
      setError(null);
      const updatedEvent = await eventService.registerForEvent(id);
      setEvent(updatedEvent);
      setRegisterSuccess(true);
      setTimeout(() => setRegisterSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading message="Loading event details..." />
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message={error} onRetry={fetchEvent} />
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const status = getEventStatus(event.date, event.currentParticipants, event.maxParticipants);
  const progress = (event.currentParticipants / event.maxParticipants) * 100;
  const canRegister = !isPastEvent(event.date) && !isEventFull(event.currentParticipants, event.maxParticipants);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <span className={`${status.color} text-white text-sm font-semibold px-4 py-2 rounded-full`}>
                {status.text}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-3 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date & Time</p>
                  <p className="text-gray-900 mt-1">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 mr-3 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900 mt-1">{event.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About This Event</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Participants */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Participants</h2>
            <div className="flex justify-between text-gray-700 mb-3">
              <span className="font-medium">{event.currentParticipants} registered</span>
              <span className="text-gray-500">{event.maxParticipants} max capacity</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progress >= 100 ? 'bg-red-500' : progress >= 80 ? 'bg-orange-500' : 'bg-primary-500'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            {/* Registration Button */}
            <div className="mt-6">
              {registerSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-800 font-medium">Successfully registered for this event!</span>
                  </div>
                </div>
              )}

              {error && <ErrorMessage message={error} />}

              {canRegister ? (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {registering ? 'Registering...' : 'Register for Event'}
                </button>
              ) : isPastEvent(event.date) ? (
                <div className="text-gray-500 font-medium">This event has already passed</div>
              ) : (
                <div className="text-red-500 font-medium">This event is full</div>
              )}
            </div>
          </div>
        </div>

        {/* Event Metadata */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Event ID</h3>
          <p className="text-gray-900 font-mono text-sm">{event.id}</p>
          <h3 className="text-sm font-medium text-gray-500 mt-4 mb-2">Created</h3>
          <p className="text-gray-900 text-sm">{formatDate(event.createdAt)}</p>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
