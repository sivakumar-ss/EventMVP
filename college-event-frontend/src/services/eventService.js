// Mock database in localStorage
const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Tech Innovate 2024',
    date: '2024-05-20',
    venue: 'Main Auditorium',
    description: 'A platform for students to showcase their innovative projects and research.',
    status: 'Upcoming',
    participants: ['Student 1', 'Student 2']
  },
  {
    id: 2,
    title: 'Code Conquest',
    date: '2024-04-15',
    venue: 'CS Lab 1',
    description: 'Ultimate coding challenge to test your algorithms and data structures skills.',
    status: 'Closed',
    participants: ['Student 3', 'Student 4', 'Student 5']
  }
];

const eventService = {
  getEvents: () => {
    const events = localStorage.getItem('events');
    if (!events) {
      localStorage.setItem('events', JSON.stringify(MOCK_EVENTS));
      return MOCK_EVENTS;
    }
    return JSON.parse(events);
  },

  createEvent: (eventData) => {
    const events = eventService.getEvents();
    const newEvent = {
      ...eventData,
      id: Date.now(),
      participants: [],
      status: 'Upcoming'
    };
    const updatedEvents = [...events, newEvent];
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    return newEvent;
  },

  registerForEvent: (eventId, userName) => {
    const events = eventService.getEvents();
    const updatedEvents = events.map(event => {
      if (event.id === eventId && !event.participants.includes(userName)) {
        return { ...event, participants: [...event.participants, userName] };
      }
      return event;
    });
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    
    // Track registrations for the specific user
    const registrations = JSON.parse(localStorage.getItem(`registrations_${userName}`) || '[]');
    if (!registrations.includes(eventId)) {
      localStorage.setItem(`registrations_${userName}`, JSON.stringify([...registrations, eventId]));
    }
  },

  getUserRegistrations: (userName) => {
    const eventIds = JSON.parse(localStorage.getItem(`registrations_${userName}`) || '[]');
    const allEvents = eventService.getEvents();
    return allEvents.filter(event => eventIds.includes(event.id));
  }
};

export default eventService;
