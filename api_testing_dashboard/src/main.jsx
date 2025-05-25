import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log('Starting API Testing Dashboard...');
console.log('Environment:', import.meta.env.MODE);
console.log('React Version:', React.version);

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
  console.error('Source:', event.filename + ':' + event.lineno);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

try {
  console.log('Creating React root...');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  console.log('Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('App rendered successfully!');
} catch (error) {
  console.error('Failed to render app:', error);
}