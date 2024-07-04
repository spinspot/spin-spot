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
  useAvailableUsers,
  useTimeBlock,
  useToast,
  useUpdateBooking,
  useUsers,
} from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ReserveProps {
  timeBlockId: string;
}

export default function EditReserve({ params }: { params: ReserveProps }) {
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
  const users = useUsers();
  const availableUsers = useAvailableUsers();
  const updateBooking = useUpdateBooking();

  useEffect(() => {
    if (timeBlock.isSuccess) {
      const maxPlayers = timeBlock.data?.booking.eventType === "1V1" ? 1 : 3;
      const emptyPlayers =
        maxPlayers - timeBlock.data.booking.players.length + 1;

      setSelectedUsers(
        timeBlock.data.booking.players
          .slice(0, -1)
          .map((player) => `${player._id}`)
          .concat(new Array(emptyPlayers).fill(null))
          .slice(0, maxPlayers) || [],
      );

      setSearchTexts(
        timeBlock.data.booking.players
          .slice(0, -1)
          .map((player, _index) => `${player.firstName} ${player.lastName}`)
          .concat(new Array(emptyPlayers).fill(""))
          .slice(0, maxPlayers) || [],
      );

      setEventType(timeBlock.data?.booking.eventType);

      const equipmentValue = timeBlock.data?.booking.equipment;
      if (equipmentValue !== undefined) {
        setIndumentary(equipmentValue ? "SI" : "NO");
      }
    }
  }, [timeBlock.status]);

  const handleSearch = (index: number, text: string) => {
    const newSearchTexts = [...searchTexts];
    newSearchTexts[index] = text;
    setSearchTexts(newSearchTexts);

    const newSelectedUsers = [...selectedUsers];
    newSelectedUsers[index] = null;
    setSelectedUsers(newSelectedUsers);

    if (text.length >= 1) {
      const lowerCaseText = text.toLowerCase();
      const filtered = availableUsers.data?.filter((user) => {
        const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;
        return (
          user.firstName.toLowerCase().includes(lowerCaseText) ||
          user.lastName.toLowerCase().includes(lowerCaseText) ||
          fullName.includes(lowerCaseText)
        );
      });
      const newSuggestions = [...suggestions];
      newSuggestions[index] = filtered ?? [];
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

  const handleUpdate = async () => {
    if (
      !eventType ||
      !indumentary ||
      !user ||
      !timeBlock.data?.booking ||
      !timeBlock.data.table._id
    )
      return;

    const validPlayers = [
      ...(selectedUsers.filter((player) => player !== null) as string[]),
      user._id,
    ];

    const finalizeUpdate = async () => {
      updateBooking.mutate(
        {
          _id: timeBlock.data?.booking._id,
          eventType: eventType as "1V1" | "2V2",
          owner: timeBlock.data?.booking.owner,
          table: timeBlock.data.table._id,
          players: validPlayers,
          timeBlock: params.timeBlockId,
          status: "PENDING",
          equipment: indumentary === "SI",
        },
        {
          onSuccess: () => {
            showToast({
              label: "Reserva actualizada exitosamente",
              type: "success",
            });
            router.push("/tables");
          },
          onError: (error) => {
            console.error("Error al actualizar la reserva:", error);
            showToast({
              label: "Error al actualizar la reserva",
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
          "¿Seguro que quieres actualizar la reserva sin completar los jugadores?",
        type: "warning",
        acceptButtonLabel: "Sí",
        denyButtonLabel: "No",
        onAccept() {
          finalizeUpdate();
        },
        onDeny() {
          showToast({
            label: "Actualización no realizada",
            type: "error",
          });
        },
      });
    } else {
      finalizeUpdate();
    }
  };

  useEffect(() => {
    if (
      ![timeBlock.status, users.status].some(
        (status) => status === "pending",
      ) &&
      [timeBlock.status, users.status].some((status) => status === "error")
    ) {
      showToast({
        label: "Error de conexión",
        type: "error",
      });
      router.back();
    }
  }, [timeBlock.status, users.status]);

  if (timeBlock.isLoading || users.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size="lg" variant="dots" className="text-primary" />
      </div>
    );
  }

  const initialIndumentaryIndex =
    indumentary === "SI" ? 1 : indumentary === "NO" ? 0 : null;

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
          user={null}
        />
      )}
      <SelectionSection
        isAdmin={null}
        options={options}
        optinosNo={optinosNo}
        eventType={eventType}
        indumentary={indumentary}
        setEventType={setEventType}
        setIndumentary={setIndumentary}
        resetInputs={resetInputs}
        initialActive={eventType === "1V1" ? 0 : 1}
        initialIndumentary={initialIndumentaryIndex}
      />
      <div className="flex w-full flex-col items-center justify-center max-sm:p-6 sm:mt-4">
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
      <div className="flex w-full flex-col justify-center gap-2 max-sm:px-6 sm:mt-6">
        <Button
          label="Editar"
          labelSize="text-sm"
          className={
            eventType != null && indumentary != null
              ? "btn-md btn-primary"
              : "btn-primary btn-md btn-disabled"
          }
          onClick={handleUpdate}
          isLoading={!updateBooking.isIdle}
          isLoadinglabel="Editando..."
        />
        <Button
          label="Cancelar"
          labelSize="text-sm"
          className="btn-md btn-link text-secondary mx-auto !no-underline"
          onClick={() => router.back()}
        />
      </div>
    </div>
  );
}
