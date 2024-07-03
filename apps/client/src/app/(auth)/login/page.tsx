"use client";

import { EnvelopeIcon, KeyIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, GoogleIcon, TextInput } from "@spin-spot/components";
import {
  TSignInWithCredentialsInputDefinition,
  signInWithCredentialsInputDefinition,
} from "@spin-spot/models";
import {
  useSignInWithCredentials,
  useSignInWithGoogle,
} from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useScrollLock } from "usehooks-ts";

export default function Login() {
  useScrollLock();

  const router = useRouter();
  const signInWithCredentials = useSignInWithCredentials();
  const signInWithGoogle = useSignInWithGoogle();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInWithCredentialsInputDefinition>({
    resolver: zodResolver(signInWithCredentialsInputDefinition),
    shouldFocusError: false,
    mode: "onBlur",
  });

  const handleRegisterClick = () => {
    router.push("/register");
  };

  const handleForgotPasswordClick = () => {
    router.push("/forgot-password");
  };

  const handleSignIn: SubmitHandler<TSignInWithCredentialsInputDefinition> = (
    data,
  ) => {
    signInWithCredentials.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess() {
          router.push("/dashboard");
        },
      },
    );
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
          isLoading={!signInWithCredentials.isIdle}
          isLoadinglabel="Iniciando Sesión..."
        />
        <Button
          className="btn-sm btn-neutral w-full"
          label="Continuar con Google"
          rightIcon={<GoogleIcon />}
          labelSize="text-md"
          onClick={() =>
            signInWithGoogle.mutate({
              app: "client",
              route: "/dashboard",
            })
          }
        />
        <div className="flex justify-center">
          <Button
            className="btn-sm btn-link text-neutral dark:text-base-300 !no-underline"
            label="Eres nuevo? Registrate"
            labelSize="text-md"
            onClick={handleRegisterClick}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Button
          className="btn-sm btn-link text-secondary dark:text-neutral space-y-0 !no-underline"
          label="Olvidaste tu contraseña?"
          labelSize="text-md"
          onClick={handleForgotPasswordClick}
        />
      </div>
    </div>
  );
}
