"use client";

import {
  Button,
  Calendar,
  SelectInput,
  TextInput,
} from "@spin-spot/components";
import { useCreateTournament, useToast } from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { useState } from "react";

const eventTypeOptions = ["1V1", "2V2"];
const tournamentTypeOptions = ["MEDIUM", "ADVANCED", "BEGINNER"];
const tournamentFormatOptions = ["LEAGUE", "ELIMINATION"];

export default function Create() {
  const router = useRouter();
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [maxTeams, setMaxTeams] = useState<number | undefined>(undefined);
  const [maxPlayers, setMaxPlayers] = useState<number | undefined>(undefined);
  const [eventType, setEventType] = useState<string | undefined>(undefined);
  const [tournamentType, setTournamentType] = useState<string | undefined>(
    undefined,
  );
  const [tournamentFormat, setTournamentFormat] = useState<string | undefined>(
    undefined,
  );
  const [prize, setPrize] = useState<number>(0);
  const [tournamentName, setTournamentName] = useState<string>("");
  const [tournamentDescription, setTournamentDescription] =
    useState<string>("");
  const createTournament = useCreateTournament();

  const handleCreate = () => {
    if (
      !eventType ||
      !tournamentType ||
      !tournamentFormat ||
      !startDate ||
      !endDate ||
      (eventType === "2V2" && maxTeams === undefined) ||
      (eventType === "1V1" && maxPlayers === undefined) ||
      prize === undefined ||
      !tournamentName
    ) {
      showToast({
        label: "Por favor, llena todos los campos",
        type: "error",
      });
      return;
    }
    createTournament.mutate(
      {
        name: tournamentName,
        description: tournamentDescription,
        prize: prize.toString() + "$",
        eventType: eventType as "1V1" | "2V2",
        maxPlayers: maxPlayers,
        maxTeams: maxTeams,
        tournamentType: tournamentType as "MEDIUM" | "ADVANCED" | "BEGINNER",
        tournamentFormat: tournamentFormat as "LEAGUE" | "ELIMINATION",
        startTime: startDate,
        endTime: endDate,
        status: "OPEN",
        owner: "665229652dc1249bcd4611b7", // Cambiar esto a user?._id || " " cuando esté listo
        location: "UNIMET",
      },
      {
        onSuccess: () => {
          showToast({
            label: "Torneo creado exitosamente",
            type: "success",
          });
          router.push("/tournaments");
        },
        onError: (error) => {
          console.log(error);
          showToast({
            label: "Error al crear el torneo ",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="font-body flex-grow py-32">
      <div className="font-title text-center font-bold">
        <h1 className="text-primary flex flex-col text-3xl">
          <span>Crear</span>
          <span>Torneo</span>
        </h1>
      </div>
      <div className="text-primary mx-auto mt-4 flex max-w-md flex-col items-center gap-y-4 ">
        <TextInput
          topLeftLabel="Nombre del torneo"
          placeholder="Nombre del torneo"
          value={tournamentName || ""}
          onChange={(e) => setTournamentName(e.target.value)}
        />
        <TextInput
          topLeftLabel="Descripción del torneo"
          placeholder="Descripción del torneo"
          value={tournamentDescription || ""}
          onChange={(e) => setTournamentDescription(e.target.value)}
        />
        <TextInput
          topLeftLabel="Premio"
          type="number"
          placeholder="Premio"
          value={prize}
          onChange={(e) => setPrize(parseInt(e.target.value))}
        />
        <SelectInput
          topLeftLabel="Tipo de evento"
          defaultOption="Selecciona el tipo de evento"
          options={eventTypeOptions}
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        />
        <TextInput
          topLeftLabel={
            eventType === "1V1"
              ? "Cantidad de jugadores"
              : "Cantidad de equipos"
          }
          type="number"
          min={2}
          max={50}
          placeholder={
            eventType === "1V1"
              ? "Cantidad de jugadores"
              : "Cantidad de equipos"
          }
          value={eventType === "1V1" ? maxPlayers || "" : maxTeams || ""}
          onChange={(e) => {
            const value = e.target.value ? parseInt(e.target.value) : undefined;
            if (eventType === "1V1") {
              setMaxPlayers(value);
              setMaxTeams(undefined);
            } else {
              setMaxTeams(value);
              setMaxPlayers(undefined);
            }
          }}
        />
        <SelectInput
          topLeftLabel="Tipo de torneo"
          defaultOption="Selecciona el tipo de torneo"
          options={tournamentTypeOptions}
          value={tournamentType}
          onChange={(e) => setTournamentType(e.target.value)}
        />
        <SelectInput
          topLeftLabel="Formato del torneo"
          defaultOption="Selecciona el formato del torneo"
          options={tournamentFormatOptions}
          value={tournamentFormat}
          onChange={(e) => setTournamentFormat(e.target.value)}
        />
        <div className="mt-2 flex flex-col items-center">
          <span className="label-text text-2xl">Fecha de inicio</span>
          <Calendar onDateChange={setStartDate} endDate={endDate} />
        </div>
        <div className="mt-2 flex flex-col items-center">
          <span className="label-text text-2xl">Fecha de finalización</span>
          <Calendar onDateChange={setEndDate} />
        </div>
        <Button onClick={handleCreate} label="Crear Torneo"></Button>
      </div>
    </div>
  );
}
