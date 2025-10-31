# Event Finder Frontend

A modern, responsive React application for discovering and creating events.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## 🎯 Features

### Core Features
- ✅ Event list view with responsive grid layout
- ✅ Event detail view with full information
- ✅ Create event form with validation
- ✅ Search and filter functionality
- ✅ Real-time participant tracking

### Bonus Features
- ✅ Distance-based sorting using geolocation
- ✅ Loading states for all async operations
- ✅ Comprehensive error handling
- ✅ TypeScript for type safety
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern UI with Tailwind CSS
- ✅ Event registration system
- ✅ Progress bars for participant tracking
- ✅ Status badges (Available, Full, Past)

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── EventCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorMessage.tsx
│   ├── pages/           # Page components
│   │   ├── EventList.tsx
│   │   ├── EventDetail.tsx
│   │   └── CreateEvent.tsx
│   ├── services/        # API integration
│   │   └── api.ts
│   ├── types/           # TypeScript types
│   │   └── event.ts
│   ├── hooks/           # Custom React hooks
│   │   └── useGeolocation.ts
│   ├── utils/           # Helper functions
│   │   └── helpers.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Geolocation API** - Distance calculation

## 🎨 Pages

### Event List (`/`)
- Grid layout of all events
- Search by title/description
- Filter by location
- Sort by distance (with geolocation)
- Create new event button

### Event Detail (`/events/:id`)
- Full event information
- Participant count with progress bar
- Registration button
- Status indicators
- Back navigation

### Create Event (`/create`)
- Form with validation
- Date/time picker
- Optional coordinates
- Real-time validation feedback

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```bash
VITE_API_URL=http://localhost:3001/api
```

### Proxy Setup

The Vite config includes a proxy for API requests in development:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true
  }
}
```

## 🎯 Key Components

### EventCard
Displays event summary with:
- Title and status badge
- Location and date
- Participant progress bar
- Distance (if available)

### SearchBar
Provides filtering with:
- Text search
- Location filter
- Clear button
- Responsive layout

### Custom Hooks

#### useGeolocation
```typescript
const { latitude, longitude, error, loading } = useGeolocation();
```

Automatically requests user location for distance calculations.

## 📱 Responsive Design

- **Mobile**: Single column layout
- **Tablet**: 2-column grid
- **Desktop**: 3-column grid

All components are fully responsive with touch-friendly interactions.

## 🔐 Error Handling

- Network errors with retry option
- Form validation errors
- 404 handling for missing events
- User-friendly error messages

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy dist folder
netlify deploy --prod --dir=dist
```

### Environment Variables for Production

Set these in your hosting platform:

```
VITE_API_URL=https://your-api-url.com/api
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to change the primary color:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Styling

All components use Tailwind utility classes. Customize in the component files or add custom CSS in `index.css`.

## 📝 API Integration

The app expects the backend API at `http://localhost:3001/api` with these endpoints:

- `GET /events` - List events
- `GET /events/:id` - Get event details
- `POST /events` - Create event
- `POST /events/:id/register` - Register for event

## 🧪 Development Tips

### Hot Reload
Vite provides instant hot reload for a smooth development experience.

### TypeScript
All components are fully typed. Use the types in `src/types/` for consistency.

### Component Testing
Add new components to appropriate directories:
- Reusable UI: `components/`
- Full pages: `pages/`
- Business logic: `services/` or `hooks/`

## 🐛 Common Issues

### API Connection
If events don't load, check:
1. Backend is running on port 3001
2. CORS is enabled on backend
3. API_URL is correct in .env

### Geolocation
If distance sorting doesn't work:
1. Enable location in browser
2. Use HTTPS in production
3. Check browser console for errors

## 📈 Performance

- Code splitting with React Router
- Lazy loading images
- Optimized bundle size with Vite
- Minimal dependencies

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new files
3. Test responsive design
4. Add error handling
5. Update documentation
