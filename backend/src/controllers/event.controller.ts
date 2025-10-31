import { v4 as uuidv4 } from 'uuid';
import { Event, CreateEventDTO, EventFilters } from '../types/event.types';
import { calculateDistance } from '../utils/distance';

// In-memory storage
let events: Event[] = [
  {
    id: '1',
    title: 'Tech Meetup 2025',
    description: 'Join us for an evening of networking and learning about the latest in tech',
    location: 'San Francisco, CA',
    date: '2025-11-15T18:00:00Z',
    maxParticipants: 50,
    currentParticipants: 23,
    createdAt: new Date().toISOString(),
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    id: '2',
    title: 'Startup Weekend',
    description: '54 hours to build a startup from scratch with a team of developers, designers, and entrepreneurs',
    location: 'New York, NY',
    date: '2025-11-20T09:00:00Z',
    maxParticipants: 100,
    currentParticipants: 67,
    createdAt: new Date().toISOString(),
    latitude: 40.7128,
    longitude: -74.0060
  },
  {
    id: '3',
    title: 'AI Workshop',
    description: 'Hands-on workshop covering machine learning fundamentals and practical applications',
    location: 'Austin, TX',
    date: '2025-11-25T14:00:00Z',
    maxParticipants: 30,
    currentParticipants: 15,
    createdAt: new Date().toISOString(),
    latitude: 30.2672,
    longitude: -97.7431
  }
];

export class EventController {
  /**
   * Get all events with optional filtering
   */
  static getAllEvents(filters?: EventFilters, userLat?: number, userLon?: number): Event[] {
    let filteredEvents = [...events];

    // Filter by location (case-insensitive partial match)
    if (filters?.location) {
      const locationQuery = filters.location.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.location.toLowerCase().includes(locationQuery)
      );
    }

    // Filter by date
    if (filters?.date) {
      filteredEvents = filteredEvents.filter(event =>
        event.date.startsWith(filters.date!)
      );
    }

    // Search in title and description
    if (filters?.search) {
      const searchQuery = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(searchQuery) ||
        event.description.toLowerCase().includes(searchQuery)
      );
    }

    // Calculate distance from user if coordinates provided
    if (userLat !== undefined && userLon !== undefined) {
      filteredEvents = filteredEvents.map(event => {
        if (event.latitude !== undefined && event.longitude !== undefined) {
          const distance = calculateDistance(userLat, userLon, event.latitude, event.longitude);
          return { ...event, distance };
        }
        return event;
      });

      // Sort by distance
      filteredEvents.sort((a: any, b: any) => {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }

    // Sort by date (upcoming first)
    filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return filteredEvents;
  }

  /**
   * Get event by ID
   */
  static getEventById(id: string): Event | null {
    const event = events.find(e => e.id === id);
    return event || null;
  }

  /**
   * Create new event
   */
  static createEvent(eventData: CreateEventDTO): Event {
    const newEvent: Event = {
      id: uuidv4(),
      ...eventData,
      currentParticipants: 0,
      createdAt: new Date().toISOString()
    };

    events.push(newEvent);
    return newEvent;
  }

  /**
   * Update event (bonus feature)
   */
  static updateEvent(id: string, updates: Partial<CreateEventDTO>): Event | null {
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return null;

    events[index] = {
      ...events[index],
      ...updates
    };

    return events[index];
  }

  /**
   * Delete event (bonus feature)
   */
  static deleteEvent(id: string): boolean {
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return false;

    events.splice(index, 1);
    return true;
  }

  /**
   * Register participant (bonus feature)
   */
  static registerParticipant(id: string): Event | null {
    const event = events.find(e => e.id === id);
    if (!event) return null;

    if (event.currentParticipants >= event.maxParticipants) {
      throw new Error('Event is full');
    }

    event.currentParticipants++;
    return event;
  }
}
