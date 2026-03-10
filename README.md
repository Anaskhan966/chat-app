# Fastify Chat App

A full-stack real-time chat application built with Fastify, React, and Socket.io.

## Project Structure

The project is divided into two main parts:
- **backend/**: Fastify server with MongoDB (Mongoose) and Socket.io.
- **frontend/**: React frontend built with Vite, Tailwind CSS, and DaisyUI.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a connection string)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `backend/` directory with the following content:
   ```env
   PORT=3000
   MONGO_URI='mongodb://localhost:27017/chat-app'
   ```
   *(Adjust the `MONGO_URI` if your MongoDB setup is different.)*

4. Start the backend server:
   - For development (with nodemon):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```
   The server will be running at `http://localhost:3000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`.

## Features

- **Real-time Messaging**: Instant message delivery using Socket.io.
- **User Management**: Create and manage users.
- **Chat Interface**: Clean and responsive UI built with Tailwind CSS and DaisyUI.
- **Message History**: Messages are stored in MongoDB and loaded when entering a chat.

## Technologies Used

- **Backend**: Fastify, Mongoose, Socket.io, Dotenv, Fastify-CORS.
- **Frontend**: React, Vite, React Router, Tailwind CSS, DaisyUI, Lucide React.
