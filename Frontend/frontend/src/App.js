// App.js
//import Bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  BoxArrowInRight, BoxArrowUpRight, FilePerson } from 'react-bootstrap-icons';


import {React, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProtectedRoute = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await fetch('http://localhost:8080/protectedRoute', {
            method: 'GET',
            headers: {
              authorization: 'Bearer ' + token,
            },
          });

          console.log('response: ', response);
          if (response.status === 401) {
            localStorage.deleteItem('token');
            navigate('/');
          } else {
            const user = await response.json();
            console.log('user: ', user);
            navigate('/menu');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    
    fetchProtectedRoute();
  }, [navigate]);






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
