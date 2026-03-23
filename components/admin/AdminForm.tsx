"use client";

import { ReactNode, useActionState } from "react";
import { useFormStatus } from "react-dom";

type ActionFn = (prevState: any, formData: FormData) => Promise<any>;

type Props = {
  action: ActionFn;
  children: ReactNode;
  submitText?: string;
  className?: string;
};

function SubmitButton({ submitText }: { submitText: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {pending ? "Сохранение..." : submitText}
    </button>
  );
}

export function AdminForm({
  action,
  children,
  submitText = "Сохранить",
  className = "",
}: Props) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className={`space-y-4 ${className}`}>
      {children}

      <SubmitButton submitText={submitText} />

      {/* error */}
      {state?.error && (
        <div className="text-red-500 text-sm">{state.error}</div>
      )}

      {/* success */}
      {state?.success && (
        <div className="text-green-600 text-sm">Сохранено</div>
      )}
    </form>
  );
}
