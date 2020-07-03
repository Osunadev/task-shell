import React from 'react';

import './input-shell.css';

const InputShell = ({ commandInput, handleCommandInput, handleKeyDown }) => (
  <input
    type="text"
    className="input-shell"
    value={`$ ${commandInput}`}
    onChange={handleCommandInput}
    onKeyDown={handleKeyDown}
    placeholder="Please enter a command..."
  />
);

export default InputShell;
