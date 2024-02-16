import React from 'react';

const ModificationPage = () => {
  return (
    <div className="container bg-white rounded p-4 max-width-lg mt-5">
      <h1 className="mb-4">Modifier</h1>
      <form className="w-100">
        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">Prénom</label>
          <input type="text" id="prenom" className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom de famille</label>
          <input type="text" id="nom" className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input type="password" id="password" className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirmer</label>
          <input type="password" id="confirmPassword" className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="municipalite" className="form-label">Municipalité</label>
          <select id="municipalite" className="form-select">
            <option value="">Sélectionnez une municipalité</option>
            {/* Add dropdown options here */}
          </select>
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" id="interets1" className="form-check-input" />
          <label htmlFor="interets1" className="form-check-label">Intérêts 1</label>
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" id="interets2" className="form-check-input" />
          <label htmlFor="interets2" className="form-check-label">Intérêts 2</label>
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
