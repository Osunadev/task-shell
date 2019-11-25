import React from 'react';

import './tasklist-table.css';
import TaskListHeader from '../tasklist-header/tasklist-header';
import TaskListDescription from '../tasklist-description/tasklist-description';
import TaskListTasks from '../tasklist-tasks/tasklist-tasks';

const TaskListTable = ({ taskList, taskListId }) => {
  return (
    <div id='taskListTable' className='table-container'>
      <TaskListHeader title={taskList.title} date={taskList.date} />
      <TaskListDescription description={taskList.description} />
      <p className='tasklist-table-title'>TASKS</p>
      <TaskListTasks taskList={taskList} />
    </div>
  );
};

export default TaskListTable;
