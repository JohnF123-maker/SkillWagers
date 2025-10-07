"use client";
import { useState } from "react";
import ErrorTooltip from './ErrorTooltip';

const PasswordInput = ({ label = "Password", name, error = "", ...rest }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <label 
          className="block text-sm font-medium mb-1" 
          htmlFor={name}
          style={{ color: 'white' }}
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
          style={{
            backgroundColor: 'white',
            color: 'black',
            border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            padding: '12px 48px 12px 16px',
            width: '100%',
            fontSize: '14px',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#f59e0b';
            e.target.style.boxShadow = error ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : '0 0 0 2px rgba(245, 158, 11, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
          autoComplete="current-password"
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '8px',
            border: 'none',
            background: 'transparent',
            color: '#6b7280',
            cursor: 'pointer',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#374151';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#6b7280';
          }}
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
