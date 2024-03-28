import React from 'react';

const SelectedActivity = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      <div className="bg-white p-4 rounded-lg m-4 text-center">
        <h1 className="mb-0">Activité 1</h1>
        <div className="description mt-4">
          <p><strong>Date:</strong> 20/02/2024</p>
          <p><strong>Heure:</strong> 14h à 17h</p>
          <p><strong>Emplacement:</strong> Aréna de Valcourt</p>
          <p><strong>Intérêts:</strong> Famille, intergénérationel, etc.</p>
        </div>
        <div className="buttons mt-4">
          <button className="btn btn-primary me-2">S'inscrire à l'activité</button>
          <button className="btn btn-primary">Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default SelectedActivity;
