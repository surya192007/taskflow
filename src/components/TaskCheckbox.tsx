import React from 'react';
import { Check } from 'lucide-react';

interface TaskCheckboxProps {
  checked: boolean;
  onChange: (e: React.MouseEvent | React.ChangeEvent) => void;
  ariaLabel: string;
}

export const TaskCheckbox: React.FC<TaskCheckboxProps> = ({
  checked,
  onChange,
  ariaLabel,
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange(e);
      }}
      className={`w-5 h-5 rounded-[6px] inline-flex items-center justify-center shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 ${
        checked
          ? 'bg-[#3B82F6] border-[1.5px] border-[#3B82F6] text-white scale-100'
          : 'bg-white border-[1.5px] border-[#CBD5E1] hover:border-[#3B82F6] text-transparent'
      }`}
    >
      <Check
        className={`w-3.5 h-3.5 stroke-[2.5] transition-transform duration-150 ${
          checked ? 'scale-100' : 'scale-50 opacity-0'
        }`}
      />
    </button>
  );
};
