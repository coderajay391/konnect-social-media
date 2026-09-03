import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Register } from './Register/Register';
import { AuthProvider } from '../../context/AuthContext';
import { ToastProvider } from '../../context/ToastContext';

describe('Register Page', () => {
  it('renders registration form fields', () => {
    render(
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Register />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Full Name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Username$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email Address$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm Password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });
});
