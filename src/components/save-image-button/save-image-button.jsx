import React from 'react';

import './save-image-button.css';

const SaveImageButton = ({ children, onClick }) => (
  <button className='save-image-button' onClick={onClick}>
    {children}
  </button>
);

export default SaveImageButton;
