import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from "./context/AuthContext";
import { SnackbarProvider } from 'notistack';
import SiteUnderMaintenance from './components/SiteUnderMaintenance/SiteUnderMaintenance';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SnackbarProvider maxSnack={3}>
        {/*  preventDuplicate> */}
        <App />
        {/* <SiteUnderMaintenance /> */}
      </SnackbarProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
