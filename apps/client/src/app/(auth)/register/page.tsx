"use client";

import { EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@spin-spot/components";
import {
  TSignUpWithCredentialsInputDefinition,
  signUpWithCredentialsInputDefinition,
} from "@spin-spot/models";
import { useSignUpWithCredentials, useToast } from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useScrollLock } from "usehooks-ts";

export default function Register() {
  useScrollLock();

  const router = useRouter();
  const { showToast } = useToast();
  const signUpWithCredentials = useSignUpWithCredentials();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignUpWithCredentialsInputDefinition>({
    resolver: zodResolver(signUpWithCredentialsInputDefinition),
    shouldFocusError: false,
    mode: "onBlur",
  });

  const handleRegisterClick = () => {
    router.push("/login");
  };

  const handleSignUp: SubmitHandler<TSignUpWithCredentialsInputDefinition> = (
    data,
  ) => {
    signUpWithCredentials.mutate(
      {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      },
      {
        onSuccess() {
          showToast({
            label: "Te has registrado con exito!",
            type: "success",
            duration: 3000,
          });
          router.push("/tables");
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full space-y-4 rounded-lg p-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-primary dark:text-base-300 mb-1 text-center text-3xl font-black">
            Registrarse
          </h2>
          <TextInput
            placeholder="example@email.com"
            type="email"
            topRightLabel="Correo Electrónico"
            className={`input-sm ${errors.email ? "input-error" : "input-primary"}`}
            iconLeft={
              <EnvelopeIcon className="text-primary dark:text-neutral h-6 w-6" />
            }
            bottomLeftLabel={errors.email?.message}
            {...register("email")}
          />
          <TextInput
            placeholder="John"
            type="text"
            topRightLabel="Nombre"
            className={`input-sm ${errors.firstName ? "input-error" : "input-primary"}`}
            iconLeft={
              <UserIcon className="text-primary dark:text-neutral h-6 w-6" />
            }
            bottomLeftLabel={errors.firstName?.message}
            {...register("firstName")}
          />
          <TextInput
            placeholder="Doe"
            type="text"
            topRightLabel="Apellido"
            className={`input-sm ${errors.lastName ? "input-error" : "input-primary"}`}
            iconLeft={
              <UserIcon className="text-primary dark:text-neutral h-6 w-6" />
            }
            bottomLeftLabel={errors.lastName?.message}
            {...register("lastName")}
          />
          <TextInput
            placeholder="12345678"
            type="password"
            topRightLabel="Contraseña"
            className={`input-sm ${errors.password ? "input-error" : "input-primary"}`}
            iconLeft={
              <KeyIcon className="text-primary dark:text-neutral h-6 w-6" />
            }
            bottomLeftLabel={errors.password?.message}
            {...register("password")}
          />
        </div>
        <Button
          className="btn-sm btn-neutral w-full"
          label="Registrarse"
          labelSize="text-md"
          onClick={handleSubmit(handleSignUp)}
          isLoading={!signUpWithCredentials.isIdle}
          isLoadinglabel="Registrandose..."
        />
        <div className="flex justify-center">
          <Button
            className="btn-sm btn-link text-neutral dark:text-base-300 !no-underline"
            label="Ya tienes cuenta? Inicia Sesión"
            labelSize="text-md"
            onClick={handleRegisterClick}
          />
        </div>
      </div>
    </div>
  );
}
