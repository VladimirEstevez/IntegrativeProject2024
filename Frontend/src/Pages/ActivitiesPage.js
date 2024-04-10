import React, { useEffect, useState, useRef } from "react";
import Card from "../Objects/Card";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { House } from "react-bootstrap-icons";

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/data");
        const data = await response.json();
        setInterests(data.interests);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  //Create separate refs for each dropdown
  const filterDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);

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

  // Render dropdown menu with checkboxes
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


 //Render date dropdown button
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
          <option value="">All activities</option>
          <option value="previous">Previous activities</option>
          <option value="today">Today's Activities</option>
          <option value="upcoming">Upcoming activities</option>
        </select>
      </div>
    </div>
  );
}

  // Filter activities with tags and date
  // Filter activities with tags and date
  const filteredActivities = Array.isArray(activities)
    ? activities.filter((activity) => {

      //Filter by tags
      const tagFilter = selectedFilters.length === 0 || selectedFilters.some((filter) => activity.tag.includes(filter));

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
        const response = await fetch("http://localhost:8080/activities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        //console.log("data: ", data);
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

          // console.log("response: ", response);
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
        <h1 className="col-4 text-center mb-4">Vos activités</h1>
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
          className="col-4 btn btn-light btn-custom btn-hover-effect position-relative  mb-4"
          onClick={() => navigate("/")}
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
  );
};

export default ActivitiesPage;
