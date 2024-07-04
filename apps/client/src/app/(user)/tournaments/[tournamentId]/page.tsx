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
  Modal,
  PingPongIcon,
} from "@spin-spot/components";
import { IPopulatedTournament } from "@spin-spot/models";
import {
  useAuth,
  useAvailableUsersByTournament,
  useJoinTournament,
  useLeaveTournament,
  useToast,
  useTournament,
} from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TournamentParams {
  tournamentId: string;
}

export default function TournamentJoin({
  params,
}: {
  params: TournamentParams;
}) {
  const { showToast } = useToast();
  const tournament = useTournament(params.tournamentId);
  const { user } = useAuth();

  const [searchTexts, setSearchTexts] = useState<string[]>([""]);
  const [suggestions, setSuggestions] = useState<any[][]>([]);
  const [selectedUsers, setSelectedUsers] = useState<(string | any)[]>([]);
  const [teamName, setTeamName] = useState<string>("");

  const joinTournament = useJoinTournament();
  const leaveTournament = useLeaveTournament();
  const usersAvailables = useAvailableUsersByTournament(params.tournamentId);
  const eventType = tournament.data?.eventType;

  const [isUpdating, setIsUpdating] = useState(false); // Estado para controlar si se está actualizando el torneo

  const router = useRouter();

  const handleSearch = (index: number, text: string) => {
    const newSearchTexts = [...searchTexts];
    newSearchTexts[index] = text;
    setSearchTexts(newSearchTexts);

    const newSelectedUsers = [...selectedUsers];
    newSelectedUsers[index] = null;
    setSelectedUsers(newSelectedUsers);

    if (text.length >= 1) {
      const lowerCaseText = text.toLowerCase();
      const filtered =
        usersAvailables.data?.filter((user) => {
          const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;
          return (
            user.firstName.toLowerCase().includes(lowerCaseText) ||
            user.lastName.toLowerCase().includes(lowerCaseText) ||
            fullName.includes(lowerCaseText)
          );
        }) || [];
      const newSuggestions = [...suggestions];
      newSuggestions[index] = filtered;
      setSuggestions(newSuggestions);
    } else {
      const newSuggestions = [...suggestions];
      newSuggestions[index] = [];
      setSuggestions(newSuggestions);
    }
  };

  const handleSelectUser = (index: number, user: any) => {
    const newSearchTexts = [...searchTexts];
    newSearchTexts[index] = `${user.firstName} ${user.lastName}`;
    setSearchTexts(newSearchTexts);

    const newSuggestions = [...suggestions];
    newSuggestions[index] = [];
    setSuggestions(newSuggestions);

    const newSelectedUsers = [...selectedUsers];
    newSelectedUsers[index] = user._id;
    setSelectedUsers(newSelectedUsers);
  };

  function handleInscription(tournament: IPopulatedTournament) {
    if (user?._id) {
      const players =
        eventType === "2V2"
          ? [...selectedUsers.filter((userId) => userId !== null), user._id]
          : [];
      const name = eventType === "2V2" ? teamName : "";

      console.log(name);
      console.log(players);

      setIsUpdating(true);
      joinTournament.mutate(
        { _id: tournament._id, name: name, players: players },
        {
          onSuccess() {
            showToast({
              label: "Se ha inscrito al torneo de forma exitosa!",
              type: "success",
              duration: 3000,
            });
          },
          onError() {
            showToast({
              label: "Error al inscribirse en el torneo",
              type: "error",
            });
            setIsUpdating(false);
          },
        },
      );
    }
  }

  const handleInscribirseToast = (tournament: IPopulatedTournament) => {
    showToast({
      label: "¿Seguro que quieres unirte al torneo?",
      type: "warning",
      acceptButtonLabel: "Sí",
      denyButtonLabel: "No",
      onAccept() {
        handleInscription(tournament);
      },
      onDeny() {
        showToast({
          label: "Inscripción Cancelada",
          type: "error",
          duration: 2500,
        });
      },
    });
  };

  function handleSalirse(tournament: IPopulatedTournament) {
    if (user?._id && tournament.players) {
      setIsUpdating(true);
      leaveTournament.mutate(
        { _id: tournament._id },
        {
          onSuccess() {
            showToast({
              label: "Se ha salido del torneo de forma exitosa!",
              type: "success",
              duration: 3000,
            });
          },
          onError() {
            showToast({
              label: "Error al salirse del torneo",
              type: "error",
              duration: 3000,
            });
            setIsUpdating(false);
          },
        },
      );
    }
  }

  const handleSalirseToast = (tournament: IPopulatedTournament) => {
    showToast({
      label: "¿Seguro que quieres salirte del torneo?",
      type: "warning",
      acceptButtonLabel: "Sí",
      denyButtonLabel: "No",
      onAccept() {
        handleSalirse(tournament);
      },
      onDeny() {
        showToast({
          label: "Inscripción Cancelada",
          type: "error",
          duration: 2500,
        });
      },
    });
  };

  const handleBackClick = () => {
    router.push("/tournaments");
  };

  useEffect(() => {
    if (!tournament.isFetching) {
      setIsUpdating(false);
    }
  }, [tournament.isFetching]);

  const isPlayerInTeams =
    tournament.data?.teams &&
    tournament.data?.teams.some((team) =>
      team.players.some((player) => player._id === user?._id),
    );

  const buttonOnClick =
    isPlayerInTeams ||
    tournament.data?.players?.some((player) => player._id === user?._id)
      ? handleSalirseToast
      : handleInscribirseToast;

  const buttonText =
    isPlayerInTeams ||
    tournament.data?.players?.some((player) => player._id === user?._id)
      ? "Salirse"
      : "Inscribirse";

  const showLoader =
    isUpdating &&
    (isPlayerInTeams ||
    tournament.data?.players?.some((player) => player._id === user?._id) ? (
      <div className="flex items-center justify-center gap-2">
        <Loader size="md" className="text-secondary"></Loader> Saliéndose...
      </div>
    ) : (
      <div className="flex items-center justify-center gap-2">
        <Loader size="md" className="text-primary"></Loader> Inscribiendose...
      </div>
    ));

  console.log(isPlayerInTeams);

  return (
    <div>
      {tournament.isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Loader size="lg" className="text-primary" variant="dots"></Loader>
        </div>
      ) : (
        <div>
          <div className="relative grid h-64 w-full items-center justify-items-center bg-[url(/tournamentBackGround.svg)] bg-cover bg-center bg-no-repeat md:h-72">
            <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
            <div className="font-title relative text-center">
              <h1 className="flex flex-col text-3xl">
                <span className="text-white">TORNEO</span>
                <span className="text-white">
                  {tournament.data?.name.toUpperCase()}
                </span>
              </h1>
            </div>
          </div>
          <div className="font-title py-10 text-center">
            <h1 className="text-3xl font-bold">Información Relevante 🏆</h1>
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
            <div className="text-3xl font-bold">
              {tournament.data?.eventType === "1V1"
                ? `Juagdores Inscritos ${tournament.data?.players?.length}/${tournament.data.maxPlayers}`
                : `Equipos Inscritos ${tournament.data?.teams?.length}/${tournament.data?.maxTeams}`}
            </div>
            <div className="flex flex-col gap-4">
              {tournament.data?.players?.length ===
                tournament.data?.maxPlayers ||
              (tournament.data?.teams?.length === tournament.data?.maxTeams &&
                !isPlayerInTeams) ? (
                <Button
                  label="Torneo Lleno"
                  className={"btn-disabled btn-lg w-72"}
                />
              ) : eventType === "2V2" ? (
                isPlayerInTeams ? (
                  <Button
                    label={showLoader || buttonText}
                    className={`btn-lg w-72 ${showLoader ? "btn-disabled" : ""} ${buttonText === "Inscribirse" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() =>
                      tournament.data && buttonOnClick(tournament.data)
                    }
                  />
                ) : (
                  <Modal
                    searchTexts={searchTexts}
                    suggestions={suggestions}
                    selectedUsers={selectedUsers}
                    handleSearch={handleSearch}
                    handleSelectUser={handleSelectUser}
                    teamName={teamName}
                    setTeamName={setTeamName}
                    onClick={() =>
                      tournament.data && handleInscription(tournament.data)
                    }
                    isPending={isUpdating}
                  ></Modal>
                )
              ) : (
                <Button
                  label={showLoader || buttonText}
                  className={`btn-lg w-72 ${showLoader ? "btn-disabled" : ""} ${buttonText === "Inscribirse" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() =>
                    tournament.data && buttonOnClick(tournament.data)
                  }
                />
              )}
              <Button
                className="btn btn-link text-secondary mx-auto !no-underline"
                label="Volver"
                onClick={handleBackClick}
              ></Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
