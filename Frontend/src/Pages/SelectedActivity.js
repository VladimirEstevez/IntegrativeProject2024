import React from 'react'; // Importing React

// Functional component for displaying selected activity details
const SelectedActivity = () => {
  return (
    <div className="d-flex flex-column align-items-center"> {/* Flex container */}
      {/* Selected activity details */}
      <div className="bg-white p-4 rounded-lg m-4 text-center"> {/* Container with white background */}
        <h1 className="mb-0">Activité 1</h1> {/* Activity title */}
        <div className="description mt-4"> {/* Description section */}
          <p><strong>Date:</strong> 20/02/2024</p> {/* Date */}
          <p><strong>Heure:</strong> 14h à 17h</p> {/* Time */}
          <p><strong>Emplacement:</strong> Aréna de Valcourt</p> {/* Location */}
          <p><strong>Intérêts:</strong> Famille, intergénérationel, etc.</p> {/* Interests */}
        </div>
        <div className="buttons mt-4"> {/* Buttons section */}
          {/* Button to register for the activity */}
          <button className="btn btn-primary me-2">S'inscrire à l'activité</button>
          {/* Button to cancel */}
          <button className="btn btn-primary">Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default SelectedActivity; // Exporting SelectedActivity component
