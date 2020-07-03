import React from 'react';

import './select-tasklist-button.css';

const SelectTasklistButton = ({
  instructionBtn,
  taskListId,
  taskListTitle,
  isSelected,
  changeSelection,
}) => {
  let btnContainerClass;

  if (instructionBtn) {
    btnContainerClass = `select-instruction-container ${
      isSelected ? 'selected-instruction' : ''
    }`;
  } else {
    btnContainerClass = `select-tasklist-container ${
      isSelected ? 'selected' : ''
    }`;
  }

  return (
    <div
      className={btnContainerClass}
      onClick={() => changeSelection(taskListId)}
    >
      {/* taskListId + 1 because the user sees the taskListId starging at 1, not 0 */}
      {instructionBtn ? (
        <p>{taskListTitle}</p>
      ) : (
        <>
          <span className="select-tasklist-button-id">{taskListId + 1}</span>
          <span className="select-tasklist-button-title">{taskListTitle}</span>
        </>
      )}
    </div>
  );
};

export default SelectTasklistButton;
