import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { BoxArrowInRight, XLg, BoxArrowUpRight } from 'react-bootstrap-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function ConnectionPage() {
  const [form, setForm] = useState({
    courriel: '',
    motDePasse: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Token: ', data.accessToken);
      localStorage.setItem('token', data.accessToken);

      toast.success('Connexion réussie!', { autoClose: 3000, pauseOnHover: false });
      setTimeout(() => {
        navigate('/menu');  // Navigate to /menu after a delay
      }, 4000);
      // Handle successful login here
    } else {
      const data = await response.json();
      toast.error(data.message, { autoClose: 3000, pauseOnHover: false });
      // Handle error here
    }
  };

  useEffect(() => {
    const fetchProtectedRoute = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await fetch('http://localhost:8080/user/protectedRoute', {
            method: 'GET',
            headers: {
              authorization: 'Bearer ' + token,
            },
          });

          console.log('response: ', response);
          if (response.status === 401) {
            localStorage.deleteItem('token');
            navigate('/');
          } else {
            const user = await response.json();
            console.log('user: ', user);
            navigate('/menu');
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
      <Row className="justify-content-center align-items-center">
        <Col xs={12} md={6}>
          <h1 className="text-center">Connexion</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Adresse Courriel:</Form.Label>
              <Form.Control type="email" onChange={e => setForm({ ...form, courriel: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de Passe:</Form.Label>
              <Form.Control type="password" onChange={e => setForm({ ...form, motDePasse: e.target.value })} />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="light" className="m-2 btn-custom btn-hover-effect" type="button" onClick={() => navigate("/")}>
                Annuler
                <XLg size={24} />
              </Button>
              <Button variant="light" className="m-2 btn-custom btn-hover-effect" type="submit">
                Se Connecter
                <BoxArrowInRight size={24} />
              </Button>
              <Button variant="light" className="m-2 btn-custom btn-hover-effect" onClick={() => navigate("/forgotPassword")}>
                Mot de passe oublié?
                <BoxArrowUpRight size={24} />
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ConnectionPage;
