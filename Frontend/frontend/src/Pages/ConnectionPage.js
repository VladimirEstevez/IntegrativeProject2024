// App.js

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function ConnectionPage() {
  const [form, setForm] = useState({
    courriel: '',
    motDePasse: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      toast.success('Login successful!',  { autoClose: 3000 , pauseOnHover: false });
      setTimeout(() => {
        navigate('/menu');  // Navigate to /menu after a delay
      }, 4000);
      // Handle successful login here
    } else {
      const data = await response.json();
      toast.error(data.message, { autoClose: 3000, pauseOnHover: false });
      // Handle error here
    }
  };


  
  return (
    <div>
      <ToastContainer />
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email">Adresse Courriel:</label>
            <input type="email" id="email"  onChange={e => setForm({ ...form, courriel: e.target.value })}  name="email" style={{ margin: '5px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password">Mot de Passe:</label>
            <input type="password" id="password" onChange={e => setForm({ ...form, motDePasse: e.target.value })}   name="password" style={{ margin: '5px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" onClick= {()=>navigate("/")} style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Annuler</button>
            <button type="submit" style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Se Connecter</button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}

export default ConnectionPage;
