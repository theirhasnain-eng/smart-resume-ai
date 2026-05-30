import { logoutAction } from '@/app/actions/logout';

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="btn-nav btn-nav-ghost logout-btn">
        <i className="fa-solid fa-right-from-bracket" />
        Logout
      </button>
    </form>
  );
}
