# FindBack — Campus Lost & Found Platform

FindBack is a campus lost and found web application that helps students report lost belongings and share information about items they have found.

## Features

- Browse lost and found listings
- Search items by name, category, location, and description
- Filter listings by item category and status
- Report lost or found items through a form
- Store item listings in a MySQL database
- React-based frontend with an Express backend API

## Tech Stack

**Frontend**
- React
- Vite
- CSS

**Backend**
- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- CORS

## Project Structure

```text
findback/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── src/
│   ├── App.jsx
│   └── App.css
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Install Node.js and MySQL before running the project.

### 1. Clone the repository

```bash
git clone https://github.com/purvakale16/findback.git
cd findback
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the database

Create a MySQL database named `findback_db` and create an `items` table with the columns required by the backend.

Create a `.env` file inside the `backend` folder with your local database configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=findback_db
DB_PORT=3306
```

Replace `your_mysql_password` with your own local MySQL password. Never commit your actual `.env` file or database credentials to GitHub.

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Start the backend

```bash
node server.js
```

### 6. Start the frontend

Open a second terminal in the project root and run:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API Endpoints

| Method | Endpoint     |      Purpose                      |
|--------|--------------|-----------------------------------|
|   GET  |    `/`       | Check that the backend is running |
|   GET  | `/api/items` | Retrieve item listings            |
|   POST | `/api/items` | Create a new item listing         |

## Project Goal

The goal of FindBack is to make it easier for campus communities to report, discover, and reunite lost belongings.

## Developer

**Purva Kale**

GitHub: [purvakale16](https://github.com/purvakale16)
