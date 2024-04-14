import React, { useState } from "react"; // Importing React and useState hook
import { Navbar, Nav } from "react-bootstrap"; // Importing Navbar and Nav components from react-bootstrap
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook from react-router-dom
import {
  BookmarkHeart,
  BoxArrowInLeft,
  PersonGear,
  PersonWalking,
} from "react-bootstrap-icons"; // Importing icons from react-bootstrap-icons

// Functional component for Navbar
function NavbarComponent() {
  const navigate = useNavigate(); // Accessing navigate function from react-router-dom
  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // State variable for Navbar toggle

  // Function to handle logout
  function SeDeconnecter() {
    //Remove the token from localStorage
    localStorage.removeItem("token");
    //Navigate to the main page
    navigate("/");
  }

  // Rendering Navbar component
  return (
    <div>
      <Navbar
        style={{
          backgroundColor: isNavbarOpen ? "white" : "transparent",
          zIndex: 1000,
        }}
        expand="lg"
        className="position-absolute top-0 end-0"
      >
        <Navbar.Toggle
          onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {/* Link to view user's activities */}
            <Nav.Link onClick={() => navigate("/myActivities")}>
              <span style={{ marginRight: "5px" }}>Voir mes activités</span>
              <BookmarkHeart size={24} />
            </Nav.Link>
            {/* Link to view all activities */}
            <Nav.Link onClick={() => navigate("/activities")}>
              <span style={{ marginRight: "5px" }}>Voir les activités</span>
              <PersonWalking size={24} />
            </Nav.Link>
            {/* Link to modify user's profile */}
            <Nav.Link onClick={() => navigate("/modify")}>
              <span style={{ marginRight: "5px" }}>Modifier Mon Profil</span>
              <PersonGear size={24} />
            </Nav.Link>
            {/* Button to logout */}
            <Nav.Link onClick={() => SeDeconnecter()}>
              <span style={{ marginRight: "5px" }}>Se Déconnecter</span>
              <BoxArrowInLeft size={24} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavbarComponent; // Exporting NavbarComponent
