import React from 'react';

import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ActivitiesPage from './Pages/ActivitiesPage';
import ConnectionPage from './Pages/ConnectionPage';
import InscriptionPage from './Pages/InscriptionPage';
import MainMenuPage from './Pages/MainMenuPage';
import ModifcationPage from './Pages/ModifcationPage';
import SelectedActivity from './Pages/SelectedActivity';
import ReactDOM from 'react-dom/client';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/login" element={<ConnectionPage />} />
        <Route path="/register" element={<InscriptionPage />} />
        <Route path="/menu" element={<MainMenuPage />} />
        <Route path="/modify" element={<ModifcationPage />} />
        <Route path="/activity/:id" element={<SelectedActivity />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

