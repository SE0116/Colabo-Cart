// src/__tests__/Cart.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../components/cart';

import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockResolvedValue({
  data: {
    predict: "-94.0993070602417",
  },
});

describe('Cart Component', () => {
  test('renders empty cart page with buttons', () => {
    render(<Cart />);
    expect(screen.getByText(/장바구니가 비어 있습니다/)).toBeInTheDocument();
    expect(screen.getByText(/시술/)).toBeInTheDocument();
    expect(screen.getByText(/할인/)).toBeInTheDocument();
    expect(screen.getByText(/다음/)).toBeInTheDocument();
  });

  test('opens item modal on add button click', () => {
    render(<Cart />);
    fireEvent.click(screen.getByText(/시술/));
    expect(screen.getByText(/아이템 목록/)).toBeInTheDocument();
  });

  test('adds selected items to the cart', () => {
    render(<Cart />);
    fireEvent.click(screen.getByText(/시술/));
    fireEvent.click(screen.getByLabelText(/여성컷/));
    fireEvent.click(screen.getByText(/확인/));
    expect(screen.getByText(/여성컷/)).toBeInTheDocument();
  });

  test('opens discount modal on discount button click', () => {
    render(<Cart />);
    fireEvent.click(screen.getByText(/할인/));
    expect(screen.getByText(/할인 목록/)).toBeInTheDocument();
  });

  test('adds selected discounts to the cart', () => {
    render(<Cart />);
    fireEvent.click(screen.getByText(/할인/));
    fireEvent.click(screen.getByLabelText(/지인 할인/));
    fireEvent.click(screen.getByText(/확인/));
    expect(screen.getByText(/지인 할인/)).toBeInTheDocument();
  });

  test('calculates total price correctly', () => {
    render(<Cart />);
    fireEvent.click(screen.getByText(/시술/));
    fireEvent.click(screen.getByLabelText(/여성컷/));
    fireEvent.click(screen.getByLabelText(/남성컷/));
    fireEvent.click(screen.getByText(/확인/));
    fireEvent.click(screen.getByText(/할인/));
    fireEvent.click(screen.getByLabelText(/지인 할인/));
    fireEvent.click(screen.getByText(/확인/));
    expect(screen.getByText(/59800/)).toBeInTheDocument();
  });

  test('removes item from the cart', () => {
    render(<Cart />);
    fireEvent.click(screen.getByText(/시술/));
    fireEvent.click(screen.getByLabelText(/여성컷/));
    fireEvent.click(screen.getByText(/확인/));
    fireEvent.click(screen.getByText(/삭제/));
    expect(screen.queryByText(/여성컷/)).not.toBeInTheDocument();
  });

  test('removes discount from the cart', () => {
    render(<Cart />);
    fireEvent.click(screen.getByText(/할인/));
    fireEvent.click(screen.getByLabelText(/지인 할인/));
    fireEvent.click(screen.getByText(/확인/));
    fireEvent.click(screen.getByText(/삭제/));
    expect(screen.queryByText(/지인 할인/)).not.toBeInTheDocument();
  });
});
