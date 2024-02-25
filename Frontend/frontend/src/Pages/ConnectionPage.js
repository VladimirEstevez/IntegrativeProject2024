import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BoxArrowInRight, XLg, BoxArrowUpRight } from 'react-bootstrap-icons';
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

    const response = await fetch('http://localhost:8080/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Token: ', data.accessToken);
      localStorage.setItem('token', data.accessToken);


      toast.success('Connexion réussie!', { autoClose: 3000, pauseOnHover: false });
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
    <div>
      <ToastContainer />
      <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: 'white' }}>
        <div className="text-center">
          <h1>Connexion</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Adresse Courriel:</label>
              <input type="email" className="form-control" id="email" onChange={e => setForm({ ...form, courriel: e.target.value })} name="email" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de Passe:</label>
              <input type="password" className="form-control" id="password" onChange={e => setForm({ ...form, motDePasse: e.target.value })} name="password" />
            </div>
            <div className="d-flex justify-content-between">
              <button type="button" onClick={() => navigate("/")} className="btn btn-primary"
                style={{
                  borderRadius: '10px',
                  position: 'relative',
                  padding: '10px 20px',
                  transition: 'transform 0.3s',
                  marginRight: '10px' // Add margin to the right side
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
                  <span style={{ marginRight: '5px' }}>Annuler</span>
                  <XLg size={24} />
                </button>

              <button type="submit" className="btn btn-primary" style={{
                borderRadius: '10px',
                position: 'relative',
                padding: '10px 20px',
                transition: 'transform 0.3s',
                marginRight: '10px' // Add margin to the right side
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
                  <span style={{ marginRight: '5px' }}>Se Connecter</span>
                  <BoxArrowInRight size={24} />
                </button>


                <button onClick={() => navigate("/login")}  className="btn btn-primary" style={{ borderRadius: '10px', 
                  position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
                    <span style={{ marginRight: '5px' }}>Mot de passe oublié?</span>
                  <BoxArrowUpRight size={24} />
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConnectionPage;
