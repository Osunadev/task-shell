import React from 'react';

import './tasklist-description.css';

const TaskListDescription = ({ description }) => {
  return (
    description && (
      <div className="tasklist-container-description">
        <p className="tasklist-description">{description}</p>
      </div>
    )
  );
};

export default TaskListDescription;
