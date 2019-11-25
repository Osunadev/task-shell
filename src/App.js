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
      selTaskList: -1 // Meaning that there's no tasklist within our taskLists array
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

  handleCommandSubmit = event => {
    if (event.key === 'Enter') {
      // Cleaning up the input and updating our taskLists array
      this.setState(
        prevState => {
          const { status, taskLists } = runProvidedCommand(
            prevState.taskLists,
            prevState.commandInput
          );

          const newSelTaskList = updateSelTasklist(
            taskLists.length,
            prevState.taskLists.length,
            prevState.selTaskList
          );

          console.log(newSelTaskList);

          return {
            commandInput: '',
            commandError: status,
            taskLists: taskLists,
            selTaskList: newSelTaskList
          };
        },
        () => {
          this.backupTaskLists();
        }
      );
    }
  };

  handleChangeTasklist = selectedIndex => {
    this.setState({ selTaskList: selectedIndex }, () => this.backupTaskLists());
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
