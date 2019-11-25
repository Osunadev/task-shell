import React from 'react';

import './input-shell.css';

const InputShell = ({
  commandInput,
  handleCommandInput,
  handleCommandSubmit
}) => (
  <input
    type='text'
    className='input-shell'
    value={`$ ${commandInput}`}
    onChange={handleCommandInput}
    onKeyPress={handleCommandSubmit}
    placeholder='Please enter a command...'
  />
);

export default InputShell;
