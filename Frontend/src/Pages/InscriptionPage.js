import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FilePerson, XLg } from "react-bootstrap-icons";
import { Container, Form, Button, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import { useNavigate } from "react-router-dom";


function InscriptionPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedRoute = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch(
            "http://localhost:8080/user/protectedRoute",
            {
              method: "GET",
              headers: {
                authorization: "Bearer " + token,
              },
            }
          );

          console.log("response: ", response);
          if (response.status === 401) {
            localStorage.removeItem("token"); // Corrected typo
            navigate("/");
          } else {
            const user = await response.json();
            console.log("user: ", user);
            navigate("/menu");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchProtectedRoute();
  }, [navigate]);

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    courriel: "",
    motDePasse: "",
    confirmerMotDePasse: "",
    municipalite: "",
    interests: [],
  });

  const [tags, setTags] = useState([]);
  const [municipalites, setMunicipalites] = useState([]);

  function renderMunicipalites() {
    return municipalites.map((municipalite, index) => (
      <option key={index} value={municipalite}>
        {municipalite}
      </option>
    ));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/data");
        const data = await response.json();
        console.log('Fetched data:', data);
        setTags(data.interests);
        setMunicipalites(data.municipalities);
        console.log('Tags state after fetch:', tags);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchData();
  }, [tags]);

  const handleChange = (event) => {
    if (event.target.name === 'tags') {
      const selectedTags = Array.from(event.target.selectedOptions, option => option.value);
      setForm({
        ...form,
        tags: selectedTags,
      });
    } else {
      setForm({
        ...form,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalForm = { ...form };
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (!emailRegex.test(form.courriel)) {
      toast.error("Format d'email invalide", {
        autoClose: 3000,
        pauseOnHover: false,
      });
      return;
    }

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

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.", {
        autoClose: 3000,
        pauseOnHover: false,
      });
      return;
    }

    delete finalForm.confirmerMotDePasse;

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

    if (!emailResponse.ok) {
      const data = await emailResponse.json();
      toast.error(data.message, { autoClose: 3000, pauseOnHover: false });
      return;
    }
    const response = await fetch("http://localhost:8080/register/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalForm),
    });

    if (response.ok) {
      toast.success("Votre utilisateur a été créé avec succès!", {
        autoClose: 3000,
        pauseOnHover: false,
      });
      setTimeout(() => {
        navigate("/");
        alert(
          "PLEASE CONFIRM YOUR EMAIL VERIFICATION BEFORE LOGGING IN FOR THE FIRST TIME"
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
    <Container style={{ minHeight: "100vh" }}>
      <ToastContainer />
      <Row className="justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <h1 style={{marginTop: 0}}>Inscription</h1>
            <Form.Group controlId="courriel">
              <Form.Label>Courriel:</Form.Label>
              <Form.Control type="email" name="courriel" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="prenom">
              <Form.Label>Prénom:</Form.Label>
              <Form.Control type="text" name="prenom" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="nom">
              <Form.Label>Nom de famille:</Form.Label>
              <Form.Control type="text" name="nom" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="motDePasse">
              <Form.Label>Mot de passe:</Form.Label>
              <Form.Control type="password" name="motDePasse" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="confirmerMotDePasse">
              <Form.Label>Confirmer le mot de passe:</Form.Label>
              <Form.Control type="password" name="confirmerMotDePasse" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="municipalite">
              <Form.Label>Municipalité:</Form.Label>
              <Form.Control as="select" name="municipalite" onChange={handleChange}>
                {renderMunicipalites()}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="tags">
              <Form.Label>Intérêts:</Form.Label>
              <Form.Control as="select" name="tags" value={form.tags} onChange={handleChange} multiple>
                {tags && tags.map((tag, index) => (
                  <option key={index} value={tag}>{tag}</option>
                ))}
              </Form.Control>
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
  );
}

export default InscriptionPage;
