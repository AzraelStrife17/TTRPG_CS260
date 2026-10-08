import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './src/app.jsx';
import './src/app.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find the root element in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);