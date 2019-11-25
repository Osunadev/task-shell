import React from 'react';

import './input-shell.css';

const InputShell = ({
  commandInput,
  handleCommandInput,
  handleCommandSubmit,
  handleKeyDown
}) => (
  <input
    type='text'
    className='input-shell'
    value={`$ ${commandInput}`}
    onChange={handleCommandInput}
    onKeyPress={handleCommandSubmit}
    onKeyDown={handleKeyDown}
    placeholder='Please enter a command...'
  />
);

export default InputShell;
