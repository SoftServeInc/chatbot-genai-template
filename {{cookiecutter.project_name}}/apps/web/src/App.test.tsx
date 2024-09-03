import { render, waitFor } from '@testing-library/react';
import App from './App';

test('True is True', () => {
  expect(true).toBe(true);
});

test('Renders the App component', async () => {
  const app = await waitFor(() => render(<App />));

  expect(app.container).toBeInTheDocument();
});
