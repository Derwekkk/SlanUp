import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { CreateEventInput } from '../types/event';
import ErrorMessage from '../components/ErrorMessage';
import { formatDateForInput } from '../utils/helpers';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateEventInput>({
    title: '',
    description: '',
    location: '',
    date: formatDateForInput(),
    maxParticipants: 10,
    latitude: undefined,
    longitude: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxParticipants' || name === 'latitude' || name === 'longitude' 
        ? value === '' ? undefined : Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return;
    }
    if (!formData.date) {
      setError('Date is required');
      return;
    }
    if (formData.maxParticipants < 1) {
      setError('Max participants must be at least 1');
      return;
    }

    // Validate date is in the future
    if (new Date(formData.date) < new Date()) {
      setError('Event date must be in the future');
      return;
    }

    // Validate coordinates if provided
    if (formData.latitude !== undefined && formData.longitude !== undefined) {
      if (formData.latitude < -90 || formData.latitude > 90) {
        setError('Latitude must be between -90 and 90');
        return;
      }
      if (formData.longitude < -180 || formData.longitude > 180) {
        setError('Longitude must be between -180 and 180');
        return;
      }
    }

    try {
      setLoading(true);
      const eventData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };
      const newEvent = await eventService.createEvent(eventData);
      navigate(`/events/${newEvent.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
      setLoading(false);
    }
  };

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
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Event</h1>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Tech Meetup 2025"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Describe your event..."
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            {/* Date and Max Participants Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Max Participants */}
              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants *
                </label>
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Optional Coordinates */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Optional: Add Coordinates for Distance Calculation
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude || ''}
                    onChange={handleChange}
                    step="any"
                    min="-90"
                    max="90"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 37.7749"
                  />
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude || ''}
                    onChange={handleChange}
                    step="any"
                    min="-180"
                    max="180"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., -122.4194"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Adding coordinates enables distance-based sorting for users
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
