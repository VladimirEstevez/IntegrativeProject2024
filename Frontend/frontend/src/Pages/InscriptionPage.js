import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FilePerson, XLg } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import '../css/inscription.css'; // Import the CSS file

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
            localStorage.deleteItem("token");
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

  const [tags, setTags] = useState([]);
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    courriel: "",
    motDePasse: "",
    confirmerMotDePasse: "",
    municipalite: "",
  });

  const interests = [
    "Arts",
    "Cuisine",
    "Concertation et partenariats",
    "Développement local",
    "Éducation",
    "Environnement",
    "Entrepreneuriat",
    "Formation",
    "Implication citoyenne",
    "Interculturel",
    "Intergénérationnel",
    "Musique",
    "Rencontre sociale",
    "Sports et plein air",
  ];

  const municipalites = [
    "Valcourt",
    "Canton de Valcourt",
    "Bonsecours",
    "Lawrenceville",
    "Maricourt",
    "Racine",
    "Sainte-Anne-de-la-Rochelle",
    "MRC du Val-Saint-François",
    "Estrie",
    "Province de Québec",
    "Canada",
    "Autre",
  ];

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
          onChange={handleChange}
          type="checkbox"
          id={`interest${index}`}
          name={`${interest}`}
        />{" "}
        {interest}
      </label>
    ));
  }

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      if (e.target.checked) {
        setTags((prevTags) => [...prevTags, e.target.name]);
      } else {
        setTags((prevTags) => prevTags.filter((tag) => tag !== e.target.name));
      }
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalForm = {
      ...form,
      tags,
    };
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
        // Navigate to /menu after a delay
      }, 4000);
      // Handle successful form submission here
    } else {
      toast.error("Error:", response.status, {
        autoClose: 3000,
        pauseOnHover: false,
      });
      // Handle error here
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <h1>Inscription</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-input">
          <label htmlFor="courriel">Courriel:</label>
          <input
            type="email"
            id="courriel"
            name="courriel"
            onChange={handleChange}
          />
        </div>
        <div className="form-input">
          <label htmlFor="prenom">Prénom:</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            onChange={handleChange}
          />
        </div>
        <div className="form-input">
          <label htmlFor="nom">Nom de famille:</label>
          <input
            type="text"
            id="nom"
            name="nom"
            onChange={handleChange}
          />
        </div>
        <div className="form-input">
          <label htmlFor="motDePasse">Mot de passe:</label>
          <input
            type="password"
            id="motDePasse"
            name="motDePasse"
            onChange={handleChange}
          />
        </div>
        <div className="form-input">
          <label htmlFor="confirmerMotDePasse">Confirmer le mot de passe:</label>
          <input
            type="password"
            id="confirmerMotDePasse"
            name="confirmerMotDePasse"
            onChange={handleChange}
          />
        </div>
        <div className="form-input">
          <label htmlFor="municipalite">Municipalité:</label>
          <select
            id="municipalite"
            name="municipalite"
            onChange={handleChange}
          >
            {renderMunicipalites()}
          </select>
        </div>
        <div className="form-input interests-container">
          <label>Intérêts:</label>
          <div>
            {renderInterests()}
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
            <span>Annuler</span>
            <XLg size={24} />
          </button>
          <button type="submit" className="btn btn-primary">
            <span>S'inscrire</span>
            <FilePerson size={24} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default InscriptionPage;
