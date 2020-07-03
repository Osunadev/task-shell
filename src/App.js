import React, { Component } from 'react';

import { runProvidedCommand, updateSelTasklist } from './utils/index';
import { generateTableImage } from './App.utils';
import { backupTaskLists, backupInputCommands } from './utils/storage-backup';

// Instruction commands in order to use task-shell
import TasklistCommands from './data/tasklist-commands';
import TaskCommands from './data/task-commands';

import './App.css';
import InputShell from './components/input-shell/input-shell';
import SelectTaskLists from './components/select-tasklists/select-tasklists';
import TaskListTable from './components/tasklist-table/tasklist-table';
import SaveImageButton from './components/save-image-button/save-image-button';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, // A flag to display only our content when it's false
      commandInput: '',
      commandError: '',
      taskLists: [],
      selTaskList: -1, // Meaning that there's no tasklist within our taskLists array
      inputCommandsArr: [],
      cachedInputsIdx: -1, // This id helps us to move between the different commands we have in cache
      maxCachedInputs: 5, // We're only storing up to 5 commands in our cache
      instructionsArr: [TasklistCommands, TaskCommands],
      currentTasklist: TasklistCommands, // The tasklist object to display in screen
      selInstrList: 0,
    };
  }

  componentDidMount() {
    const taskListsBackup = localStorage.getItem('taskLists');
    const commandsHistoryBackup = localStorage.getItem('commandsHistory');

    // Default state values
    let selTaskList = -1;
    let taskLists = [];
    let inputCommandsArr = [];
    let currentTasklist;
    let selInstrList;

    if (taskListsBackup) {
      const taskListsObj = JSON.parse(taskListsBackup);
      selTaskList = taskListsObj.selTaskList;
      taskLists = taskListsObj.taskLists;

      currentTasklist = taskLists[selTaskList];
      selInstrList = -1; // Since we found created tasklists in storage, we don't need to show instructions
    } else {
      currentTasklist = this.state.currentTasklist;
      selInstrList = 0;
    }

    if (commandsHistoryBackup) {
      inputCommandsArr = JSON.parse(commandsHistoryBackup);
    }

    this.setState({
      isLoading: false,
      inputCommandsArr,
      taskLists,
      selTaskList,
      selInstrList,
      currentTasklist,
    });
  }

  tasklistsBackup = () => {
    const { taskLists, selTaskList } = this.state;
    localStorage.setItem(
      'taskLists',
      JSON.stringify({ taskLists, selTaskList })
    );
  };

  handleCommandInput = event => {
    const { value } = event.target;

    // We're skipping the first 2 string characters because that's our inputs prefix
    this.setState({ commandInput: value.substring(2) });
  };

  handleChangeTasklist = selectedIndex => {
    const { taskLists } = this.state;

    const currentTasklist = taskLists[selectedIndex];

    this.setState(
      { selTaskList: selectedIndex, currentTasklist, selInstrList: -1 },
      () => backupTaskLists(taskLists, selectedIndex)
    );
  };

  handleChangeInstructionList = selectedIndex => {
    const { instructionsArr } = this.state;

    const currentTasklist = instructionsArr[selectedIndex];

    this.setState({
      selTaskList: -1,
      selInstrList: selectedIndex,
      currentTasklist,
    });
  };

  runExecutionCommand = () => {
    this.setState(
      prevState => {
        // Running the provided command
        const { error, taskLists } = runProvidedCommand(
          prevState.taskLists,
          prevState.commandInput
        );

        // If we don't have an error: our command was successful
        if (!error) {
          // Updating the selected Task List index
          const newSelTaskList = updateSelTasklist(
            taskLists.length,
            prevState.taskLists.length,
            prevState.selTaskList
          );

          let currentTasklist;
          let selInstrList;

          // If the last tasklist was deleted
          if (newSelTaskList < 0) {
            currentTasklist = prevState.instructionsArr[0];
            selInstrList = 0;
          } else {
            // Updating the new selected tasklist
            currentTasklist = taskLists[newSelTaskList];
            selInstrList = -1;
          }

          // Storing the command in our inputCommandsArray
          if (prevState.inputCommandsArr.length < prevState.maxCachedInputs) {
            this.state.inputCommandsArr.push(prevState.commandInput);
          } else {
            // If we reach the limit of our inputCommandsArray
            this.state.inputCommandsArr.shift(); // Deleting the first cached command
            this.state.inputCommandsArr.push(prevState.commandInput);
          }

          // Backing up our history of commands
          backupInputCommands(prevState.inputCommandsArr);

          return {
            commandInput: '',
            commandError: error,
            selTaskList: newSelTaskList,
            cachedInputsIdx: -1, // Restarting our index for moving through the cached commands
            selInstrList,
            taskLists,
            currentTasklist,
          };
        }

        // If we have an error, we keep the command intact, to give the user a chance to correct the typo
        return {
          commandInput: prevState.commandInput,
          commandError: error,
        };
      },
      () => {
        this.tasklistsBackup();
      }
    );
  };

  handleKeyDown = event => {
    // eslint-disable-next-line default-case
    switch (event.keyCode) {
      case 13: // Enter pressed
        this.runExecutionCommand();
        break;

      case 38: // Up key pressed
        this.setState(prevState => {
          const commandsArrLen = prevState.inputCommandsArr.length;

          // If we don't have any command stored
          if (!commandsArrLen) {
            return {
              commandInput: '',
            };
          }
          // If it's our first time moving through the cached commands
          else if (prevState.cachedInputsIdx === -1 && commandsArrLen) {
            return {
              commandInput: prevState.inputCommandsArr[commandsArrLen - 1],
              cachedInputsIdx: commandsArrLen - 1,
            };
          } else if (prevState.cachedInputsIdx === 0) {
            // If we got to the top of the oldest command
            return {
              commandInput: prevState.inputCommandsArr[0],
            };
          } else {
            return {
              commandInput:
                prevState.inputCommandsArr[prevState.cachedInputsIdx - 1],
              cachedInputsIdx: prevState.cachedInputsIdx - 1,
            };
          }
        });
        break;

      case 40: // Down key pressed
        this.setState(prevState => {
          const commandsArrLen = prevState.inputCommandsArr.length;

          if (prevState.cachedInputsIdx === -1) {
            return {
              commandInput: '',
            };
          } else if (prevState.cachedInputsIdx === commandsArrLen - 1) {
            // If we got to the top of the newest command
            return {
              commandInput:
                prevState.inputCommandsArr[prevState.cachedInputsIdx],
              cachedInputsIdx: -1,
            };
          } else {
            return {
              commandInput:
                prevState.inputCommandsArr[prevState.cachedInputsIdx],
              cachedInputsIdx: prevState.cachedInputsIdx + 1,
            };
          }
        });

        break;
    }
  };

  render() {
    const {
      commandInput,
      commandError,
      instructionsArr,
      taskLists,
      selTaskList,
      isLoading,
      currentTasklist,
      selInstrList,
    } = this.state;

    return (
      <div className="page-container">
        {!isLoading && (
          <>
            <h1 className="page-title">TASK-SHELL</h1>
            <InputShell
              commandInput={commandInput}
              handleCommandInput={this.handleCommandInput}
              handleKeyDown={this.handleKeyDown}
            />
            {commandError && <p className="error-message">{commandError}</p>}
            <div className="page-content">
              <div className="page-content--select-panel">
                {
                  /* Created Tasklists */
                  taskLists.length ? (
                    <SelectTaskLists
                      taskLists={taskLists}
                      selectedTaskListId={selTaskList}
                      changeSelection={this.handleChangeTasklist}
                    />
                  ) : null
                }

                {/* Instructions Commands Tasklists*/}
                <SelectTaskLists
                  instructionsList
                  taskLists={instructionsArr}
                  selectedTaskListId={selInstrList}
                  changeSelection={this.handleChangeInstructionList}
                />
              </div>

              <div className="page-content--table">
                <TaskListTable taskList={currentTasklist} />

                {
                  /* if none of the command lists are selected */
                  selInstrList < 0 ? (
                    <SaveImageButton
                      onClick={() => {
                        generateTableImage(taskLists, selTaskList);
                      }}
                    >
                      Save tasklist as Image
                    </SaveImageButton>
                  ) : null
                }
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default React.memo(App);
