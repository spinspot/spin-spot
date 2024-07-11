"use client";

import { EnvelopeIcon, UserIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectInput, TextInput } from "@spin-spot/components";
import {
  TUpdateUserInputDefinition,
  updateUserInputDefinition,
} from "@spin-spot/models";
import { useAuth, useToast, useUpdateUser } from "@spin-spot/services";
import { cn } from "@spin-spot/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export default function EditProfile() {
  const router = useRouter();
  const { showToast } = useToast();

  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?._id;

  const updateUser = useUpdateUser();

  const handleBackClick = () => {
    router.push("/profile");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUpdateUserInputDefinition>({
    resolver: zodResolver(updateUserInputDefinition),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      gender: user?.gender,
    },
    shouldFocusError: false,
    mode: "onBlur",
  });

  const handleUpdateProfile: SubmitHandler<TUpdateUserInputDefinition> = (
    data,
  ) => {
    if (userId) {
      updateUser.mutate(
        { _id: userId, ...data },
        {
          onSuccess: () => {
            showToast({
              label: "Se ha actualizado su perfil con exito!",
              type: "success",
              duration: 3000,
            });
            router.push("/profile");
          },
        },
      );
    }
  };

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className="font-body flex-grow pb-36 lg:py-36">
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
        <div className="flex w-full max-w-full flex-col gap-4">
          <TextInput
            placeholder="First Name"
            topRightLabel="First Name"
            iconLeft={
              <UserIcon className="text-primary dark:text-neutral h-6 w-6" />
            }
            {...register("firstName")}
            className={errors.firstName ? "input-error" : ""}
            bottomLeftLabel={errors.firstName?.message}
          />
          <TextInput
            placeholder="Last Name"
            topRightLabel="Last Name"
            iconLeft={
              <UserIcon className="text-primary dark:text-neutral h-6 w-6" />
            }
            {...register("lastName")}
            className={errors.lastName ? "input-error" : ""}
            bottomLeftLabel={errors.lastName?.message}
          />
          <TextInput
            placeholder="Email"
            topRightLabel="Email"
            iconLeft={
              <EnvelopeIcon className="text-primary dark:text-neutral h-6 w-6" />
            }
            {...register("email")}
            className={errors.email ? "input-error" : ""}
            bottomLeftLabel={errors.email?.message}
          />
          <SelectInput
            options={["MALE", "FEMALE", "OTHER"]}
            defaultOption="Elige tu Género"
            topRightLabel="Género"
            {...register("gender")}
            className={cn(
              "select-primary",
              errors.gender ? "select-error" : "",
            )}
            bottomLeftLabel={errors.gender?.message}
          />
        </div>

        <div className="mt-6 flex w-full flex-col gap-3">
          <Button
            className="btn-md btn-primary"
            label="Editar Perfil"
            labelSize="text-md"
            onClick={handleSubmit(handleUpdateProfile)}
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
