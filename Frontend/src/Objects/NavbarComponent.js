import React, { useState } from "react"; // Importing React and useState hook
import { Navbar, Nav } from "react-bootstrap"; // Importing Navbar and Nav components from react-bootstrap
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook from react-router-dom
import {
  BookmarkHeart,
  BoxArrowInLeft,
  PersonGear,
  PersonWalking,
} from "react-bootstrap-icons"; // Importing icons from react-bootstrap-icons
import { Link } from "react-router-dom";

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
          borderBottom: "1px solid black",
          display: "flex",
          justifyContent: "space-between",
          
        }}
        expand="lg"
        fixed="top"
        //className="d-flex justify-content-between align-items-start"
        expanded={isNavbarOpen} // Add this line
      >
        <Navbar.Brand as={Link} to="/" className="ml-auto ms-3 btn-hover-effect ">
          <img
            src="https://valcourt2030.org/wp-content/uploads/2017/05/2030-180x67.jpg" // Replace with the path to your logo
            width="110"
            height="30"
            className="d-inline-block align-top "
            alt="Logo"
          />
        </Navbar.Brand>
        
          <Navbar.Toggle
            className="btn-hover-effect mx-3 mb-1 py-1"
            onClick={() => setIsNavbarOpen((prevIsNavbarOpen) => !prevIsNavbarOpen)}
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse id="basic-navbar-nav"  className={isNavbarOpen ? "show" : ""} >
          
            <Nav  style={{ justifyContent: "flex-end" }}>
              {/* Link to view user's activities */}
              <Nav.Link
                className="mx-2 btn my-1 btn-light btn-hover-effect border border-3 rounded"
                onClick={() => {
                  navigate("/myActivities");
                  setIsNavbarOpen(false);
                }}
              >
                <span style={{ marginRight: "5px" }}>Voir mes activités</span>
                <BookmarkHeart size={24} />
              </Nav.Link>
              <Nav.Link
                className="mx-2 my-1  btn btn-light border border-3 btn-hover-effect  rounded"
                onClick={() => {
                  navigate("/activities");
                  setIsNavbarOpen(false);
                }}
              >
                <span style={{ marginRight: "5px" }}>Voir les activités</span>
                <PersonWalking size={24} />
              </Nav.Link>
              <Nav.Link
                className="mx-2 my-1  btn btn-light border border-3 btn-hover-effect  rounded"
                onClick={() => {
                  navigate("/modify");
                  setIsNavbarOpen(false);
                }}
              >
                <span style={{ marginRight: "5px" }}>Modifier Mon Profil</span>
                <PersonGear size={24} />
              </Nav.Link>
              <Nav.Link
                className="mx-2 my-1  btn btn-light border border-3 btn-hover-effect  rounded"
                onClick={() => {
                  SeDeconnecter();
                  setIsNavbarOpen(false);
                }}
              >
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
