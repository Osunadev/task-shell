import Lexer from './lexer';
import TaskListParser from './parser';

export const runProvidedCommand = (taskListsArray, input) => {
  try {
    const lexer = new Lexer(input);
    const parser = new TaskListParser(lexer.tokens, taskListsArray);
    return { taskLists: parser.getModTaskListsArray(), status: '' };
  } catch (error) {
    return {
      taskLists: taskListsArray,
      status: error.message
    };
  }
};

// This functions helps us to update the current selected tasklist to be displayed on screen
export const updateSelTasklist = (
  taskListsLength,
  prevTaskListsLength,
  prevSelTaskList
) => {
  // If previous taskList array was empty, but now has its first taskList
  if (!prevTaskListsLength && taskListsLength) return 0;

  // If our new taskLists array has less tasklists than our previous taskLists array
  if (taskListsLength < prevTaskListsLength) {
    // If the last taskList was selected before
    if (prevSelTaskList === prevTaskListsLength - 1) return taskListsLength - 1;
    else return prevSelTaskList;
  } else {
    // Meaning that we didn't remove any taskList from our array
    return prevSelTaskList;
  }
};
