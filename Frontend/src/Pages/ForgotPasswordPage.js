import React, { useState } from "react"; // Importing necessary modules and components
import { Form, Button, InputGroup } from 'react-bootstrap'; // Importing Bootstrap components
import { XLg, BoxArrowUpRight } from "react-bootstrap-icons"; // Importing icons
import { toast, ToastContainer } from "react-toastify"; // Importing toast notification components
import "react-toastify/dist/ReactToastify.css"; // Importing toast notification CSS
import { useNavigate } from "react-router-dom"; // Importing hook for navigation
import backgroundImage from '../Logo/V2030.png'; // Importing the background image
import { useEffect } from "react"; // Importing useEffect hook

function ForgotPasswordPage() {
  useEffect(() => {
    // Add the class when the component is mounted
    document.body.classList.add('no-padding');

    // Remove the class when the component is unmounted
    return () => {
      document.body.classList.remove('no-padding');
    };
  }, []);
  // State for form field
  const [form, setForm] = useState({
    courriel: "",
  });

  const navigate = useNavigate(); // Navigation function

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // Send email verification request to server
    const emailResponse = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/user/verifyEmail`,
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

    // Send password reset request to server
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/requestPasswordReset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courriel: form.courriel }),
    });

    // Handle password reset response
    if (response.ok) {
      // Clear email input field
      const emailInput = document.getElementById("email");
      emailInput.value = "";

      // Show success toast notification
      const message = await response.text();
      toast.success(message, { autoClose: 3000, pauseOnHover: false });

      // Navigate to login page after a delay
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } else {
      // Show error toast notification
      const message = await response.text();
      toast.error(message, { autoClose: 3000, pauseOnHover: false });
    }
  };

  // Render forgot password form
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontSize: '1.3em', 
      background: `linear-gradient(to bottom, #007bff, #B9D56D)`, 
      backgroundSize: 'auto', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat', 
      minHeight: '100vh' 
    }}>

    <div>
      <ToastContainer /> {/* Container for toast notifications */}
      <div className="container-fluid d-flex justify-content-center align-items-center " style={{ height: "100vh" }}>
        <div className="text-center">
          <h1>Mot de passe oublié</h1>
          <Form onSubmit={handleSubmit}> {/* Form for forgot password */}
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Adresse Courriel:</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  onChange={(e) => setForm({ ...form, courriel: e.target.value })}
                  value={form.courriel}
                />
                <Button variant="light" type="button" onClick={() => navigate("/login")} className="btn-custom">
                  <span>Annuler</span>
                  <XLg size={24} />
                </Button>
              </InputGroup>
            </Form.Group>
            <Button variant="light" type="submit" className="m-2 btn-custom"> {/* Button to confirm password reset */}
              <span>Confirmer</span>
              <BoxArrowUpRight size={24} />
            </Button>
          </Form>
        </div>
      </div>
    </div>
  </div>
  );
}

export default ForgotPasswordPage; // Exporting ForgotPasswordPage component
