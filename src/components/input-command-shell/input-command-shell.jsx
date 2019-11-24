import React from 'react';

import './input-command-shell.css';

const InputComandShell = ({ text }) => (
  <div className='container-input'>
    <input className='input-shell' type='text' value={`$ ${text}`} />
  </div>
);

export default InputComandShell;
