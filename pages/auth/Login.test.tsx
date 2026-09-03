import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login/Login';
import { AuthProvider } from '../../context/AuthContext';
import { ToastProvider } from '../../context/ToastContext';

describe('Login Page', () => {
  it('renders login form with email and password inputs', () => {
    render(
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email Address$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });
});
