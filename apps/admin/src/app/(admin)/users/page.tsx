"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Badge, Card, Loader } from "@spin-spot/components";
import { useUsers } from "@spin-spot/services";
import { useRouter } from "next/navigation";

export default function Users() {
  const router = useRouter();
  const { data: users, isLoading } = useUsers();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader variant="dots" size="lg" className="text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-grow">
      <div className="font-title mt-8 text-center font-bold">
        <h1 className="flex flex-col text-3xl">
          <span>Usuarios SpinSpot</span>
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <Badge
          labelName="Usuarios Registrados"
          label={users?.length}
          leftIcon={<UserGroupIcon className="text-primary"></UserGroupIcon>}
        ></Badge>
      </div>
      <div className="my-6 flex justify-center p-5">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {users?.map((user, index) => (
            <Card
              key={index}
              labelName={`${user.firstName} ${user.lastName}`}
              label={`Status: ${user.isActive ? "Activo" : "Bloqueado"}`}
              labelButton="Editar Usuario"
              image={false}
              onClick={() => router.push(`users/edit/${user._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
