import React from 'react';
import ErrorTooltip from './ErrorTooltip';

export default function AuthInput({
  label,
  name,
  register,
  type = "text",
  placeholder,
  error,
  inputProps = {},
  className = "",
}) {
  const errorId = error ? `${name}-error` : undefined;
  const { onBlur, ...registerProps } = register(name);

  const handleBlur = async (e) => {
    // Call react-hook-form's onBlur
    await onBlur(e);
    // Call any custom onBlur from inputProps
    if (inputProps.onBlur) {
      inputProps.onBlur(e);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="auth-label">{label}</label>
      <div className="relative">
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className={`auth-input ${error ? "border-red-600 focus:border-red-600 focus:ring-red-300 pr-10" : ""} ${className}`}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...registerProps}
          {...inputProps}
          onBlur={handleBlur}
        />
        <ErrorTooltip id={errorId} message={error?.message} />
      </div>
    </div>
  );
}