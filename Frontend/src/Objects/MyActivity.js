import React, { useState } from 'react'; // Importing React and useState hook
import { useLocation, useNavigate } from 'react-router-dom'; // Importing useLocation and useNavigate hooks from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS
import V2030transparence1 from '../Logo/V2030transparence1.png';
import formatUTCDate from './utilDate'; // Importing utility function for formatting UTC date

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
    <div className="activity p-5 shadow-sm bg-white rounded text-center" style={{background: 'linear-gradient(to bottom, #007bff, #ffffff)', maxWidth: '100%', margin: 'auto', color: '#333', height: '100vh', width: '100vw'}}>
      {/* Activity image */}
      <img src={activity.post_thumbnail} alt="Event" className="activity-img my-3 img-fluid rounded mx-auto d-block" style={{maxWidth: '50%'}} />
      {/* Activity title */}
      <h2 className="my-3">{activity.post_title}</h2>
      {/* Activity excerpt */}
      <p className="text-muted">{activity.post_excerpt}</p>
      {/* Activity content */}
      <p className="my-3 text-justify" dangerouslySetInnerHTML={{ __html: postContentWithBreaks }}></p>
      {/* Start date */}
      <p><small className="text-muted">Start Date: {formatUTCDate(activity.StartDate)}</small></p>
      {/* End date */}
      <p><small className="text-muted">End Date: {formatUTCDate(activity.EndDate)}</small></p>
      {/* Event URL */}
      <span>Evenement sur le site Valcourt2030: </span><a href={activity.post_url} onClick={handleEventUrlClick} className=" my-3">   {activity.post_title}  </a>
      {/* Tags */}
      <p><small className="text-muted">Tags: {activity.tags.join(', ')}</small></p>
      {/* Button to go back */}
      <button onClick={() => goBack()} className="btn btn-secondary my-3">Go Back</button>
    </div>
  );
};

export default MyActivity; // Exporting MyActivity component
