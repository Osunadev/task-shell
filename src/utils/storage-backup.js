export const backupTaskLists = (taskLists, selTaskList) => {
  localStorage.setItem('taskLists', JSON.stringify({ taskLists, selTaskList }));
};

export const backupInputCommands = inputCommandsArr => {
  localStorage.setItem('commandsHistory', JSON.stringify(inputCommandsArr));
};
