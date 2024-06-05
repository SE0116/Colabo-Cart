import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cart page with initial buttons and message', () => {
    render(<App />);
    expect(screen.getByText(/장바구니가 비어 있습니다/)).toBeInTheDocument();
    expect(screen.getByText(/추가/)).toBeInTheDocument();
    expect(screen.getByText(/할인/)).toBeInTheDocument();
    expect(screen.getByText(/다음/)).toBeInTheDocument();
});
