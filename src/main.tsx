import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AdminTokensPage from '@/pages/AdminTokensPage';
import App from '@/App';
import './index.css';

const isAdminPage = window.location.pathname.replace(/\/+$/, '') === '/admin';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminPage ? <AdminTokensPage /> : <App />}
  </StrictMode>
);
