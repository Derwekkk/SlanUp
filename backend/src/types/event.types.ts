export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  maxParticipants: number;
  currentParticipants: number;
  createdAt: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  location: string;
  date: string;
  maxParticipants: number;
  latitude?: number;
  longitude?: number;
}

export interface EventFilters {
  location?: string;
  date?: string;
  search?: string;
}
