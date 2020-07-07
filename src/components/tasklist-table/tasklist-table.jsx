import React, { PureComponent } from 'react';

import './tasklist-table.css';
import TaskListHeader from '../tasklist-header/tasklist-header';
import TaskListDescription from '../tasklist-description/tasklist-description';
import TaskListTasks from '../tasklist-tasks/tasklist-tasks';

// We used PureComponent to avoid unnecesary re-renders when the task-shell input changes
class TaskListTable extends PureComponent {
  render() {
    const { taskList } = this.props;
    return (
      <div id="taskListTable" className="table-container">
        <TaskListHeader title={taskList.title} date={taskList.date} />
        <TaskListDescription description={taskList.description} />
        <p className="tasklist-table-title">TASKS</p>
        {taskList.tasks.length ? (
          <TaskListTasks taskList={taskList} />
        ) : (
          <p className="tasklist-table-no-tasks">
            Empty task list, please create some tasks.
          </p>
        )}
      </div>
    );
  }
}

export default TaskListTable;
