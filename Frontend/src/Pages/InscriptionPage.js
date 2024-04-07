import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FilePerson, XLg } from "react-bootstrap-icons";
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

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    courriel: "",
    motDePasse: "",
    confirmerMotDePasse: "",
    municipalite: "",
    interests: [], // Change to an array to store multiple interests
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
        console.log('Fetched data:', data); // Log the fetched data
        setTags(data.interests); // Assume the API returns a tags array
        setMunicipalites(data.municipalities); // Set the municipalities state with data.municipalities
        console.log('Tags state after fetch:', tags); // Log the tags state after fetch
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchData();
  }, [tags]);


  

  // Handle tags in the handleChange function
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
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>Inscription</h1>
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
        <div className="form-input">
          <label htmlFor="interests">Intérêts:</label>
          <select
            id="tags"
            name="tags"
            value={form.tags} // Bind the value to form state
            onChange={handleChange}
            className="basic-multi-select"
            classNamePrefix="select"
            multiple // Allow multiple selection
          >
            {/* Render options for tags */}
            {console.log('Rendering tags:', tags)} {/* Log the tags state during render */}
            {tags && tags.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-light m-2 btn-custom btn-hover-effect"
            onClick={() => navigate("/")}
          >
            <span>Annuler</span>
            <XLg size={24} />
          </button>
          <button
            type="submit"
            className="btn btn-light m-2 btn-custom btn-hover-effect"
          >
            <span>S'inscrire</span>
            <FilePerson size={24} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default InscriptionPage;
