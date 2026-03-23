type InputProps = {
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  type?: string;
};

export function AdminInput({
  name,
  defaultValue,
  placeholder,
  type = "text",
}: InputProps) {
  return (
    <input
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      type={type}
      className="border p-2 rounded w-full"
    />
  );
}
