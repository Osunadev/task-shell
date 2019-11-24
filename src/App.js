import React, { Component } from 'react';

import { runProvidedCommand } from './utils/index';

import './App.css';
import SelectTaskLists from './components/select-tasklists/select-tasklists';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commandInput: '',
      commandError: '',
      taskLists: [],
      selTaskList: 0
    };
  }

  componentDidMount() {
    const taskListsBackup = localStorage.getItem('taskLists');

    if (taskListsBackup) {
      const { selTaskList, taskLists } = JSON.parse(taskListsBackup);
      this.setState({ taskLists, selTaskList });
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
          const commandResult = runProvidedCommand(
            prevState.taskLists,
            prevState.commandInput
          );

          return {
            commandInput: '',
            commandError: commandResult.status,
            taskLists: commandResult.taskLists
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
    const { commandInput, commandError, taskLists, selTaskList } = this.state;

    return (
      <div className='page-container'>
        <h1 className='page-title'>TASK-SHELL</h1>
        <input
          type='text'
          className='input-shell'
          value={`$ ${commandInput}`}
          onChange={this.handleCommandInput}
          onKeyPress={this.handleCommandSubmit}
          placeholder='Please enter a command...'
        />
        {commandError && <p className='error-message'>{commandError}</p>}
        <div className='page-content'>
          <SelectTaskLists
            taskLists={taskLists}
            selectedTaskListId={selTaskList}
            changeSelection={this.handleChangeTasklist}
          />
          <div className='page-content--table'>
            {taskLists.map((taskList, id) => (
              <p>{taskList.title}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
