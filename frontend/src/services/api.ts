import axios from 'axios';
import { Event, CreateEventInput, ApiResponse } from '../types/event';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface EventFilters {
  location?: string;
  date?: string;
  search?: string;
  lat?: number;
  lon?: number;
}

export const eventService = {
  /**
   * Get all events with optional filters
   */
  async getAllEvents(filters?: EventFilters): Promise<Event[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.location) params.append('location', filters.location);
      if (filters?.date) params.append('date', filters.date);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.lat !== undefined) params.append('lat', filters.lat.toString());
      if (filters?.lon !== undefined) params.append('lon', filters.lon.toString());

      const response = await api.get<ApiResponse<Event[]>>(`/events?${params.toString()}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  },

  /**
   * Get event by ID
   */
  async getEventById(id: string): Promise<Event> {
    try {
      const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
      if (!response.data.data) {
        throw new Error('Event not found');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error('Failed to fetch event');
    }
  },

  /**
   * Create new event
   */
  async createEvent(eventData: CreateEventInput): Promise<Event> {
    try {
      const response = await api.post<ApiResponse<Event>>('/events', eventData);
      if (!response.data.data) {
        throw new Error('Failed to create event');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating event:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to create event');
    }
  },

  /**
   * Register for an event
   */
  async registerForEvent(id: string): Promise<Event> {
    try {
      const response = await api.post<ApiResponse<Event>>(`/events/${id}/register`);
      if (!response.data.data) {
        throw new Error('Failed to register for event');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('Error registering for event:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to register for event');
    }
  }
};
