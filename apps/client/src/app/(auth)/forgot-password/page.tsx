"use client";

import { EnvelopeIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@spin-spot/components";
import {
  TForgotPasswordInputDefinition,
  forgotPasswordInputDefinition,
} from "@spin-spot/models";
import { useForgotPassword, useToast } from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useScrollLock } from "usehooks-ts";

export default function ResetPassword() {
  useScrollLock();
  const { showToast } = useToast();

  const router = useRouter();
  const forgotPassword = useForgotPassword();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TForgotPasswordInputDefinition>({
    resolver: zodResolver(forgotPasswordInputDefinition),
    shouldFocusError: false,
    mode: "onBlur",
  });

  const handleVolverClick = () => {
    router.push("/login");
  };

  const handleSumbit: SubmitHandler<TForgotPasswordInputDefinition> = (
    data,
  ) => {
    setIsSubmitted(true);
    forgotPassword.mutate(
      {
        email: data.email,
      },
      {
        onSuccess() {
          console.log("Exito!");
          setIsSubmitted(false);
          showToast({
            label: "Se ha enviado un enlace a su correo!",
            type: "success",
            duration: 3000,
          });
        },
      },
    );
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      <div className="mt-24 w-96 space-y-4 rounded-lg p-8 sm:mt-36">
        <div className="flex flex-col gap-1">
          <h2 className="text-primary dark:text-neutral mb-1 text-center text-3xl font-black">
            Olvidaste tu contraseña?
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
        </div>
        <Button
          className={`btn-sm ${isSubmitted ? "btn-disabled" : "btn-neutral"} w-full`}
          label={isSubmitted ? "Enlace Enviado" : "Enviar"}
          labelSize="text-md"
          onClick={handleSubmit(handleSumbit)}
        />
        <Button
          className="btn-sm btn-link text-neutral w-full"
          label="Volver"
          labelSize="text-md"
          onClick={handleVolverClick}
        />
      </div>
    </div>
  );
}
