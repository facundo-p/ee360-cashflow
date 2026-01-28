import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';

type PasswordInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
};

export function PasswordInput({
  id = 'password',
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  minLength,
  autoComplete = 'current-password',
  disabled = false,
  className = '',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`
          w-full px-4 py-3 pr-12 rounded-xl border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          placeholder-gray-400 text-gray-900
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
      />

      <button
        type="button"
        onClick={() => setShowPassword((v) => !v)}
        onMouseDown={(e) => e.preventDefault()}
        className="
          absolute inset-y-0 right-3 flex items-center
          text-gray-500 hover:text-gray-700
          focus:outline-none
        "
        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        tabIndex={-1}
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}
