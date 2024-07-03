"use client";
import { CalculatorIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectInput, TextInput } from "@spin-spot/components";
import {
  TCreateTableInputDefinition,
  createTableInputDefinition,
} from "@spin-spot/models";
import { useCreateTable, useToast } from "@spin-spot/services";
import { cn } from "@spin-spot/utils";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

export default function createTableAdmin() {
  const router = useRouter();
  const createTable = useCreateTable();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    Omit<TCreateTableInputDefinition, "isActive"> & { isActive: string }
  >({
    resolver: zodResolver(
      createTableInputDefinition
        .omit({ isActive: true })
        .extend({ isActive: z.enum(["ACTIVA", "INACTIVA"]) }),
    ),
    shouldFocusError: false,
    mode: "onBlur",
  });

  const handleBackClick = () => {
    router.push("/tables");
  };

  const handleCreateTable: SubmitHandler<
    Omit<TCreateTableInputDefinition, "isActive"> & { isActive: string }
  > = (data) => {
    createTable.mutate(
      { ...data, isActive: data.isActive === "ACTIVA" },
      {
        onSuccess: () => {
          showToast({
            label: "Se ha creado la mesa con exito!",
            type: "success",
            duration: 3000,
          });
          router.push("/tables");
        },
        onError: () => {
          showToast({
            label: "Ha ocurrido un error al crear la mesa",
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

  return (
    <div className="font-body flex-grow py-32">
      <div className="font-title text-center font-bold">
        <h1 className="text-primary dark:text-base-300 flex flex-col text-3xl">
          <span>Crear Mesa</span>
        </h1>
      </div>
      <div className="text-primary mx-auto mt-4 flex max-w-md flex-col items-center gap-y-4 max-sm:px-8">
        <TextInput
          placeholder="Código..."
          topRightLabel="Código de la mesa"
          iconLeft={
            <CalculatorIcon className="text-primary dark:text-neutral h-6 w-6" />
          }
          {...register("code")}
          className={
            errors.code
              ? "dark:text-base-300 input-error"
              : "dark:text-base-300"
          }
          bottomLeftLabel={errors.code?.message}
        />
        <SelectInput
          options={["ACTIVA", "INACTIVA"]}
          defaultOption="Seleccione actividad"
          topRightLabel="Actividad"
          {...register("isActive")}
          className={cn(
            "select-primary",
            errors.isActive
              ? "dark:text-base-300 select-error"
              : "dark:text-base-300",
          )}
          bottomLeftLabel={errors.isActive?.message}
        />
        <div
          className={`${errors.isActive ? "mt-2" : "mt-4"} flex w-full flex-col gap-3`}
        >
          <Button
            className="btn-md btn-primary"
            label="Crear Mesa"
            labelSize="text-md"
            onClick={handleSubmit(handleCreateTable, handleFormError)}
          />
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
