import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import { useAuth } from './context/AuthContext';
import { useWebSocket } from './context/WebSocketContext';

jest.mock('./context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('./context/WebSocketContext', () => ({
  useWebSocket: jest.fn(),
}));

describe('student navigation', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { fullName: 'Test Student', role: 'STUDENT' },
      logout: jest.fn(),
    });

    useWebSocket.mockReturnValue({
      connected: true,
      maintenanceMode: false,
    });
  });

  test('does not render the student top navbar on dashboard pages', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<Navbar />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
