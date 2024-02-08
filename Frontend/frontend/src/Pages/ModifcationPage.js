import React from 'react';

const ModificationPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '400px',
      margin: 'auto',
      marginTop: '50px',
    }}>
      <h1 style={{ marginBottom: '20px' }}>Modifier</h1>
      <form style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}>
        <div style={{
          marginBottom: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          width: '100%',
        }}>
          <label htmlFor="prenom">Prénom</label>
          <input type="text" id="prenom" style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            boxSizing: 'border-box',
          }} />
        </div>
        <div style={{
          marginBottom: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          width: '100%',
        }}>
          <label htmlFor="nom">Nom de famille</label>
          <input type="text" id="nom" style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            boxSizing: 'border-box',
          }} />
        </div>
        <div style={{
          marginBottom: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          width: '100%',
        }}>
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            boxSizing: 'border-box',
          }} />
        </div>
        <div style={{
          marginBottom: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          width: '100%',
        }}>
          <label htmlFor="confirmPassword">Confirmer</label>
          <input type="password" id="confirmPassword" style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            boxSizing: 'border-box',
          }} />
        </div>
        <div style={{
          marginBottom: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          width: '100%',
        }}>
          <label htmlFor="municipalite">Municipalité</label>
          <select id="municipalite" style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            <option value="">Sélectionnez une municipalité</option>
            {/* Add dropdown options here */}
          </select>
        </div>
        <div style={{
          marginBottom: '15px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}>
          <input type="checkbox" id="interets1" style={{ marginRight: '10px' }} />
          <label htmlFor="interets1">Intérêts 1</label>
        </div>
        <div style={{
          marginBottom: '15px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}>
          <input type="checkbox" id="interets2" style={{ marginRight: '10px' }} />
          <label htmlFor="interets2">Intérêts 2</label>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: '20px',
        }}>
          <button type="button" style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}>Annuler</button>
          <button type="submit" style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}>Modifier</button>
        </div>
      </form>
    </div>
  );
};

export default ModificationPage;
