import React from 'react';

import './tasklist-header.css';

const TaskListHeader = ({ title, date }) => {
  return (
    <div className='tasklist-container-title'>
      <h1 className='tasklist-title'>{title}</h1>
      {date && <p className='tasklist-date'>{date}</p>}
    </div>
  );
};

export default TaskListHeader;
