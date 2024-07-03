"use client";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Loader, SelectInput, TextInput } from "@spin-spot/components";
import {
  TUpdateUserInputDefinition,
  updateUserInputDefinition,
} from "@spin-spot/models";
import { useToast, useUpdateUser, useUser } from "@spin-spot/services";
import { cn } from "@spin-spot/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

interface editUserParams {
  userId: string;
}

export default function editUserAdmin({ params }: { params: editUserParams }) {
  const user = useUser(params.userId);
  const router = useRouter();
  const updateUser = useUpdateUser();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<
    Omit<TUpdateUserInputDefinition, "isActive"> & { isActive: string }
  >({
    resolver: zodResolver(
      updateUserInputDefinition
        .omit({ isActive: true })
        .extend({ isActive: z.enum(["ACTIVO", "BLOQUEADO"]) }),
    ),
    defaultValues: {
      firstName: user?.data?.firstName,
      lastName: user?.data?.lastName,
      email: user?.data?.email,
      gender: user?.data?.gender,
      userType: user?.data?.userType,
      isActive: user?.data?.isActive ? "ACTIVO" : "BLOQUEADO",
    },
    shouldFocusError: false,
    mode: "onBlur",
  });

  const handleBackClick = () => {
    router.push("/users");
  };

  const handleUpdateUser: SubmitHandler<
    Omit<TUpdateUserInputDefinition, "isActive"> & { isActive: string }
  > = (data) => {
    user.data &&
      updateUser.mutate(
        { _id: user.data?._id, ...data, isActive: data.isActive === "ACTIVO" },
        {
          onSuccess: () => {
            showToast({
              label: "Se ha actualizado el usuario con exito!",
              type: "success",
              duration: 3000,
            });
            router.push("/users");
          },
        },
      );
  };

  useEffect(() => {
    if (user.data) {
      setValue("firstName", user.data.firstName);
      setValue("lastName", user.data.lastName);
      setValue("email", user.data.email);
      setValue("gender", user.data.gender);
      setValue("userType", user.data.userType);
      // Convirtiendo isActive a "ACTIVA" o "INACTIVA" para el SelectInput
      setValue("isActive", user.data.isActive ? "ACTIVO" : "BLOQUEADO");
    }
  }, [user.data, setValue]);

  if (user.isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader variant="dots" size="lg" className="text-primary" />
      </div>
    );
  }

  return (
    <div className="font-body flex-grow py-32">
      <div className="font-title text-center font-bold">
        <h1 className="text-primary dark:text-base-300 flex flex-col pb-10 text-3xl">
          <span>Editar Usuario</span>
        </h1>
      </div>
      <div className="mb-3 flex flex-col items-center justify-center max-sm:px-8">
        <div className="w-90 mb-2 h-32 overflow-hidden rounded-full bg-black">
          <Image
            src="/DefaultUserImage.png" // PONER PERFIL DE USUARIO
            alt="Jane Doe"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>
      </div>

      <div className="text-primary mx-auto mt-4 flex max-w-md flex-col items-center gap-y-4 max-sm:px-8">
        <TextInput
          placeholder="First Name"
          topRightLabel="First Name"
          iconLeft={
            <UserIcon className="text-primary dark:text-neutral h-6 w-6" />
          }
          {...register("firstName")}
          className={
            errors.firstName
              ? "dark:text-base-300 input-error"
              : "dark:text-base-300"
          }
          bottomLeftLabel={errors.firstName?.message}
        />
        <TextInput
          placeholder="Last Name"
          topRightLabel="Last Name"
          iconLeft={
            <UserIcon className="text-primary dark:text-neutral h-6 w-6" />
          }
          {...register("lastName")}
          className={
            errors.lastName
              ? "dark:text-base-300 input-error"
              : "dark:text-base-300"
          }
          bottomLeftLabel={errors.lastName?.message}
        />
        <TextInput
          placeholder="Email"
          topRightLabel="Email"
          iconLeft={
            <EnvelopeIcon className="text-primary dark:text-neutral h-6 w-6" />
          }
          {...register("email")}
          className={
            errors.email
              ? "dark:text-base-300 input-error"
              : "dark:text-base-300"
          }
          bottomLeftLabel={errors.email?.message}
        />
        <SelectInput
          options={["PLAYER", "ADMIN"]}
          defaultOption="Seleccione tipo de usuario"
          topRightLabel="Tipo"
          {...register("userType")}
          className={cn(
            "select-primary",
            errors.userType
              ? "dark:text-base-300 select-error"
              : "dark:text-base-300",
          )}
          bottomLeftLabel={errors.userType?.message}
        />
        <SelectInput
          options={["MALE", "FEMALE", "OTHER"]}
          defaultOption="Elige tu Género"
          topRightLabel="Género"
          {...register("gender")}
          className={cn(
            "select-primary",
            errors.gender
              ? "dark:text-base-300 select-error"
              : "dark:text-base-300",
          )}
          bottomLeftLabel={errors.gender?.message}
        />
        <SelectInput
          options={["ACTIVO", "BLOQUEADO"]}
          defaultOption="Seleccione status"
          topRightLabel="Status"
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
            label="Editar Usuario"
            labelSize="text-md"
            onClick={handleSubmit(handleUpdateUser)}
          />
          <Button
            className="btn-md btn-link text-secondary mx-auto !no-underline"
            label="Ir a Usuarios"
            labelSize="text-md"
            onClick={handleBackClick}
          />
        </div>
      </div>
    </div>
  );
}
