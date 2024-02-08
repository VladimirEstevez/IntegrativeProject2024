// InscriptionPage.js
import React from 'react';

function InscriptionPage() {
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '20px' }}>Inscription</h1>
      <form style={{ width: '50%', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label htmlFor="prenom" style={{ marginBottom: '5px' }}>Prénom:</label>
          <input type="text" id="prenom" name="prenom" style={{ borderRadius: '5px', padding: '5px', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label htmlFor="nom" style={{ marginBottom: '5px' }}>Nom de famille:</label>
          <input type="text" id="nom" name="nom" style={{ borderRadius: '5px', padding: '5px', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label htmlFor="courriel" style={{ marginBottom: '5px' }}>Courriel:</label>
          <input type="email" id="courriel" name="courriel" style={{ borderRadius: '5px', padding: '5px', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label htmlFor="motDePasse" style={{ marginBottom: '5px' }}>Mot de passe:</label>
          <input type="password" id="motDePasse" name="motDePasse" style={{ borderRadius: '5px', padding: '5px', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label htmlFor="confirmerMotDePasse" style={{ marginBottom: '5px' }}>Confirmer:</label>
          <input type="password" id="confirmerMotDePasse" name="confirmerMotDePasse" style={{ borderRadius: '5px', padding: '5px', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label htmlFor="municipalite" style={{ marginBottom: '5px' }}>Municipalité:</label>
          <select id="municipalite" name="municipalite" style={{ borderRadius: '5px', padding: '5px', width: '100%' }}>
            <option value="ville1">Ville 1</option>
            <option value="ville2">Ville 2</option>
            <option value="ville3">Ville 3</option>
          </select>
        </div>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label style={{ marginBottom: '5px' }}>Intérêts:</label>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <label htmlFor="interet1" style={{ marginBottom: '5px' }}><input type="checkbox" id="interet1" name="interet1" /> Intérêt 1</label>
            <label htmlFor="interet2" style={{ marginBottom: '5px' }}><input type="checkbox" id="interet2" name="interet2" /> Intérêt 2</label>
          </div>
        </div>
        <button type="submit" style={{ borderRadius: '5px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', width: '100%', maxWidth: '400px' }}>S'inscrire</button>
      </form>
    </div>
  );
}

export default InscriptionPage;
