"use client";

import { Button, Card, Loader } from "@spin-spot/components";
import { useNotClosedTournaments } from "@spin-spot/services";
import { useRouter } from "next/navigation";

export default function Tournaments() {
  const router = useRouter();
  const { data: tournaments, isLoading } = useNotClosedTournaments();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader variant="dots" size="lg" className="text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-grow">
      <div className="font-title mt-3 text-center font-bold">
        <h1 className="flex flex-col text-3xl">
          <span>Torneos SpinSpot</span>
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <Button
          className="btn-primary"
          label="Crear Nuevo Torneo"
          onClick={() => router.push("/tournaments/create")}
        />
        <div className="text-lg font-semibold">
          Torneos Activos: {tournaments ? tournaments.length : 0}
        </div>
      </div>
      <div className="my-6 flex justify-center p-5">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tournaments?.map((tournament, index) => (
            <Card
              key={index}
              labelName={tournament.name}
              label={tournament.description}
              labelButton="Editar Torneo"
              onClick={() =>
                router.push(`/tournaments/edit-tournament/${tournament._id}`)
              }
              image={true}
              imageSrc="/tournamentBackGround.svg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
