import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../app/auth/LoginScreen'; // adapte le chemin si besoin

describe('LoginScreen', () => {
  it('met à jour les champs email et mot de passe', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Entrer votre email');
    const passwordInput = getByPlaceholderText('Entrer votre mot de passe');

    fireEvent.changeText(emailInput, 'test@email.com');
    fireEvent.changeText(passwordInput, 'supersecret');

    expect(emailInput.props.value).toBe('test@email.com');
    expect(passwordInput.props.value).toBe('supersecret');
  });
});