import React, { useState, ChangeEvent, FocusEvent } from 'react';
import './TextField.scss';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (evt: FocusEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  required?: boolean;
  fullWidth?: boolean;
  touched?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
                                                      label,
                                                      value,
                                                      onChange,
                                                      onBlur,
                                                      error,
                                                      type = 'text',
                                                      required = false,
                                                      fullWidth = false,
                                                      touched = false,
                                                    }) => {
  const [focused, setFocused] = useState(false);
  const showError = error && touched;

  return (
    <div className={`text-field ${fullWidth ? 'full-width' : ''}`}>
      <div className={`text-field__wrap ${showError ? 'error' : ''} ${focused ? 'focused' : ''}`}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(evt) => {
            setFocused(false);
            onBlur?.(evt);
          }}
          required={required}
        />
        <label className={`label ${value || focused ? 'shrink' : ''}`}>
          {label}{required && '*'}
        </label>
      </div>
      {showError && <div className="error-message">{error}</div>}
    </div>
  );
};