import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";


const Activity = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activity = location.state.activity;
  //console.log('activity: ', activity);

  const formatDate = (startDateString) => {
    const startDate = new Date(startDateString);
    const formattedDate = startDate.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
  }

  const goBack = () => {
   navigate('/activities'); // replace '/activities' with the path to your activities menu
  }


  const registerActivity = async () => {
    const token = localStorage.getItem('token'); // replace with how you store your jwt token
  
    const response = await fetch('http://localhost:8080/activities/register-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(activity)
    });
  
    if (response.ok) {
      alert('Registration successful');
    } else {
      alert('Registration failed');
    }
  }

  return (
    <div className="activity p-5">
      <img src={activity.post_thumbnail} alt="Event" className="activity-img my-3" />
      <h2>{activity.post_title}</h2>
      <p>{activity.post_content}</p>
      <p>{activity.post_excerpt}</p>
      <p>Start Date: {formatDate(activity.StartDate)}</p>
      <p>End Date: {formatDate(activity.EndDate)}</p>
      <p>Site Web: <a href={activity.event_url}> {activity.post_title} </a> </p>
      <p>Tags: {activity.tags.join(', ')}</p>
      <button onClick={registerActivity} className="register-button btn btn-primary">Register to the activity</button>
      <button onClick={goBack} className="btn btn-primary ms-3">Go back to Activity menu</button>
    </div>
  );
};

export default Activity;