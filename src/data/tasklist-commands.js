const TasklistCommands = {
  title: 'Tasklist Commands',
  description:
    'These are the available commands to be used in task-shell to create, modify and remove tasklists.',
  date: '02/07/2020',
  tasks: [
    // Create Tasklist Commands
    {
      title: 'CREATE TASKLIST COMMANDS',
      description: '',
      time: 5,
    },
    {
      title: 'Create simple tasklist',
      description: 'create tasklist [tasklist title]',
      time: 0,
    },
    {
      title: 'Create tasklist with description',
      description:
        'create tasklist [tasklist title] description “some tasklist descr”',
      time: 0,
    },
    {
      title: 'Create tasklist with date',
      description: 'create tasklist [tasklist title] date dd/mm/yyyy',
      time: 0,
    },
    {
      title: 'Create complete tasklist: description and date',
      description:
        'create tasklist [tasklist title] description “some tasklist descr” date dd/mm/yyyy',
      time: 0,
    },
    // Modify Tasklists Commands
    {
      title: 'MODIFY TASKLIST COMMANDS',
      description: '',
      time: 5,
    },
    {
      title: 'Modify tasklist title',
      description: 'modify tasklist tasklist-id title [new tasklist name]',
      time: 0,
    },
    {
      title: 'Modify tasklist description',
      description:
        'modify tasklist tasklist-id description “new tasklist descr”',
      time: 0,
    },
    {
      title: 'Modify tasklist date',
      description: 'modify tasklist tasklist-id date dd/mm/yyyy',
      time: 0,
    },
    {
      title: 'Modify all tasklist properties: title, description and date',
      description:
        'modify tasklist tasklist-id title [new tasklist title] description “new tasklist descr” date dd/mm/yyyy',
      time: 0,
    },
    // Remove Tasklists Commands
    {
      title: 'REMOVE TASKLISTS COMMANDS',
      description: '',
      time: 5,
    },
    {
      title: 'Remove whole tasklist (warning)',
      description: 'remove tasklist tasklist-id',
      time: 0,
    },
    {
      title: 'Remove tasklist description',
      description: 'remove tasklist description tasklist-id',
      time: 0,
    },
    {
      title: 'Remove tasklist date',
      description: 'remove tasklist date tasklist-id',
      time: 0,
    },
    {
      title: 'Remove tasklist description and date',
      description: 'remove tasklist description date tasklist-id',
      time: 0,
    },
  ],
};

export default TasklistCommands;
