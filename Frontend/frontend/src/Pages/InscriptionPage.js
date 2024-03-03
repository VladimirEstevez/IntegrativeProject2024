// InscriptionPage.js
import React, {useEffect, useState} from 'react';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FilePerson, XLg } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/inscription.css';


function InscriptionPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    courriel: '',
    motDePasse: '',
    confirmerMotDePasse: '',
    municipalite: '',
    interet1: false,
    interet2: false,
    // Add other form fields here
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (!emailRegex.test(form.courriel)) {
      toast.error('Format d\'email invalide', { autoClose: 3000, pauseOnHover: false });
      return;
    }
   

    const confirmPassword = form.confirmerMotDePasse;
    const password = form.motDePasse;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;
  

    
    if (!hasUpperCase || !hasNumber || !hasMinLength) {
      toast.error('Le mot de passe doit comporter au moins 8 caractères, dont une lettre majuscule et un chiffre.');
      return;
    }
  
    
  if (password !== confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas.',  { autoClose: 3000, pauseOnHover: false });
    return;
  }
  
  
  delete form.confirmerMotDePasse;


  
  const emailResponse = await fetch('http://localhost:8080/register/verifyEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courriel: form.courriel }),
  });

  if (!emailResponse.ok) {
    const data = await emailResponse.json();
    toast.error(data.message, { autoClose: 3000, pauseOnHover: false });
    return;
  }



    const response = await fetch('http://localhost:8080/register/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {

      //const data = await response.json();
      //console.log('data: ', data);
      //localStorage.setItem('prenom', data.user.prenom);

      toast.success('Votre utilisateur a été créé avec succès!',  { autoClose: 3000, pauseOnHover: false  });
      setTimeout(() => {
        navigate('/');
        alert('PLEASE CONFIRM YOUR EMAIL VERIFICATION BEFORE LOGGING IN FOR THE FIRST TIME');
          // Navigate to /menu after a delay
      }, 4000);
      // Handle successful form submission here
    } else {
      toast.error('Error:', response.status , { autoClose: 3000, pauseOnHover: false });
      // Handle error here
    }
  };

  useEffect(() => {
    const fetchProtectedRoute = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await fetch('http://localhost:8080/protectedRoute', {
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
    <div className="container">
    <ToastContainer />
    <div className="form-container">
      <h1 className="form-title">Inscription</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-input">
          <label htmlFor="courriel" className="form-label">Courriel:</label>
          <input type="email" id="courriel" name="courriel"  onChange={handleChange} className="input-field" />
        </div>
        <div className="form-input">
          <label htmlFor="prenom" className="form-label">Prénom:</label>
          <input type="text" id="prenom" name="prenom"  onChange={handleChange} className="input-field" />
        </div>
        <div className="form-input">
          <label htmlFor="nom" className="form-label">Nom de famille:</label>
          <input type="text" id="nom" name="nom"  onChange={handleChange} className="input-field" />
        </div>
        <div className="form-input">
          <label htmlFor="motDePasse" className="form-label">Mot de passe:</label>
          <input type="password" id="motDePasse"  onChange={handleChange} name="motDePasse" className="input-field" />
        </div>
        <div className="form-input">
          <label htmlFor="confirmerMotDePasse" className="form-label">Confirmer le mot de passe:</label>
          <input type="password" id="confirmerMotDePasse" onChange={handleChange} name="confirmerMotDePasse" className="input-field" />
        </div>
        <div className="form-input">
          <label htmlFor="municipalite" className="form-label">Municipalité:</label>
          <select id="municipalite" name="municipalite"  onChange={handleChange} className="input-field">
            <option value="ville1"> Valcourt </option>
            <option value="ville2">Racine</option>
            <option value="ville3">Bonsecours </option>
          </select>
        </div>
        <div className="form-input">
          <label className="form-label">Intérêts:</label>
          <div className="interests">
            <label htmlFor="interet1" className="interest"><input  onChange={handleChange} type="checkbox" id="interet1" name="interet1" /> Familiale</label>
            <label htmlFor="interet2" className="interest"><input  onChange={handleChange} type="checkbox" id="interet2" name="interet2" /> Plein air</label>
          </div>
        </div >
        <div className="button-container">
         
          <button 
  onClick={() => navigate("/")}  
  className="btn cancel-button btn-light  m-2 btn-custom btn-hover-effect">
            <span className="button-text">Annuler</span>
            <XLg size={24} />
          </button> 
          <button type="submit" 
  onClick={() => navigate("/login")}  
  className="btn btn-light  m-2 btn-custom submit-button btn-hover-effect">
            <span className="button-text">S'inscrire</span>
            <FilePerson size={24} />
          </button>
        </div>
      </form>
    </div>
</div>
  );
}

export default InscriptionPage;
