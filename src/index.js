import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/AppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* AppProvider envuelve toda la app, dándole acceso
        al estado global a cualquier componente dentro */}
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);