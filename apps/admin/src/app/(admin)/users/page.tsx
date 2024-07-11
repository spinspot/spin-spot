"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Badge, Card, Loader, TextInput, Button } from "@spin-spot/components"; 
import { useUsers } from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Users() {
  const router = useRouter();
  const { data: users, isLoading } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "blocked">("all");

  const filteredUsers = users?.filter(user => {
    const matchesSearchQuery = `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "active" && user.isActive) || (filter === "blocked" && !user.isActive);
    return matchesSearchQuery && matchesFilter;
  });

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
      <div className="mt-4 flex flex-col items-center justify-center gap-4">
        <Badge
          labelName="Usuarios Registrados"
          label={users?.length}
          leftIcon={<UserGroupIcon className="text-primary"></UserGroupIcon>}
        />
        <div className="w-full max-w-md my-2">
          <TextInput
            placeholder="Buscar por nombre completo"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <Button
            className={`${filter === "all" ? "btn-primary" : "btn-secondary"} w-1/3 btn-md`}
            onClick={() => setFilter("all")}
            label="Todos"
          >
          </Button>
          <Button
            className={`${filter === "active" ? "btn-primary" : "btn-secondary" } w-1/3 btn-md` }
            onClick={() => setFilter("active")}
            label="Activos"
          > 
          </Button>
          <Button
            className={`${filter === "blocked" ? "btn-primary" : "btn-secondary" } w-1/3 btn-md` }
            onClick={() => setFilter("blocked")}
            label="Bloqueados"
          >
          </Button>
        </div>
      </div>
      <div className="my-6 flex justify-center p-5">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredUsers?.map((user, index) => (
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
