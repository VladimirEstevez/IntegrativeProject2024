import React, { useState, useEffect } from 'react'; // Importing necessary modules and components
import { Button, Form, Container, Row, Col } from 'react-bootstrap'; // Importing Bootstrap components
import { BoxArrowInRight, XLg, BoxArrowUpRight } from 'react-bootstrap-icons'; // Importing icons
import { toast, ToastContainer } from 'react-toastify'; // Importing toast notification components
import 'react-toastify/dist/ReactToastify.css'; // Importing toast notification CSS
import { useNavigate } from 'react-router-dom'; // Importing hook for navigation
import backgroundImage from '../Logo/V2030.png'; // Importing the background image


function ConnectionPage() {
  // State for form fields
  const [form, setForm] = useState({
    courriel: '',
    motDePasse: '',
  });

  const navigate = useNavigate(); // Navigation function

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("WTF", form);

    console.log(`${process.env.REACT_APP_SERVER_URL}`)
    // Send login request to server
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    // Handle server response
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.accessToken);

      // Show success toast notification
      toast.success('Connexion réussie!', { autoClose: 3000, pauseOnHover: false });

      // Navigate to /menu after a delay
      setTimeout(() => {
        navigate('/menu');
      }, 4000);
    } else {
      // Show error toast notification
      const data = await response.json();
      toast.error(data.message, { autoClose: 3000, pauseOnHover: false });
    }
  };

  // Check if user is already authenticated on component mount
  useEffect(() => {
    console.log(`${process.env.REACT_APP_SERVER_URL}`)
    const fetchProtectedRoute = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/protectedRoute`, {
            method: 'GET',
            headers: {
              authorization: 'Bearer ' + token,
            },
          });

          if (response.status === 401) {
            // Remove token from localStorage and redirect to login page if unauthorized
            localStorage.removeItem('token');
            navigate('/');
          } else {
            // Redirect to /menu if user is authenticated
            navigate('/menu');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    
    fetchProtectedRoute(); // Call function to check authentication status
  }, [navigate]);

  // Render login form
  return (
    <div className="position-relative min-vh-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.9' }}>

    <Container>
      <ToastContainer /> {/* Container for toast notifications */}
      <Row className="justify-content-center align-items-center">
        <Col xs={12} md={6}>
          <h1 className="text-center" style={{ color: 'white' }}>Connexion</h1>
          <Form onSubmit={handleSubmit}> {/* Form for login */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'white' }}>Adresse Courriel:</Form.Label>
              <Form.Control type="email" onChange={e => setForm({ ...form, courriel: e.target.value })} /> {/* Email input */}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'white' }}>Mot de Passe:</Form.Label>
              <Form.Control type="password" onChange={e => setForm({ ...form, motDePasse: e.target.value })} /> {/* Password input */}
            </Form.Group>
            <div className="d-grid gap-2">
              {/* Buttons for login, cancel, and forgot password */}
              <Button variant="light" style={{ color: 'white' }} className="m-2 btn-custom btn-hover-effect" type="button" onClick={() => navigate("/")}>
                Annuler
                <XLg size={24} />
              </Button>
              <Button variant="light" style={{ color: 'white' }} className="m-2 btn-custom btn-hover-effect" type="submit">
                Se Connecter
                <BoxArrowInRight size={24} />
              </Button>
              <Button variant="light" style={{ color: 'white' }} className="m-2 btn-custom btn-hover-effect" onClick={() => navigate("/forgotPassword")}>
                Mot de passe oublié?
                <BoxArrowUpRight size={24} />
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  </div>
  );
}

export default ConnectionPage; // Exporting ConnectionPage component
