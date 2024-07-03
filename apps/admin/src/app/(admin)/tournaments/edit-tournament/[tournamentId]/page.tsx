"use client";

import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import {
  Badge,
  Button,
  Countdown,
  Loader,
  PingPongIcon,
} from "@spin-spot/components";
import {
  useToast,
  useTournament,
  useTournamentParticipants,
  useUpdateTournament,
} from "@spin-spot/services";
import { useRouter } from "next/navigation";

interface TournamentParams {
  tournamentId: string;
}

export default function TournamentInfo({
  params,
}: {
  params: TournamentParams;
}) {
  const router = useRouter();
  const tournament = useTournament(params.tournamentId);
  const tournamentData = tournament.data;
  const updateTournament = useUpdateTournament();
  const { showToast } = useToast();

  const { data: participants, isLoading } = useTournamentParticipants(
    params.tournamentId,
  );

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader variant="dots" size="lg" className="text-primary" />
      </div>
    );
  }

  const handleDeleteTournament = () => {
    if (!tournamentData) return;

    updateTournament.mutate(
      { _id: tournamentData._id, status: "FINISHED" },
      {
        onSuccess: () => {
          showToast({
            label: "El torneo ha sido marcado como terminado.",
            type: "success",
            duration: 3000,
          });
          router.push("/tournaments");
        },
        onError: (error) => {
          showToast({
            label: error.message,
            type: "error",
            duration: 3000,
          });
        },
      },
    );
  };

  const confirmDeleteTournament = () => {
    showToast({
      label: "¿Estás seguro de que deseas eliminar este torneo?",
      type: "warning",
      acceptButtonLabel: "Sí",
      denyButtonLabel: "No",
      onAccept: handleDeleteTournament,
      onDeny: () => {
        showToast({
          label: "Eliminación cancelada",
          type: "error",
          duration: 3000,
        });
      },
    });
  };

  const renderParticipants = () => {
    if (!tournamentData || !participants) return null;

    if (tournamentData.eventType === "1V1") {
      return (
        <table className="m-4 w-full table-auto">
          <thead>
            <tr>
              <th className=" px-4 py-2 text-2xl">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((player: any) => (
              <tr key={player._id}>
                <td className="border px-4 py-2">
                  {player.firstName} {player.lastName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (tournamentData.eventType === "2V2") {
      return (
        <table className="mt-4 min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-2xl">Equipo</th>
              <th className="px-4 py-2 text-2xl">Jugadores</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((team: any) => (
              <tr key={team._id}>
                <td className="border-primary border-2 px-4 py-2 text-lg">
                  {team.name}
                </td>
                <td className="border-primary border-2 px-4 py-2 text-lg">
                  {team.players.map((player: any) => (
                    <div key={player._id}>
                      {player.firstName} {player.lastName}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return null;
  };

  return (
    <div className="font-body flex-grow items-center justify-center py-20 text-center ">
      <h1 className="flex flex-col text-3xl font-bold">
        Información del Torneo 🏆
      </h1>
      <div className="mt-4 flex items-center justify-center gap-4">
        <h2 className="my-4 text-2xl font-semibold">
          {tournamentData?.name.toUpperCase()}
        </h2>
      </div>
      {tournament.data && (
        <div className="flex w-full justify-center">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:gap-x-8">
            <Badge
              labelName="Fecha Inicio"
              label={new Date(tournament.data?.startTime)
                .toLocaleDateString([], {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\//g, "-")}
              leftIcon={
                <CalendarDaysIcon className="text-neutral h-[36px] w-[36px]" />
              }
            />
            <Badge
              labelName="Fecha Fin"
              label={new Date(tournament.data?.endTime)
                .toLocaleDateString([], {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\//g, "-")}
              leftIcon={
                <CalendarDaysIcon className="text-neutral h-[36px] w-[36px]" />
              }
            />
            <Badge
              labelName="Modalidad"
              label={tournament.data.eventType}
              leftIcon={<PingPongIcon className="h-[36px] w-[36px]" />}
            />
            <Badge
              labelName="Sede"
              label={tournament.data.location}
              leftIcon={
                <BuildingLibraryIcon className="text-neutral h-[36px] w-[36px]" />
              }
            />
            <Badge
              labelName="Formato"
              label={
                tournament.data.tournamentFormat === "ELIMINATION"
                  ? "Eliminación"
                  : "Liga"
              }
              leftIcon={
                <TrophyIcon className="text-neutral h-[36px] w-[36px]" />
              }
            />
            <Badge
              labelName="Precio"
              label={tournament.data.prize}
              leftIcon={
                <BanknotesIcon className="text-neutral h-[36px] w-[36px]" />
              }
            />
          </div>
        </div>
      )}
      <div className="my-10 flex flex-col items-center justify-center gap-8">
        <div className="text-3xl font-bold">Tiempo Restante</div>
        {tournament.data?.startTime && (
          <Countdown startTime={tournament.data?.startTime}></Countdown>
        )}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <h3 className="text-3xl font-bold">Participantes: </h3>
      </div>
      <div className="flex items-center justify-center px-10 py-4 lg:px-60">
        {renderParticipants()}
      </div>
      <div className="mt-8 flex w-full flex-col gap-3 px-10 lg:px-60">
        <Button
          className="btn-primary"
          label="Editar Torneo"
          onClick={() =>
            router.push(`/tournaments/update-tournament/${params.tournamentId}`)
          }
        />
        <Button
          className="btn-secondary"
          label="Eliminar Torneo"
          onClick={confirmDeleteTournament}
        />
        <Button
          className="btn-md btn-link text-secondary mx-auto !no-underline"
          label="Ir a Torneos"
          onClick={() => router.push(`/tournaments`)}
        />
      </div>
    </div>
  );
}
