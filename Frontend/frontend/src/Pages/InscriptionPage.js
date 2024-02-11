// InscriptionPage.js
import React, {useState} from 'react';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InscriptionPage() {


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


    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmPassword = form.confirmerMotDePasse;
    const password = form.motDePasse;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;
  
    if (!hasUpperCase || !hasNumber || !hasMinLength) {
      toast.error('Password must be at least 8 characters, include an uppercase letter and a number.');
      return;
    }
  
    
  if (password !== confirmPassword) {
    toast.error('Passwords do not match.');
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
    toast.error(data.message);
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
      const data = await response.json();
      console.log(data);
      toast.success('You have been successfully registered!');
      // Handle successful form submission here
    } else {
      toast.error('Error:', response.status);
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
          <label htmlFor="confirmerMotDePasse" style={{ marginBottom: '5px' }}>Confirmer:</label>
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
        </div>
        <button type="submit" style={{ borderRadius: '5px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', width: '100%', maxWidth: '400px' }}>S'inscrire</button>
      </form>
    </div></div>
  );
}

export default InscriptionPage;
