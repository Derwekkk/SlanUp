import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { Event } from '../types/event';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useGeolocation } from '../hooks/useGeolocation';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({ search: '', location: '' });
  const [useLocation, setUseLocation] = useState(false);
  
  const geolocation = useGeolocation();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {};
      
      if (searchFilters.search) filters.search = searchFilters.search;
      if (searchFilters.location) filters.location = searchFilters.location;
      
      if (useLocation && geolocation.latitude && geolocation.longitude) {
        filters.lat = geolocation.latitude;
        filters.lon = geolocation.longitude;
      }

      const data = await eventService.getAllEvents(filters);
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchFilters, useLocation, geolocation.latitude, geolocation.longitude]);

  const handleSearch = (filters: { search: string; location: string }) => {
    setSearchFilters(filters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event Finder</h1>
              <p className="text-gray-600 mt-1">Discover amazing events near you</p>
            </div>
            <Link
              to="/create"
              className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              + Create Event
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Location Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useLocation"
              checked={useLocation}
              onChange={(e) => setUseLocation(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              disabled={!geolocation.latitude || !!geolocation.error}
            />
            <label htmlFor="useLocation" className="ml-2 text-sm text-gray-700">
              Sort by distance from my location
            </label>
            {geolocation.loading && (
              <span className="ml-2 text-xs text-gray-500">(detecting location...)</span>
            )}
            {geolocation.error && (
              <span className="ml-2 text-xs text-red-500">(location unavailable)</span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {events.length} event{events.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} onRetry={fetchEvents} />}

        {/* Loading State */}
        {loading && <Loading message="Loading events..." />}

        {/* Events Grid */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search filters or create a new event.</p>
            <div className="mt-6">
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                + Create Event
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventList;
