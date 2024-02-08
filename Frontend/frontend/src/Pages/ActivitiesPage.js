import React from 'react';

const ActivitiesPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: '100vh' }}>
      <h1>Vos activités</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'lightblue', padding: '10px 20px', margin: '10px' }}>Activité 1</div>
        <div style={{ backgroundColor: 'lightblue', padding: '10px 20px', margin: '10px' }}>Activité 2</div>
        <div style={{ backgroundColor: 'lightblue', padding: '10px 20px', margin: '10px' }}>Activité 3</div>
      </div>
      <button style={{ marginTop: '20px', backgroundColor: 'blue', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>Se déconnecter</button>
    </div>
  );
}

export default ActivitiesPage;
