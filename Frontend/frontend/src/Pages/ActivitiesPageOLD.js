import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BoxArrowInLeft } from 'react-bootstrap-icons';

const ActivitiesPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container-fluid bg-white d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
      <h1>Vos activités</h1>
      <div className="d-flex justify-content-center">
        <button className="bg-lightblue p-3 m-2" style={{ borderRadius: '10px', 
            position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>Activité 1</button>

        <button className="bg-lightblue p-3 m-2" style={{ borderRadius: '10px', 
            position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>Activité 2</button>
        <button className="bg-lightblue p-3 m-2" style={{ borderRadius: '10px', 
            position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>Activité 3</button>
      </div>
      <button onClick={() => navigate("/")} className="btn btn-primary mt-4" 
      style={{ borderRadius: '10px', 
      position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
        <span style={{ marginRight: '5px' }}>Se Déconnecter</span>
            <BoxArrowInLeft size={24} />
      </button>
    </div>
  );
}

export default ActivitiesPage;
