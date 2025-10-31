import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types/event';
import { formatDate, getEventStatus, formatDistance } from '../utils/helpers';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const status = getEventStatus(event.date, event.currentParticipants, event.maxParticipants);
  const progress = (event.currentParticipants / event.maxParticipants) * 100;

  return (
    <Link
      to={`/events/${event.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{event.title}</h3>
          <span className={`${status.color} text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-2`}>
            {status.text}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.date)}</span>
          </div>

          {event.distance !== undefined && (
            <div className="flex items-center text-sm text-primary-600 font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{formatDistance(event.distance)}</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{event.currentParticipants} participants</span>
            <span>{event.maxParticipants} max</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progress >= 100 ? 'bg-red-500' : progress >= 80 ? 'bg-orange-500' : 'bg-primary-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
