import React from 'react';

const ConnectionPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Connexion</h1>
        <form>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email">Adresse Courriel:</label>
            <input type="email" id="email" name="email" style={{ margin: '5px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password">Mot de Passe:</label>
            <input type="password" id="password" name="password" style={{ margin: '5px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Annuler</button>
            <button type="submit" style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Se Connecter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectionPage;
