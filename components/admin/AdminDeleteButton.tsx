"use client";

type Props = {
  action: (id: string) => Promise<any>;
  id: string;
};

export function AdminDeleteButton({ action, id }: Props) {
  return (
    <button
      type="button"
      onClick={async () => {
        await action(id);
      }}
      className="text-red-500 text-sm"
    >
      Удалить
    </button>
  );
}
