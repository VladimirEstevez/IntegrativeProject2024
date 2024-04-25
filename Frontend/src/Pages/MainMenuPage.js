import React, { useEffect, useState } from "react"; // Importing necessary modules and components
import { useNavigate } from "react-router-dom"; // Importing hook for navigation

const MainMenuPage = () => {
  const navigate = useNavigate(); // Navigation function
  const [prenom, setPrenom] = useState(null); // State for first name
  const [isLoading, setIsLoading] = useState(true); // State to track loading state

  useEffect(() => {
    async function fetchProtectedRoute() {
      const token = localStorage.getItem("token"); // Get token from local storage
      try {
        const response = await fetch(
          "http://localhost:8080/user/protectedRoute",
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

  return (
    // Render main menu page
    <div className="container-fluid vh-100">
      <div className="d-flex justify-content-center align-items-start pt-5 m-5">
        <div className="container-md text-center">
          <h1 className="fs-4 mb-4">Bonjour {prenom}</h1>{" "}
          {/* Display greeting with first name */}
        </div>
      </div>
    </div>
  );
};

export default MainMenuPage; // Export MainMenuPage component
