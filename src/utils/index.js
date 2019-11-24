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
