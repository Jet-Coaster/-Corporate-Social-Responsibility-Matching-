# CSR Volunteer Matching System

## Features

### 1. User Management & Authentication
- **User Roles**: Admin, CSR Representative, Person-in-Need (PIN), Platform Management
- **JWT-based Authentication**: Secure token-based authentication
- **Role-based Authorization**: Different access levels for different user types

### 2. PIN (Person-in-Need) Features
- **Profile Management**: Create and manage personal profiles
- **Request Management**: Create, update, and track help requests
- **Service Categories**: Categorize requests by type of assistance needed
- **History Tracking**: View completed matches and service history
- **Request Analytics**: Track views and shortlist counts

### 3. CSR Representative Features
- **Profile Management**: Create and manage corporate profiles
- **Request Search**: Search and filter volunteer opportunities
- **Shortlist Management**: Save and organize potential opportunities
- **Match Creation**: Create matches with PINs
- **History Tracking**: View completed volunteer services
- **Advanced Filtering**: Filter by services, date periods, urgency, location

### 4. Platform Management
- **Service Categories**: Manage different types of volunteer services
- **Company Management**: Manage corporate partners
- **Reporting**: Generate daily, weekly, and monthly reports
- **Analytics**: Track system usage and performance metrics

### 5. Tracking & Analytics
- **View Tracking**: Track when CSR reps view PIN requests
- **Shortlist Analytics**: Monitor shortlist counts and trends
- **Match Analytics**: Track successful matches and completion rates
- **Comprehensive Reporting**: Detailed reports for platform management

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### PIN Endpoints
- `POST /api/v1/pin/profile` - Create PIN profile
- `GET /api/v1/pin/profile` - Get PIN profile
- `PUT /api/v1/pin/profile` - Update PIN profile
- `POST /api/v1/pin/requests` - Create help request
- `GET /api/v1/pin/requests` - Get PIN requests
- `GET /api/v1/pin/requests/:id` - Get specific request
- `PUT /api/v1/pin/requests/:id` - Update request
- `GET /api/v1/pin/history` - Get PIN history with filtering

### CSR Representative Endpoints
- `POST /api/v1/csr/profile` - Create CSR profile
- `GET /api/v1/csr/profile` - Get CSR profile
- `PUT /api/v1/csr/profile` - Update CSR profile
- `GET /api/v1/csr/requests` - Search volunteer opportunities
- `GET /api/v1/csr/requests/:id` - View specific request (tracks view)
- `POST /api/v1/csr/shortlist` - Add to shortlist
- `GET /api/v1/csr/shortlist` - Get shortlist
- `DELETE /api/v1/csr/shortlist/:id` - Remove from shortlist
- `POST /api/v1/csr/matches` - Create match
- `GET /api/v1/csr/matches` - Get CSR matches
- `GET /api/v1/csr/matches/:id` - Get specific match
- `PUT /api/v1/csr/matches/:id` - Update match
- `GET /api/v1/csr/history` - Get CSR history with filtering

### Admin Endpoints
- `POST /api/v1/admin/companies` - Create company
- `GET /api/v1/admin/companies` - Get all companies
- `POST /api/v1/admin/categories` - Create service category
- `GET /api/v1/admin/categories` - Get all categories
- `PUT /api/v1/admin/categories/:id` - Update category
- `POST /api/v1/admin/reports` - Generate report
- `GET /api/v1/admin/reports` - Get reports

## Database Schema

### Core Entities
- **Users**: Base user accounts with authentication
- **PINs**: Person-in-Need profiles with personal information
- **CSRReps**: Corporate Social Responsibility representatives
- **Companies**: Corporate partners and organizations
- **ServiceCategories**: Types of volunteer services available

### Request & Matching
- **PINRequests**: Help requests created by PINs
- **Shortlists**: CSR reps saving requests for later
- **Matches**: Completed connections between CSR reps and PINs
- **ViewLogs**: Tracking when CSR reps view requests

### Analytics & Reporting
- **Reports**: Generated reports for platform management
- **Statistics**: Built-in analytics and metrics

## Installation & Setup (Docker-only)

### Prerequisites
- Docker Desktop

### 1. Clone the Repository
```bash
git clone <repository-url>
cd csr-volunteer-matching/backend
```

### 2. Configure environment (optional)
Copy `env.example` to `.env` and adjust values if needed:
```bash
cp env.example .env
```

### 3. Start services
```bash
docker compose up -d --build
```

This starts Postgres (port 5432) and the API at `http://localhost:8080`.

### 4. Logs
```bash
docker compose logs -f api
```

### 5. Stop services
```bash
docker compose down
```

## Docker Setup

### Prerequisites
- Docker Desktop

### 1. Copy environment example (optional)
```bash
cp env.example .env
```

### 2. Start services
```bash
docker compose up -d --build
```

This will start:
- Postgres on port 5432 (data persisted in a named volume)
- API on `http://localhost:8080`

### 3. View logs
```bash
docker compose logs -f api
```

### 4. Stop services
```bash
docker compose down
```

### Seed data in Docker (optional)
Run the seed command in the API container:
```bash
docker compose exec api /app/server -seed
```
If a dedicated seed flag is not implemented, you can temporarily run the seed program by extending the Dockerfile or using `go run` inside a dev container/shell.

## Test Data

The system includes a comprehensive test data generation script that creates:
- 20 Service Categories
- 10 Companies
- 100 PIN profiles
- 50 CSR Representative profiles
- 200 PIN requests
- 150 Shortlist entries
- 100 Matches
- 500 View logs

## API Usage Examples

### 1. Register a PIN User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "pin"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### 3. Create PIN Profile
```bash
curl -X POST http://localhost:8080/api/v1/pin/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1-555-0123",
    "address": "123 Main St, City, State",
    "emergency_contact": "Jane Doe - +1-555-0124",
    "medical_info": "No known allergies",
    "special_needs": "Wheelchair accessible"
  }'
```

### 4. Create Help Request
```bash
curl -X POST http://localhost:8080/api/v1/pin/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Need help with grocery shopping",
    "description": "I need assistance with weekly grocery shopping due to mobility issues",
    "category_id": 1,
    "urgency": "medium",
    "location": "Downtown",
    "special_notes": "Need wheelchair accessible transportation"
  }'
```

### 5. Search Volunteer Opportunities (CSR Rep)
```bash
curl -X GET "http://localhost:8080/api/v1/csr/requests?category_id=1&urgency=high&page=1&page_size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Add to Shortlist
```bash
curl -X POST http://localhost:8080/api/v1/csr/shortlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "request_id": 1,
    "notes": "Great opportunity for our team",
    "priority": "high"
  }'
```

## Filtering & Search

### PIN Request Search Parameters
- `category_id`: Filter by service category
- `status`: Filter by request status (open, in_progress, completed, cancelled)
- `urgency`: Filter by urgency level (low, medium, high, urgent)
- `location`: Filter by location
- `search`: Text search in title and description
- `start_date`: Filter by creation date (YYYY-MM-DD)
- `end_date`: Filter by creation date (YYYY-MM-DD)
- `page`: Page number for pagination
- `page_size`: Number of results per page

### Match History Search Parameters
- `category_id`: Filter by service category
- `status`: Filter by match status
- `start_date`: Filter by match date
- `end_date`: Filter by match date
- `page`: Page number for pagination
- `page_size`: Number of results per page

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password hashing
- **Role-based Access Control**: Different permissions for different user types
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: GORM ORM with parameterized queries

## Performance Features

- **Database Indexing**: Optimized database queries with proper indexing
- **Pagination**: Efficient pagination for large datasets
- **Connection Pooling**: Database connection pooling for better performance
- **Caching**: Built-in caching for frequently accessed data

## Monitoring & Logging

- **View Tracking**: Track when CSR reps view PIN requests
- **Activity Logging**: Comprehensive activity logging
- **Error Handling**: Detailed error messages and logging
- **Health Checks**: Built-in health check endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.


