import React from 'react';

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
};

export default function DateInputWithPlaceholder({
  value,
  onChange,
  placeholder,
  className,
}: Props) {
  const isEmpty = !value;

  return (
    <div className="relative">
      {isEmpty && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {placeholder}
        </span>
      )}

      <input
        type="date"
        value={value}
        onChange={onChange}
        className={`${className} ${isEmpty ? 'date-input-empty' : ''}`}
      />
    </div>
  );
}
