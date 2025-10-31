# Event Finder Backend API

A RESTful API built with Node.js, Express, and TypeScript for managing events.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

The server will start on `http://localhost:3001`

## 📋 API Endpoints

### Get All Events
```
GET /api/events
```

**Query Parameters:**
- `location` (optional) - Filter by location (case-insensitive)
- `date` (optional) - Filter by date (ISO format)
- `search` (optional) - Search in title and description
- `lat` (optional) - User latitude for distance calculation
- `lon` (optional) - User longitude for distance calculation

**Example:**
```bash
curl "http://localhost:3001/api/events?location=San%20Francisco"
curl "http://localhost:3001/api/events?lat=37.7749&lon=-122.4194"
```

### Get Event by ID
```
GET /api/events/:id
```

**Example:**
```bash
curl http://localhost:3001/api/events/1
```

### Create Event
```
POST /api/events
```

**Request Body:**
```json
{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "location": "San Francisco, CA",
  "date": "2025-12-01T09:00:00Z",
  "maxParticipants": 100,
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Meetup",
    "description": "Monthly tech meetup",
    "location": "Seattle, WA",
    "date": "2025-11-30T18:00:00Z",
    "maxParticipants": 50
  }'
```

### Register for Event (Bonus)
```
POST /api/events/:id/register
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/events/1/register
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── controllers/      # Business logic
│   ├── routes/          # API routes
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Helper functions
│   └── server.ts        # Main application
├── package.json
└── tsconfig.json
```

## 🎯 Features

✅ RESTful API design  
✅ TypeScript for type safety  
✅ In-memory storage  
✅ CORS enabled  
✅ Request validation  
✅ Error handling  
✅ Distance calculation (Haversine formula)  
✅ Search and filtering  
✅ Event registration system  

## 📦 Dependencies

- **express** - Web framework
- **cors** - Enable CORS
- **uuid** - Generate unique IDs
- **typescript** - Type safety
- **ts-node-dev** - Development server

## 🔧 Environment Variables

```
PORT=3001  # Server port (default: 3001)
```

## 📝 Data Model

```typescript
interface Event {
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
```
