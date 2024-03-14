import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ActivitiesPage from './Pages/ActivitiesPage';
import ConnectionPage from './Pages/ConnectionPage';
import InscriptionPage from './Pages/InscriptionPage';
import MainMenuPage from './Pages/MainMenuPage';
import ModifcationPage from './Pages/ModifcationPage';
import SelectedActivity from './Objects/Activity';
import PasswordPage from './Pages/ForgotPasswordPage';
import ReactDOM from 'react-dom/client';
import ResetPasswordPage from './Pages/ResetPasswordPage';
import PasswordModificationPage from './Pages/PasswordModificationPage';
import MyActivitiesPage from './Pages/MyActivities';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<ConnectionPage />} />
        <Route path="/register" element={<InscriptionPage />} />
       
        
        <Route path="/menu" element={<MainMenuPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/modify" element={<ModifcationPage />} />
        <Route path="/activities/:id" element={<SelectedActivity />} />
        <Route path="/forgotPassword" element={<PasswordPage />} />
        <Route path="/myActivities" element={<MyActivitiesPage />} />
        
       
        <Route path="/resetPassword" element={<ResetPasswordPage />} />
        <Route path="/passwordModification" element={<PasswordModificationPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

