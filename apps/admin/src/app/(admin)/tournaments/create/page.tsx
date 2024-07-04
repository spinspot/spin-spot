"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Calendar,
  SelectInput,
  TextInput,
} from "@spin-spot/components";
import {
  TCreateTournamentInputDefinition,
  createTournamentInputDefinition,
} from "@spin-spot/models";
import { useCreateTournament, useToast } from "@spin-spot/services";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

// Importa el plugin UTC de dayjs
dayjs.extend(utc);

const eventTypeOptions = ["1V1", "2V2"];
const tournamentTypeOptions = ["BEGINNER", "MEDIUM", "ADVANCED"];
const tournamentFormatOptions = ["LEAGUE", "ELIMINATION"];

export default function Create() {
  const router = useRouter();
  const { showToast } = useToast();

  const createTournament = useCreateTournament();

  const handleBackClick = () => {
    router.push("/tournaments");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<TCreateTournamentInputDefinition>({
    resolver: zodResolver(createTournamentInputDefinition),
    shouldFocusError: false,
    mode: "onBlur",
  });

  console.log(errors);

  const handleCreateTournament: SubmitHandler<
    TCreateTournamentInputDefinition
  > = (data) => {
    createTournament.mutate(
      {
        ...data,
        prize: data.prize + "$",
        maxPlayers: watch("eventType") === "1V1" ? data.maxPlayers : undefined,
        maxTeams: watch("eventType") === "2V2" ? data.maxTeams : undefined,
        owner: "665229652dc1249bcd4611b7", // Cambiar esto a user?._id || " " cuando esté listo
        status: "OPEN",
        location: "UNIMET",
        startTime: adjustDateToUTC(data.startTime?.toString()),
        endTime: adjustDateToUTC(data.endTime?.toString()),
      },
      {
        onSuccess: () => {
          showToast({
            label: "Se ha creado el torneo con éxito!",
            type: "success",
            duration: 3000,
          });
          router.push("/tournaments");
        },
        onError: () => {
          showToast({
            label: "Ha ocurrido un error al crear el torneo",
            type: "error",
            duration: 3000,
          });
        },
      },
    );
  };

  const handleFormError = () => {
    showToast({
      label: "Por favor, corrige los errores en el formulario",
      type: "error",
      duration: 3000,
    });
  };

  const adjustDateToUTC = (date: string | undefined): Date => {
    const utcDate = dayjs(date).utc(); // Convierte a UTC

    // Aplica el offset horario de Caracas (GMT-4)
    const caracasOffset = -11 * 60; // En minutos
    const caracasTime = utcDate.subtract(caracasOffset, "minute");

    return caracasTime.toDate(); // Devuelve la fecha y hora en formato ISO string con offset de Caracas
  };

  return (
    <div className="font-body flex-grow py-32">
      <div className="font-title text-center font-bold">
        <h1 className="text-primary dark:text-base-300 flex flex-col text-3xl">
          <span>Crear Torneo</span>
        </h1>
      </div>
      <div className="text-primary mx-auto mt-4 flex max-w-md flex-col items-center gap-y-4 ">
        <TextInput
          topLeftLabel="Nombre del torneo"
          placeholder="Nombre..."
          {...register("name")}
          className={
            errors.name
              ? "dark:text-base-300 input-error"
              : "dark:text-base-300"
          }
          bottomLeftLabel={errors.name?.message}
        />
        <TextInput
          topLeftLabel="Descripción del torneo"
          placeholder="Descripción..."
          {...register("description")}
          className={
            errors.description
              ? "dark:text-base-300 input-error"
              : "dark:text-base-300"
          }
          bottomLeftLabel={errors.description?.message}
        />
        <TextInput
          topLeftLabel="Precio"
          placeholder="Precio..."
          {...register("prize")}
          className={
            errors.prize
              ? "dark:text-base-300 input-error"
              : "dark:text-base-300"
          }
          bottomLeftLabel={errors.prize?.message}
        />
        <SelectInput
          topLeftLabel="Tipo de evento"
          defaultOption="Selecciona el tipo de evento"
          options={eventTypeOptions}
          {...register("eventType")}
          className={
            errors.eventType
              ? "dark:text-base-300 select-error"
              : "dark:text-base-300"
          }
          bottomLeftLabel={errors.eventType?.message}
        />
        {watch("eventType") === "2V2" && (
          <TextInput
            topLeftLabel={"Cantidad de equipos"}
            placeholder={"Cantidad de equipos..."}
            {...register("maxTeams", {
              setValueAs: (value) => parseInt(value, 10),
            })}
            className={
              errors.maxTeams
                ? "dark:text-base-300 select-error"
                : "dark:text-base-300"
            }
            bottomLeftLabel={errors.maxTeams?.message}
          />
        )}
        {watch("eventType") === "1V1" && (
          <TextInput
            topLeftLabel={"Cantidad de jugadores"}
            placeholder={"Cantidad de jugadores..."}
            {...register("maxPlayers", {
              setValueAs: (value) => parseInt(value, 10),
            })}
            className={
              errors.maxPlayers
                ? "dark:text-base-300 select-error"
                : "dark:text-base-300"
            }
            bottomLeftLabel={errors.maxPlayers?.message}
          />
        )}
        <SelectInput
          topLeftLabel="Tipo de torneo"
          defaultOption="Selecciona el tipo de torneo"
          options={tournamentTypeOptions}
          {...register("tournamentType")}
          className={
            errors.tournamentType
              ? "dark:text-base-300 select-error"
              : "dark:text-base-300"
          }
          bottomLeftLabel={errors.tournamentType?.message}
        />
        <SelectInput
          topLeftLabel="Formato del torneo"
          defaultOption="Selecciona el formato del torneo"
          options={tournamentFormatOptions}
          {...register("tournamentFormat")}
          className={
            errors.tournamentFormat
              ? "dark:text-base-300 select-error"
              : "dark:text-base-300"
          }
          bottomLeftLabel={errors.tournamentFormat?.message}
        />

        <div className="mt-10 flex flex-col items-center">
          <span className="label-text text-primary dark:text-base-300 text-2xl font-bold">
            Fecha de inicio
          </span>
          <Controller
            control={control}
            name="startTime"
            render={({ field }) => (
              <Calendar onDateChange={(date) => field.onChange(date)} />
            )}
          />
        </div>
        <div className="mt-5 flex flex-col items-center">
          <span className="label-text text-primary dark:text-base-300 text-2xl font-bold">
            Fecha de finalización
          </span>
          <Controller
            control={control}
            name="endTime"
            render={({ field }) => (
              <Calendar
                onDateChange={(date) => field.onChange(date)}
                startDate={watch("startTime")}
              />
            )}
          />
        </div>
        <div className={"mt-4 flex w-full flex-col gap-3"}>
          <Button
            onClick={handleSubmit(handleCreateTournament, handleFormError)}
            label="Crear Torneo"
            className="btn-primary"
          ></Button>
          <Button
            className="btn-md btn-link text-secondary mx-auto !no-underline"
            label="Volver"
            labelSize="text-md"
            onClick={handleBackClick}
          />
        </div>
      </div>
    </div>
  );
}
