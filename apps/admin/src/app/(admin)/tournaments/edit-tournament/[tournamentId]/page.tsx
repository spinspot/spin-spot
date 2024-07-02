"use client";

import { Badge, Button, Countdown, Loader, PingPongIcon } from "@spin-spot/components";
import { useRouter } from "next/navigation";
import { useTournament, useTournamentParticipants } from "@spin-spot/services";
import { BanknotesIcon, BuildingLibraryIcon, CalendarDaysIcon, TrophyIcon } from "@heroicons/react/24/outline";

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
  
    const { data: participants, isLoading } = useTournamentParticipants(params.tournamentId);
  
    if (isLoading) {
        return <Loader />;
    }
  
    const renderParticipants = () => {
        if (!tournamentData || !participants) return null;
  
        if (tournamentData.eventType === "1V1") {
            return (
                <table className="w-full table-auto m-4">
                    <thead>
                        <tr>
                            <th className=" text-2xl px-4 py-2">Nombre</th>
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
                <table className="min-w-full table-auto mt-4">
                    <thead>
                        <tr>
                            <th className="text-2xl px-4 py-2">Equipo</th>
                            <th className="text-2xl px-4 py-2">Jugadores</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.map((team: any) => (
                            <tr key={team._id}>
                                <td className="text-lg border px-4 py-2">{team.name}</td>
                                <td className="text-lg border px-4 py-2">
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
        <div className="font-body flex-grow py-20 justify-center items-center text-center ">
            <h1 className="flex flex-col text-3xl font-bold">Información del Torneo 🏆</h1>
            <div className="flex justify-center items-center mt-4 gap-4">
                <h2 className="font-semibold text-2xl my-4">{tournamentData?.name.toUpperCase()}</h2>
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
            <div className="flex justify-center items-center mt-4 gap-4">
                <h3 className="font-semibold text-xl">Participantes: </h3>
            </div>
            <div className="flex justify-center items-center mt-4 gap-4">
                {renderParticipants()}
            </div>
            <div className="flex justify-center items-center mt-8 gap-5 pb-4">
                <Button 
                    className="btn-primary "
                    label="Volver a Torneos"
                    onClick={() => router.push(`/tournaments`)}
                />
                <Button
                    className="btn-primary"
                    label="Editar Torneo"
                    onClick={() => router.push(`/tournaments/update-tournament/${params.tournamentId}`)}
                />
                <Button
                    className="btn-secondary"
                    label="Eliminar Torneo"
                    onClick={()=>console.log('Eliminar Torneo')}
                />
            </div>
        </div>
    );
  }
  
