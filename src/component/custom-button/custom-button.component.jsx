import React from 'react';
import './custom-button.styles.scss';

const CustomButton = ({children, ...otherProps}) => (
    <button className={otherProps.className? otherProps.className : 'custom-button'} {...otherProps}>
        {children}
    </button>
);
export default CustomButton;