import React, { Component } from 'react';

import { runProvidedCommand, updateSelTasklist } from './utils/index';
import { generateTableImage } from './App.utils';

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
      maxCachedInputs: 5 // We're only storing up to 5 commands in our cache
    };
  }

  componentDidMount() {
    const taskListsBackup = localStorage.getItem('taskLists');

    if (taskListsBackup) {
      const { selTaskList, taskLists } = JSON.parse(taskListsBackup);
      this.setState({ isLoading: false, taskLists, selTaskList });
    } else {
      this.setState({ isLoading: false });
    }
  }

  backupTaskLists = () => {
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

  handleCommandSubmit = event => {};

  handleChangeTasklist = selectedIndex => {
    this.setState({ selTaskList: selectedIndex }, () => this.backupTaskLists());
  };

  handleKeyDown = event => {
    // eslint-disable-next-line default-case
    switch (event.keyCode) {
      case 13: // Enter pressed
        this.setState(
          prevState => {
            // Running the provided command
            const { status, taskLists } = runProvidedCommand(
              prevState.taskLists,
              prevState.commandInput
            );
            // Updating the selected Task List index
            const newSelTaskList = updateSelTasklist(
              taskLists.length,
              prevState.taskLists.length,
              prevState.selTaskList
            );

            // Storing the command in our inputCommandsArray
            if (prevState.inputCommandsArr.length < prevState.maxCachedInputs) {
              this.state.inputCommandsArr.push(prevState.commandInput);
            } else {
              // If we reach the limit of our inputCommandsArray
              this.state.inputCommandsArr.shift(); // Deleting the first cached command
              this.state.inputCommandsArr.push(prevState.commandInput);
            }

            return {
              commandInput: '',
              commandError: status,
              taskLists: taskLists,
              selTaskList: newSelTaskList,
              cachedInputsIdx: -1 // Restarting our index for moving through the cached commands
            };
          },
          () => {
            this.backupTaskLists();
          }
        );
        break;

      case 38: // Up key pressed
        this.setState(prevState => {
          const commandsArrLen = prevState.inputCommandsArr.length;

          // If it's our first time moving through the cached commands
          if (prevState.cachedInputsIdx === -1 && commandsArrLen) {
            return {
              commandInput: prevState.inputCommandsArr[commandsArrLen - 1],
              cachedInputsIdx: commandsArrLen - 1
            };
          } else if (prevState.cachedInputsIdx === 0) {
            // If we got to the top of the oldest command
            return {
              commandInput: prevState.inputCommandsArr[0]
            };
          } else {
            return {
              commandInput:
                prevState.inputCommandsArr[prevState.cachedInputsIdx - 1],
              cachedInputsIdx: prevState.cachedInputsIdx - 1
            };
          }
        });
        break;

      case 40: // Down key pressed
        this.setState(prevState => {
          const commandsArrLen = prevState.inputCommandsArr.length;

          if (prevState.cachedInputsIdx === -1) {
            return {
              commandInput: ''
            };
          } else if (prevState.cachedInputsIdx === commandsArrLen - 1) {
            // If we got to the top of the newest command
            return {
              commandInput:
                prevState.inputCommandsArr[prevState.cachedInputsIdx],
              cachedInputsIdx: -1
            };
          } else {
            return {
              commandInput:
                prevState.inputCommandsArr[prevState.cachedInputsIdx],
              cachedInputsIdx: prevState.cachedInputsIdx + 1
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
      taskLists,
      selTaskList,
      isLoading
    } = this.state;

    return (
      <div className='page-container'>
        {!isLoading && (
          <>
            <h1 className='page-title'>TASK-SHELL</h1>
            <InputShell
              commandInput={commandInput}
              handleCommandInput={this.handleCommandInput}
              handleCommandSubmit={this.handleCommandSubmit}
              handleKeyDown={this.handleKeyDown}
            />
            {commandError && <p className='error-message'>{commandError}</p>}
            {selTaskList >= 0 && (
              <div className='page-content'>
                <SelectTaskLists
                  taskLists={taskLists}
                  selectedTaskListId={selTaskList}
                  changeSelection={this.handleChangeTasklist}
                />
                <div className='page-content--table'>
                  <TaskListTable
                    taskListId={selTaskList}
                    taskList={taskLists[selTaskList]}
                  />
                  <SaveImageButton
                    onClick={() => {
                      generateTableImage(taskLists, selTaskList);
                    }}
                  >
                    Save tasklist as Image
                  </SaveImageButton>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export default App;
