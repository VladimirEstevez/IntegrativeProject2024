import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ActivitiesPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container-fluid bg-white d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
      <h1>Vos activités</h1>
      <div className="d-flex justify-content-center">
        <button className="bg-lightblue p-3 m-2">Activité 1</button>
        <button className="bg-lightblue p-3 m-2">Activité 2</button>
        <button className="bg-lightblue p-3 m-2">Activité 3</button>
      </div>
      <button onClick={() => navigate("/")} className="btn btn-primary mt-4">Se déconnecter</button>
    </div>
  );
}

export default ActivitiesPage;
