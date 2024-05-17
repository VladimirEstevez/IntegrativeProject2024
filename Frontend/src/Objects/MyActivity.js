import React, { useState } from 'react'; // Importing React and useState hook
import { useLocation, useNavigate } from 'react-router-dom'; // Importing useLocation and useNavigate hooks from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS
import backgroundImage from '../Logo/V2030.png'; // Importing the background image
import V2030transparence1 from '../Logo/V2030transparence1.png';
import { formatDateFunction } from './DateFormattingTool';

// Functional component for displaying user's activity details
const MyActivity = () => {
  const location = useLocation(); // Accessing current location from react-router-dom
  const navigate = useNavigate(); // Accessing navigate function from react-router-dom
  const activity = location.state.activity; // Extracting activity object from location state
  const [isLoading, setIsLoading] = useState(false); // State variable for loading state

  // Function to navigate back to myActivities menu
  const goBack = () => {
    navigate('/myActivities'); // Navigating back to myActivities menu
  }

  // Function to handle click on event URL
  const handleEventUrlClick = (event) => {
    setIsLoading(true); // Setting loading state to true
    setTimeout(() => {
      window.open(activity.event_url, '_blank'); // Opening event URL in new tab after 1 second
      setIsLoading(false); // Setting loading state to false
    }, 1000); // Delaying action for 1 second
    event.preventDefault(); // Preventing default action
  }

  // Rendering loading state if isLoading is true
  if (isLoading) {
    return (
      <div className="text-center" style={{background: 'linear-gradient(to bottom, #007bff, #ffffff)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw'}}>
       <img src={V2030transparence1} alt="" className="logo" /> 
        <p>Redirection vers le site web...</p>
      </div>
    );
  }

  // Formatting post content with line breaks
  const postContentWithBreaks = activity.post_content.replace(/\r\n/g, '<br>');

  // Rendering user's activity details
  return (
    <div
      className="activity p-5 shadow-sm bg-white rounded text-center"
      style={{
        background: "linear-gradient(to bottom, #007bff, #bdd668)",
        maxWidth: "100%",
        color: "#333",
        minHeight:"100vh"
      }}
    >
      
      {/* Activity details */}
      <div className="container bg-white " style={{ borderRadius: '33px' }}>
        <div className="row">
          <div className="col">
            <img
              src={activity.post_thumbnail}
              alt="Event"
              className="activity-img my-3 img-fluid d-block  mx-auto"
            />{" "}
            {/* Activity image */}
          </div>
          </div>
          <div className="row">
            <div className="col">
              <h2 className="my-3 " style={{ fontSize: '1.8em' }}>{activity.post_title}</h2>{" "}
              {/* Activity title */}
              
              {/* Activity excerpt */}
              <p
                className="my-3 text-justify" style={{ fontSize: '1.2em' }}
                dangerouslySetInnerHTML={{ __html: postContentWithBreaks }}
              ></p>{" "}
              {/* Activity content */}
              <p>
                <small className="text-muted " style={{ fontSize: '1.2em' }}>
                  Date de début: {formatDateFunction(activity.StartDate)}
                </small>
              </p>{" "}
              {/* Start date */}
              <p>
                <small className="text-muted " style={{ fontSize: '1.2em' }}>
                  Date de fin: {formatDateFunction(activity.EndDate)}
                </small>
              </p>{" "}
              {/* End date */}
              <span className="text-muted " style={{ fontSize: '1.2em' }}>Événement sur le site Valcourt2030: </span>
              <a style={{ fontSize: '1.2em' }}
                href={activity.post_url}
                onClick={handleEventUrlClick}
                className=" my-3"
              >
                {" "}
                {activity.post_title}{" "}
              </a>{" "}
              {/* Event URL */}
              <p className="text-muted " style={{ fontSize: '1.2em' }}>
                <small className="text-muted" >
                  Intérêts: {activity.tags.join(", ")}
                </small>
              </p>{" "}
              {/* Tags */} <button
                onClick={() => goBack()}
                className="btn  btn-hover-effect btn-secondary fs-2 my-3 "
              >
                Retour
              </button>{" "}
              {/* Button to go back */}
             </div>
          </div>
        </div>
      </div>
  );
};

export default MyActivity; // Exporting MyActivity component
