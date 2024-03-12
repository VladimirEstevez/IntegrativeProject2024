import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { XLg, BoxArrowUpRight } from 'react-bootstrap-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';



function PasswordPage() {
  const [form, setForm] = useState({
    courriel: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (!emailRegex.test(form.courriel)) {
      toast.error('Format d\'email invalide', { autoClose: 3000, pauseOnHover: false });
      return;
    }

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

    const response = await fetch('http://localhost:8080/user/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      // Get the input element by its ID
      const emailInput = document.getElementById('email');

      // Clear the input field value
      emailInput.value = '';

      //Display a toast saying "Vérifiez votre courriel pour réinitialiser votre mot de passe"
      toast.success("Vérifiez votre courriel pour réinitialiser votre mot de passe", { autoClose: 3000, pauseOnHover: false });
      setTimeout(() => {
        navigate('/login');  // Navigate to /login after a delay
      }, 4000);
    } else {
      const data = await response.json();
      toast.error(data.message, { autoClose: 3000, pauseOnHover: false });
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: 'white' }}>
        <div className="text-center">
          <h1>Mot de passe oublié</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Adresse Courriel:</label>
              <input type="email" className="form-control" id="email" onChange={e => setForm({ ...form, courriel: e.target.value })} name="email" />
            </div>
            <div className="d-flex justify-content-between">
              <button type="button" onClick={() => navigate("/")} className="btn btn-primary btn-margin-right">
                <span>Annuler</span>
                <XLg size={24} />
              </button>
              <button type="submit" className="btn btn-primary">
                <span>Confirmer</span>
                <BoxArrowUpRight size={24} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordPage;
