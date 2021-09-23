import React from 'react';
import './custom-button.styles.scss';

const CustomButton = ({ children, inverted, ...otherProps }) => (
  <button
    className={`${inverted ? 'inverted' : ''}
    ${otherProps.className ? otherProps.className : 'custom-button'}`}
    {...otherProps}
  >
    {children}
  </button>
);
export default CustomButton;
