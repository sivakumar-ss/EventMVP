// Mock data for the frontend
export const mockEvents = [
  {
    id: 1,
    title: "National Hackathon 2026",
    description: "A 24-hour coding challenge where teams compete to build innovative solutions to real-world problems. Great prizes and networking opportunities await!",
    date: "2026-05-20",
    time: "09:00 AM",
    venue: "Main Auditorium, Block A",
    category: "Technical",
    status: "UPCOMING",
    maxParticipants: 200,
    registeredCount: 143,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    adminName: "Dr. Priya Sharma",
    tags: ["Coding", "AI", "Web Dev"],
  },
  {
    id: 2,
    title: "Cultural Fest 2026 - Utsav",
    description: "Annual cultural extravaganza featuring music, dance, drama, and art competitions. A celebration of talent and creativity across all departments.",
    date: "2026-05-28",
    time: "10:00 AM",
    venue: "Open Air Theatre",
    category: "Cultural",
    status: "UPCOMING",
    maxParticipants: 500,
    registeredCount: 312,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    adminName: "Prof. Anand Kumar",
    tags: ["Music", "Dance", "Drama"],
  },
  {
    id: 3,
    title: "TEDx Campus Talks",
    description: "Inspiring talks by industry leaders, entrepreneurs, and innovators. This year's theme: 'Building Tomorrow's World Today'.",
    date: "2026-06-05",
    time: "11:00 AM",
    venue: "Seminar Hall, Block C",
    category: "Seminar",
    status: "UPCOMING",
    maxParticipants: 300,
    registeredCount: 289,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    adminName: "Dr. Meeta Joshi",
    tags: ["Talks", "Innovation", "Leadership"],
  },
  {
    id: 4,
    title: "Sports Day 2026",
    description: "Inter-department sports competition featuring cricket, football, basketball, athletics, and many more exciting sports events.",
    date: "2026-04-15",
    time: "08:00 AM",
    venue: "College Sports Complex",
    category: "Sports",
    status: "CLOSED",
    maxParticipants: 400,
    registeredCount: 400,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    adminName: "Mr. Ravi Singh",
    tags: ["Sports", "Athletics", "Cricket"],
  },
  {
    id: 5,
    title: "AI/ML Workshop Series",
    description: "Comprehensive 3-day workshop on Artificial Intelligence and Machine Learning. Hands-on sessions with Python, TensorFlow, and real datasets.",
    date: "2026-06-12",
    time: "09:30 AM",
    venue: "Computer Lab 1 & 2",
    category: "Workshop",
    status: "UPCOMING",
    maxParticipants: 60,
    registeredCount: 54,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    adminName: "Dr. Priya Sharma",
    tags: ["AI", "ML", "Python"],
  },
  {
    id: 6,
    title: "Entrepreneurship Summit",
    description: "Connect with successful entrepreneurs, investors, and mentors. Pitch your startup idea and get expert feedback from venture capitalists.",
    date: "2026-06-20",
    time: "10:00 AM",
    venue: "Conference Hall",
    category: "Seminar",
    status: "UPCOMING",
    maxParticipants: 150,
    registeredCount: 87,
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    adminName: "Prof. Anand Kumar",
    tags: ["Startup", "Business", "Networking"],
  },
];

export const mockRegisteredEvents = [
  { ...mockEvents[0], registrationDate: "2026-04-10", certificateReady: false },
  { ...mockEvents[1], registrationDate: "2026-04-08", certificateReady: false },
  { ...mockEvents[3], registrationDate: "2026-03-25", certificateReady: true },
];

export const mockParticipants = [
  { id: 1, name: "Rahul Verma", email: "rahul.v@college.edu", college: "Engineering Dept.", registeredDate: "2026-04-10", eventId: 1 },
  { id: 2, name: "Ananya Patel", email: "ananya.p@college.edu", college: "CS Dept.", registeredDate: "2026-04-09", eventId: 1 },
  { id: 3, name: "Kiran Sharma", email: "kiran.s@college.edu", college: "IT Dept.", registeredDate: "2026-04-11", eventId: 1 },
  { id: 4, name: "Deepak Nair", email: "deepak.n@college.edu", college: "ECE Dept.", registeredDate: "2026-04-08", eventId: 1 },
  { id: 5, name: "Priya Mehta", email: "priya.m@college.edu", college: "Mech Dept.", registeredDate: "2026-04-12", eventId: 1 },
  { id: 6, name: "Arjun Roy", email: "arjun.r@college.edu", college: "Civil Dept.", registeredDate: "2026-04-07", eventId: 2 },
  { id: 7, name: "Sneha Gupta", email: "sneha.g@college.edu", college: "CS Dept.", registeredDate: "2026-04-06", eventId: 2 },
  { id: 8, name: "Rohit Das", email: "rohit.d@college.edu", college: "Engineering Dept.", registeredDate: "2026-04-05", eventId: 2 },
];

export const mockNotifications = [
  { id: 1, message: "Your registration for 'National Hackathon 2026' is confirmed!", time: "2 hours ago", read: false, type: "success" },
  { id: 2, message: "TEDx Campus Talks - Only 11 spots remaining. Register now!", time: "5 hours ago", read: false, type: "warning" },
  { id: 3, message: "Cultural Fest 2026 schedule has been updated.", time: "1 day ago", read: true, type: "info" },
  { id: 4, message: "Sports Day certificate is ready for download!", time: "2 days ago", read: true, type: "success" },
];

export const testimonials = [
  { id: 1, name: "Rahul Verma", role: "CS Final Year", avatar: "RV", text: "This platform completely transformed how I track college events. Never missed a registration deadline since I started using it!", rating: 5 },
  { id: 2, name: "Ananya Patel", role: "ECE 3rd Year", avatar: "AP", text: "The event cards, registration confirmations, and certificate downloads are seamless. Super intuitive and beautiful UI!", rating: 5 },
  { id: 3, name: "Dr. Meeta Joshi", role: "Event Coordinator", avatar: "MJ", text: "Managing 300+ participants across multiple events used to be a nightmare. Now it's a few clicks. Absolutely love the admin dashboard!", rating: 5 },
];

export const categories = ["All", "Technical", "Cultural", "Sports", "Workshop", "Seminar"];

export const adminStats = {
  totalEvents: 6,
  totalStudents: 1284,
  totalRegistrations: 1285,
  activeEvents: 5,
};

export const chartData = [
  { name: "Jan", events: 2, registrations: 120 },
  { name: "Feb", events: 3, registrations: 210 },
  { name: "Mar", events: 4, registrations: 340 },
  { name: "Apr", events: 3, registrations: 280 },
  { name: "May", events: 6, registrations: 520 },
  { name: "Jun", events: 5, registrations: 430 },
];

export const participationByEvent = [
  { name: "Hackathon", value: 143 },
  { name: "Cultural Fest", value: 312 },
  { name: "TEDx", value: 289 },
  { name: "Sports", value: 400 },
  { name: "AI Workshop", value: 54 },
  { name: "E-Summit", value: 87 },
];
