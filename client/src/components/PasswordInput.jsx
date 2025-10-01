"use client";
import { useState } from "react";

const PasswordInput = ({ label = "Password", name, className = "", ...rest }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          className={`w-full rounded-xl border px-4 py-3 pr-12 ${className}`}
          autoComplete="current-password"
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute inset-y-0 right-2 my-auto text-sm underline text-gray-600 hover:text-gray-800"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;