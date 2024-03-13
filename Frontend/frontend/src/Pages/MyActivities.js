import React, { useEffect, useState, useRef } from "react";
import Card from "../Objects/Card";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BoxArrowInLeft } from "react-bootstrap-icons";

const MyActivitiesPage = () => {
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
  // Add a state variable for the selected date
  const [selectedDate, setSelectedDate] = useState(null);
  // State variable for dropdown open/close state
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setDateDropdownOpen(false);
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
          className="btn btn-primary m-2"
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

  //Render date dropdown button
  function renderDateFilterMenu() {
    return (
      <div ref={dropdownRef}>
        <button className="btn btn-primary m-2" onClick={() => setDateDropdownOpen(!dateDropdownOpen)}>
          Filter by Date
        </button>
        {dateDropdownOpen && (
          <div
            className="position-absolute bg-white border rounded p-2"
            style={{ zIndex: 1000 }}
          >
            <input
              type="date"
              value={selectedDate || ''}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        )}
      </div>
    );
  }

  // Filter activities with tags and date
  const filteredActivities = activities.filter(
    (activity) =>
      (selectedFilters.length === 0 ||
      selectedFilters.some((filter) => activity.tags.includes(filter))) && 
      (!selectedDate || selectedDate.trim() === '' || new Date(activity.StartDate).toISOString().substring(0, 10) === selectedDate)
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <h1 className="mb-4">Vos activités</h1>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <div>{renderFilterMenu()}</div>
        <div>{renderDateFilterMenu()}</div>
      </div>
      <div className="row">
        {filteredActivities.map((activity) => (
          <div className="col-md-4 mb-4" key={activity._id}>
            <Card activity={activity} />
          </div>
        ))}
      </div>
      <div className="row justify-content-center">
        <button
          onClick={() => navigate("/")}
          className="btn btn-primary mt-4"
          style={{
            borderRadius: "10px",
            position: "relative",
            padding: "10px 20px",
            transition: "transform 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span style={{ marginRight: "5px" }}>Se Déconnecter</span>
          <BoxArrowInLeft size={24} />
        </button>
      </div>
    </div>
  );
};

export default MyActivitiesPage;
