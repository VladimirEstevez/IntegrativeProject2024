import React, { useEffect, useState, useRef } from "react";
import Card from "../Objects/Card";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BoxArrowInLeft } from "react-bootstrap-icons";


const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const interests = [
    "Arts",
    "Cuisine",
    "Concertation et partenariats",
    "Développement local",
    "Éducation",
    "Environnement",
    "Entrepreneuriat",
    "Formation",
    "Implication citoyenne",
    "Interculturel",
    "Intergénérationnel",
    "Musique",
    "Rencontre sociale",
    "Sports et plein air",
  ];

  // State variable for selected filters
  const [selectedFilters, setSelectedFilters] = useState([]);
  // State variable for dropdown open/close state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownRef = useRef(null);

  // Render dropdown menu with checkboxes
  function renderFilterMenu() {
    return (
      <div ref={dropdownRef}>
        <button
          className="btn btn-light  m-2 btn-custom btn-hover-effect"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          Filter
        </button>
        {dropdownOpen && (
          <div
            className="position-absolute bg-white border rounded p-2"
            style={{ zIndex: 1000 }}
          >
            {interests.map((interest, index) => (
              <label key={index} style={{ display: "block", padding: "5px" }}>
                <input
                  type="checkbox"
                  onChange={(e) => handleFilterChange(e, interest)}
                  checked={selectedFilters.includes(interest)}
                />{" "}
                {interest}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Filter activities
  const filteredActivities = activities.filter(
    (activity) =>
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) => activity.tags.includes(filter))
  );

  // Handle checkbox change
  const handleFilterChange = (e, interest) => {
    if (e.target.checked) {
      setSelectedFilters((prevFilters) => [...prevFilters, interest]);
    } else {
      setSelectedFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== interest)
      );
    }
  };



  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:8080/activities");
        const data = await response.json();
        console.log("data: ", data);
        setActivities(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchProtectedRoute = async () => {
      if (!token) {
        navigate("/");
      } else {
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

          console.log("response: ", response);
          if (response.status === 401) {
            navigate("/");
          } else {
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    // Call the functions sequentially
    fetchProtectedRoute();
    fetchActivities();
  }, [navigate, token]);

  return (
     <div className="container">
    <div className="row justify-content-center mb-4">
      <div className="col-12">{renderFilterMenu()}</div>
    </div>
    <div className="row card-deck"> {/* Use card-deck here */}
      {filteredActivities.map(activity => (
        <div className="col-md-4 mb-4 " key={activity._id}>
          <div className="card h-100">
            <Card activity={activity} />
          </div>
        </div>
      ))}
    </div>
    <div className="button-container">
      <button onClick={() => navigate("/")} className="btn btn-light  m-2 btn-custom btn-hover-effect">
        <span>Retour</span>
        <BoxArrowInLeft size={24} />
      </button>
    </div>
  </div>
  );
};

export default ActivitiesPage;
