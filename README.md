# Real-time Chat Application

A simple real-time chat application built with React, Express, and Socket.IO. Users can create and join chat rooms, and messages are ephemeral (deleted when users leave the room).

## Features

- Create and join chat rooms
- Real-time messaging
- User presence notifications
- Modern Material-UI interface
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

## Running the Application

1. Start the server:
   ```bash
   cd server
   npm start
   ```
   The server will run on http://localhost:5000

2. Start the client:
   ```bash
   cd client
   npm start
   ```
   The client will run on http://localhost:3000

3. Open http://localhost:3000 in your browser

## Usage

1. Enter your username and a room name
2. Click "Create Room" to create a new room or "Join Room" to join an existing one
3. Start chatting!
4. Messages are ephemeral and will be deleted when all users leave the room

## Technologies Used

- React
- Express
- Socket.IO
- Material-UI
- Node.js
