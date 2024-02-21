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
          const response = await fetch('http://localhost:8080/protectedRoute', {
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

  function SeDeconnecter(){
    //Remove the token
    localStorage.removeItem('token');

    //Navigate to the main page
    navigate("/");
  }
  
  if (isLoading) {
    return <div>Loading...</div>;
}

  return (
    <div className="container-fluid bg-white vh-100 d-flex justify-content-center align-items-center">
      <div className="container-md text-center">
        <h1 className="fs-4 mb-4">Bonjour {prenom}</h1>
        <div className="mb-2">
          <button onClick={() => navigate("/activities")} className="btn btn-primary btn-block">Voir mes activités</button>
        </div>
        <div className="mb-2">
          <button onClick={() => navigate("/modify")} className="btn btn-primary btn-block">Modifier mon profil</button>
        </div>
        <div>
          <button onClick={() => SeDeconnecter()} className="btn btn-primary btn-block">Se déconnecter</button>
        </div>
      </div>
    </div>
  );
};

export default MainMenuPage;
