import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenuPage = () => {
  const navigate = useNavigate();
  const prenom = localStorage.getItem('prenom');
  console.log("Prenom: ", prenom);

  return (
    <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        textAlign: 'center',
      }}>
        <h1 style={{ 
          fontSize: '24px',
          marginBottom: '20px',
        }}>Bonjour {prenom}</h1>
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          textAlign: 'center',
          maxWidth: '300px', // Adjust the maximum width as needed
          margin: '0 auto', // Center the container
        }}>
          <button onClick ={()=>navigate("/activities")} style={{ 
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            marginBottom: '10px',
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            display: 'block',
            width: '100%',
          }}>
            Voir mes activités
          </button>
          <button onClick ={()=>navigate("/modify")} style={{ 
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            marginBottom: '10px',
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            display: 'block',
            width: '100%',
          }}>
            Modifier mon profil
          </button>
          <button onClick ={()=>navigate("/")} style={{ 
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            marginBottom: '10px',
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            display: 'block',
            width: '100%',
          }}>
            Se deconnecter
          </button>
        </div>
      </div>
  );
};

export default MainMenuPage;
