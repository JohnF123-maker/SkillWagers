"use client";
import { useState } from "react";
import ErrorTooltip from './ErrorTooltip';

const PasswordInput = ({ label = "Password", name, error = "", ...rest }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <label 
          className="auth-label" 
          htmlFor={name}
        >
          {label}
        </label>
        {error && <ErrorTooltip message={error} />}
      </div>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          className="auth-input auth-input-password"
          autoComplete="current-password"
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 border-none bg-transparent text-gray-500 hover:text-gray-700 cursor-pointer outline-none"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m0 0l3.122 3.122M12 12l-3.122-3.122" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
