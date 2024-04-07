import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  BookmarkHeart,
  BoxArrowInLeft,
  PersonGear,
  PersonWalking,
} from "react-bootstrap-icons";

function NavbarComponent() {
  const navigate = useNavigate();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  function SeDeconnecter() {
    //Remove the token
    localStorage.removeItem("token");

    //Navigate to the main page
    navigate("/");
  }

  return (
    <div>
        <Navbar
        style={{ 
          backgroundColor: isNavbarOpen ? "white" : "transparent",
          zIndex: 1000, 
        }}
        expand="lg"
        className="position-absolute top-0 end-0 mb-3"
        >
        <Navbar.Toggle
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
            aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
            <Nav.Link className="me-1 ms-1" onClick={() => navigate("/myActivities")}>
                <span>Voir mes activités</span>
                <BookmarkHeart size={24} />
            </Nav.Link>
            <Nav.Link className="me-1 ms-1" onClick={() => navigate("/activities")}>
                <span>Voir les activités</span>
                <PersonWalking size={24} />
            </Nav.Link>
            <Nav.Link className="me-1 ms-1" onClick={() => navigate("/modify")}>
                <span>Modifier Mon Profil</span>
                <PersonGear size={24} />
            </Nav.Link>
            <Nav.Link className="me-1 ms-1" onClick={() => SeDeconnecter()}>
                <span>Se Déconnecter</span>
                <BoxArrowInLeft size={24} />
            </Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    </div>
  );
}

export default NavbarComponent;
