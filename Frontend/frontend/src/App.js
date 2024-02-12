// App.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

function App() {

  const navigate = useNavigate()
  return (
    <div style={{ backgroundColor: 'white', padding: '20px', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Valcourt2030</h1>
      <button onClick={()=>navigate("/register")} style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', margin: '10px', borderRadius: '10px', border: 'none' }}>S'inscrire</button>
      <button onClick={()=>navigate("/login")} style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', margin: '10px', borderRadius: '10px', border: 'none' }}>Se connecter</button>
    </div>
  );
}

export default App;
