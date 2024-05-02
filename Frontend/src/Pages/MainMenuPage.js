import React, { useEffect, useState } from 'react'; // Importing necessary modules and components
import { useNavigate } from 'react-router-dom'; // Importing hook for navigation
import backgroundImage from '../Logo/V2030.png'; // Importing the background i

const MainMenuPage = () => {
  const navigate = useNavigate(); // Navigation function
  const [prenom, setPrenom] = useState(null); // State for first name
  const [isLoading, setIsLoading] = useState(true); // State to track loading state

  useEffect(() => {
    async function fetchProtectedRoute() {
      const token = localStorage.getItem("token"); // Get token from local storage
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/user/protectedRoute`,
          {
            method: "GET",
            headers: {
              authorization: "Bearer " + token,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/");
        }

        const user = await response.json(); // Parse response as JSON
        setPrenom(user.prenom); // Set first name state
        setIsLoading(false); // Set loading state to false
      } catch (error) {
        console.error("A problem occurred when fetching the data.");
      }
    }
    fetchProtectedRoute(); // Call fetchProtectedRoute function
  }, [navigate]); // Dependency array containing navigate function

  if (isLoading) {
    // If loading state is true, display loading message
    return <div>Loading...</div>;
  }
  
    return ( // Render main menu page
    <div className="" style={{ background: "linear-gradient(to bottom, #007bff, #B9D56D)", backgroundSize: 'auto', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      <div
        className=""
        style={{
          backgroundImage: `url(${backgroundImage})`,
          height: "100vh",
          width: "100vw",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          opacity: "0.9",
        }}
      >

      <div className="container-fluid vh-100">
        <div className="d-flex justify-content-center align-items-start ">
          <div className="container-md text-center text-white">
            <h1 className="fs-4 mt-4 text-white">Bonjour {prenom}. On est content de vous revoir!</h1>
<p className="fs-4">Explorez les événements, connectez-vous avec les autres et restez impliqué dans Valcourt2030 !</p>
<p className="fs-4">Voici ce que vous pouvez faire sur votre page principale:</p>
<ul className="fs-5 " style={{textAlign: "left"}}>
  <li>Découvrez les événements locaux: parcourez les activités à venir par vos balises personnalisées ou par date pour trouver des événements qui vous intéressent.</li>
  <li>Restez organisé: consultez vos activités enregistrées sur votre propre page dédiée.</li>
  <li>Connectez-vous avec les autres: rencontrez de nouvelles personnes et établissez des relations avec vos voisins en participant à des événements.</li>
  <li>Informez-vous : restez à jour sur les dernières nouvelles et événements au sein de la communauté de Valcourt.</li>
</ul>
          </div>
        </div>
      </div>
    </div>
    </div>
    );
  };

export default MainMenuPage; // Export MainMenuPage component
