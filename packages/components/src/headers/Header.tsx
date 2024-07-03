"use client";

import { useAuth, useSignOut } from "@spin-spot/services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SpinSpotIcon } from "../extra-icons";
import { Loader } from "../loaders";

interface HeaderProps {
  isAdmin?: boolean;
}

export function Header({ isAdmin = false }: HeaderProps) {
  const user = useAuth();
  const signOut = useSignOut();
  const router = useRouter();

  console.log(user);

  const handleLogoutClick = () => {
    signOut.mutate();
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleTablesClick = () => {
    router.push("/tables");
  };

  const handleReservesClick = () => {
    router.push("/reserves");
  };

  const handleHomeClick = () => {
    router.push("/dashboard");
  };

  const handleTournamentsClick = () => {
    router.push("/tournaments");
  };

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          {isAdmin ? (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a onClick={handleHomeClick}>Dashboard</a>
              </li>
              <li>
                <a onClick={handleTablesClick}>Gestión de Mesas</a>
              </li>
              <li>
                <a onClick={handleReservesClick}>Gestión de Reservas</a>
              </li>
              <li>
                <a onClick={handleTournamentsClick}>Gestión de Torneos</a>
              </li>
            </ul>
          ) : (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a onClick={handleHomeClick}>Home</a>
              </li>
              <li>
                <a onClick={handleTablesClick}>Mesas</a>
              </li>
              <li>
                <a onClick={handleTournamentsClick}>Torneos</a>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="navbar-center">
        <Link
          href="/dashboard"
          tabIndex={0}
          role="button"
          className="btn btn-link btn-lg avatar"
        >
          <SpinSpotIcon className="dark:text-base-100" />
        </Link>
      </div>
      <div className="navbar-end">
        {!user.isLoading ? (
          <div className="dropdown dropdown-end flex">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-full rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-[60px] w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between" onClick={handleProfileClick}>
                  Perfil
                </a>
              </li>
              <li>
                <a className="text-red-500" onClick={handleLogoutClick}>
                  Cerrar Sesión
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <Loader size="lg" className="text-primary" />
        )}
      </div>
    </div>
  );
}
