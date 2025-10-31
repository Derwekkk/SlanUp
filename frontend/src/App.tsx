import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/create" element={<CreateEvent />} />
      </Routes>
    </Router>
  );
};

export default App;
