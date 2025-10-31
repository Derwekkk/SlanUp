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
  distance?: number;
}

export interface CreateEventInput {
  title: string;
  description: string;
  location: string;
  date: string;
  maxParticipants: number;
  latitude?: number;
  longitude?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
}
