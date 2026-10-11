import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portfolio headline', () => {
  render(<App />);
  const heading = screen.getByText(/Experiências digitais feitas para/i);
  expect(heading).toBeInTheDocument();
});
