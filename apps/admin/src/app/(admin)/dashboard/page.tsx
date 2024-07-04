"use client";

import {
  ChartBarIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Button, Card, Loader, PingPongIcon } from "@spin-spot/components";
import Stat from "@spin-spot/components/stats/Stat";
import {
  useAuth,
  useBookings,
  useTables,
  useTournaments,
  useUsers,
} from "@spin-spot/services";
import { useRouter } from "next/navigation";

export default function dashboard() {
  const users = useUsers();
  const { user } = useAuth();
  const tournaments = useTournaments();
  const tables = useTables();
  const bookings = useBookings();
  const router = useRouter();

  console.log(users);

  const statsData = [
    {
      icon: <UserGroupIcon className="inline-block h-8 w-8 stroke-current" />,
      title: "Usuarios Activos",
      value: users.data?.length,
      description: "Since 2024",
      isLoading: tournaments.isLoading,
    },
    {
      icon: <TrophyIcon className="inline-block h-8 w-8 stroke-current" />,
      title: "Torneos Creados",
      value: tournaments.data?.length,
      description: "↗︎ 400 (22%)",
      isLoading: tournaments.isLoading,
    },
    {
      icon: (
        <PingPongIcon className="text-primary inline-block h-10 w-10 stroke-current" />
      ),
      title: "Mesas Registradas",
      value: tables.data?.length,
      description: "↘︎ 90 (14%)",
      isLoading: tables.isLoading,
    },
    {
      icon: <ChartBarIcon className="inline-block h-8 w-8 stroke-current" />,
      title: "Reservas Realizadas",
      value: bookings.data?.length,
      description: "↘︎ 90 (14%)",
      isLoading: bookings.isLoading,
    },
  ];

  const getCarouselClass = (cards: string | any[]) =>
    cards.length <= 4
      ? cards.length <= 1
        ? "justify-center"
        : "lg:justify-center"
      : "";

  if (
    tournaments.isLoading ||
    tables.isLoading ||
    users.isLoading ||
    bookings.isLoading
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size="lg" variant="dots" className="text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="m-6 flex flex-col items-center justify-center gap-6">
        <div className="animate-shine from-primary bg-gradient-radial to-sky-500 bg-[size:200%] bg-clip-text p-5 text-center text-3xl font-bold text-transparent">
          Bienvenido de vuelta, {user?.firstName} {user?.lastName}
        </div>

        <Stat stats={statsData}></Stat>
      </div>
      <div className="flex-grow">
        <div className="font-title w-full pt-6 text-center font-normal">
          <h2 className="h-10 text-2xl font-bold">Torneos de SpinSpot</h2>
        </div>
        <div className="p-4">
          <div
            className={`carousel carousel-center w-full gap-x-8 bg-inherit px-4 pb-8 ${tournaments.data && getCarouselClass(tournaments.data)}`}
          >
            {tournaments.data?.length !== 0 ? (
              <>
                {tournaments.data &&
                  tournaments.data
                    .slice(0, 4)
                    .map((tournament, index) => (
                      <Card
                        key={index}
                        label={tournament.description}
                        labelName={tournament.name}
                        labelButton="Editar"
                        onClick={() =>
                          router.push(
                            `/tournaments/edit-tournament/${tournament._id}`,
                          )
                        }
                        className="carousel-item"
                        image={true}
                        imageSrc="/tournamentBackGround.svg"
                      />
                    ))}
                <div className="flex items-center justify-center">
                  <Button
                    label="Ver Todos"
                    className="btn-primary btn-md lg:btn-lg"
                    onClick={() => router.push("tournaments")}
                  ></Button>
                </div>
              </>
            ) : (
              <div className="">
                No se tienen torneos para esta categoria actualmente
              </div>
            )}
          </div>
        </div>
        <div className="font-title w-full pt-6 text-center font-normal">
          <h2 className="h-10 text-2xl font-bold">Mesas de SpinSpot</h2>
        </div>
        <div className="p-4">
          <div
            className={`carousel carousel-center w-full gap-x-8 bg-inherit px-4 pb-8 ${tables.data && getCarouselClass(tables.data)}`}
          >
            {tables.data?.length !== 0 ? (
              <>
                {tables.data &&
                  tables.data
                    .slice(0, 4)
                    .map((table, index) => (
                      <Card
                        key={index}
                        labelName={`Mesa ${table.code}`}
                        label={`Mesa ${table.isActive ? "Activa" : "Inactiva"}`}
                        labelButton="Editar"
                        className="carousel-item"
                        image={true}
                        imageSrc="/pingPongTable.svg"
                        onClick={() => router.push(`tables/edit/${table._id}`)}
                      />
                    ))}
                <div className="flex items-center justify-center">
                  <Button
                    label="Ver Todas"
                    className="btn-primary btn-md lg:btn-lg"
                    onClick={() => router.push("tables")}
                  ></Button>
                </div>
              </>
            ) : (
              <div className="">
                No se tienen torneos para esta categoria actualmente
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
