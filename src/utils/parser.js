const { tokenTypes } = require('./lexer.js');

class TaskListParser {
  constructor(tokens, taskListsObj) {
    this.tokens = tokens;
    this.taskListsArray = taskListsObj;
    this.tokenIdx = 0;
    // Creating a Deep Copy of the entire taskListsArray
    this.modTaskListsArray = JSON.parse(JSON.stringify(this.taskListsArray));

    // Start the parsing process
    this.startParsing();
  }

  startParsing() {
    const stmtValue = this.resolve(tokenTypes['StmtKeyword']).value;
    const elmtValue = this.resolve(tokenTypes['ElmtKeyword']).value;

    switch (stmtValue) {
      case 'create':
        if (elmtValue === 'tasklist') this.createTaskList();
        else this.createTask();
        break;
      case 'modify':
        if (elmtValue === 'tasklist') this.modifyTaskList();
        else this.modifyTask();
        break;
      case 'remove':
        if (elmtValue === 'tasklist') this.removeTaskList();
        else this.removeTask();
        break;
    }
  }

  isAnyTokenLeft() {
    return this.tokenIdx < this.tokens.length;
  }

  getCurrentToken() {
    return this.tokens[this.tokenIdx];
  }

  // Helpers methods to resolve any given value: taskId, taskListId, tokenType, etc...
  resolveTaskIdOfTaskList(taskListId, taskId) {
    this.resolveTaskListId(taskListId);

    if (taskId < 0)
      throw Error(
        "Parsing Error: Don't use numbers below of 1 when refering to task-id's!"
      );

    if (taskId > this.taskListsArray[taskListId].tasks.length - 1)
      throw Error(
        `Parsing Error: There's no task with the task-id of: '${taskId + 1}'!`
      );
  }

  resolveTaskListId(taskListId) {
    if (taskListId < 0)
      throw Error(
        "Parsing Error: Don't use numbers below of 1 when refering to tasklist-id's!"
      );

    // (this.taskListsArray.length - 1) because our taskListId has a starting point of 0
    if (taskListId > this.taskListsArray.length - 1)
      throw Error(
        `Parsing Error: There's no tasklist with the tasklist-id of: '${
          taskListId + 1
        }'!`
      );
  }

  resolve(tokenType) {
    if (!this.isAnyTokenLeft()) {
      throw Error(
        `Parsing Error: A token of type ${tokenType} was expected but we reached the end of the string input.`
      );
    }

    if (tokenType !== this.getCurrentToken().type) {
      throw Error(
        `Parsing Error: '${
          this.getCurrentToken().value
        }' token wasn't expected!`
      );
    }

    return this.tokens[this.tokenIdx++];
  }

  // A helper method to confirm if the value of the current AttrKeyword token is the same as the one we're looking for
  isCurrentTokenAttrValue(attrValue) {
    const actualAttrValue = this.resolve(tokenTypes['AttrKeyword']).value;

    if (actualAttrValue !== attrValue)
      throw Error(
        `Parsing Error: Expecting '${attrValue}' token, but instead got '${actualAttrValue}' token!`
      );
  }

  addTaskList(title = '', description = '', date = '') {
    this.modTaskListsArray.push({
      title,
      description,
      date,
      tasks: [],
    });
  }

  addTask(taskListId, title = '', description = '', time = '') {
    this.resolveTaskListId(taskListId);

    this.modTaskListsArray[taskListId].tasks.push({
      title,
      description,
      time,
    });
  }

  changeTaskList(taskListId, title, description, date) {
    this.resolveTaskListId(taskListId);

    if (typeof title !== 'undefined')
      this.modTaskListsArray[taskListId].title = title;
    if (typeof description !== 'undefined')
      this.modTaskListsArray[taskListId].description = description;
    if (typeof date !== 'undefined')
      this.modTaskListsArray[taskListId].date = date;
  }

  changeTask(taskListId, taskId, title, description, time) {
    this.resolveTaskIdOfTaskList(taskListId, taskId);

    if (typeof title !== 'undefined')
      this.modTaskListsArray[taskListId].tasks[taskId].title = title;
    if (typeof description !== 'undefined')
      this.modTaskListsArray[taskListId].tasks[
        taskId
      ].description = description;
    if (typeof time !== 'undefined')
      this.modTaskListsArray[taskListId].tasks[taskId].time = time;
  }

  eraseTaskList(taskListId) {
    this.resolveTaskListId(taskListId);

    // Deleting the taskList specified
    this.modTaskListsArray.splice(taskListId, 1);
  }

  eraseTask(taskListId, taskId) {
    this.resolveTaskIdOfTaskList(taskListId, taskId);

    // Deleting the task specified from its taskList
    this.modTaskListsArray[taskListId].tasks.splice(taskId, 1);
  }

  // Production methods: create tasklist, create task, modify tasklist, modify task, remove tasklist, remove task
  createTaskList() {
    const title = this.resolve(tokenTypes['TitleText']).value;
    let description = '';
    let date = '';

    if (this.isAnyTokenLeft()) {
      // If we still have some tokens left in our tokens array
      let attrValue = this.resolve(tokenTypes['AttrKeyword']).value;

      switch (attrValue) {
        case 'description':
          description = this.resolve(tokenTypes['DescriptionText']).value;

          if (this.isAnyTokenLeft()) {
            this.isCurrentTokenAttrValue('date');
            date = this.resolve(tokenTypes['DateFormat']).value;
          }
          break;
        case 'date':
          date = this.resolve(tokenTypes['DateFormat']).value;
          break;
        default:
          throw Error(
            `Parsing Error: '${attrValue}' attribute not applicable when creating tasklists!`
          );
      }
    }

    // After getting all of the useful values of our tokens, we're checking if there are no tokens left
    if (!this.isAnyTokenLeft()) {
      this.addTaskList(title, description, date);
    } else
      throw Error(
        `Parsing Error: Unexpected token at the end of the command: '${this.getCurrentToken()}'!`
      );
  }

  createTask() {
    const title = this.resolve(tokenTypes['TitleText']).value;
    let taskListId = 0;
    let description = '';
    let time = 0;

    let attrValue = this.resolve(tokenTypes['AttrKeyword']).value;

    // Checking for a 'from', 'description', 'time', 'description' attribute keyword
    switch (attrValue) {
      case 'from':
        taskListId =
          this.resolve(tokenTypes['Number']).value -
          1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
        break;

      case 'description':
        description = this.resolve(tokenTypes['DescriptionText']).value;
        attrValue = this.resolve(tokenTypes['AttrKeyword']).value;

        if (attrValue === 'from') {
          /* OPTION #2: create task [task title] description from tasklist-id */
          taskListId =
            this.resolve(tokenTypes['Number']).value -
            1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
        } else if (attrValue === 'time') {
          /* OPTION #4: create task [task title] description time estimated-time-in-minutes from tasklist-id */
          time = parseInt(this.resolve(tokenTypes['Number']).value);

          this.isCurrentTokenAttrValue('from');
          taskListId =
            this.resolve(tokenTypes['Number']).value -
            1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
        } else
          throw Error(
            `Parsing Error: '${attrValue}' id not a valid token. Expecting 'from' or 'time' tokens!`
          );
        break;

      case 'time':
        /* OPTION #3: create task [task title] time estimated-time-in-minutes from tasklist-id */
        time = parseInt(this.resolve(tokenTypes['Number']).value);

        this.isCurrentTokenAttrValue('from');
        taskListId =
          this.resolve(tokenTypes['Number']).value -
          1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
        break;

      default:
        throw Error(
          `Parsing Error: '${attrValue}' is not a valid initial token when creating tasks!`
        );
    }

    // After getting all of the useful values of our tokens, we're checking if there are no tokens left
    if (!this.isAnyTokenLeft()) {
      this.addTask(taskListId, title, description, time);
    } else
      throw Error(
        `Parsing Error: There shouldn't be a token after your your tasklist-id: '${
          taskListId + 1
        }' value!`
      );
  }

  modifyTaskList() {
    const taskListId =
      this.resolve(tokenTypes['Number']).value -
      1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
    let title = undefined;
    let description = undefined;
    let date = undefined;

    let attrValue = this.resolve(tokenTypes['AttrKeyword']).value;

    switch (attrValue) {
      case 'title':
        title = this.resolve(tokenTypes['TitleText']).value;

        if (this.isAnyTokenLeft()) {
          this.isCurrentTokenAttrValue('description');
          description = this.resolve(tokenTypes['DescriptionText']).value;
          attrValue = this.resolve(tokenTypes['AttrKeyword']).value; // it should be 'date'

          this.isCurrentTokenAttrValue('date');
          date = this.resolve(tokenTypes['DateFormat']).value;
        }
        break;

      case 'description':
        description = this.resolve(tokenTypes['DescriptionText']).value;
        break;

      case 'date':
        date = this.resolve(tokenTypes['DateFormat']).value;
        break;

      default:
        throw Error(
          `Parsing Error: '${attrValue}' is not a valid initial token when modifying tasklists!`
        );
    }

    // After getting all of the useful values of our tokens, we're checking if there are no tokens left
    if (!this.isAnyTokenLeft()) {
      this.changeTaskList(taskListId, title, description, date);
    } else
      throw Error(
        `Parsing Error: Unexpected token at the end of the command: '${
          this.getCurrentToken().value
        }'`
      );
  }

  modifyTask() {
    const taskId =
      this.resolve(tokenTypes['Number']).value -
      1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
    let taskListId = 0;
    let title = undefined;
    let description = undefined;
    let time = undefined;

    let attrValue = this.resolve(tokenTypes['AttrKeyword']).value;

    switch (attrValue) {
      case 'title':
        title = this.resolve(tokenTypes['TitleText']).value;

        attrValue = this.resolve(tokenTypes['AttrKeyword']).value; // it should be 'description'

        if (attrValue === 'from')
          taskListId = this.resolve(tokenTypes['Number']).value - 1;
        /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */ else if (
          attrValue === 'description'
        ) {
          description = this.resolve(tokenTypes['DescriptionText']).value;
          this.isCurrentTokenAttrValue('time');

          time = parseInt(this.resolve(tokenTypes['Number']).value);
          this.isCurrentTokenAttrValue('from');
          taskListId =
            this.resolve(tokenTypes['Number']).value -
            1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
        } else
          throw Error(
            `Parsing Error: Expecting 'from' or 'date' tokens, not '${attrValue}'`
          );

        break;

      case 'description':
        description = this.resolve(tokenTypes['DescriptionText']).value;

        this.isCurrentTokenAttrValue('from');
        taskListId =
          this.resolve(tokenTypes['Number']).value -
          1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
        break;

      case 'time':
        time = parseInt(this.resolve(tokenTypes['Number']).value);

        this.isCurrentTokenAttrValue('from');
        taskListId =
          this.resolve(tokenTypes['Number']).value -
          1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
        break;

      default:
        throw Error(
          `Parsing Error: '${attrValue}' is not a valid initial token when modifying tasks!`
        );
    }

    // After getting all of the useful values of our tokens, we're checking if there are no tokens left
    if (!this.isAnyTokenLeft()) {
      this.changeTask(taskListId, taskId, title, description, time);
    } else
      throw Error(
        `Parsing Error: Unexpected token: '${this.getCurrentToken().value}'`
      );
  }

  removeTaskList() {
    const currentToken = this.getCurrentToken();
    let taskListId = 0;
    let isEraseDescription = false;
    let isEraseDate = false;
    let isEraseTaskList = false;

    if (currentToken.type === tokenTypes['Number']) {
      // Deleting for sure the taskList
      isEraseTaskList = true;
      taskListId =
        this.resolve(tokenTypes['Number']).value -
        1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
    } else if (currentToken.type === tokenTypes['AttrKeyword']) {
      let attrValue = this.resolve(tokenTypes['AttrKeyword']).value;

      switch (attrValue) {
        case 'description':
          isEraseDescription = true;

          /* 'Deleting' only "description" */
          if (currentToken.type === tokenTypes['Number'])
            taskListId = this.resolve(tokenTypes['Number']) - 1;
          /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */ else {
            /* 'Deleting' both "description" and "date" */
            this.isCurrentTokenAttrValue('date');

            taskListId =
              this.resolve(tokenTypes['Number']).value -
              1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
            isEraseDate = true;
          }
          break;

        case 'date':
          taskListId =
            this.resolve(tokenTypes['Number']).value -
            1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
          /* 'Deleting' only "date" */
          isEraseDate = true;
          break;

        default:
          throw Error(
            `Only 'description' or 'date' tokens are valid when removing a tasklist attribute!.`
          );
      }
    } else
      throw Error(
        `Parsing Error: Unexpected token: '${this.getCurrentToken().value}'`
      );

    // After getting all of the useful values of our tokens, we're checking if there are no tokens left
    if (!this.isAnyTokenLeft()) {
      if (!isEraseTaskList) {
        // We actually only make some modifications
        this.changeTaskList(
          taskListId,
          undefined,
          isEraseDescription ? '' : undefined,
          isEraseDate ? '' : undefined
        );
      } else this.eraseTaskList(taskListId);
    } else
      throw Error(
        `Parsing Error: Unexpected token at the end of the statement: '${
          this.getCurrentToken().value
        }'`
      );
  }

  removeTask() {
    let taskId = 0;
    let taskListId = 0;
    let isEraseTask = false;
    let isEraseDescription = false;
    let isEraseTime = false;

    if (this.getCurrentToken().type === tokenTypes['AttrKeyword']) {
      let attrValue = this.resolve(tokenTypes['AttrKeyword']).value;

      switch (attrValue) {
        case 'time':
          isEraseTime = true;
          break;
        case 'description':
          isEraseDescription = true;

          if (this.getCurrentToken().value === 'time') {
            /* If we're also deleting the task time */
            isEraseTime = true;
            this.isCurrentTokenAttrValue('time');
          }
          break;
        default:
          throw Error(
            `Only 'description' or 'time' tokens are valid when removing a task attribute!.`
          );
      }
    } else if ((this.getCurrentToken().type = tokenTypes['Number'])) {
      // Wanting to remove the whole task, and not just the date
      isEraseTask = true;
    }

    taskId =
      this.resolve(tokenTypes['Number']).value -
      1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */
    this.isCurrentTokenAttrValue('from');
    taskListId =
      this.resolve(tokenTypes['Number']).value -
      1; /* -1 because we start our id's at 0, but they are displayed starting at 1 for the users */

    // After getting all of the useful values of our tokens, we're checking if there are no tokens left
    if (!this.isAnyTokenLeft()) {
      if (isEraseTask) {
        this.eraseTask(taskListId, taskId);
      } else {
        this.changeTask(
          taskListId,
          taskId,
          undefined,
          isEraseDescription ? '' : undefined,
          isEraseTime ? '' : undefined
        );
      }
    } else
      throw Error(
        `Parsing Error: Unexpected token at the end of the statement: '${
          this.getCurrentToken().value
        }'`
      );
  }

  getModTaskListsArray() {
    // Getter method that returns the new Modified TaskListsArray
    return this.modTaskListsArray;
  }
}

export default TaskListParser;
