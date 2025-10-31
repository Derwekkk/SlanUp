/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Format date for input field (YYYY-MM-DDTHH:mm)
 */
export const formatDateForInput = (dateString?: string): string => {
  const date = dateString ? new Date(dateString) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Check if event is in the past
 */
export const isPastEvent = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};

/**
 * Check if event is full
 */
export const isEventFull = (currentParticipants: number, maxParticipants: number): boolean => {
  return currentParticipants >= maxParticipants;
};

/**
 * Get event status badge
 */
export const getEventStatus = (
  date: string,
  currentParticipants: number,
  maxParticipants: number
): { text: string; color: string } => {
  if (isPastEvent(date)) {
    return { text: 'Past', color: 'bg-gray-500' };
  }
  if (isEventFull(currentParticipants, maxParticipants)) {
    return { text: 'Full', color: 'bg-red-500' };
  }
  const spotsLeft = maxParticipants - currentParticipants;
  if (spotsLeft <= 5) {
    return { text: `${spotsLeft} spots left`, color: 'bg-orange-500' };
  }
  return { text: 'Available', color: 'bg-green-500' };
};

/**
 * Format distance
 */
export const formatDistance = (distance?: number): string => {
  if (distance === undefined) return '';
  if (distance < 1) return `${Math.round(distance * 1000)}m away`;
  return `${distance.toFixed(1)}km away`;
};
