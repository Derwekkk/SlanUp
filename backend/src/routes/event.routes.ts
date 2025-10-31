import { Router, Request, Response } from 'express';
import { EventController } from '../controllers/event.controller';
import { CreateEventDTO, EventFilters } from '../types/event.types';

const router = Router();

/**
 * GET /api/events
 * Get all events with optional filters
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const filters: EventFilters = {
      location: req.query.location as string,
      date: req.query.date as string,
      search: req.query.search as string
    };

    // Get user location for distance calculation
    const userLat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    const userLon = req.query.lon ? parseFloat(req.query.lon as string) : undefined;

    const events = EventController.getAllEvents(filters, userLat, userLon);

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

/**
 * GET /api/events/:id
 * Get event by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = EventController.getEventById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
});

/**
 * POST /api/events
 * Create new event
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const eventData: CreateEventDTO = req.body;

    // Validation
    if (!eventData.title || !eventData.description || !eventData.location || !eventData.date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description, location, date'
      });
    }

    if (!eventData.maxParticipants || eventData.maxParticipants < 1) {
      return res.status(400).json({
        success: false,
        error: 'maxParticipants must be at least 1'
      });
    }

    // Validate date
    const eventDate = new Date(eventData.date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
    }

    // Validate coordinates if provided
    if (eventData.latitude !== undefined && eventData.longitude !== undefined) {
      if (
        eventData.latitude < -90 || eventData.latitude > 90 ||
        eventData.longitude < -180 || eventData.longitude > 180
      ) {
        return res.status(400).json({
          success: false,
          error: 'Invalid coordinates'
        });
      }
    }

    const newEvent = EventController.createEvent(eventData);

    res.status(201).json({
      success: true,
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create event'
    });
  }
});

/**
 * POST /api/events/:id/register
 * Register for an event (bonus feature)
 */
router.post('/:id/register', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = EventController.registerParticipant(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event,
      message: 'Successfully registered for event'
    });
  } catch (error: any) {
    if (error.message === 'Event is full') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to register for event'
    });
  }
});

export default router;
