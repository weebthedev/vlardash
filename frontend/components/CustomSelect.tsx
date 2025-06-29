import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-64 text-white" ref={ref}>
      <button
        className="bg-[#2e2e2e] w-full px-3 py-2 rounded-md flex justify-between items-center hover:bg-[#383838] transition"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <span className="flex items-center gap-2">
          {selected?.icon}
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#2e2e2e] border border-[#3f3f3f] rounded-md shadow-lg max-h-64 overflow-y-auto">
          <input
            className="w-full px-3 py-2 bg-[#1e1e1e] border-b border-[#3f3f3f] text-white focus:outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredOptions.map((opt) =>
            opt.disabled ? (
              <div
                key={opt.value}
                className="px-3 py-2 text-sm text-gray-400 bg-[#1e1e1e] font-medium flex items-center gap-2 cursor-default"
              >
                {opt.icon}
                {opt.label}
              </div>
            ) : (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch('');
                }}
                className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-[#444]"
              >
                {opt.icon}
                {opt.label}
              </button>
            )
          )}
          {filteredOptions.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
