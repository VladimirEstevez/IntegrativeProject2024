import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
const ModificationPage = () => {


  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [municipalite, setMunicipalite] = useState('');
  const [sports, setSports] = useState(false);
  const [festivals, setFestivals] = useState(false);
  

  const navigate = useNavigate();

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
              'authorization': 'Bearer ' + token,
            }
          });

          console.log('response: ', response);
          if (response.status === 401){
            navigate('/');
          }else{
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
    
    // Send updatedUser to server to update the user in the database
    // collection.updateOne({ email: userEmail }, { $set: updatedUser });
  
    try {
      // Send updatedUser to server to update the user in the database
      const response = await fetch('http://localhost:8080/updateUser', {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'authorization': 'Bearer ' + token,
          },
          body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('token', data.accessToken);

      console.log('Success:', data);
      toast.success('Modifications réussies!',  { autoClose: 3000, pauseOnHover: false  });
      setTimeout(() => {
        navigate('/menu');  // Navigate to /menu after a delay
      }, 4000);

  } catch (error) {
      console.error('Error:', error);
  }
};

  return (
    <div className="container bg-white rounded p-4 max-width-lg mt-5"><ToastContainer />
      <h1 className="mb-4">Modifier</h1>
      <form className="w-100" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">Prénom</label>
          <input type="text" id="prenom" className="form-control" value={prenom} onChange={e => setPrenom(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom de famille</label>
          <input type="text" id="nom" className="form-control" value={nom} onChange={e => setNom(e.target.value)}/>
        </div>
        {/*
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Ancien mot de passe</label>
          <input type="password" id="password" className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Nouveau mot de passe</label>
          <input type="password" id="password" className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirmer nouveau mot de passe</label>
          <input type="password" id="confirmPassword" className="form-control" />
        </div>*/}
        <div className="mb-3">
          <label htmlFor="municipalite" className="form-label">Municipalité</label>
          <select id="municipalite" className="form-select" value={municipalite} onChange={e => setMunicipalite(e.target.value)}>
            <option value="Valcourt">Valcourt</option>
            <option value="Richmond">Richmond</option>
            <option value="Windsor">Windsor</option>
            
            {/* Add dropdown options here */}
          </select>
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" id="Sports" className="form-check-input"  checked={sports} onChange={e => setSports(e.target.checked)}/>
          <label htmlFor="Sports" className="form-check-label">Sports</label>
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" id="Festivals" className="form-check-input" checked={festivals} onChange={e => setFestivals(e.target.checked)} />
          <label htmlFor="Festivals" className="form-check-label">Festivals</label>
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-primary">Annuler</button>
          <button type="submit" className="btn btn-primary">Modifier</button>
        </div>
      </form>
    </div>
  );
};

export default ModificationPage;
