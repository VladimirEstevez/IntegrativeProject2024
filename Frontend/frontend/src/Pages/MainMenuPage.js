import React, { useEffect, useState } from 'react';
import { BookmarkHeart, BoxArrowInLeft, PersonGear, PersonWalking } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

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
    <div className="container-fluid vh-100">
      <Navbar style={{ backgroundColor: 'transparent' }} expand="lg" className="position-absolute top-0 end-0">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link onClick={() => navigate("/myActivities")}>
              <span style={{ marginRight: '5px' }}>Voir mes activités</span>
              <BookmarkHeart size={24} />
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/activities")}>
              <span style={{ marginRight: '5px' }}>Voir les activités</span>
              <PersonWalking size={24} />
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/modify")}>
              <span style={{ marginRight: '5px' }}>Modifier Mon Profil</span>
              <PersonGear size={24} />
            </Nav.Link>
            <Nav.Link onClick={() => SeDeconnecter()}>
              <span style={{ marginRight: '5px' }}>Se Déconnecter</span>
              <BoxArrowInLeft size={24} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="d-flex justify-content-center align-items-start pt-5 m-5">
        <div className="container-md text-center">
          <h1 className="fs-4 mb-4">Bonjour {prenom}</h1>
        </div>
      </div>
    </div>
  );
};

export default MainMenuPage;
