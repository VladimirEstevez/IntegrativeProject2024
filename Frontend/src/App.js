// App.js
//import Bootstrap from 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { BoxArrowInRight, FilePerson } from "react-bootstrap-icons";
import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./Logo/V2030_sans.png"; // Importing the background image
import logoBlanc from "./Logo/Logo_blanc.png";
import "./App.css";

function App() {

  useEffect(() => {
    // Add the class when the component is mounted
    document.body.classList.add('no-padding');

    // Remove the class when the component is unmounted
    return () => {
      document.body.classList.remove('no-padding');
    };
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProtectedRoute = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/user/protectedRoute`,
          {
            method: "GET",
            headers: {
              authorization: "Bearer " + token,
            },
          }
        );

        if (response.status === 200) {
          navigate("/menu");
        } else {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };

    fetchProtectedRoute();
  }, [navigate]);

  return (

    <div className="d-flex " style={{ 
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
    <div
      className="h-100 d-flex align-items-center" 
      style={{
        backgroundImage: `url(${backgroundImage})`,
        minHeight: "100vh",
        width: "100vw",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        opacity: "0.9",
      }}
    >
      <div className="container-fluid pt-5 d-flex flex-column justify-content-center align-items-center">
        <div className="row  d-flex  justify-content-center text-light text-center">
          <p className="display-4">Bienvenue sur l’application Valcourt 2030</p>
          <p className="fs-4" >Connectez-vous avec notre communauté et explorez tout ce que notre organisation a à offrir! </p>
          <p className="fs-4">Pour commencer, créez un compte en cliquant sur le bouton "S'inscrire". </p>
          <p className="fs-4">Vous avez déjà un compte? Cliquez sur Connexion pour accéder à votre tableau de bord personnalisé.</p>
          <div
            style={{
              backgroundImage: `url(${logoBlanc})`,
              height: "33vh",
              width: "66vw",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
              opacity: "0.9",
            }}
          ></div>
        </div>
        <div className="row">
          <div className="d-flex justify-content-center align-self-start">
            <button onClick={() => navigate("/register")} className="btn btn-light m-2 btn-custom btn-hover-effect">
              <span style={{ marginRight: "5px", fontSize: "1.3em" }}>S'inscrire</span>
              <FilePerson size={28} />
            </button>
          </div>
          <div className="d-flex justify-content-center pb-5 mb-5 align-self-start">
            <button onClick={() => navigate("/login")} className="btn btn-light m-2 btn-custom btn-hover-effect ">
              <span style={{ marginRight: "5px", fontSize: "1.3em" }}>Se connecter</span>
              <BoxArrowInRight size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default App;
