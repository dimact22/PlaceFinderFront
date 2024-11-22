import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";

// Мокируем useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

test('тест для кнопки submit', async () => {
  const mockNavigate = jest.fn();
  useNavigate.mockReturnValue(mockNavigate); // Мокаем вызов useNavigate

  render(<Login />);

  // Проверяем, что кнопка рендерится
  const submitButton = screen.getByRole('button', { name: /увійти/i });
  expect(submitButton).toBeInTheDocument();

  // Заполняем поля формы
  fireEvent.change(screen.getByPlaceholderText('Електронна пошта'), { target: { value: 'john.doe@gmail.com' } });
  fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'SecurePassword_123' } });

  // Отправляем форму
  fireEvent.click(submitButton);

  // Ожидаем, что navigate будет вызван с '/profile'
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/profile'));
});
