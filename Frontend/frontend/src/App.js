// App.js
//import Bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  BoxArrowInRight, BoxArrowUpRight, FilePerson } from 'react-bootstrap-icons';


import React from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
 
  return (
    <div className="container-fluid bg-white p-5 d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
      <h1>Valcourt2030</h1>
      <button onClick={() => navigate("/register")} className="btn btn-primary m-2"
      style={{ borderRadius: '10px', 
      position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }} >
        <span style={{ marginRight: '5px' }}>S'inscrire</span>
      <FilePerson size={24} /></button>
      <button onClick={() => navigate("/login")}  className="btn btn-primary m-2" style={{ borderRadius: '10px', 
      position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
        <span style={{ marginRight: '5px' }}>Se connecter</span>
      <BoxArrowInRight size={24} />
      </button>
      <button onClick={() => navigate("/login")}  className="btn btn-primary m-2" style={{ borderRadius: '10px', 
      position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
        <span style={{ marginRight: '5px' }}>Mot de passe oublié?</span>
      <BoxArrowUpRight size={24} />
      </button>

      
      
    </div>
  );
}

export default App;
