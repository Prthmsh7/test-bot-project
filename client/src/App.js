import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import {
  Container,
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Initialize socket with options
const socket = io('https://test-bot-project-server.onrender.com', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  extraHeaders: {
    'Access-Control-Allow-Origin': 'https://test-bot'
  },
});

function App() {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isInRoom, setIsInRoom] = useState(false);
  const [error, setError] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.on('receive_message', (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    socket.on('user_joined', (data) => {
      setMessages((prev) => [...prev, { text: data.message, timestamp: data.timestamp }]);
    });

    socket.on('user_left', (data) => {
      setMessages((prev) => [...prev, { text: data.message, timestamp: data.timestamp }]);
    });

    socket.on('error', (errorMessage) => {
      setError(errorMessage);
    });

    socket.on('room_created', ({ roomCode, username }) => {
      setRoomCode(roomCode);
      setIsInRoom(true);
      setError('');
    });

    socket.on('room_joined', ({ roomCode, username }) => {
      setRoomCode(roomCode);
      setIsInRoom(true);
      setError('');
    });

    socket.on('load_messages', (existingMessages) => {
      setMessages(existingMessages);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('error');
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('load_messages');
    };
  }, []);

  const handleCreateRoom = () => {
    if (!username) {
      setError('Please enter your username');
      return;
    }
    socket.emit('create_room', username);
  };

  const handleJoinRoom = () => {
    if (!username || !roomCode) {
      setError('Please enter both username and room code');
      return;
    }
    socket.emit('join_room', { roomCode, username });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', {
        roomCode,
        message,
        username,
      });
      setMessage('');
    }
  };

  const handleLeaveRoom = () => {
    setIsInRoom(false);
    setRoomCode('');
    setMessages([]);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Real-time Chat App
          </Typography>
          {isInRoom && (
            <IconButton color="inherit" onClick={handleLeaveRoom}>
              <ExitToAppIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
        {!isInRoom ? (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Join or Create a Room
            </Typography>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Room Code (for joining)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              margin="normal"
              disabled={!username}
            />
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateRoom}
                fullWidth
                disabled={!username}
              >
                Create New Room
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleJoinRoom}
                fullWidth
                disabled={!username || !roomCode}
              >
                Join Room
              </Button>
            </Box>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5">
                Room Code: {roomCode}
              </Typography>
              <IconButton onClick={copyRoomCode} size="small">
                <ContentCopyIcon />
              </IconButton>
            </Box>
            <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {messages.map((msg, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={msg.username ? `${msg.username}: ${msg.text}` : msg.text}
                      secondary={new Date(msg.timestamp).toLocaleTimeString()}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </List>
            <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  variant="outlined"
                />
                <IconButton type="submit" color="primary">
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        )}
      </Container>

      <Snackbar
        open={showCopied}
        autoHideDuration={2000}
        onClose={() => setShowCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Room code copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App; 