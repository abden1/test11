# Freelancer Management System

A full-stack application for registering freelancers and managing their project portfolios with advanced search capabilities.

## Overview

This project demonstrates the implementation of a Freelancer Management System with the following key features:

- Joined inheritance hierarchy in database design
- Full-text search capabilities using PostgreSQL
- Responsive React Native UI
- Complete RESTful API

## Technology Stack

### Backend
- **Framework**: Spring Boot 2.7.x
- **Language**: Java 11
- **Database**: PostgreSQL with full-text search
- **ORM**: Hibernate/JPA
- **Build Tool**: Maven

### Frontend
- **Framework**: React Native with TypeScript
- **Form Management**: Formik with Yup validation
- **HTTP Client**: Axios
- **Navigation**: React Navigation
- **UI Components**: Custom components

## Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── freelancer/
│   │   │           └── management/
│   │   │               ├── controller/     # REST API endpoints
│   │   │               ├── model/          # Entity classes
│   │   │               ├── repository/     # Data access layer
│   │   │               ├── service/        # Business logic
│   │   │               ├── dto/            # Data transfer objects
│   │   │               ├── exception/      # Exception handling
│   │   │               ├── config/         # Configuration classes
│   │   │               └── FreelancerManagementApplication.java
│   │   └── resources/
│   │       ├── application.properties      # Application configuration
│   │       └── db/
│   │           └── migration/              # Database migrations
└── pom.xml                                # Maven configuration
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Main application screens
│   ├── services/         # API integration services
│   └── types/            # TypeScript type definitions
├── App.tsx               # Main application component
├── tsconfig.json         # TypeScript configuration
└── package.json          # NPM dependencies
```

## Features

### 1. User Registration
- Register as a freelancer with personal and professional details
- Validation of input data
- Responsive form with error handling

### 2. Portfolio Management
- Add projects to freelancer profiles
- Rich project information including technologies used
- Proper relationship management between freelancers and projects

### 3. Full-Text Search
- PostgreSQL-powered full-text search
- Search projects by title or technologies used
- Optimized for performance with GIN indices
- Ranked search results

## API Endpoints

### Freelancer Management
- `POST /api/v1/register` - Register a new freelancer
- `GET /api/v1/freelancers/{id}` - Get freelancer details by ID

### Portfolio Management
- `POST /api/v1/portfolio/add` - Add a new project to a freelancer's portfolio
- `GET /api/v1/portfolio/search?query=` - Search for projects
- `GET /api/v1/portfolio/freelancer/{freelancerId}` - Get all projects for a specific freelancer

## Setup Instructions

### Prerequisites
- Java 11 or higher
- Maven
- PostgreSQL
- Node.js and npm

### Backend Setup
1. Create a PostgreSQL database named `freelancer_db`
2. Navigate to the backend directory
3. Configure `application.properties` with your database credentials
4. Run the following commands:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Follow Expo instructions to run on a device or emulator

## Implementation Highlights

### Database Inheritance
The system implements a three-level inheritance hierarchy:
- `BaseUser`: Contains common user attributes
- `User`: Extends BaseUser with application-specific attributes
- `Freelancer`: Extends User with specialization fields

### Full-Text Search
The project uses PostgreSQL's advanced full-text search capabilities:
- Custom tsvector columns for efficient text indexing
- GIN indices for fast search performance
- Database triggers to automatically update search vectors
- Ranked search results based on relevance

### Clean Architecture
The backend follows clean architecture principles:
- Clear separation of concerns
- Domain-driven design
- Dependency injection
- Repository pattern

## Assumptions and Design Decisions

1. **Authentication**: For simplicity, this implementation does not include authentication and authorization. In a production environment, JWT or OAuth2 would be implemented.

2. **Data Validation**: Basic validation is implemented on both frontend and backend, but a production system would need more comprehensive validation.

3. **Error Handling**: The system includes basic error handling, which would be extended in a production environment.

4. **Mobile First**: The UI is designed with a mobile-first approach using React Native.

## Future Enhancements

1. User authentication and authorization
2. More advanced search filters
3. Pagination for large result sets
4. Image upload for user profiles and projects
5. Reviews and ratings for freelancers

## Author

[Your Name]

## License

This project is licensed under the MIT License - see the LICENSE file for details. 