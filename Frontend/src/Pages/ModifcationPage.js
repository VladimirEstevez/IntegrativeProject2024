import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
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
    <Container>
      <ToastContainer />
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col xs={12} md={8} lg={6}>
          <div className="bg-white rounded p-4 mt-5">
            <h1 className="mb-4">Modifier</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Prénom</Form.Label>
                <Form.Control type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nom de famille</Form.Label>
                <Form.Control type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Municipalité:</Form.Label>
                <Form.Select value={municipalite} onChange={(e) => setMunicipalite(e.target.value)}>
                  <option value="">Choisir...</option>
                  {renderMunicipalites()}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Intérêts:</Form.Label>
                {renderInterests()}
              </Form.Group>
              <Button variant="light" className="m-2 btn-custom btn-hover-effect" onClick={ModifyPassword} >
                Demander la modification du mot de passe
              </Button>
              <div className="d-grid gap-2">
                <Button variant="light" className="m-2 btn-custom btn-hover-effect" onClick={() => navigate("/menu")}>
                  Annuler
                  <XLg size={24} />
                </Button>
                <Button variant="light" className="m-2 btn-custom btn-hover-effect" type="submit">
                  Modifier Mon Profil
                  <PersonGear size={24} />
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ModificationPage;
