import React from 'react';

const SelectedActivity = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', margin: '20px', textAlign: 'center' }}>
      <h1 style={{ margin: '0' }}>Activité 1</h1>
      <div className="description" style={{ marginTop: '20px' }}>
        <p><strong>Date:</strong> 20/02/2024</p>
        <p><strong>Heure:</strong> 14h à 17h</p>
        <p><strong>Emplacement:</strong> Aréna de Valcourt</p>
        <p><strong>Intérêts:</strong> Famille, intergénérationel, etc.</p>
      </div>
      <div className="buttons" style={{ marginTop: '20px' }}>
        <button style={{ backgroundColor: 'blue', color: 'white', borderRadius: '5px', marginRight: '10px' }}>S'inscrire à l'activité</button>
        <button style={{ backgroundColor: 'blue', color: 'white', borderRadius: '5px' }}>Annuler</button>
      </div>
    </div>
  </div>
  );
}

export default SelectedActivity;
