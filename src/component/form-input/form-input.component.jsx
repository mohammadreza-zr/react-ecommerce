import React from 'react';
import './form-input.styles.scss';

const FormInput = ({handleChange, label, ...otherProps}) => (
    <div className='group '>
        <input className={otherProps.className? otherProps.className : 'form-input'} onChange={handleChange} {...otherProps} />
        {
            label.length > 0 ? (
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