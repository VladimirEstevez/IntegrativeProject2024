import React, { useState } from "react"; // Importing useState hook from React
import { toast, ToastContainer } from "react-toastify"; // Importing toast notifications
import backgroundImage from '../Logo/V2030.png'; // Importing the background image


// Functional component for password reset page
function ResetPasswordPage() {
  // State variables for password and confirmPassword
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    // Send data to backend route for password reset
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }), // Sending token and new password in JSON format
      });

      if (response.ok) {
        // Display success message if password reset is successful
        toast.success("Réinitialisation du mot de passe réussie.");
        // Redirect to home page
        window.location.href = "/";
      } else {
        // Display error message if password is already modified
        toast.error("Le mot de passe est déjà modifié.");
      }
    } catch (error) {
      // Display error message if an error occurs during password reset
      toast.error("Une erreur s'est produite lors de la réinitialisation du mot de passe.");
    }
  };

  // Render form for password reset
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
      <h1 className="m-4">Réinitialisation du mot de passe</h1> {/* Heading */}
      <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
        {/* Password input */}
        <input
          type="password"
          id="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-control my-3"
        />
        {/* Confirm password input */}
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="form-control my-3"
        />
        {/* Submit button */}
        <div className="d-flex justify-content-center align-items-center my-3">
          <button
            type="submit"
            style={{
              backgroundColor: "blue",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
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
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}

export default ResetPasswordPage; // Exporting ResetPasswordPage component
