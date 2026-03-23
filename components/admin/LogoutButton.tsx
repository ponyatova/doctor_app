import { logout } from "@/app/admin/login/action";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button className="text-red-500">Выйти</button>
    </form>
  );
}
