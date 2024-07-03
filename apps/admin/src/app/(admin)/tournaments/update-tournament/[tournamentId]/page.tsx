"use client";

import { CalendarIcon, ClipboardIcon, PencilIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Loader, TextInput, SelectInput } from "@spin-spot/components";
import {
  TUpdateTournamentInputDefinition,
  updateTournamentInputDefinition,
} from "@spin-spot/models";
import { useTournament, useToast, useUpdateTournament } from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { format } from "date-fns";

interface UpdateTournamentParams {
  tournamentId: string;
}

export default function UpdateTournament({
  params,
}: {
  params: UpdateTournamentParams;
}) {
  const tournament = useTournament(params.tournamentId);
  const router = useRouter();
  const updateTournament = useUpdateTournament();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TUpdateTournamentInputDefinition>({
    resolver: zodResolver(updateTournamentInputDefinition),
    defaultValues: {
      name: "",
      description: "",
      tournamentFormat: "ELIMINATION",
      maxTeams: 0,
      prize: "",
    },
    shouldFocusError: false,
    mode: "onBlur",
  });

  const handleBackClick = () => {
    router.push("/tournaments");
  };

  const handleUpdateTournament: SubmitHandler<TUpdateTournamentInputDefinition> = (data) => {
    // Adjust dates to ensure correct timezone
    const adjustedData = {
      ...data,
      startTime: adjustDateToUTC(data.startTime?.toString()),
      endTime: adjustDateToUTC(data.endTime?.toString()),
    };

    if (tournament.data) {
      updateTournament.mutate(
        { _id: tournament.data._id, ...adjustedData },
        {
          onSuccess: () => {
            showToast({
              label: "El torneo se ha actualizado con éxito!",
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
        }
      );
    }
  };

  useEffect(() => {
    if (tournament.data) {
      setValue("name", tournament.data.name);
      setValue("description", tournament.data.description);
      setValue("tournamentFormat", tournament.data.tournamentFormat);
      setValue("prize", tournament.data.prize);

      const formatDateToInput = (date: string | undefined) => {
        if (!date) return undefined;
        return format(new Date(date), "yyyy-MM-dd");
      };

      // Set formatted date values
      setValue("startTime", formatDateToInput(tournament.data.startTime?.toString()) as unknown as Date);
      setValue("endTime", formatDateToInput(tournament.data.endTime?.toString()) as unknown as Date);

      if (tournament.data.eventType === "2V2") {
        setValue("maxTeams", tournament.data.maxTeams);
      } else if (tournament.data.eventType === "1V1") {
        setValue("maxPlayers", tournament.data.maxPlayers);
      }
    }
  }, [tournament.data, setValue]);

  const adjustDateToUTC = (date: string | undefined): Date | undefined => {
    if (!date) return undefined;
    const utcDate = new Date(date);
    return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
  };

  return (
    <div className="font-body flex-grow py-32">
      <div className="font-title text-center font-bold">
        <h1 className="text-primary dark:text-base-300 flex flex-col text-3xl">
          <span>Editar Torneo</span>
        </h1>
      </div>
      <div className="text-primary mx-auto mt-4 flex max-w-md flex-col items-center gap-y-4 max-sm:px-8">
        {tournament.isLoading ? (
          <div className="mt-14 flex items-center justify-center">
            <Loader size="lg" variant="dots" className="text-primary"></Loader>
          </div>
        ) : (
          <>
            <TextInput
              placeholder="Nombre del torneo..."
              topRightLabel="Nombre del torneo"
              iconLeft={<ClipboardIcon className="text-primary dark:text-neutral h-6 w-6" />}
              {...register("name")}
              className={errors.name ? "dark:text-base-300 input-error" : "dark:text-base-300"}
              bottomLeftLabel={errors.name?.message}
            />
            <TextInput
              placeholder="Descripción del torneo..."
              topRightLabel="Descripción del torneo"
              iconLeft={<PencilIcon className="text-primary dark:text-neutral h-6 w-6" />}
              {...register("description")}
              className={errors.description ? "dark:text-base-300 input-error" : "dark:text-base-300"}
              bottomLeftLabel={errors.description?.message}
            />
            <SelectInput
              topRightLabel="Formato del torneo"
              options={["ELIMINATION", "LEAGUE"]}
              {...register("tournamentFormat")}
              className={errors.tournamentFormat ? "dark:text-base-300 input-error" : "dark:text-base-300"}
              bottomLeftLabel={errors.tournamentFormat?.message}
            />
            {tournament.data?.eventType === "2V2" ? (
              <TextInput
                placeholder="Máxima cantidad de equipos..."
                topRightLabel="Máxima cantidad de equipos"
                iconLeft={<ClipboardIcon className="text-primary dark:text-neutral h-6 w-6" />}
                {...register("maxTeams", { valueAsNumber: true })}
                className={errors.maxTeams ? "dark:text-base-300 input-error" : "dark:text-base-300"}
                bottomLeftLabel={errors.maxTeams?.message}
                type="number"
              />
            ) : (
              <TextInput
                placeholder="Máxima cantidad de jugadores..."
                topRightLabel="Máxima cantidad de jugadores"
                iconLeft={<ClipboardIcon className="text-primary dark:text-neutral h-6 w-6" />}
                {...register("maxPlayers", { valueAsNumber: true })}
                className={errors.maxPlayers ? "dark:text-base-300 input-error" : "dark:text-base-300"}
                bottomLeftLabel={errors.maxPlayers?.message}
                type="number"
              />
            )}
            <TextInput
              id="startTime"
              placeholder="Fecha de inicio..."
              topRightLabel="Fecha de inicio"
              iconLeft={<CalendarIcon className="text-primary dark:text-neutral h-6 w-6" />}
              {...register("startTime")}
              className={errors.startTime ? "dark:text-base-300 input-error" : "dark:text-base-300"}
              bottomLeftLabel={errors.startTime?.message}
              type="date"
            />
            <TextInput
              id="endTime"
              placeholder="Fecha de fin..."
              topRightLabel="Fecha de fin"
              iconLeft={<CalendarIcon className="text-primary dark:text-neutral h-6 w-6" />}
              {...register("endTime")}
              className={errors.endTime ? "dark:text-base-300 input-error" : "dark:text-base-300"}
              bottomLeftLabel={errors.endTime?.message}
              type="date"
            />
            <TextInput
              placeholder="Premio..."
              topRightLabel="Premio"
              {...register("prize")}
              className={errors.prize ? "dark:text-base-300 input-error" : "dark:text-base-300"}
              bottomLeftLabel={errors.prize?.message}
            />
            <div className={`${errors.prize ? "mt-2" : "mt-4"} flex w-full flex-col gap-3`}>
              <Button
                className="btn-md btn-primary"
                label="Actualizar Torneo"
                labelSize="text-md"
                onClick={handleSubmit(handleUpdateTournament)}
              />
              <Button
                className="btn-md btn-link text-secondary mx-auto !no-underline"
                label="Volver"
                labelSize="text-md"
                onClick={handleBackClick}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}







