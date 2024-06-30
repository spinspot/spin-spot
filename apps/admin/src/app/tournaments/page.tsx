"use client";

import { Button, Card, Loader } from "@spin-spot/components";
import { useRouter } from "next/navigation";
import { useTournaments } from "@spin-spot/services";

export default function Tournaments() {
  const router = useRouter();
  const { data: tournaments, isLoading } = useTournaments();

  return (
    <div className="flex-grow">
      <div className="font-title font-bold text-center">
        <h1 className="flex flex-col text-3xl">
          <span>Torneos</span>
          <span>UNIMET</span>
        </h1>
      </div>
      <div className="flex justify-center items-center mt-4 gap-4">
        <Button
          className="btn-primary"
          label="Crear Nuevo Torneo"
          onClick={() => router.push("/tournaments/create")}
        />
        <div className="text-lg font-semibold">
          Torneos Activos: {tournaments ? tournaments.length : 0}
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <Loader />
          ) : (
            tournaments?.map((tournament) => (
              <Card
                labelName={tournament.name}
                label={tournament.description}
                labelButton="Editar Torneo"
                image={false}
                onClick={() => router.push(`/editar-torneo/${tournament._id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
