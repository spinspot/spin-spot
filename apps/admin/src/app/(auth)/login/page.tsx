"use client";

import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@spin-spot/components";
import {
  TSignInWithCredentialsInputDefinition,
  signInWithCredentialsInputDefinition,
} from "@spin-spot/models";
import { useSignInWithCredentials } from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useScrollLock } from "usehooks-ts";

export default function Login() {
  const router = useRouter();
  const signInWithCredentials = useSignInWithCredentials();
  useScrollLock();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInWithCredentialsInputDefinition>({
    defaultValues: {
      userType: "ADMIN",
    },
    resolver: zodResolver(signInWithCredentialsInputDefinition),
    shouldFocusError: false,
    mode: "onBlur",
  });

  const handleNotAdminClick = () => {
    router.push("https://spinspot-client.vercel.app/login");
  };

  const handleSignIn: SubmitHandler<TSignInWithCredentialsInputDefinition> = (
    data,
  ) => {
    signInWithCredentials.mutate(data, {
      onSuccess() {
        router.push("/dashboard");
      },
    });
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full space-y-4 rounded-lg px-8 pb-2 pt-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-primary dark:text-base-300 mb-1 text-center text-3xl font-black">
            Iniciar Sesión
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
            type="password"
            placeholder="12345678"
            className={`input-sm ${errors.password ? "input-error" : "input-primary"}`}
            topRightLabel="Contraseña"
            iconLeft={
              <KeyIcon className="text-primary dark:text-neutral h-6 w-6" />
            }
            bottomLeftLabel={errors.password?.message}
            {...register("password")}
          />
        </div>
        <Button
          className="btn-sm btn-neutral w-full"
          label="Iniciar Sesión"
          labelSize="text-md"
          onClick={handleSubmit(handleSignIn)}
          isLoading={signInWithCredentials.isPending}
          isLoadinglabel="Iniciando Sesión..."
        />
        <div className="flex justify-center">
          <Button
            className="btn-sm btn-link text-neutral dark:text-base-300 !no-underline"
            label="No eres un administrador?"
            labelSize="text-md"
            onClick={handleNotAdminClick}
          />
        </div>
      </div>
    </div>
  );
}
