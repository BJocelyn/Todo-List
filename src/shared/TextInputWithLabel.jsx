import { forwardRef } from 'react';

const TextInputWithLabel = forwardRef(function TextInputWithLabel(
  { elementId, labelText, onChange, value, type = 'text', required = false },
  ref
) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>

      <input
        id={elementId}
        type={type}
        value={value}
        onChange={onChange}
        ref={ref}
        required={required}
      />
    </>
  );
});

export default TextInputWithLabel;
