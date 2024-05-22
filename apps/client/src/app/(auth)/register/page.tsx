"use client";

import { EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@spin-spot/components";
import {
  TSignUpWithCredentialsInputDefinition,
  signUpWithCredentialsInputDefinition,
} from "@spin-spot/models";
import { useSignUpWithCredentials } from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Register() {
  const router = useRouter();
  const signUpWithCredentials = useSignUpWithCredentials();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<TSignUpWithCredentialsInputDefinition>({
    resolver: zodResolver(signUpWithCredentialsInputDefinition),
    shouldFocusError: false,
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
          router.push("/tables");
        },
      },
    );
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      <div className="mt-24 w-96 space-y-4 rounded-lg p-8 sm:mt-36">
        <div className="flex flex-col gap-1">
          <h2 className="text-primary mb-1 text-center text-3xl font-black">
            Registrarse
          </h2>
          <TextInput
            placeholder="example@email.com"
            type="email"
            topRightLabel="Correo Electrónico"
            className={`input-sm ${errors.email ? "input-error" : "input-primary"}`}
            iconLeft={
              <EnvelopeIcon className="text-primary h-6 w-6"></EnvelopeIcon>
            }
            bottomLeftLabel={errors.email?.message}
            {...register("email", { onBlur: () => trigger("email") })}
          />
          <TextInput
            placeholder="John"
            type="text"
            topRightLabel="Nombre"
            className={`input-sm ${errors.firstName ? "input-error" : "input-primary"}`}
            iconLeft={<UserIcon className="text-primary h-6 w-6"></UserIcon>}
            bottomLeftLabel={errors.firstName?.message}
            {...register("firstName", { onBlur: () => trigger("firstName") })}
          />
          <TextInput
            placeholder="Doe"
            type="text"
            topRightLabel="Apellido"
            className={`input-sm ${errors.lastName ? "input-error" : "input-primary"}`}
            iconLeft={<UserIcon className="text-primary h-6 w-6"></UserIcon>}
            bottomLeftLabel={errors.lastName?.message}
            {...register("lastName", { onBlur: () => trigger("lastName") })}
          />
          <TextInput
            placeholder="12345678"
            type="password"
            topRightLabel="Contraseña"
            className={`input-sm ${errors.password ? "input-error" : "input-primary"}`}
            iconLeft={<KeyIcon className="text-primary h-6 w-6"></KeyIcon>}
            bottomLeftLabel={errors.password?.message}
            {...register("password", { onBlur: () => trigger("password") })}
          />
        </div>
        <Button
          className="btn-sm btn-neutral w-full"
          label="Registrarse"
          labelSize="text-md"
          onClick={handleSubmit(handleSignUp)}
        />
        <Button
          className="btn-sm btn-link text-neutral w-full"
          label="Ya tienes cuenta? Inicia Sesión"
          labelSize="text-md"
          onClick={handleRegisterClick}
        />
      </div>
    </div>
  );
}
