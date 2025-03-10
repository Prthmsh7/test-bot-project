import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Increase timeout for async tests
jest.setTimeout(10000);

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
}); 