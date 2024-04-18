import React, { useEffect, useState } from 'react'; // Importing necessary modules and components
import { useNavigate } from 'react-router-dom'; // Importing hook for navigation
import { toast, ToastContainer } from 'react-toastify'; // Importing toast notifications
import { Form} from 'react-bootstrap'; // Importing Bootstrap components
import { PersonGear, XLg } from 'react-bootstrap-icons'; // Importing Bootstrap icons
import backgroundImage from '../Logo/V2030.png'; // Importing the background image

const ModificationPage = () => {
  const [prenom, setPrenom] = useState(''); // State for first name
  const [nom, setNom] = useState(''); // State for last name
  const [municipalite, setMunicipalite] = useState(''); // State for municipality
  const [tags, setTags] = useState([]); // State for interests/tags
  const [interests, setInterests] = useState([]); // State for interests options
  const [municipalites, setMunicipalites] = useState([]); // State for municipality options

  useEffect(() => {
    const fetchData = async () => { // Fetch data for interests and municipalities
      try {
        const response = await fetch("http://localhost:8080/data");
        const data = await response.json();
        setInterests(data.interests); // Set interests options
        setMunicipalites(data.municipalities); // Set municipality options
      } catch (error) {
        console.error("Error:", error); // Log any errors
      }
    };
  
    fetchData(); // Call fetchData function
  }, []);

  function renderMunicipalites() { // Render municipality options
    return municipalites.map((municipalite, index) => (
      <option key={index} value={municipalite}>
        {municipalite}
      </option>
    ));
  }

  function renderInterests() { // Render interest options as checkboxes
    return interests.map((interest, index) => (
      <Form.Check 
        key={index}
        type="checkbox"
        id={`interest${index}`}
        label={interest}
        checked={tags.includes(interest)}
        onChange={(e) => handleInterestChange(e, interest)}
      />
    ));
  }

  async function ModifyPassword(){ // Function to request password modification
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/user/requestPasswordModification', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      });

      const message = await response.text();

      if (!response.ok) {
        toast.error(message); // Display error message if request fails
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(message , { autoClose: 3000, pauseOnHover: false }); // Display success message
    } catch (error) {
      console.error('Error:', error); // Log any errors
    }
  }

  const handleInterestChange = (e, interest) => { // Function to handle interest selection
    if (e.target.checked) {
      setTags(prevTags => [...prevTags, interest]); // Add interest to selected interests
    } else {
      setTags(prevTags => prevTags.filter(tag => tag !== interest)); // Remove interest from selected interests
    }
  };

  const navigate = useNavigate(); // Navigation function

  const handleSubmit = async (event) => { // Function to handle form submission
    event.preventDefault();

    // Create an object with the current state values
    const updatedUser = {};
    if (prenom.trim()) updatedUser.prenom = prenom;
    if (nom.trim()) updatedUser.nom = nom;
    if (municipalite) updatedUser.municipalite = municipalite;
    if (tags.length > 0) updatedUser.tags = tags;

    const token = localStorage.getItem('token');

    try {
      // Send updatedUser to server to update the user in the database
      const response = await fetch('http://localhost:8080/user/updateUser', {
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
      localStorage.setItem('token', data.accessToken); // Update token in local storage

      toast.success('Modifications réussies!', { autoClose: 3000, pauseOnHover: false }); // Display success message
      setTimeout(() => {
        navigate('/menu'); // Navigate to /menu after a delay
      }, 4000);
    } catch (error) {
      console.error('Error:', error); // Log any errors
    }
  };

  useEffect(() => {
    const fetchProtectedRoute = async () => { // Fetch user data for modification
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/'); // Navigate to home page if token is not present
      } else {
        try {
          const response = await fetch('http://localhost:8080/user/protectedRoute', {
            method: 'GET',
            headers: {
              authorization: 'Bearer ' + token,
            },
          });

          console.log('response: ', response);
          if (response.status === 401) {
            navigate('/'); // Navigate to home page if unauthorized
          } else {
            const user = await response.json(); // Parse user data from response
            console.log('user: ', user);
            setPrenom(user.prenom); // Set first name
            setNom(user.nom); // Set last name
            setMunicipalite(user.municipalite); // Set municipality
            setTags(user.tags); // Set interests/tags
          }
        } catch (error) {
          console.error('Error:', error); // Log any errors
        }
      }
    };

    fetchProtectedRoute(); // Call fetchProtectedRoute function
  }, [navigate]); // Dependency array containing navigate function

  return (
    <div className="position-relative min-vh-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.9' }}>

    <div className="d-flex justify-content-center align-items-center">
      <div className="container">
        <ToastContainer />
        <h1 className="mb-4" style={{  color: 'white' }}>Modifier</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="prenom" className="form-label"style={{  color: 'white' }} > 
              Prénom
            </label>
            <input type="text" id="prenom" className="form-control" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="nom" className="form-label" style={{  color: 'white' }}>
              Nom de famille
            </label>
            <input type="text" id="nom" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="municipalite"style={{  color: 'white' }}>
              Municipalité:
            </label>
            <select
              value={municipalite}
              id="municipalite"
              name="municipalite"
              className="form-select"
              onChange={(e) => setMunicipalite(e.target.value)}
            >
              {renderMunicipalites()} {/* Render municipality options */}
            </select>
          </div>
          <div>
            <label >Intérêts:</label>
            <div>
              {renderInterests()} {/* Render interest options */}
            </div>
          </div>
          <button type="button"variant="light" className="m-2 btn-custom btn-hover-effect" onClick={ModifyPassword}> {/* Button to request password modification */}
            <span style={{ marginRight: '5px' }}>Demander la modification du mot de passe</span>
          </button>
          <div className="d-flex justify-content-between">
            <button type="button"variant="light" className="m-2 btn-custom btn-hover-effect" onClick={() => navigate("/menu")}> {/* Button to cancel */}
              <span style={{ marginRight: '5px' }}>Annuler</span>
              <XLg size={24} />
            </button>
            <button type="submit" variant="light" className="m-2 btn-custom btn-hover-effect"> {/* Button to submit form */}
              <span style={{ marginRight: '5px' }}>Modifier Mon Profil</span>
              <PersonGear size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default ModificationPage; // Export ModificationPage component
