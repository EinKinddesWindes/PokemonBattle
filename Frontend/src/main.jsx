import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import '@fontsource/press-start-2p';
import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
