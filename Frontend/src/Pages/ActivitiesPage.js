import React, { useEffect, useState, useRef } from "react"; // Importing necessary modules and components
import Card from "../Objects/Card"; // Importing custom Card component
import { useNavigate } from "react-router-dom"; // Importing hook for navigation
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS
import { BoxArrowInLeft } from "react-bootstrap-icons"; // Importing logout icon

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
        const response = await fetch("http://localhost:8080/data");
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
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown open/close
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false); // State for date dropdown open/close

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target)
      ) {
        setDateDropdownOpen(false);
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
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          Filter
        </button>
        {dropdownOpen && (
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
      <div ref={dateDropdownRef}>
        <button
          className="btn btn-light btn-custom btn-hover-effect"
          onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
        >
          Filter by Date
        </button>
        {dateDropdownOpen && (
          <div
            className="position-absolute bg-white border rounded p-2"
            style={{ zIndex: 1000 }}
          >
            <input
              type="date"
              value={selectedDate || ""}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        )}
      </div>
    );
  }

  // Filter activities based on selected tags and date
  const filteredActivities = activities.filter(
    (activity) =>
      (selectedFilters.length === 0 ||
        selectedFilters.some((filter) => activity.tags.includes(filter))) &&
      (!selectedDate ||
        selectedDate.trim() === "" ||
        new Date(activity.StartDate).toISOString().substring(0, 10) ===
          selectedDate)
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

  // Fetch activities data from the server on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:8080/activities", {
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
            "http://localhost:8080/user/protectedRoute",
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <h1 className="col-4 text-center mb-4">Vos activités</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-sm-auto text-center">
          <div className="">{renderFilterMenu()}</div>
        </div>
        <div className="col-sm-auto text-center">
          <div className="mw-75">{renderDateFilterMenu()}</div>
        </div>
      </div>
      <div className="row">
        {filteredActivities.map((activity) => (
          <div className="col-12 col-sm-6 col-md-4 mb-4" key={activity._id}>
            <Card activity={activity} />
          </div>
        ))}
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
          Se Déconnecter <BoxArrowInLeft size={24} />
        </button>
      </div>
    </div>
  );
};

export default ActivitiesPage; // Exporting ActivitiesPage component
