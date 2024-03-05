import React, { useState  } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

const Activity = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activity = location.state.activity;
 const [isLoading, setIsLoading] = useState(false);

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
 const handleEventUrlClick = (event) => {
    setIsLoading(true);
    setTimeout(() => {
      window.open(activity.event_url, '_blank');
      setIsLoading(false);
    }, 1000); // open the new window after 1 second
    event.preventDefault(); // prevent the default action
  }
  if (isLoading) {
    return (
      <div className="text-center" style={{background: 'linear-gradient(to bottom, #007bff, #ffffff)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw'}}>
        <img src="https://valfamille.com/site2022/wp-content/uploads/logo-bleu-marge.jpg" alt="Loading image not found" style={{width: '240px', height: '100px'}} />
        <p>Redirection vers le site web...</p>
      </div>
    );
  }
  
return (
    <div className="activity p-5 shadow-sm bg-white rounded text-center" style={{background: 'linear-gradient(to bottom, #007bff, #ffffff)', maxWidth: '100%', margin: 'auto', color: '#333', height: '100vh', width: '100vw'}}>
      <img src={activity.post_thumbnail} alt="Event" className="activity-img my-3 img-fluid rounded mx-auto d-block" style={{maxWidth: '50%'}} />
      <h2 className="my-3">{activity.post_title}</h2>
      <p className="text-muted">{activity.post_excerpt}</p>
      <p className="my-3 text-justify">{activity.post_content}</p>
      <p><small className="text-muted">Start Date: {formatDate(activity.StartDate)}</small></p>
      <p><small className="text-muted">End Date: {formatDate(activity.EndDate)}</small></p>
      <a href={activity.event_url} onClick={handleEventUrlClick} className="btn btn-primary my-3">Event URL</a>
      <p><small className="text-muted">Tags: {activity.tags.join(', ')}</small></p>
      <button onClick={() => goBack()} className="btn btn-secondary my-3">Go Back</button>
      <button onClick={registerActivity} className="register-button btn btn-primary">Register to the activity</button>
    </div>
  );
};

export default Activity;  