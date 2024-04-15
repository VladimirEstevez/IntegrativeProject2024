import React, { useEffect, useState, useRef } from "react";

import Card from "../Objects/Card"; // Importing Card component
import { useNavigate } from "react-router-dom"; // Importing hook for navigation
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS
import { House } from "react-bootstrap-icons"; // Importing logout icon


// Functional component for My Activities Page
const MyActivitiesPage = () => {
  const [activities, setActivities] = useState([]); // State for activities
  const navigate = useNavigate(); // Navigation hook
  const token = localStorage.getItem("token"); // Retrieving token from local storage
  const [interests, setInterests] = useState([]); // State for user interests

  useEffect(() => {
    // Fetching user interests from server
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/data"); // Fetching data from server
        const data = await response.json(); // Parsing response as JSON
        setInterests(data.interests); // Setting interests state with fetched data
      } catch (error) {
        console.error("Error:", error); // Logging error if any
      }
    };
  
    fetchData(); // Calling fetchData function on component mount
  }, []);

  // Creating refs for dropdowns
  const filterDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);

  // State variables for filters and dropdowns
  const [selectedFilters, setSelectedFilters] = useState([]); // State for selected filters
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false); // State for filter dropdown
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date

  useEffect(() => {
    // Handling click outside dropdown to close it
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Adding event listener for mousedown
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Removing event listener on component unmount
    };
  }, []);

  // Function to render filter dropdown menu
  function renderFilterMenu() {
    return (
      <div className="dropdown" ref={filterDropdownRef}>
        <button
          className="btn btn-light btn-custom btn-hover-effect dropdown-toggle"

          onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
        >
          Filtre
        </button>
        {filterDropdownOpen && (
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

  // Function to render date filter dropdown menu
  function renderDateFilterMenu() {
    return (
      <div ref={dateDropdownRef}>
          <div
          className="bg-white"
          style={{ zIndex: 1000 }}
        >
          <select
            value={selectedDate || ""}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="">Ensemble des Activités</option>
            <option value="previous">Activités précédentes</option>
            <option value="today">Activités du jour</option>
            <option value="upcoming">Activités à venir</option>
          </select>
        </div>
      </div>
    );
  }

  // Filtering activities based on selected filters and date
  const filteredActivities = Array.isArray(activities)
    ? activities.filter((activity) => {

      //Filter by tags
      const tagFilter =
          selectedFilters.length === 0 ||
          (Array.isArray(activity.tags) && selectedFilters.some((filter) => activity.tags.includes(filter)));

      //Filter by date
      let dateFilter = false;
      const activityDate = new Date(activity.StartDate).toISOString().substring(0, 10);
      switch (selectedDate) {
        case "previous":
          dateFilter = activityDate < new Date().toISOString().substring(0, 10);
          break;
        case "today":
          dateFilter = activityDate === new Date().toISOString().substring(0, 10);
          break;
        case "upcoming":
          dateFilter = activityDate > new Date().toISOString().substring(0, 10);
          break;
        default:
          dateFilter = true;
      }

      return tagFilter && dateFilter;
    })
    : [];

  // Handling checkbox change
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
    // Fetching user activities from server
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/activities/my-activities",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Setting authorization header with token
            },
          }
        );
        const data = await response.json(); // Parsing response as JSON
        setActivities(data); // Setting activities state with fetched data
      } catch (error) {
        console.error("Error:", error); // Logging error if any
      }
    };

    const fetchProtectedRoute = async () => {
      if (!token) {
        navigate("/"); // Redirecting to login page if token is not present
      } else {
        try {
          const response = await fetch(
            "http://localhost:8080/user/protectedRoute",
            {
              method: "GET",
              headers: {
                authorization: "Bearer " + token, // Setting authorization header with token
              },
            }
          );

          if (response.status === 401) {
            navigate("/"); // Redirecting to login page if unauthorized
          }
        } catch (error) {
          console.error("Error:", error); // Logging error if any
        }
      }
    };

    // Calling functions sequentially
    fetchProtectedRoute();
    fetchActivities();
  }, [navigate, token]);

  // JSX for rendering My Activities Page
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">

        <h1 className="col-12 text-center mb-4">Mes activités</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-sm-auto text-center">
          <div>{renderFilterMenu()}</div>
        </div>
        <div className="col-sm-auto text-center mt-2">
          <div className="mw-75">{renderDateFilterMenu()}</div>
        </div>

      </div>
      <div className="row">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div className="col-md-4 mb-4" key={activity._id}>
              <Card activity={activity} /> {/* Render Card component for each activity */}
            </div>
          ))
        ) : (
          <p>Aucune activité trouvée.</p>
        )}
      </div>
      <div className="row justify-content-center">

        {/* Logout button */}
        <button
          onClick={() => navigate("/")} // Navigate to login page on click
          className="col-4 btn btn-light btn-custom btn-hover-effect position-relative"

          style={{
            transition: "transform 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)"; // Scaling effect on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"; // Reverting scale effect on hover out
          }}
        >

          Retour à la page d'accueil <House size={20} />

        </button>
      </div>
    </div>
  );
};

export default MyActivitiesPage; // Exporting MyActivitiesPage component
