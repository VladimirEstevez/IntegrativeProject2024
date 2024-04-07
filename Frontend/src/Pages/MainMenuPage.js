import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenuPage =  () => {
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
          const response = await fetch('http://localhost:8080/user/protectedRoute', {
            method: 'GET',
            headers: {
              'authorization': 'Bearer ' + token,
            }
          });

          console.log('prenom: ', response);
          if (response.status === 401){
            navigate('/');
          } else if (!response.ok) {
            console.error('Error:', await response.text());
            navigate('/');
          } else {
            const user = await response.json();
            console.log('prenom: ', user.prenom);
            //localStorage.setItem('prenom', user.prenom);
            setPrenom(user.prenom);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

   // setPrenom(localStorage.getItem('prenom'));
    fetchProtectedRoute();
  }, [navigate]);

if (isLoading) {
  return <div>Loading...</div>;
}

return (
  <div className="container-fluid vh-100">
    <div className="d-flex justify-content-center align-items-start pt-5 m-5">
      <div className="container-md text-center">
        <h1 className="fs-4 mb-4">Bonjour {prenom}</h1>
      </div>
    </div>
  </div>
);
};

export default MainMenuPage;
