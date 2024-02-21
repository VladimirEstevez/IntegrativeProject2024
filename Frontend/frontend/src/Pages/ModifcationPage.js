import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { PersonGear, XLg } from 'react-bootstrap-icons';

const ModificationPage = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [municipalite, setMunicipalite] = useState('');
  const [sports, setSports] = useState(false);
  const [festivals, setFestivals] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create an object with the current state values
    const updatedUser = {};
    if (prenom.trim()) updatedUser.prenom = prenom;
    if (nom.trim()) updatedUser.nom = nom;
    if (municipalite) updatedUser.municipalite = municipalite;
    if (sports) updatedUser.sports = sports;
    if (festivals) updatedUser.festivals = festivals;

    const token = localStorage.getItem('token');

    try {
      // Send updatedUser to server to update the user in the database
      const response = await fetch('http://localhost:8080/updateUser', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('token', data.accessToken);

      console.log('Success:', data);
      toast.success('Modifications réussies!', { autoClose: 3000, pauseOnHover: false });
      setTimeout(() => {
        navigate('/menu'); // Navigate to /menu after a delay
      }, 4000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const fetchProtectedRoute = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/');
      } else {
        try {
          const response = await fetch('http://localhost:8080/protectedRoute', {
            method: 'GET',
            headers: {
              authorization: 'Bearer ' + token,
            },
          });

          console.log('response: ', response);
          if (response.status === 401) {
            navigate('/');
          } else {
            const user = await response.json();
            console.log('user: ', user);
            setPrenom(user.prenom);
            setNom(user.nom);
            setMunicipalite(user.municipalite);
            setSports(user.sports);
            setFestivals(user.festivals);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchProtectedRoute();
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container bg-white rounded p-4 max-width-md mt-5">
        <ToastContainer />
        <h1 className="mb-4">Modifier</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="prenom" className="form-label">
              Prénom
            </label>
            <input type="text" id="prenom" className="form-control" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="nom" className="form-label">
              Nom de famille
            </label>
            <input type="text" id="nom" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="municipalite" className="form-label">
              Municipalité
            </label>
            <select
              id="municipalite"
              className="form-select"
              value={municipalite}
              onChange={(e) => setMunicipalite(e.target.value)}
            >
              <option value="Valcourt">Valcourt</option>
              <option value="Richmond">Richmond</option>
              <option value="Windsor">Windsor</option>
            </select>
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" id="Sports" className="form-check-input" checked={sports} onChange={(e) => setSports(e.target.checked)} />
            <label htmlFor="Sports" className="form-check-label">
              Sports
            </label>
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" id="Festivals" className="form-check-input" checked={festivals} onChange={(e) => setFestivals(e.target.checked)} />
            <label htmlFor="Festivals" className="form-check-label">
              Festivals
            </label>
          </div>
          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-primary"
            style={{ position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
              <span style={{ marginRight: '5px' }}>Annuler</span>
                  <XLg size={24} />
            </button>
            <button type="submit" className="btn btn-primary" 
            style={{ position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
              <span style={{ marginRight: '5px' }}>Modifier Mon Profil</span>
                <PersonGear size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModificationPage;
