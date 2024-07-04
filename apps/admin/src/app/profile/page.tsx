"use client";

import { MapPinIcon } from "@heroicons/react/24/outline";
import { Button } from "@spin-spot/components";
import { useAuth, useBookingsByOwner, useBookingsByPlayer, useUserTournaments } from "@spin-spot/services";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useScrollLock } from "usehooks-ts";

export default function Profile() {
  useScrollLock();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const Tournaments = useUserTournaments(user?._id ?? "")
  const totalTournaments = Tournaments.data?.length ?? 0;
  const activeOwnerBookings = useBookingsByOwner(user?._id ?? "");
  const activePlayerBookings = useBookingsByPlayer(user?._id ?? "");
  const totalBookings = (activeOwnerBookings.data?.length ?? 0) + (activePlayerBookings.data?.length ?? 0 );

  const handleEditClick = () => {
    router.push("/profile/edit");
  };

  const handleBackClick = () => {
    router.push("/dashboard");
  };

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  const userFullName = `${user?.firstName} ${user?.lastName}`;

  return (
    <>
      {/* Profile Info */}
      <div className="flex flex-col items-center justify-center">
        <div className="w-90 h-32 overflow-hidden rounded-full bg-black">
          <Image
            src="/DefaultUserImage.png" // PONER PERFIL DE USUARIO
            alt={user ? userFullName : "User"}
            width={128}
            height={128}
            className="object-cover"
          />
        </div>
        <h1 className="text-secondary mt-4 text-center text-2xl font-bold dark:text-white">
          {user ? userFullName : "Jane Doe"}
        </h1>
        <div className="flex items-center justify-center gap-1">
          <MapPinIcon className="text-neutral h-6 w-6"></MapPinIcon>
          <p className="text-neutral mt-2 text-center">
            Universidad Metropolitana
          </p>
        </div>
        <div className="mt-4 flex justify-center gap-6">
          <div className="text-center">
            <p className="text-secondary text-lg font-semibold dark:text-white">
              {totalBookings}
            </p>
            <p className="text-neutral text-sm">Reservas Activas</p>
          </div>
          <div className="text-center">
            <p className="text-secondary text-lg font-semibold dark:text-white">
              {totalTournaments}
            </p>
            <p className="text-neutral text-sm">Torneos</p>
          </div>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <Button
            className="btn-sm btn-secondary w-24"
            label="Volver"
            labelSize="text-md"
            onClick={handleBackClick}
          />
          <Button
            className="btn-sm btn-primary"
            label="Editar Perfil"
            labelSize="text-md"
            onClick={handleEditClick}
          />
        </div>
      </div>
    </>
  );
}
