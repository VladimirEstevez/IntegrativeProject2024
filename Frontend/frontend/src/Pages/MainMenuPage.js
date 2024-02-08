import React from 'react';

const MainMenuPage = () => {
  return (
    <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        textAlign: 'center',
      }}>
        <h1 style={{ 
          fontSize: '24px',
          marginBottom: '20px',
        }}>Bonjour Guillaume</h1>
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          textAlign: 'center',
          maxWidth: '300px', // Adjust the maximum width as needed
          margin: '0 auto', // Center the container
        }}>
          <button style={{ 
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
          <button style={{ 
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
          <button style={{ 
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
            Retour au menu
          </button>
        </div>
      </div>
  );
};

export default MainMenuPage;
