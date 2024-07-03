"use client";

import { Button, Card, Loader } from "@spin-spot/components";
import { useTables } from "@spin-spot/services";
import { useRouter } from "next/navigation";

export default function Tables() {
  const router = useRouter();
  const { data: tables, isLoading } = useTables();

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
          <span>Mesas SpinSpot</span>
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <Button
          className="btn-primary"
          label="Crear Nueva Mesa"
          onClick={() => router.push("/tables/create")}
        />
        <div className="text-lg font-semibold">
          Mesas Activas:{" "}
          {tables ? tables?.filter((table) => table.isActive).length : 0}
        </div>
      </div>
      <div className="my-6 flex justify-center p-5">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tables?.map((table, index) => (
            <Card
              key={index}
              labelName={`Mesa ${table.code}`}
              label={`Mesa ${table.isActive ? "Activa" : "Inactiva"}`}
              labelButton="Editar Mesa"
              image={true}
              imageSrc="/pingPongTable.svg"
              onClick={() => router.push(`tables/edit/${table._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
