import React from 'react';

import TaskListTaskRow from '../tasklist-task-row/tasklist-task-row';

const TaskListTasks = ({ taskList }) => (
  <>
    {taskList.tasks.map(({ ...taskProps }, id) => {
      return <TaskListTaskRow key={id} {...taskProps} taskId={id + 1} />;
    })}
  </>
);

export default TaskListTasks;
