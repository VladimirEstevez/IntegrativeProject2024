import React from 'react';
import { useLocation } from 'react-router-dom';

const Activity = () => {
  const location = useLocation();
  const activity = location.state.activity;

  const formatDate = (startDateString) => {
    const startDate = new Date(startDateString);
    const formattedDate = startDate.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
  }

  return (
    <div className="activity p-5">
      <img src={activity.post_thumbnail} alt="Event" className="activity-img" />
      <h2>{activity.post_title}</h2>
      <p>{activity.post_content}</p>
      <p>{activity.post_excerpt}</p>
      <p>Start Date: {formatDate(activity.StartDate)}</p>
      <p>End Date: {formatDate(activity.EndDate)}</p>
      <a href={activity.event_url}>Event URL</a>
      <p>Tags: {activity.tags.join(', ')}</p>
    </div>
  );
};

export default Activity;