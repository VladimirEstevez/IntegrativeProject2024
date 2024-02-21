// InscriptionPage.js
import React, {useState} from 'react';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FilePerson, XLg } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

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


  
  const emailResponse = await fetch('http://localhost:8080/verifyEmail', {
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



    const response = await fetch('http://localhost:8080/subscribe', {
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

  
  return (
    <div><ToastContainer />
    <div style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '20px' }}>Inscription</h1>
      <form onSubmit={handleSubmit} style={{ width: '50%', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label htmlFor="courriel" style={{ marginBottom: '5px' }}>Courriel:</label>
          <input type="email" id="courriel" name="courriel"  onChange={handleChange} style={{ borderRadius: '5px', padding: '5px', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label htmlFor="prenom" style={{ marginBottom: '5px' }}>Prénom:</label>
          <input type="text" id="prenom" name="prenom"  onChange={handleChange} style={{ borderRadius: '5px', padding: '5px', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label htmlFor="nom" style={{ marginBottom: '5px' }}>Nom de famille:</label>
          <input type="text" id="nom" name="nom"  onChange={handleChange} style={{ borderRadius: '5px', padding: '5px', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label htmlFor="motDePasse" style={{ marginBottom: '5px' }}>Mot de passe:</label>
          <input type="password" id="motDePasse"  onChange={handleChange} name="motDePasse" style={{ borderRadius: '5px', padding: '5px', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label htmlFor="confirmerMotDePasse" style={{ marginBottom: '5px' }}>Confirmer le mot de passe:</label>
          <input type="password" id="confirmerMotDePasse" onChange={handleChange} name="confirmerMotDePasse" style={{ borderRadius: '5px', padding: '5px', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label htmlFor="municipalite" style={{ marginBottom: '5px' }}>Municipalité:</label>
          <select id="municipalite" name="municipalite"  onChange={handleChange} style={{ borderRadius: '5px', padding: '5px', width: '100%' }}>
            <option value="ville1">Ville 1</option>
            <option value="ville2">Ville 2</option>
            <option value="ville3">Ville 3</option>
          </select>
        </div>
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
          <label style={{ marginBottom: '5px' }}>Intérêts:</label>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <label htmlFor="interet1" style={{ marginBottom: '5px' }}><input  onChange={handleChange} type="checkbox" id="interet1" name="interet1" /> Intérêt 1</label>
            <label htmlFor="interet2" style={{ marginBottom: '5px' }}><input  onChange={handleChange} type="checkbox" id="interet2" name="interet2" /> Intérêt 2</label>
          </div>
        </div >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
  <button 
    type="button" 
    onClick={() => navigate("/")} 
    style={{ 
      backgroundColor: 'blue', 
      color: 'white', 
      padding: '10px 20px', 
      borderRadius: '5px', 
      border: 'none', 
      cursor: 'pointer',
      transition: 'transform 0.3s', // Add transition
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }} // Add onMouseEnter
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
      <span style={{ marginRight: '5px' }}>Annuler</span>
        <XLg size={24} />
    </button>
  
  <button 
    type="submit" 
    style={{ 
      backgroundColor: 'blue', 
      color: 'white', 
      padding: '10px 20px', 
      borderRadius: '5px', 
      border: 'none', 
      cursor: 'pointer',  
      marginLeft: '10px', 
      transition: 'transform 0.3s', // Add transition
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }} // Add onMouseEnter
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
      <span style={{ marginRight: '5px' }}>S'inscrire</span>
        <FilePerson size={24} />
    </button>
    </div>
      </form>
    </div></div>
  );
}

export default InscriptionPage;
