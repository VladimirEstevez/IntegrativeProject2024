import React, { useEffect, useState, useRef } from "react";
import Card from "../Objects/Card";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BoxArrowInLeft } from "react-bootstrap-icons";

const MyActivitiesPage = () => {
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

  const filterDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setDateDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function renderFilterMenu() {
    return (
      <div ref={filterDropdownRef} className="m-2">
        <button
          className="btn btn-light btn-custom btn-hover-effect"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          Filter
        </button>
        {dropdownOpen && (
          <div className="position-absolute bg-white border rounded p-2" style={{ zIndex: 1000 }}>
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

  function renderDateFilterMenu() {
    return (
      <div ref={dateDropdownRef} className="m-2">
        <button
          className="btn btn-light btn-custom btn-hover-effect"
          onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
        >
          Filter by Date
        </button>
        {dateDropdownOpen && (
          <div className="position-absolute bg-white border rounded p-2" style={{ zIndex: 1000 }}>
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

  const filteredActivities = Array.isArray(activities)
    ? activities.filter(
        (activity) =>
          (selectedFilters.length === 0 ||
            selectedFilters.some((filter) => activity.tags.includes(filter))) &&
          (!selectedDate ||
            selectedDate.trim() === "" ||
            new Date(activity.StartDate).toISOString().substring(0, 10) ===
              selectedDate)
      )
    : [];

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
        const response = await fetch(
          "http://localhost:8080/activities/my-activities",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
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

          if (response.status === 401) {
            navigate("/");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchProtectedRoute();
    fetchActivities();
  }, [navigate, token]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <h1 className="mb-4 col-4 text-center">Mes activités</h1>
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
          onClick={() => navigate("/")}
          className="col-4 btn btn-light btn-custom btn-hover-effect position-relative  mb-4"
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
