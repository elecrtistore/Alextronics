import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { InquiryProvider } from './contexts/InquiryContext';
import './index.css';

const params = new URLSearchParams(window.location.search);
const oobCode = params.get('oobCode');
const mode = params.get('mode');
if (oobCode && mode === 'resetPassword') {
  window.location.replace(`/#/reset-password?oobCode=${encodeURIComponent(oobCode)}&mode=${mode}`);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <InquiryProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </InquiryProvider>
    </AuthProvider>
  </React.StrictMode>
);
