import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenuPage =  () => {
  const navigate = useNavigate();
  //useEffect( () => {
    const token = localStorage.getItem('token');

  if (!token) {
    navigate('/');
  }else{
    const response = fetch('http://localhost:8080/protectedRoute', {
      method: 'GET',
      headers: {
        'authorization': 'Bearer ' + token,
      }
    });
    
    console.log('response: ', response);
    if (response.status === 401){
      navigate('/');
    }
  }
  
  return (
    <div className="container-fluid bg-white vh-100 d-flex justify-content-center align-items-center">
      <div className="container-md text-center">
        <h1 className="fs-4 mb-4">Bonjour username</h1>
        <div className="mb-2">
          <button onClick={() => navigate("/activities")} className="btn btn-primary btn-block">Voir mes activités</button>
        </div>
        <div className="mb-2">
          <button onClick={() => navigate("/modify")} className="btn btn-primary btn-block">Modifier mon profil</button>
        </div>
        <div>
          <button onClick={() => navigate("/")} className="btn btn-primary btn-block">Se déconnecter</button>
        </div>
      </div>
    </div>
  );
};

export default MainMenuPage;
