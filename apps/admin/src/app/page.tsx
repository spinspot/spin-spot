"use client";

import {
  Button,
  LayoutAdmin,
  Loader,
  SpinSpotIcon,
} from "@spin-spot/components";
import { useCurrentUser } from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const currentUser = useCurrentUser();

  useEffect(() => {
    if (currentUser.data) {
      router.push("/dashboard");
    }
  }, [currentUser.data]);

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <LayoutAdmin>
      <div className="space-y-4 rounded-lg px-12 pb-2 pt-8">
        <div className="flex flex-col items-center justify-center gap-9">
          <SpinSpotIcon />
          <h2 className="dark:text-base-300 mb-1 text-center text-xl font-light  ">
            Página de administrador
          </h2>
          {currentUser.isLoading && <Loader variant="spinner" />}
          {(currentUser.isError || currentUser.data === null) && (
            <Button
              className=" btn-lg btn-neutral"
              onClick={handleLoginClick}
              label="Ingresar"
              labelSize="text-md"
            />
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
}
