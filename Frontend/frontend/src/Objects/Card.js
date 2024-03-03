import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ activity }) => {
    const navigate = useNavigate();
  
    const goToActivity = () => {
      navigate(`/activities/${activity._id}`, { state: { activity } });
    };

    const formatDate = (startDateString) => {
  const startDate = new Date(startDateString);
  const formattedDate = startDate.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${formattedDate} ${formattedTime}`;
};

    return (
        <div className="card">
          <img src={activity.post_thumbnail} alt="Event" className="card-img-top" />
          <div className="card-body">
            <h5 className="card-title">{activity.post_content}</h5>
            <h5 className="card-title">{activity.post_title}</h5>
            <p className="card-text">Début: {formatDate(activity.StartDate)}</p>
            <p className="card-text">Fin: {formatDate(activity.EndDate)}</p>
            <p className="card-text">Tags: {activity.tags.join(', ')}</p>
            <div className='d-flex justify-content-center'>
            <button onClick={goToActivity} className="bg-lightblue p-3 m-2" style={{ borderRadius: '10px', 
                position: 'relative', padding: '10px 20px', transition: 'transform 0.3s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>GO TO ACTIVITY</button>
            </div>
            
          </div>
        </div>
      );
};

export default Card;