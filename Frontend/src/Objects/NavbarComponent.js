import React, { useState } from "react"; // Importing React and useState hook
import { Navbar, Nav } from "react-bootstrap"; // Importing Navbar and Nav components from react-bootstrap
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook from react-router-dom
import {
  BookmarkHeart,
  BoxArrowInLeft,
  PersonGear,
  PersonWalking,
} from "react-bootstrap-icons"; // Importing icons from react-bootstrap-icons
import { Link } from 'react-router-dom';

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
          backgroundColor: "white", 
          zIndex: 1000,
        }}
        expand="lg"
  fixed="top"
  className="d-flex justify-content-between align-items-start"
        
      >
        <div>
        <Navbar.Toggle
          onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {/* Link to view user's activities */}
            <Nav.Link className="mx-2" onClick={() => navigate("/myActivities")}>
  <span style={{ marginRight: "5px" }}>Voir mes activités</span>
  <BookmarkHeart size={24} />
</Nav.Link>
<Nav.Link className="mx-2" onClick={() => navigate("/activities")}>
  <span style={{ marginRight: "5px" }}>Voir les activités</span>
  <PersonWalking size={24} />
</Nav.Link>
<Nav.Link className="mx-2" onClick={() => navigate("/modify")}>
  <span style={{ marginRight: "5px" }}>Modifier Mon Profil</span>
  <PersonGear size={24} />
</Nav.Link>
<Nav.Link className="mx-2" onClick={() => SeDeconnecter()}>
  <span style={{ marginRight: "5px" }}>Se Déconnecter</span>
  <BoxArrowInLeft size={24} />
</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        </div>
        <Navbar.Brand as={Link} to="/" className="ml-auto">
    <img
      src="https://valcourt2030.org/wp-content/uploads/2017/05/2030-180x67.jpg" // Replace with the path to your logo
      width="100"
      height="30"
      className="d-inline-block align-top"
      alt="Logo"
    />
  </Navbar.Brand>
      </Navbar>
    </div>
  );
}

export default NavbarComponent; // Exporting NavbarComponent
