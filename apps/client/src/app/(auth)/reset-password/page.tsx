"use client";

import { KeyIcon } from "@heroicons/react/16/solid";
import { Button, Loader, TextInput } from "@spin-spot/components";
import { TResetPasswordInputDefinition } from "@spin-spot/models";
import { useResetPassword, useToast, useUser } from "@spin-spot/services";
import { useRouter, useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useScrollLock } from "usehooks-ts";

export default function ChangePassword() {
  useScrollLock();

  const resetPassword = useResetPassword();
  const serachParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const user = useUser(serachParams.get("user") || "");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TResetPasswordInputDefinition>({
    defaultValues: {
      user: serachParams.get("user") || undefined,
      token: serachParams.get("token") || undefined,
    },
    // resolver: zodResolver(resetPasswordInputDefinition),
    shouldFocusError: false,
    mode: "onBlur",
  });

  const handleSumbit: SubmitHandler<TResetPasswordInputDefinition> = (data) => {
    if (data.password !== data.confirmPassword) {
      return setError("confirmPassword", {
        message: "Las contrasenas no concuerdan",
      });
    }
    resetPassword.mutate(
      {
        user: data.user,
        token: data.token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess() {
          router.push("/login");
          showToast({
            label: "Contraseña cambiada exitosamente",
            type: "success",
          });
        },
      },
    );
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      <div className="mt-24 w-full space-y-4 rounded-lg p-8 sm:mt-36">
        <div className="flex flex-col gap-1">
          {user.isLoading ? (
            <div className="flex items-center justify-center">
              <Loader size="lg" variant="dots" className="text-primary " />
            </div>
          ) : (
            <h2 className="text-primary mb-1 text-center text-3xl font-black">
              Reset Password {user.data?.firstName} {user.data?.lastName}
            </h2>
          )}
          <TextInput
            placeholder="1234567"
            type="password"
            topRightLabel="Password"
            className={`input-sm ${errors.password ? "input-error" : "input-primary"}`}
            iconLeft={
              <KeyIcon className="text-primary dark:text-neutral h-6 w-6" />
            }
            bottomLeftLabel={errors.password?.message}
            {...register("password")}
          />
          <TextInput
            placeholder="1234567"
            type="password"
            topRightLabel="Confirm Password"
            className={`input-sm ${errors.confirmPassword ? "input-error" : "input-primary"}`}
            iconLeft={<KeyIcon className="text-primary h-6 w-6" />}
            bottomLeftLabel={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>
        <Button
          className="btn-sm btn-neutral w-full"
          label="Enviar"
          labelSize="text-md"
          onClick={handleSubmit(handleSumbit)}
        />
      </div>
    </div>
  );
}
