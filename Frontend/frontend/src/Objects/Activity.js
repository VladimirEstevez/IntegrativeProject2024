import React from 'react';
import { useLocation } from 'react-router-dom';

const Activity = () => {
  const location = useLocation();
  const activity = location.state.activity;

  return (
    <div className="activity">
      <img src={activity.post_thumbnail} alt="Event" className="activity-img" />
      <h2>{activity.post_title}</h2>
      <p>{activity.post_content}</p>
      <p>{activity.post_excerpt}</p>
      <p>Start Date: {activity.StartDate}</p>
      <p>End Date: {activity.EndDate}</p>
      <a href={activity.event_url}>Event URL</a>
      <p>Tags: {activity.tags.join(', ')}</p>
    </div>
  );
};

export default Activity;