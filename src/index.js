import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from "./context/AuthContext";
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
