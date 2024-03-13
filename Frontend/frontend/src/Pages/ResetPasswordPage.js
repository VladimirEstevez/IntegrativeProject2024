// ResetPassword.js
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetSuccessful, setIsResetSuccessfull] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;

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

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    // Send data to backend route for password reset
    try {
      const response = await fetch("http://localhost:8080/user/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        //Display success message
        setIsResetSuccessfull(true);
      } else {
        // Display success message to user
        return(
          toast.error("Le mot de passe est déjà modifié.")
        )
      }
    } catch (error) {
      // Display error message to user
      return(
        toast.error("Une erreur s'est produite lors de la réinitialisation du mot de passe.")
      )
    }
  };

  if (isResetSuccessful) {
    // If the password reset was successful, display a success message
    return(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // This assumes that the div takes up the full viewport height
        }}
      >
        <h3>Réinitialisation du mot de passe réussie</h3>
      </div>
    )
  } else {
    // If the password reset hasn't happened yet, display the form
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // This assumes that the div takes up the full viewport height
        }}
      >
        <ToastContainer />
        <h1 className="m-4">Réinitialisation du mot de passe</h1>
        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <input
            type="password"
            id="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control my-3"
          />
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-control my-3"
          />
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
                transition: "transform 0.3s", // Add transition
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }} // Add onMouseEnter
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ResetPasswordPage;
