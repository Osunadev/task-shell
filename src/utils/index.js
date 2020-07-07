import Lexer from './lexer';
import TaskListParser from './parser';

export const runProvidedCommand = (taskListsArray, input) => {
  try {
    const lexer = new Lexer(input);
    const parser = new TaskListParser(lexer.tokens, taskListsArray);
    return { taskLists: parser.getModTaskListsArray(), error: undefined };
  } catch (error) {
    return {
      taskLists: taskListsArray,
      error: error.message,
    };
  }
};

// This functions helps us to update the current selected tasklist to be displayed on screen
export const updateSelTasklist = (
  taskListsLength,
  prevTaskListsLength,
  prevSelTaskList
) => {
  // If a tasklist was only modified
  if (prevTaskListsLength === taskListsLength) return prevSelTaskList;

  // If a new tasklist was created
  if (prevTaskListsLength < taskListsLength) return taskListsLength - 1;

  // If a tasklist was removed
  if (taskListsLength < prevTaskListsLength) {
    // If tasklist array is empty
    if (!taskListsLength) return -1;

    // If the prev selected tasklist respects the new length of the array
    if (prevSelTaskList < taskListsLength - 1) return prevSelTaskList;

    // If the prev selected tasklist was the end item
    return taskListsLength - 1;
  }
};
