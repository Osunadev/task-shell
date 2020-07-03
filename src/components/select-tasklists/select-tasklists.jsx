import React from 'react';

import './select-tasklists.css';

import SelectTasklistButton from '../select-tasklist-button/select-tasklist-button';

const SelectTasklists = ({
  instructionsList,
  taskLists,
  selectedTaskListId,
  changeSelection,
}) => {
  return (
    <div className="page-content--tasklists">
      <p className="select-tasklist-title">
        {instructionsList ? 'COMMANDS INSTRUCTIONS' : 'CREATED TASKLISTS'}
      </p>
      {taskLists.map((taskList, id) => (
        <SelectTasklistButton
          instructionBtn={instructionsList}
          key={id}
          taskListId={id}
          taskListTitle={taskList.title}
          isSelected={id === selectedTaskListId}
          changeSelection={changeSelection}
        />
      ))}
    </div>
  );
};

export default SelectTasklists;
