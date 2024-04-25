import React, { useState } from "react"; // Importing useState hook from React
import { toast, ToastContainer } from "react-toastify"; // Importing toast notifications
import { Form, Button } from 'react-bootstrap'; // Importing Form and Button components from react-bootstrap
import backgroundImage from '../Logo/V2030.png'; // Importing the background image


// Functional component for password modification page
function PasswordModificationPage() {
  // State variables for password, confirmPassword, and success status
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordChangeSuccessfull, setIsPasswordChangeSuccessfull] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Preventing default form submission behavior

    // Validation checks for password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;

    // Display error if password does not meet requirements
    if (!hasUpperCase || !hasNumber || !hasMinLength) {
      toast.error(
        "Le mot de passe doit comporter au moins 8 caractères, dont une lettre majuscule et un chiffre."
      );
      return;
    }

    // Validate password and confirmPassword
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas!");
      return;
    }

    // Extract token from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    // Send data to backend route for password modification
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/passwordModification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }), // Sending token and new password in JSON format
      });

      if (response.ok) {
        // Display success message if password modification is successful
        setIsPasswordChangeSuccessfull(true);
      } else {
        // Display error message if password is already modified
        toast.error("Le mot de passe est déjà modifié.")
      }
    } catch (error) {
      // Display error message if an error occurs during password modification
      return toast.error(
        "Une erreur s'est produite lors de la réinitialisation du mot de passe."
      );
    }
  };

  // Conditional rendering based on password modification success status
  if (isPasswordChangeSuccessfull) {
    // Render success message if password modification is successful
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Setting full viewport height
        }}
      >
        <h3>Modification du mot de passe réussie</h3>
      </div>
    );
  } else {
    // Render form if password modification is not yet successful
    return (
      <div className="position-relative min-vh-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.9' }}>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Setting full viewport height
        }}
      >
        <ToastContainer /> {/* Toast notifications container */}
        <h1 className="m-4 text-center" style={{ color: 'white' }}>Modification du mot de passe</h1> {/* Heading */}
        <Form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          {/* Password input */}
          <Form.Control
            type="password"
            id="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="my-3"
          />
          {/* Confirm password input */}
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="my-3"
          />
          {/* Submit button */}
          <div className="d-flex justify-content-center align-items-center my-3">
            <Button
              type="submit"
              variant="light"
              className="m-2 btn-custom"
              style={{
                borderRadius: "10px",
                cursor: "pointer",
                transition: "transform 0.3s", // Adding transition effect
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)"; // Scaling effect on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"; // Reverting scale effect on hover out
              }}
            >
              Confirmer
            </Button>
          </div>
        </Form>
      </div>
      </div>
    );
  }
}

export default PasswordModificationPage; // Exporting PasswordModificationPage component
