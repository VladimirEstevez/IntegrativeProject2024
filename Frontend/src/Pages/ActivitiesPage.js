
import React, { useEffect, useState, useRef } from "react"; // Importing necessary modules and components
import Card from "../Objects/Card"; // Importing custom Card component
import { useNavigate } from "react-router-dom"; // Importing hook for navigation
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS
import { House } from "react-bootstrap-icons"; // Importing logout icon
import backgroundImage from '../Logo/V2030.png'; // Importing the background image
import Dropdown from 'react-bootstrap/Dropdown';

const ActivitiesPage = () => {
  // State variables and constants initialization
  const [activities, setActivities] = useState([]); // State for storing activities
  const navigate = useNavigate(); // Navigation function
  const token = localStorage.getItem("token"); // Token stored in local storage
  const [interests, setInterests] = useState([]); // State for storing interests

  // Fetch interests data from the server on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/data`);
        const data = await response.json();
        setInterests(data.interests); // Setting fetched interests data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData(); // Calling fetch function
  }, []);

  // Refs for dropdowns and state variables for dropdown open/close state
  const filterDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const [selectedFilters, setSelectedFilters] = useState([]); // State for selected filters
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false); // State for dropdown open/close
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false); // State for dropdown open/close
  

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // Render dropdown menu with checkboxes for interests

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
            className="dropdown-menu show p-2"
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

  
  // Render date dropdown button
  function renderDateFilterMenu() {
    return (
      <Dropdown onSelect={(e) => setSelectedDate(e)}>
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



  // Filter activities with tags and date
  const filteredActivities = Array.isArray(activities)
    ? activities.filter((activity) => {
        //Filter by tags
        const tagFilter =
          selectedFilters.length === 0 ||
          (Array.isArray(activity.tags) && selectedFilters.some((filter) => activity.tags.includes(filter)));

        //Filter by date
        let dateFilter = false;
        const activityDate = new Date(activity.StartDate)
          .toISOString()
          .substring(0, 10);
        switch (selectedDate) {
          case "previous":
            dateFilter =
              activityDate < new Date().toISOString().substring(0, 10);
            break;
          case "today":
            dateFilter =
              activityDate === new Date().toISOString().substring(0, 10);
            break;
          case "upcoming":
            dateFilter =
              activityDate > new Date().toISOString().substring(0, 10);
            break;
          default:
            dateFilter = true;
        }

        return tagFilter && dateFilter;
      })
    : [];


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

  // Fetch activities data from the server on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/activities`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setActivities(data); // Setting fetched activities data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchProtectedRoute = async () => {
      if (!token) {
        navigate("/"); // Redirect to login page if token is not available
      } else {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/user/protectedRoute`,
            {
              method: "GET",
              headers: {
                authorization: "Bearer " + token,
              },
            }
          );

          if (response.status === 401) {
            navigate("/"); // Redirect to login page if unauthorized
          } else {
            // Do nothing if authorized
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

  // Render activities
  return (
    <div className="text-center" style={{ background: ` linear-gradient(to bottom, #007bff, #B9D56D)`, backgroundSize: 'auto', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
    <div className="container mt-5">
      <div className="row justify-content-center">
        <h1 className="col-12 text-center mb-4 " style={{ color: 'white' }}>Vos activités</h1>
      </div>
      <div className="row p-3 justify-content-center">
        <div className="col-sm-auto text-center">
          <div>{renderFilterMenu()}</div>
        </div>
        <div className="col-sm-auto text-center">
          <div>{renderDateFilterMenu()}</div>
        </div>
      </div>
      <div className="row">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div className="col-12 col-sm-6 col-md-4 mb-4" key={activity._id}>
              <Card activity={activity} />
            </div>
          ))
        ) : (
          <p className="col-md-12">Aucune activité trouvée.</p>
        )}
      </div>
      <div className="row justify-content-center">
        <button

          className="col-4 btn btn-light btn-custom btn-hover-effect position-relative"
          onClick={() => navigate("/")} // Logout button with transition effect

          style={{
            transition: "transform 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Retour à la page d'accueil <House size={20} />
        </button>
      </div>
    </div>
   </div>
  );
};

export default ActivitiesPage; // Exporting ActivitiesPage component
