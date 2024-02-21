import React, { useEffect, useState } from 'react';
import { BoxArrowInLeft, PersonGear, PersonWalking } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const MainMenuPage = () => {
  const navigate = useNavigate();
  const [prenom, setPrenom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProtectedRoute = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/');
      } else {
        try {
          const response = await fetch('http://localhost:8080/protectedRoute', {
            method: 'GET',
            headers: {
              'authorization': 'Bearer ' + token,
            }
          });

          if (response.status === 401) {
            navigate('/');
          } else if (!response.ok) {
            console.error('Error:', await response.text());
            navigate('/');
          } else {
            const user = await response.json();
            localStorage.setItem('prenom', user.prenom);
            setPrenom(user.prenom);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchProtectedRoute();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid bg-white vh-100 d-flex justify-content-center align-items-center">
      <div className="container-md text-center">
        <h1 className="fs-4 mb-4">Bonjour {prenom}</h1>
        <div className="mb-2 position-relative" style={{ maxWidth: '300px', margin: '0 auto' }}>
          <button
            onClick={() => navigate("/activities")}
            className="btn btn-primary btn-block"
            style={{ position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <span style={{ marginRight: '5px' }}>Voir mes activités</span>
            <PersonWalking size={24} />
          </button>
        </div>
        <div className="mb-2 position-relative" style={{ maxWidth: '300px', margin: '0 auto' }}>
          <button
            onClick={() => navigate("/modify")}
            className="btn btn-primary btn-block"
            style={{ position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <span style={{ marginRight: '5px' }}>Modifier Mon Profil</span>
            <PersonGear size={24} />
          </button>
        </div>
        <div className="position-relative" style={{ maxWidth: '300px', margin: '0 auto' }}>
          <button
            onClick={() => navigate("/")}
            className="btn btn-primary btn-block"
            style={{ position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <span style={{ marginRight: '5px' }}>Se Déconnecter</span>
            <BoxArrowInLeft size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainMenuPage;
