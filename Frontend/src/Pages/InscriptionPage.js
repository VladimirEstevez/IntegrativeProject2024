import React, { useState, useEffect } from "react"; // Importing necessary modules and components
import 'bootstrap/dist/css/bootstrap.css'; // Importing Bootstrap CSS
import { toast, ToastContainer } from "react-toastify"; // Importing toast notification components
import "react-toastify/dist/ReactToastify.css"; // Importing toast notification CSS
import { FilePerson, XLg } from "react-bootstrap-icons"; // Importing icons
import { Container, Form, Button, Row, Col } from 'react-bootstrap'; // Importing Bootstrap components
import { useNavigate } from "react-router-dom"; // Importing hook for navigation
import backgroundImage from '../Logo/V2030.png'; // Importing the background image

function InscriptionPage() {
  const navigate = useNavigate(); // Navigation function

  // State for form fields and tags
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    courriel: "",
    motDePasse: "",
    confirmerMotDePasse: "",
    municipalite: "",
    tags: [],
  });

  const [tags, setTags] = useState([]); // State for tags
  const [municipalites, setMunicipalites] = useState([]); // State for municipalities
  const [interests, setInterests] = useState([]); // State for interests
  const [consent, setConsent] = useState(false); // State for consent checkbox

  // Fetch data from the server on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/data");
        const data = await response.json();
        //console.log('Fetched data:', data);
        setInterests(data.interests); // Set interests from fetched data
        setMunicipalites(data.municipalities); // Set municipalities from fetched data
        //console.log('Tags state after fetch:', tags); // Log tags state after fetch (won't be updated immediately)
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchData();
  }, [tags]); // Fetch data when tags state changes

  // Render interests checkboxes
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

  // Render municipality options
  function renderMunicipalites() {
    return municipalites.map((municipalite, index) => (
      <option key={index} value={municipalite}>
        {municipalite}
      </option>
    ));
  }

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setConsent(checked); // Update consent state
    } else if (name === 'tags') {
      const selectedTags = Array.from(event.target.selectedOptions, option => option.value);
      setForm({
        ...form,
        interests: selectedTags,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  // Handle interest checkbox changes
  const handleInterestChange = (e, interest) => {
    if (e.target.checked) {
      setTags(prevTags => [...prevTags, interest]);
    } else {
      setTags(prevTags => prevTags.filter(tag => tag !== interest));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Copy form state to avoid mutating it
    const finalForm = { ...form };
    finalForm.tags = tags; // Set interests from tags

    if (!consent) { // Check if consent checkbox is checked
      toast.error("Vous devez consentir pour vous inscrire", {
        autoClose: 3000,
        pauseOnHover: false,
      });
      return;
    }

    // Regular expression to validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    // Validate email format
    if (!emailRegex.test(form.courriel)) {
      toast.error("Format d'email invalide", {
        autoClose: 3000,
        pauseOnHover: false,
      });
      return;
    }

    // Validate password strength
    const confirmPassword = form.confirmerMotDePasse;
    const password = form.motDePasse;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;

    if (!hasUpperCase || !hasNumber || !hasMinLength) {
      toast.error(
        "Le mot de passe doit comporter au moins 8 caractères, dont une lettre majuscule et un chiffre."
      );
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.", {
        autoClose: 3000,
        pauseOnHover: false,
      });
      return;
    }

    // Remove confirmMotDePasse field from finalForm
    delete finalForm.confirmerMotDePasse;

    // Send email verification request to server
    const emailResponse = await fetch(
      "http://localhost:8080/register/verifyEmail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courriel: form.courriel }),
      }
    );

    // Handle email verification response
    if (!emailResponse.ok) {
      const data = await emailResponse.json();
      toast.error(data.message, { autoClose: 3000, pauseOnHover: false });
      return;
    }

    // Send registration request to server
    const response = await fetch("http://localhost:8080/register/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalForm),
    });

    // Handle registration response
    if (response.ok) {
      toast.success("Votre utilisateur a été créé avec succès!", {
        autoClose: 3000,
        pauseOnHover: false,
      });
      setTimeout(() => {
        navigate("/");
        alert(
          "Veuillez vérifier votre courriel pour activer votre compte!"
        );
      }, 4000);
    } else {
      toast.error("Error:", response.status, {
        autoClose: 3000,
        pauseOnHover: false,
      });
    }
  };

  return (
    <div className="position-relative min-vh-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.9' }}>
      <Container>
        <ToastContainer />
        <Row className="justify-content-center align-items-center">
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <h1 style={{  color: 'white' }}>Inscription</h1>
              <Form.Group controlId="consent">
                <Form.Check 
                  type="checkbox"
                  label="Consentez-vous à la politique de la loi 25?"
                  onChange={handleChange}
                  checked={consent}
                  style={{  color: 'white' }}
                />
              </Form.Group>
              <Button 
                variant="light" 
                className="m-2 btn-custom btn-hover-effect"
                onClick={() => window.open("https://valcourt2030.org/politique-de-confidentialite/", '_blank')}
              >
                Pour plus d'information
              </Button>
              <Form.Group controlId="courriel">
                <Form.Label style={{ color: 'white' }}>Courriel:</Form.Label>
                <Form.Control type="email" name="courriel" onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="prenom">
                <Form.Label style={{ color: 'white' }}>Prénom:</Form.Label>
                <Form.Control type="text" name="prenom" onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="nom">
                <Form.Label style={{  color: 'white' }}>Nom de famille:</Form.Label>
                <Form.Control type="text" name="nom" onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="motDePasse">
                <Form.Label style={{  color: 'white' }}>Mot de passe:</Form.Label>
                <Form.Control type="password" name="motDePasse" onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="confirmerMotDePasse">
                <Form.Label style={{  color: 'white' }}>Confirmer le mot de passe:</Form.Label>
                <Form.Control type="password" name="confirmerMotDePasse" onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="municipalite">
                <Form.Label style={{  color: 'white' }}>Municipalité:</Form.Label>
                <Form.Control as="select" name="municipalite" onChange={handleChange}>
                  {renderMunicipalites()}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{  color: 'white' }}>Intérêts:</Form.Label>
                {renderInterests()}
              </Form.Group>
              <div className="d-flex justify-content-between">
                <Button variant="light" className="m-2 btn-custom btn-hover-effect" onClick={() => navigate("/")}>
                  <span>Annuler</span>
                  <XLg size={24} />
                </Button>
                <Button type="submit" variant="light" className="m-2 btn-custom btn-hover-effect">
                  <span>S'inscrire</span>
                  <FilePerson size={24} />
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}


export default InscriptionPage; // Exporting InscriptionPage component
