// App.js
//import Bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  BoxArrowInRight, FilePerson } from 'react-bootstrap-icons';
import {React, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProtectedRoute = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        const response = await fetch('http://localhost:8080/user/protectedRoute', {
          method: 'GET',
          headers: {
            authorization: 'Bearer ' + token,
          },
        });

        if (response.status === 200) {
          navigate('/menu');
        } else {
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    };
    
    fetchProtectedRoute();
  }, [navigate]);


  return (
    <div className="container-fluid bg-white p-5 d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
     
      <img src="https://valfamille.com/site2022/wp-content/uploads/logo-bleu-marge.jpg" alt="" className="logo" />
      <button 
  onClick={() => navigate("/register")}  
  className="btn btn-light  m-2 btn-custom btn-hover-effect"

>
        <span style={{ marginRight: '5px' }}>S'inscrire</span>
      <FilePerson size={24} /></button>
      <button 
  onClick={() => navigate("/login")}  
  className="btn btn-light  m-2 btn-custom btn-hover-effect"
>
        <span style={{ marginRight: '5px' }}>Se connecter</span>
      <BoxArrowInRight size={24} />
      </button>
           
      
    </div>
  );
}

export default App;
