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
    <div >
        <Navbar
        style={{ backgroundColor: isNavbarOpen ? "white" : "transparent" }}
        expand="lg"
        className="position-absolute top-0 end-0"
        >
        <Navbar.Toggle
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
            aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
            <Nav.Link onClick={() => navigate("/myActivities")}>
                <span style={{ marginRight: "5px" }}>Voir mes activités</span>
                <BookmarkHeart size={24} />
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/activities")}>
                <span style={{ marginRight: "5px" }}>Voir les activités</span>
                <PersonWalking size={24} />
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/modify")}>
                <span style={{ marginRight: "5px" }}>Modifier Mon Profil</span>
                <PersonGear size={24} />
            </Nav.Link>
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

export default NavbarComponent;
