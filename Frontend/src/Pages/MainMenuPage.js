import React, { useEffect, useState } from 'react'; // Importing necessary modules and components
import { useNavigate } from 'react-router-dom'; // Importing hook for navigation
import backgroundImage from '../Logo/V2030.png'; // Importing the background image

const MainMenuPage =  () => {
  const navigate = useNavigate(); // Navigation function
  const [prenom, setPrenom] = useState(null); // State for first name
  const [isLoading, setIsLoading] = useState(true); // State to track loading state

  useEffect(() => {
    
    const fetchProtectedRoute = async () => {
      const token = localStorage.getItem('token'); // Get token from local storage

      if (!token) { // If token is not present, navigate to home page
        navigate('/');
      } else {
        try {
          const response = await fetch('http://localhost:8080/user/protectedRoute', { // Fetch protected route from server
            method: 'GET',
            headers: {
              'authorization': 'Bearer ' + token, // Set authorization header with token
            }
          });

          console.log('prenom: ', response); // Log response
          if (response.status === 401){ // If unauthorized, navigate to home page
            navigate('/');
          } else if (!response.ok) { // If response is not okay, log error and navigate to home page
            console.error('Error:', await response.text());
            navigate('/');
          } else {
            const user = await response.json(); // Parse response as JSON
            console.log('prenom: ', user.prenom); // Log first name from response
            setPrenom(user.prenom); // Set first name state
            setIsLoading(false); // Set loading state to false
          }
        } catch (error) {
          console.error('Error:', error); // Log any errors
        }
      }
    };

    fetchProtectedRoute(); // Call fetchProtectedRoute function
  }, [navigate]); // Dependency array containing navigate function

  if (isLoading) { // If loading state is true, display loading message
    return <div>Loading...</div>;
  }

    return ( // Render main menu page
    <div className="position-relative min-vh-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.9' }}>

      <div className="container-fluid vh-100">
        <div className="d-flex justify-content-center align-items-start pt-5 m-5">
          <div className="container-md text-center">
            <h1 className="fs-4 mb-4 text-white">Bonjour {prenom}</h1> {/* Display greeting with first name */}
            <h1 className="fs-4 mb-4 text-white">Veuillez utiliser le menu situé en haut à droite pour accéder aux fonctionnalités du site</h1>

          </div>
        </div>
      </div>
    </div>
    );
  };

export default MainMenuPage; // Export MainMenuPage component
