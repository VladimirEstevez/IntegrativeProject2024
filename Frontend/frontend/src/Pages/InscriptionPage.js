import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function InscriptionPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    courriel: '',
    motDePasse: '',
    confirmerMotDePasse: '',
    municipalite: '',
    interet1: false,
    interet2: false,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic

    // Fetching data logic

    // Navigation logic

  };

  return (
    <div>
      <ToastContainer />
      <div className="container bg-white min-vh-100 d-flex justify-content-center align-items-center flex-column">
        <h1 className="mb-4">Inscription</h1>
        <form onSubmit={handleSubmit} className="w-50 p-4 border rounded d-flex flex-column align-items-center">
          <div className="mb-3 w-100">
            <label htmlFor="courriel" className="form-label">Courriel:</label>
            <input type="email" className="form-control" id="courriel" name="courriel" onChange={handleChange} />
          </div>
          <div className="mb-3 w-100">
            <label htmlFor="prenom" className="form-label">Prénom:</label>
            <input type="text" className="form-control" id="prenom" name="prenom" onChange={handleChange} />
          </div>
          <div className="mb-3 w-100">
            <label htmlFor="nom" className="form-label">Nom de famille:</label>
            <input type="text" className="form-control" id="nom" name="nom" onChange={handleChange} />
          </div>
          <div className="mb-3 w-100">
            <label htmlFor="motDePasse" className="form-label">Mot de passe:</label>
            <input type="password" className="form-control" id="motDePasse" name="motDePasse" onChange={handleChange} />
          </div>
          <div className="mb-3 w-100">
            <label htmlFor="confirmerMotDePasse" className="form-label">Confirmer mot de passe:</label>
            <input type="password" className="form-control" id="confirmerMotDePasse" name="confirmerMotDePasse" onChange={handleChange} />
          </div>
          <div className="mb-3 w-100">
            <label htmlFor="municipalite" className="form-label">Municipalité:</label>
            <select className="form-select" id="municipalite" name="municipalite" onChange={handleChange}>
              <option value="ville1">Ville 1</option>
              <option value="ville2">Ville 2</option>
              <option value="ville3">Ville 3</option>
            </select>
          </div>
          <div className="mb-3 w-100">
            <label className="form-label">Intérêts:</label>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="interet1" name="interet1" onChange={handleChange} />
              <label className="form-check-label" htmlFor="interet1">Intérêt 1</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="interet2" name="interet2" onChange={handleChange} />
              <label className="form-check-label" htmlFor="interet2">Intérêt 2</label>
            </div>
          </div>
          <div className="mb-3 w-100 d-flex justify-content-between">
            <button type="button" onClick={() => navigate("/")} className="btn btn-primary">Annuler</button>
            <button type="submit" className="btn btn-primary">S'inscrire</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InscriptionPage;
