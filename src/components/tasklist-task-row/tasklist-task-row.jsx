import React from 'react';

import './tasklist-task-row.css';

const TaskListTaskRow = ({ title, description, time, taskId }) => {
  return (
    <div className='tasklist-task-row-container'>
      <div className='title-container-task'>
        <p className='task-id'>{taskId}</p>
        <h1 className='task-title'>{title}</h1>
      </div>
      {description && <p className='task-description'>{description}</p>}
      {time > 0 && (
        <div className='task-time'>{`ESTIMATED TIME: ${time} MINUTES`}</div>
      )}
    </div>
  );
};

export default TaskListTaskRow;
