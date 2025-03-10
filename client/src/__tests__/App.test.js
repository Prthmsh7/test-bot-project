import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders chat interface', () => {
    render(<App />);
    expect(screen.getByText(/create room/i)).toBeInTheDocument();
  });

  test('handles room creation', async () => {
    render(<App />);
    const createButton = screen.getByText(/create room/i);
    fireEvent.click(createButton);
    // Add assertions based on your UI
  });

  test('handles socket connection', () => {
    render(<App />);
    // Add socket connection tests
  });
}); 