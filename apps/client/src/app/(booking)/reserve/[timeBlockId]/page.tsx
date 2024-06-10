"use client";

import {
  Button,
  Loader,
  PlayerInput,
  ReservationInfo,
  SelectionSection,
} from "@spin-spot/components";
import {
  useAuth,
  useCreateBooking,
  useTable,
  useTimeBlock,
  useToast,
  useUsers,
} from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ReserveParams {
  timeBlockId: string;
}

export default function Reserve({ params }: { params: ReserveParams }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const options = ["1V1", "2V2"];
  const optinosNo = ["NO", "SI"];
  const [searchTexts, setSearchTexts] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any[][]>([]);
  const [selectedUsers, setSelectedUsers] = useState<(string | null)[]>([]);
  const [eventType, setEventType] = useState<string | null>(null);
  const [indumentary, setIndumentary] = useState<string | null>(null);
  const router = useRouter();

  const timeBlock = useTimeBlock(params.timeBlockId);
  const table = useTable(timeBlock.data?.table._id);
  const users = useUsers();
  const createBooking = useCreateBooking();

  const handleSearch = (index: number, text: string) => {
    const newSearchTexts = [...searchTexts];
    newSearchTexts[index] = text;
    setSearchTexts(newSearchTexts);

    const newSelectedUsers = [...selectedUsers];
    newSelectedUsers[index] = null;
    setSelectedUsers(newSelectedUsers);

    if (text.length >= 1) {
      const lowerCaseText = text.toLowerCase();
      const filtered =
        users.data?.filter((user) => {
          const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;
          return (
            user.firstName.toLowerCase().includes(lowerCaseText) ||
            user.lastName.toLowerCase().includes(lowerCaseText) ||
            fullName.includes(lowerCaseText)
          );
        }) || [];
      const newSuggestions = [...suggestions];
      newSuggestions[index] = filtered;
      setSuggestions(newSuggestions);
    } else {
      const newSuggestions = [...suggestions];
      newSuggestions[index] = [];
      setSuggestions(newSuggestions);
    }
  };

  const handleSelectUser = (index: number, user: any) => {
    const newSearchTexts = [...searchTexts];
    newSearchTexts[index] = `${user.firstName} ${user.lastName}`;
    setSearchTexts(newSearchTexts);

    const newSuggestions = [...suggestions];
    newSuggestions[index] = [];
    setSuggestions(newSuggestions);

    const newSelectedUsers = [...selectedUsers];
    newSelectedUsers[index] = user._id;
    setSelectedUsers(newSelectedUsers);
  };

  const resetInputs = (length: number) => {
    setSearchTexts(Array(length).fill(""));
    setSuggestions(Array(length).fill([]));
    setSelectedUsers(Array(length).fill(null));
  };

  const handleReserve = async () => {
    if (!eventType || !indumentary || !user || !timeBlock.isSuccess) return;

    const validPlayers = [
      ...(selectedUsers.filter((player) => player !== null) as string[]),
      user._id,
    ];

    const finalizeReserve = async () => {
      createBooking.mutate(
        {
          eventType: eventType as "1V1" | "2V2",
          owner: user._id,
          table: timeBlock.data?.table._id,
          players: validPlayers,
          timeBlock: params.timeBlockId,
          status: "PENDING",
          equipment: indumentary === "SI",
        },
        {
          onSuccess: () => {
            showToast({
              label: "Reserva creada exitosamente",
              type: "success",
            });
            router.push("/tables");
          },
          onError: (error) => {
            console.error("Error al crear la reserva:", error);
            showToast({
              label: "Error al crear la reserva",
              type: "error",
            });
          },
        },
      );
    };

    if (
      (eventType === "1V1" && validPlayers.length !== 2) ||
      (eventType === "2V2" && validPlayers.length !== 4)
    ) {
      showToast({
        label:
          "¿Seguro que quieres realizar la reserva sin completar los jugadores?",
        type: "warning",
        acceptButtonLabel: "Sí",
        denyButtonLabel: "No",
        onAccept() {
          finalizeReserve();
        },
        onDeny() {
          showToast({
            label: "Reserva no realizada",
            type: "error",
          });
        },
      });
    } else {
      finalizeReserve();
    }
  };

  useEffect(() => {
    if (
      ![timeBlock.status, table.status, users.status].some(
        (status) => status === "pending",
      ) &&
      [timeBlock.status, table.status, users.status].some(
        (status) => status === "error",
      )
    ) {
      showToast({
        label: "Error de conexión",
        type: "error",
      });
      router.back();
    }
  }, [timeBlock.status, table.status, users.status]);

  if (timeBlock.isLoading || table.isLoading || users.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size="lg" variant="dots" className="text-primary" />
      </div>
    );
  }

  return (
    <div className="font-body flex-grow py-32">
      {timeBlock.isSuccess && (
        <ReservationInfo
          dateReserve={new Date(timeBlock.data.startTime)
            .toLocaleDateString([], {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "-")}
          startTime={new Date(timeBlock.data.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          endTime={new Date(timeBlock.data.endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          tableCode={timeBlock.data.table.code}
          user={user}
        />
      )}
      <SelectionSection
        options={options}
        optinosNo={optinosNo}
        eventType={eventType}
        indumentary={indumentary}
        setEventType={setEventType}
        setIndumentary={setIndumentary}
        resetInputs={resetInputs}
      />
      <div className="mt-8 flex w-full flex-col items-center justify-center">
        {eventType && (
          <PlayerInput
            searchTexts={searchTexts}
            suggestions={suggestions}
            selectedUsers={selectedUsers}
            handleSearch={handleSearch}
            handleSelectUser={handleSelectUser}
          />
        )}
      </div>
      <div className="mt-6 flex flex-row justify-center gap-x-6">
        <Button
          label="Cancelar"
          labelSize="text-sm"
          className="btn-lg btn-secondary"
          onClick={() => router.back()}
        />
        <Button
          label="Reservar"
          labelSize="text-sm"
          className={
            eventType != null && indumentary != null
              ? "btn-lg btn-primary"
              : "btn-primary btn-lg btn-disabled"
          }
          onClick={handleReserve}
        />
      </div>
    </div>
  );
}

