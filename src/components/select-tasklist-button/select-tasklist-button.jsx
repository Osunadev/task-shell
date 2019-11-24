import React from 'react';

import './select-tasklist-button.css';

const SelectTasklistButton = ({
  taskListId,
  taskListTitle,
  isSelected,
  changeSelection
}) => {
  return (
    <div
      className={`select-tasklist-container ${isSelected ? 'selected' : ''}`}
      onClick={() => changeSelection(taskListId)}
    >
      {/* taskListId + 1 because the user sees the taskListId starging at 1, not 0 */}
      <span className='select-tasklist-button-id'>{taskListId + 1}</span>
      <span className='select-tasklist-button-title'>{taskListTitle}</span>
    </div>
  );
};

export default SelectTasklistButton;
