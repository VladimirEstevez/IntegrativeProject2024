// App.js
//import Bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


import React from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  return (
    <div className="container-fluid bg-white p-5 d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
      <h1>Valcourt2030</h1>
      <button onClick={() => navigate("/register")} className="btn btn-primary m-2">S'inscrire</button>
      <button onClick={() => navigate("/login")} className="btn btn-primary m-2">Se connecter</button>
    </div>
  );
}

export default App;
