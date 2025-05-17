# Epic Gather Booking System - Backend

## Overview
This is the **backend service** for the event booking system, built using **Spring Boot**. It provides a **RESTful API** to handle user authentication, event management, bookings, and admin operations.

## Tech Stack
- **Spring Boot** (Java)
- **Spring Security** (JWT authentication)
- **Spring Data JPA** (Database interaction)
- **PostgreSQL** (Database)
- **Docker** (Optional containerization)
- **Deployment:** Azure

## Folder Structure
```
📂 backend
├── 📂 src/main/java/com/ragab/booking  # Main application code
├── 📂 src/main/resources               # Configuration files
├── 📂 .mvn                              # Maven wrapper
├── 📜 pom.xml                           # Maven dependencies
├── 📜 mvnw, mvnw.cmd                    # Maven wrappers
└── 📜 README.md                         # Backend documentation
```

## Features
✅ **User Authentication (JWT-based)**  
✅ **Event Creation & Booking Management**  
✅ **Role-based Access Control (Admin/User)**  
✅ **Pagination & Sorting for Event Listings**  
✅ **Error Handling & Validation**  

## Installation

### 1. Clone Repository
```sh
git clone https://github.com/MohammedRagab00/ATC_01556070011.git
cd ATC_01556070011/backend
```

### 2. Setup Environment Variables
Create a `.env` file or update `application.properties`:
```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/event_booking
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
JWT_SECRET=your_secret_key
```
📧 **For actual credentials, contact me at** [mohammed_ragab@outlook.com](mailto:mohammed_ragab@outlook.com).

### 3. Run the Application
Using **Maven**:
```sh
mvn spring-boot:run
```

## Prerequisites
- Java 17+
- Maven installed
- PostgreSQL running

## Deployment
The backend is deployed on **Azure**.

🔗 **API Documentation (Swagger UI):**  
[Swagger UI - Epic Gather API](https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1/swagger-ui/index.html#/)

