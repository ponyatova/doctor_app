type Props = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
};

export function AdminTextarea({ name, defaultValue, placeholder }: Props) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="border p-2 rounded w-full"
    />
  );
}
