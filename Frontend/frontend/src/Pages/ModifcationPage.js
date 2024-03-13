import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { PersonGear, XLg } from 'react-bootstrap-icons';

const ModificationPage = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [municipalite, setMunicipalite] = useState('');
  const [tags, setTags] = useState([]);



  const [interests, setInterests] = useState([]);

  const [municipalites, setMunicipalites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/data");
        const data = await response.json();
        setInterests(data.interests);
        setMunicipalites(data.municipalities);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchData();
  }, []);

  function renderMunicipalites() {
    return municipalites.map((municipalite, index) => (
      <option key={index} value={municipalite}>
        {municipalite}
      </option>
    ));
  }

  function renderInterests() {
    return interests.map((interest, index) => (
      <label
        htmlFor={`interest${index}`}
        style={{ marginBottom: "5px" }}
        key={index}
      >
        <input
          onChange={(e) => handleInterestChange(e, interest)}
          type="checkbox"
          id={`interest${index}`}
          name={`${interest}`}
          checked={tags.includes(interest)}
        />{" "}
        {interest}
      </label>
    ));
  }

  async function ModifyPassword(){
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
        toast.error(message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(message , { autoClose: 3000, pauseOnHover: false });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleInterestChange = (e, interest) => {
    if (e.target.checked) {
      setTags(prevTags => [...prevTags, interest]);
    } else {
      setTags(prevTags => prevTags.filter(tag => tag !== interest));
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
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
      console.log('WRONG TOKEN : ', data);
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
          const response = await fetch('http://localhost:8080/user/protectedRoute', {
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
            setTags(user.tags);
          
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
        {/* ROW */}
        <h1 className="mb-4">Modifier</h1>
        {/* ROW */}
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

          <div className="mb-3"          >
            <label htmlFor="municipalite" style={{ marginBottom: "5px" }}>
              Municipalité:
            </label>
            <select
            value={municipalite}
              id="municipalite"
              name="municipalite"
              className="form-select"
              onChange={(e) => setMunicipalite(e.target.value)}
            >
              {renderMunicipalites()}
            </select>
          </div>


          <div
            style={{ marginBottom: "20px", width: "100%", maxWidth: "400px" }}
          >
            <label style={{ marginBottom: "5px" }}>Intérêts:</label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "10px",
              }}
            >
              {renderInterests()}
            </div>
          </div>

            <button type="button" className="btn btn-primary mb-3"
              onClick={ModifyPassword}
              style={{ position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
              <span style={{ marginRight: '5px' }}>Demander la modification du mot de passe</span>
            </button>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-primary"
              onClick={() => navigate("/menu")}
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
