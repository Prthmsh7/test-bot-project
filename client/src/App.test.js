import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock socket.io-client
jest.mock('socket.io-client', () => {
  return {
    io: () => ({
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    }),
  };
});

describe('Chat Application', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders initial login form', () => {
    render(<App />);
    
    // Check for main elements
    expect(screen.getByText('Real-time Chat App')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Room Code (for joining)')).toBeInTheDocument();
    expect(screen.getByText('Create New Room')).toBeInTheDocument();
    expect(screen.getByText('Join Room')).toBeInTheDocument();
  });

  test('shows error when trying to create room without username', async () => {
    render(<App />);
    
    // Try to create room without entering username
    fireEvent.click(screen.getByText('Create New Room'));
    
    // Check for error message
    expect(screen.getByText('Please enter your username')).toBeInTheDocument();
  });

  test('shows error when trying to join room without credentials', async () => {
    render(<App />);
    
    // Try to join room without entering credentials
    fireEvent.click(screen.getByText('Join Room'));
    
    // Check for error message
    expect(screen.getByText('Please enter both username and room code')).toBeInTheDocument();
  });

  test('enables room code input after entering username', async () => {
    render(<App />);
    
    // Enter username
    const usernameInput = screen.getByLabelText('Username');
    await userEvent.type(usernameInput, 'testUser');
    
    // Check if room code input is enabled
    const roomCodeInput = screen.getByLabelText('Room Code (for joining)');
    expect(roomCodeInput).not.toBeDisabled();
  });

  test('enables join button when both username and room code are entered', async () => {
    render(<App />);
    
    // Enter username and room code
    const usernameInput = screen.getByLabelText('Username');
    const roomCodeInput = screen.getByLabelText('Room Code (for joining)');
    
    await userEvent.type(usernameInput, 'testUser');
    await userEvent.type(roomCodeInput, 'ABC123');
    
    // Check if join button is enabled
    const joinButton = screen.getByText('Join Room');
    expect(joinButton).not.toBeDisabled();
  });

  test('handles room creation with valid username', async () => {
    render(<App />);
    
    // Enter username
    const usernameInput = screen.getByLabelText('Username');
    await userEvent.type(usernameInput, 'testUser');
    
    // Create room
    fireEvent.click(screen.getByText('Create New Room'));
    
    // Check if socket.emit was called with correct parameters
    const socket = require('socket.io-client').io();
    expect(socket.emit).toHaveBeenCalledWith('create_room', 'testUser');
  });

  test('handles room joining with valid credentials', async () => {
    render(<App />);
    
    // Enter username and room code
    const usernameInput = screen.getByLabelText('Username');
    const roomCodeInput = screen.getByLabelText('Room Code (for joining)');
    
    await userEvent.type(usernameInput, 'testUser');
    await userEvent.type(roomCodeInput, 'ABC123');
    
    // Join room
    fireEvent.click(screen.getByText('Join Room'));
    
    // Check if socket.emit was called with correct parameters
    const socket = require('socket.io-client').io();
    expect(socket.emit).toHaveBeenCalledWith('join_room', {
      roomCode: 'ABC123',
      username: 'testUser'
    });
  });

  test('handles message sending in chat room', async () => {
    // Mock socket events to simulate being in a room
    const socket = require('socket.io-client').io();
    socket.on.mockImplementation((event, callback) => {
      if (event === 'room_joined') {
        callback({ roomCode: 'ABC123', username: 'testUser' });
      }
    });

    render(<App />);
    
    // Enter credentials and join room
    const usernameInput = screen.getByLabelText('Username');
    const roomCodeInput = screen.getByLabelText('Room Code (for joining)');
    
    await userEvent.type(usernameInput, 'testUser');
    await userEvent.type(roomCodeInput, 'ABC123');
    fireEvent.click(screen.getByText('Join Room'));
    
    // Wait for room to be joined
    await waitFor(() => {
      expect(screen.getByText('Room Code: ABC123')).toBeInTheDocument();
    });
    
    // Type and send a message
    const messageInput = screen.getByPlaceholderText('Type a message...');
    await userEvent.type(messageInput, 'Hello, World!');
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    // Check if message was sent
    expect(socket.emit).toHaveBeenCalledWith('send_message', {
      roomCode: 'ABC123',
      message: 'Hello, World!',
      username: 'testUser'
    });
  });
}); 