const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Updated CORS configuration
app.use(cors());

// Body parser middleware
app.use(express.json());

// Socket.IO setup with proper CORS
const io = new Server(server, {
  cors: {
    origin: ["https://test-bot-project.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

// Store active rooms
const rooms = new Map();

// Generate a random room code
function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Socket events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('create-room', (roomData) => {
    console.log('Room creation requested:', roomData);
    // Your room creation logic
  });

  // Create a new room
  socket.on('create_room', (username) => {
    const roomCode = generateRoomCode();
    console.log(`Creating room ${roomCode} for user ${username}`);
    
    rooms.set(roomCode, {
      messages: [],
      users: new Set(),
      creator: username
    });
    
    socket.join(roomCode);
    socket.emit('room_created', { roomCode, username });
    console.log(`Room ${roomCode} created successfully`);
  });

  // Join an existing room
  socket.on('join_room', ({ roomCode, username }) => {
    console.log(`Attempting to join room ${roomCode} by user ${username}`);
    
    if (rooms.has(roomCode)) {
      socket.join(roomCode);
      const room = rooms.get(roomCode);
      room.users.add(socket.id);
      socket.emit('room_joined', { roomCode, username });
      
      // Send existing messages to the new user
      if (room.messages.length > 0) {
        socket.emit('load_messages', room.messages);
      }
      
      io.to(roomCode).emit('user_joined', {
        message: `${username} joined the room`,
        timestamp: new Date()
      });
      console.log(`User ${username} joined room ${roomCode}`);
    } else {
      socket.emit('error', 'Room does not exist');
      console.log(`Failed to join room ${roomCode} - Room not found`);
    }
  });

  // Handle chat messages
  socket.on('send_message', (data) => {
    const { roomCode, message, username } = data;
    console.log(`Received message in room ${roomCode} from ${username}`);
    
    if (rooms.has(roomCode)) {
      const roomData = rooms.get(roomCode);
      const messageData = {
        text: message,
        username,
        timestamp: new Date(),
        userId: socket.id
      };
      roomData.messages.push(messageData);
      io.to(roomCode).emit('receive_message', messageData);
      console.log(`Message broadcasted to room ${roomCode}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all rooms
    rooms.forEach((room, roomCode) => {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        io.to(roomCode).emit('user_left', {
          message: `User left the room`,
          timestamp: new Date()
        });
        
        // If room is empty, delete it
        if (room.users.size === 0) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted - no users left`);
        }
      }
    });
  });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 