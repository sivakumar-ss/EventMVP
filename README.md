# EventHub - College Event Management System

EventHub is a comprehensive, production-ready platform designed to streamline event management within college campuses. It provides a seamless interface for students to discover and register for events, while offering powerful management tools for administrators.

## 🚀 Features

### For Students
- **Real-time Dashboard:** Track total events, personal registrations, and upcoming opportunities.
- **Event Discovery:** Browse through categories like Technical, Cultural, and Sports.
- **Easy Registration:** One-click registration for events with real-time seat tracking.
- **Personal Portfolio:** Manage your participation history and registered events.

### For Admin/Organizers
- **Event Management:** Create, edit, and close registrations for events.
- **Participant Tracking:** View and export participant lists for every event.
- **Live Statistics:** Monitor event popularity and registration trends.

## 🛠️ Tech Stack

### Frontend
- **React.js** with **Vite** for lightning-fast development.
- **Tailwind CSS** for a modern, glassmorphic UI design.
- **Lucide React** for beautiful, consistent iconography.
- **Axios** for robust API communication.

### Backend
- **Spring Boot 3.x** (Java 17) providing a RESTful API.
- **Spring Security** with **JWT** for secure, stateless authentication.
- **Spring Data JPA** for efficient database interaction.
- **PostgreSQL** as the reliable relational database.

## 🏁 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js (v18+)
- PostgreSQL

### Database Setup
1. Create a database named `mvphack` in PostgreSQL.
2. Update `college-event-backend/src/main/resources/application.properties` with your database credentials.

### Running the Backend
```bash
cd college-event-backend
./mvnw spring-boot:run
```

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔒 Security
- Secure password hashing using BCrypt.
- Role-based Access Control (RBAC) for Students and Admins.
- Protected API endpoints using JWT Bearer tokens.

## 📄 License
This project is licensed under the MIT License.
