import React, { useEffect, useState, useRef } from "react";

import Card from "../Objects/Card"; // Importing Card component
import { useNavigate } from "react-router-dom"; // Importing hook for navigation
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS
import { House } from "react-bootstrap-icons"; // Importing logout icon
import backgroundImage from '../Logo/V2030.png'; // Importing the background image
import Dropdown from 'react-bootstrap/Dropdown';


// Functional component for My Activities Page
const MyActivitiesPage = () => {
  const navigate = useNavigate(); // Navigation hook
  const token = localStorage.getItem("token"); // Retrieving token from local storage
  const [activities, setActivities] = useState([]); // State for activities
  const [interests, setInterests] = useState([]); // State for user interests

  useEffect(() => {
    // Fetching user interests from server
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/data`); // Fetching data from server
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
      <div className="dropdown p-2" ref={filterDropdownRef}>
        <button
          className="btn btn-light btn-custom btn-hover-effect dropdown-toggle "
          onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
        >
          Filtrer
        </button>
        {filterDropdownOpen && (

          <div
            className="dropdown-menu show m-2"
            style={{ zIndex: 1000 }}
          >
            {interests.map((interest, index) => (
              <label key={index} className="dropdown-item" style={{ padding: "5px" }}>

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
      <Dropdown className="p-2" onSelect={(e) => setSelectedDate(e)}>
        <Dropdown.Toggle variant="light" id="dateDropdownButton" className="btn btn-light btn-custom btn-hover-effect dropdown-toggle">
          Choisir date
        </Dropdown.Toggle>
  
        <Dropdown.Menu>
          <Dropdown.Item eventKey="">Ensemble des Activités</Dropdown.Item>
          <Dropdown.Item eventKey="previous">Activités précédentes</Dropdown.Item>
          <Dropdown.Item eventKey="today">Activités du jour</Dropdown.Item>
          <Dropdown.Item eventKey="upcoming">Activités à venir</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
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
          `${process.env.REACT_APP_SERVER_URL}/activities/my-activities`,
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
            `${process.env.REACT_APP_SERVER_URL}/user/protectedRoute`,
            {
              method: "GET",
              headers: {
                authorization: "Bearer " + token, // Setting authorization header with token
              },
            }
          );

          if (response.status !== 200) {
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
    <div className="text-center" style={{ background: ` linear-gradient(to bottom, #007bff, #B9D56D)`, backgroundSize: 'auto', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
    <div className="container ">
      <div className="row justify-content-center">

        <h1 className="col-12 text-light text-center m-4">Mes activités</h1>
      </div>
      <div className="row p-3 justify-content-center">
        <div className="col-sm-auto text-center">
          <div>{renderFilterMenu()}</div>
        </div>
        <div className="col-sm-auto text-center ">
          <div >{renderDateFilterMenu()}</div>
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
          className="col-4 mb-3 btn btn-light btn-custom btn-hover-effect position-relative"

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
   </div>
  );
};

export default MyActivitiesPage; // Exporting MyActivitiesPage component
