# HRMS API Documentation

## Overview
The HRMS API provides endpoints to manage Human Resource Management System functionalities such as employee data, attendance, payroll, and more.

## Base URL
```
https://api.hrms.com/v1
```

## Authentication
All endpoints require an API key for authentication. Include the API key in the `Authorization` header:
```
Authorization: Bearer <API_KEY>
```

## Endpoints

### 1. Authentication

#### Register Company
**POST** `/api/v1/authentication/register`

**Description:** Register a new company.

**Request Body:**
```json
{
    "companyName": "Example Corp",
    "email": "admin@example.com",
    "password": "securepassword"
}
```

**Response:**
```json
{
    "message": "Company registered successfully",
    "companyId": "12345"
}
```

#### Login
**POST** `/api/v1/authentication/login`

**Description:** Authenticate a user and retrieve a token.

**Request Body:**
```json
{
    "email": "admin@example.com",
    "password": "securepassword"
}
```

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Validate User
**GET** `/api/v1/authentication/validate`

**Description:** Validate the current user's authentication status.

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Response:**
```json
{
    "message": "User is authenticated",
    "userId": "12345"
}
```

### 2. Organization Management

#### Insert Organization Details
**POST** `/api/v1/organization`

**Description:** Add details of a new organization.

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Request Body:**
```json
{
    "organizationName": "Example Organization",
    "address": "123 Main St, City, Country",
    "contactEmail": "contact@example.com"
}
```

**Response:**
```json
{
    "message": "Organization details added successfully",
    "organizationId": "67890"
}
```


## Error Codes
| Code | Description          |
|------|----------------------|
| 401  | Unauthorized access  |
| 404  | Resource not found   |
| 500  | Internal server error|

