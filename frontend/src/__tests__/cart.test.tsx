import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../components/cart';

test('renders empty cart page with buttons', () => {
  render(<Cart />);
  expect(screen.getByText(/장바구니가 비어 있습니다/)).toBeInTheDocument();
  expect(screen.getByText(/추가/)).toBeInTheDocument();
  expect(screen.getByText(/할인/)).toBeInTheDocument();
  expect(screen.getByText(/다음/)).toBeInTheDocument();
});

test('opens item modal on add button click', () => {
  render(<Cart />);
  fireEvent.click(screen.getByText(/추가/));
  expect(screen.getByText(/아이템 목록/)).toBeInTheDocument();
});

test('adds selected items to the cart', () => {
  render(<Cart />);
  fireEvent.click(screen.getByText(/추가/));
  
  fireEvent.click(screen.getByLabelText(/아이템1/));
  fireEvent.click(screen.getByText(/확인/));

  expect(screen.getByText(/아이템1/)).toBeInTheDocument();
});