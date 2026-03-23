"use client";

import { SelectHTMLAttributes } from "react";

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  name: string;
  options: Option<T>[];
  defaultValue?: T;
  label?: string;
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function AdminSelect<T extends string>({
  name,
  options,
  defaultValue,
  label,
  className = "",
  ...props
}: Props<T>) {
  return (
    <div className="flex flex-col gap-1 w-full min-w-0">
      {label && <label className="text-sm text-slate-600">{label}</label>}

      <select
        name={name}
        defaultValue={defaultValue}
        className={`
          block
          border border-slate-300
          rounded-md
          px-3 py-2
          bg-white
          text-sm
          outline-none
          focus:ring-2 focus:ring-black
          focus:border-black
          transition
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
