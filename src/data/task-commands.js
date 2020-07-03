const TaskCommands = {
  title: 'Task Commands',
  description:
    'These are the available commands to be used in task-shell to create, modify and remove tasks.',
  date: '02/07/2020',
  tasks: [
    // Create Tasks Commands
    {
      title: 'CREATE TASK COMMANDS',
      description: '',
      time: 5,
    },
    {
      title: 'Create simple task',
      description: 'create task [task title] from tasklist-id',
      time: 0,
    },
    {
      title: 'Create task with description',
      description:
        'create task [task title] description “task descr.” from tasklist-id',
      time: 0,
    },
    {
      title: 'Create task with estimated completion time',
      description:
        'create task [task title] time estimated-time-minutes from tasklist-id',
      time: 0,
    },
    {
      title: 'Create complete task: description and estimated time',
      description:
        'create task [task title] description “task descr.” time estimated-time-minutes from tasklist-id',
      time: 0,
    },
    // Modify Tasks Commands
    {
      title: 'MODIFY TASKLISTS COMMANDS',
      description: '',
      time: 5,
    },
    {
      title: 'Modify task title',
      description:
        'modify task task-id title [new task title] from tasklist-id',
      time: 0,
    },
    {
      title: 'Modify task description',
      description:
        'modify task task-id description “new task descr.” from tasklist-id',
      time: 0,
    },
    {
      title: 'Modify task estimated time',
      description:
        'modify task task-id time new-estimated-time-minutes from tasklist-id',
      time: 0,
    },
    {
      title:
        'Modify all task properties: title, description and estimated time',
      description:
        'modify task task-id title [new task title] description “new task descr.” time new-estimated-time-minutes from tasklist-id',
      time: 0,
    },
    // Remove Tasks Commands
    {
      title: 'REMOVE TASKS COMMANDS',
      description: '',
      time: 5,
    },
    {
      title: 'Remove whole task (warning)',
      description: 'remove task task-id from tasklist-id',
      time: 0,
    },
    {
      title: 'Remove task description',
      description: 'remove task description task-id from tasklist-id',
      time: 0,
    },
    {
      title: 'Remove task estimated time',
      description: 'remove task time task-id  from tasklist-id',
      time: 0,
    },
    {
      title: 'Remove task description and estimated time',
      description: 'remove task description time task-id from tasklist-id',
      time: 0,
    },
  ],
};

export default TaskCommands;
