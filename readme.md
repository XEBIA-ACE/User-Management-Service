# demo-spring-app

Spring Boot application with best practices

## Requirements

- Java 21
- Maven

## Getting Started

To build and run the application:

```sh
# Using Maven
./mvnw spring-boot:run

# Using Gradle
./gradlew bootRun
```

## License

This project is licensed under the MIT License.

## 🚀 Quick Start

### Prerequisites

- Java 21+
- Maven 3.6+
- PostgreSQL 12+
- Redis 6.0+


### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd demo-spring-app
   ```

2. **Configure Database**
   ```sql
   -- PostgreSQL
   CREATE DATABASE demo_spring_app;
   ```

3. **Environment Variables**
   ```bash
   # Database
   export DB_USERNAME=your_db_username
   export DB_PASSWORD=your_db_password
   
   # JWT Security
   export JWT_SECRET=your_jwt_secret_key
   
   # Redis (if using Redis cache)
   export REDIS_HOST=localhost
   export REDIS_PORT=6379
   ```

4. **Run the application**
   ```bash
   # Using Maven
   ./mvnw spring-boot:run
   
   # Or using Gradle
   ./gradlew bootRun
   ```



## 📋 API Documentation



### Available Endpoints

- **Health Check**: `GET /actuator/health`
- **Authentication**: `POST /api/v1/auth/login`
- **API Base URL**: `http://localhost:8080/api/v1`

## 🏗️ Architecture

### Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/example/demoapp/
│   │       ├── Application.java
│   │       ├── config/
│   │       │   └── SecurityConfig.java
│   │       ├── controller/
│   │       │   └── BaseController.java
│   │       ├── dto/
│   │       │   ├── ApiResponse.java
│   │       │   └── ErrorResponse.java
│   │       ├── entity/
│   │       │   └── BaseEntity.java
│   │       ├── exception/
│   │       │   ├── BusinessException.java
│   │       │   └── ResourceNotFoundException.java
│   │       ├── repository/
│   │       │   └── BaseRepository.java
│   │       ├── service/
│   │       └── security/
│   └── resources/
│       ├── application.yml
│       └── db/migration/
└── test/
    └── java/
```

### Key Features

- ✅ **RESTful API** with proper HTTP status codes
- ✅ **Exception Handling** with global error handling
- ✅ **Data Validation** using Bean Validation
- ✅ **Database Integration** with JPA/Hibernate
- ✅ **Database Migration** with Flyway
- ✅ **Security** with Spring Security
- ✅ **JWT Authentication** for stateless security
- ✅ **Caching** with Redis


- ✅ **Logging** with Logback
- ✅ **Testing** with JUnit 5 and TestContainers


## 🧪 Testing

```bash
# Run all tests
./mvnw test

# Run tests with coverage
./mvnw test jacoco:report

# Run integration tests
./mvnw test -Pintegration-tests
```

## 📊 Monitoring



### Logging

- **Console**: Enabled for development
- **File**: `logs/demo-spring-app.log`
- **Level**: Configurable via `logging.level.root`

## 🔧 Configuration

### Profiles

- **default**: Development profile
- **test**: Testing profile
