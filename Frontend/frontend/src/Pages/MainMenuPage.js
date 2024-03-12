import React, { useEffect, useState } from 'react';
import { BoxArrowInLeft, PersonGear, PersonWalking } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import '../css/MainMenuPage.css'; // import the CSS file

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
  <div className="container">
    <div className="button-container">
      <button onClick={() => navigate("/activities")} className="btn btn-light  m-2 btn-custom btn-hover-effect">
        <span>Voir mes activités</span>
        <PersonWalking size={24} />
      </button>
    </div>
    <div className="button-container">
      <button onClick={() => navigate("/modify")} className="btn btn-light  m-2 btn-custom btn-hover-effect">
        <span>Modifier Mon Profil</span>
        <PersonGear size={24} />
      </button>
    </div>
    <div className="button-container">
      <button onClick={() => SeDeconnecter()} className="btn btn-light  m-2 btn-custom btn-hover-effect">
        <span>Se Déconnecter</span>
        <BoxArrowInLeft size={24} />
      </button>
    </div>
  </div>
);
};

export default MainMenuPage;
