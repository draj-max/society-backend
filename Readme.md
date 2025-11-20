# Society Management App - Backend

This repository contains the backend for a mobile application designed for managing a residential society or chawl.

## Project Overview

The goal is to create a mobile application using React Native (bare workflow) for managing a residential society or chawl. The app includes the following features:

### 1. Owner/Admin Features
*   **Registration/Login**: Admin can register themselves with necessary details (name, contact, society/chawl name).
*   **Billing Management**: Admin can add and track bills for residents, including categories such as Maintenance, Water, Electricity, and Others.
*   **Logs & Reports**: Admin can view a history of all bills and generate/download reports in Excel or PDF format, based on user selection (filter by date, type, or resident).
*   **Complaint Management**: Admin can view complaints raised by residents and mark them as resolved or pending.

### 2. Resident/User Features
*   **Registration/Login**: Residents can register themselves and link to the society/chawl.
*   **View Bills**: Residents can view their individual bills and payment status.
*   **Raise Complaints**: Residents can submit complaints regarding maintenance or other issues.
*   **Community Chat/Announcements**: Complaints or announcements from the admin are broadcasted to all residents like a chat room or group feed.

### 3. General Requirements
*   Use React Native bare workflow (not Expo).
*   Use local or cloud database (Firebase, Supabase, or SQLite) for storing users, bills, and complaints.
*   Support exporting logs as Excel (.xlsx) or PDF (.pdf).
*   Implement push notifications or in-app notifications for complaints or announcements.
*   UI should be simple, mobile-friendly, and intuitive for non-technical users.

### Optional Enhancements
*   Analytics dashboard for admin showing paid/unpaid bills.
*   Multi-society support.
*   Role-based access: Admin vs Resident.

## Table of Contents

* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Project Structure](#project-structure)
* [Configuration](#configuration)
* [Available Scripts](#available-scripts)
* [API Endpoints](#api-endpoints)
* [Contributing](#contributing)

## Prerequisites

Before you start, ensure that you have the following installed:

* **Node.js** (v14 or higher)
* **MongoDB** (Local or Remote instance)
* **npm** or **yarn**

## Installation

Follow these steps to set up the project:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd society-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the root directory based on the configuration below.

## Project Structure

```plaintext
society-backend/
│
├── src/                        # Source code directory
│   ├── config/                 # Configuration (env vars)
│   ├── controllers/            # API controllers (logic)
│   ├── models/                 # Mongoose models (DB schema)
│   ├── routes/                 # Express routes
│   ├── utils/                  # Utility functions (logger, db connection, response handler)
│   └── server.ts               # Main entry point
│
├── .env                        # Environment variables
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Documentation
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
DB_URI=mongodb://localhost:27017/society
```

* `PORT`: The port on which the server will run (default: 3000).
* `DB_URI`: The connection string for your MongoDB instance.

## Available Scripts

* **Development Mode**: Runs the server with `nodemon` and `ts-node` for hot-reloading.
  ```bash
  npm run dev
  ```

* **Build**: Compiles TypeScript code to JavaScript in the `dist` folder.
  ```bash
  npm run build
  ```

* **Start Production**: Runs the compiled JavaScript code from the `dist` folder.
  ```bash
  npm start
  ```

## API Endpoints

The base URL for the API is `http://localhost:3000/api`.

### User Routes

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/user/user-create` | Create a new user | `{ "name": "John", "email": "john@example.com", "password": "secret" }` |
| `GET` | `/user/users` | Get all users | N/A |

#### Example: Create User

**Request:**
`POST /api/user/user-create`

```json
{
    "name": "Dhurbaraj",
    "email": "draj@test.com",
    "password": "Pass123"
}
```

**Response:**

```json
{
    "success": true,
    "statusCode": 201,
    "message": "User created successfully",
    "data": {
        "_id": "68d7e1a67286276ff81e7388",
        "name": "Dhurbaraj",
        "email": "draj@test.com",
        "password": "...",
        "createdAt": "...",
        "updatedAt": "..."
    }
}
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.
