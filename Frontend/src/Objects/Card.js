import React, { useEffect } from 'react'; // Importing React and useEffect hook
import { useNavigate, useLocation } from 'react-router-dom'; // Importing useNavigate and useLocation hooks from react-router-dom

// Functional component for displaying activity card
const Card = ({ activity }) => {
    const navigate = useNavigate(); // Accessing navigate function from react-router-dom
    const location = useLocation(); // Accessing current location from react-router-dom

    // Effect to log activity when it changes
    useEffect(() => { 
        console.log(activity);
    }, [activity]); // Running effect whenever activity changes

    // Function to navigate to activity details page
    const goToActivity = () => {
        // Navigating based on current location
        if (location.pathname.startsWith("/myActivities")) {
            navigate(`/myActivities/${activity._id}`, { state: { activity } }); // Navigating to myActivities page
        } else {
            navigate(`/activities/${activity._id}`, { state: { activity } }); // Navigating to activities page
        }
    };

    // Rendering activity card
    return (
        <div className="card shadow-sm mt-1"> {/* Card container */}
            {/* Activity image */}
            <img src={activity.post_thumbnail} alt="Event" className="card-img-top" style={{ height: "150px" }}/>
            <div className="card-body"> {/* Card body */}
                {/* Activity title */}
                <h5 className="card-title text-primary">{activity.post_title}</h5>
                {/* Activity excerpt */}
                <p className="card-text">{activity.post_excerpt}</p>
                {/* Start date */}
                <p className="card-text"><small className="text-muted">Début: {(activity.StartDate)}</small></p>
                {/* End date */}
                <p className="card-text"><small className="text-muted">Fin: {(activity.EndDate)}</small></p>
                {/* Tags */}
                <p className="card-text"><small className="text-muted">Mots clés: {activity.tags.join(', ')}</small></p>
                <div className='d-flex justify-content-center'> {/* Button container */}
                    {/* Button to navigate to activity details */}
                    <button 
                        onClick={goToActivity} 
                        className="btn btn-primary" 
                    >
                        Détails de l'activité
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card; // Exporting Card component
