import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import '../css/Card.css';
import formatUTCDate from './utilDate';

const Card = ({ activity }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => { 
        console.log(activity);
    }, [activity]);

    const goToActivity = () => {
        if (location.pathname.startsWith("/myActivities")){
            navigate(`/myActivities/${activity._id}`, { state: { activity } });
        } else {
            navigate(`/activities/${activity._id}`, { state: { activity } });
        }
    };

    return (
        <div className="card shadow-sm mt-1">
            <img src={activity.post_thumbnail} alt="Event" className="card-img-top" style={{ height: "150px" }}/>
            <div className="card-body">
                <h5 className="card-title text-primary">{activity.post_title}</h5>
                <p className="card-text">{activity.post_excerpt}</p>
                <p className="card-text"><small className="text-muted">Début: {formatUTCDate(activity.StartDate)}</small></p>
                <p className="card-text"><small className="text-muted">Fin: {formatUTCDate(activity.EndDate)}</small></p>
                <p className="card-text"><small className="text-muted">Tags: {activity.tags.join(', ')}</small></p>
                <div className='d-flex justify-content-center'>
                    <button 
                        onClick={goToActivity} 
                        className="btn btn-primary" 
                    >
                        GO TO ACTIVITY
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;