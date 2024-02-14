import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenuPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid bg-white vh-100 d-flex justify-content-center align-items-center">
      <div className="container-md text-center">
        <h1 className="fs-4 mb-4">Bonjour "UserName"</h1>
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
