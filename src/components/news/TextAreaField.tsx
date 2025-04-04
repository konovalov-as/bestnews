import React, {
  ChangeEvent,
  FocusEvent,
  useState
} from 'react';
import './TextField.scss';

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (evt: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (evt: FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  rows?: number;
  touched?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
                                                              label,
                                                              value,
                                                              onChange,
                                                              onBlur,
                                                              error,
                                                              required = false,
                                                              fullWidth = false,
                                                              rows = 3,
                                                              touched = false
                                                            }) => {
  const [focused, setFocused] = useState(false);
  const showError = error && touched;

  return (
    <div className={`text-field ${fullWidth ? 'full-width' : ''}`}>
      <div className={`text-field__wrap ${showError ? 'error' : ''} ${focused ? 'focused' : ''}`}>
        <textarea
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(evt) => {
            setFocused(false);
            onBlur?.(evt);
          }}
          required={required}
          rows={rows}
        />
        <label className={`label ${(value || focused) ? 'shrink' : ''}`}>
          {label}{required && '*'}
        </label>
      </div>
      {showError && <div className="error-message">{error}</div>}
    </div>
  );
};