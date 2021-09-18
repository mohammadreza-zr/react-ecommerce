import React from 'react';
import './form-input.styles.scss';

const FormInput = ({handleChange, handleKeyDown, label, ...otherProps}) => (
    <div className='group '>
        <input className={otherProps.className? otherProps.className : 'form-input'} onChange={handleChange} onKeyDown={handleKeyDown} {...otherProps} />
        {
            label.length > 1 ? (
                <label
                    className={`${otherProps.value.length > 0 ? 'shrink': ''} form-input-label`}
                >
                    {label}
                </label>
            ) : null
        }
    </div>
)
export default FormInput;