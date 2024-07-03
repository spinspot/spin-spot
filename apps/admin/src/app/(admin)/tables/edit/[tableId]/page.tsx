"use client";
import { CalculatorIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Loader, SelectInput, TextInput } from "@spin-spot/components";
import {
  TUpdateTableInputDefinition,
  updateTableInputDefinition,
} from "@spin-spot/models";
import { useTable, useToast, useUpdateTable } from "@spin-spot/services";
import { cn } from "@spin-spot/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

interface editTableParams {
  tableId: string;
}

export default function editTableAdmin({
  params,
}: {
  params: editTableParams;
}) {
  const table = useTable(params.tableId);
  const router = useRouter();
  const updateTable = useUpdateTable();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<
    Omit<TUpdateTableInputDefinition, "isActive"> & { isActive: string }
  >({
    resolver: zodResolver(
      updateTableInputDefinition
        .omit({ isActive: true })
        .extend({ isActive: z.enum(["ACTIVA", "INACTIVA"]) }),
    ),

    defaultValues: {
      code: table.data?.code,
      isActive: table.data?.isActive ? "ACTIVA" : "INACTIVA",
    },
    shouldFocusError: false,
    mode: "onBlur",
  });

  const handleBackClick = () => {
    router.push("/tables");
  };

  const handleUpdateTable: SubmitHandler<
    Omit<TUpdateTableInputDefinition, "isActive"> & { isActive: string }
  > = (data) => {
    table.data &&
      updateTable.mutate(
        { _id: table.data?._id, ...data, isActive: data.isActive === "ACTIVA" },
        {
          onSuccess: () => {
            showToast({
              label: "Se ha actualizado la mesa con exito!",
              type: "success",
              duration: 3000,
            });
            router.push("/tables");
          },
        },
      );
  };

  useEffect(() => {
    if (table.data) {
      setValue("code", table.data.code);
      // Convirtiendo isActive a "ACTIVA" o "INACTIVA" para el SelectInput
      setValue("isActive", table.data.isActive ? "ACTIVA" : "INACTIVA");
    }
  }, [table.data, setValue]);

  return (
    <div className="font-body flex-grow py-32">
      <div className="font-title text-center font-bold">
        <h1 className="text-primary dark:text-base-300 flex flex-col text-3xl">
          <span>Editar Mesa</span>
        </h1>
      </div>
      <div className="text-primary mx-auto mt-4 flex max-w-md flex-col items-center gap-y-4 max-sm:px-8">
        {table.isLoading ? (
          <div className="mt-14 flex items-center justify-center">
            <Loader size="lg" variant="dots" className="text-primary"></Loader>
          </div>
        ) : (
          <>
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
                label="Editar Mesa"
                labelSize="text-md"
                onClick={handleSubmit(handleUpdateTable)}
              />
              <Button
                className="btn-md btn-link text-secondary mx-auto !no-underline"
                label="Ir a mesas"
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
