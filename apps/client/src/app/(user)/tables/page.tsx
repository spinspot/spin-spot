"use client";

import { Button, Calendar, Loader, Pagination } from "@spin-spot/components";
import { IPopulatedBooking, IPopulatedTimeBlock } from "@spin-spot/models";
import {
  useAuth,
  useAvailableUsers,
  useCancelBooking,
  useJoinBooking,
  useLeaveBooking,
  useTables,
  useTimeBlocks,
  useToast,
  useUpdateTimeBlock,
} from "@spin-spot/services";
import { cn } from "@spin-spot/utils";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Tables() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const { data: tables } = useTables();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const timeBlocks = useTimeBlocks(selectedTable || undefined);
  const { user } = useAuth();
  const router = useRouter();
  const availableUsers = useAvailableUsers();
  const { showToast } = useToast();
  const updateTimeBlock = useUpdateTimeBlock();
  const cancelBooking = useCancelBooking();
  const joinBooking = useJoinBooking();
  const leaveBooking = useLeaveBooking();

  const [loadingBlockId, setLoadingBlockId] = useState<string | null>(null);

  const handleShowCancelationToast = (
    timeBlockId: string,
    bookingId: string,
  ) => {
    showToast({
      label: "¿Seguro que quieres cancelar la reserva?",
      type: "warning",
      acceptButtonLabel: "Sí",
      denyButtonLabel: "No",
      onAccept() {
        handleCancelReservation(timeBlockId, bookingId);
      },
      onDeny() {
        showToast({
          label: "Reserva no cancelada",
          type: "error",
        });
      },
    });
  };

  const handleCancelReservation = async (
    timeBlockId: string,
    bookingId: string,
  ) => {
    cancelBooking.mutate(
      { _id: bookingId },
      {
        onSuccess: () => {
          updateTimeBlock.mutate({
            _id: timeBlockId,
            status: "AVAILABLE",
            booking: null,
          });
          showToast({
            label: "Reserva cancelada",
            type: "success",
          });
        },
        onError: (error) => {
          console.error("Error al cancelar la reserva:", error);
          showToast({
            label: "Error al cancelar la reserva",
            type: "error",
          });
        },
      },
    );
  };

  useEffect(() => {
    if (tables?.length) {
      //seleccionar primera mesa por defecto
      setSelectedTable(tables?.[0]?.code ?? null);
    }
  }, [tables]);

  function handleReserve(timeBlockId: string) {
    router.push(`/reserve/${timeBlockId}`);
    console.log(
      `Reserva solicitada para el bloque de tiempo con ID: ${timeBlockId}`,
    );
  }

  function handleEdit(timeBlockId: string) {
    router.push(`/edit-reserve/${timeBlockId}`);
    console.log(
      `Editar reserva solicitada para el bloque de tiempo con ID: ${timeBlockId}`,
    );
  }

  const handleShowJoinToast = (booking: IPopulatedBooking) => {
    showToast({
      label: "¿Seguro que quieres unirte a la reserva?",
      type: "warning",
      acceptButtonLabel: "Sí",
      denyButtonLabel: "No",
      onAccept() {
        handleJoin(booking);
      },
      onDeny() {
        showToast({
          label: "Unión Cancelada",
          type: "error",
        });
      },
    });
  };

  function handleJoin(booking: IPopulatedBooking) {
    console.log(availableUsers.data);

    if (!availableUsers.data?.some((item) => item._id === user?._id)) {
      showToast({
        label:
          "No se puede unir a la reserva debido a que usted ya forma parte de otra reserva",
        type: "error",
      });
      return;
    }

    if (user?._id) {
      setLoadingBlockId(booking.timeBlock.toString());
      joinBooking.mutate(
        { _id: booking._id },
        {
          onSuccess() {
            showToast({
              label: "Se ha unido a la reserva de forma exitosa!",
              type: "success",
              duration: 3000,
            });
          },
          onError() {
            showToast({
              label: "Error al unirse a la reserva.",
              type: "error",
              duration: 3000,
            });
          },
        },
      );
    }
  }

  useEffect(() => {
    if (!timeBlocks.isFetching) {
      setLoadingBlockId(null);
    }
  }, [timeBlocks.isFetching]);

  const handleShowSalirseToast = (booking: IPopulatedBooking) => {
    showToast({
      label: "¿Seguro que quieres salirte de la reserva?",
      type: "warning",
      acceptButtonLabel: "Sí",
      denyButtonLabel: "No",
      onAccept() {
        handleSalirse(booking);
      },
      onDeny() {
        showToast({
          label: "Desvinculación Cancelada",
          type: "error",
        });
      },
    });
  };

  function handleSalirse(booking: IPopulatedBooking) {
    if (user?._id) {
      setLoadingBlockId(booking.timeBlock.toString());

      leaveBooking.mutate(
        { _id: booking._id },
        {
          onSuccess() {
            showToast({
              label: "Se ha salido de la reserva de forma exitosa!",
              type: "success",
              duration: 3000,
            });
          },
          onError() {
            showToast({
              label: "Error al salirse de la reserva.",
              type: "error",
              duration: 3000,
            });
          },
        },
      );
    }
  }

  const filteredTimeBlocks = useMemo<IPopulatedTimeBlock[]>(() => {
    if (!selectedDate || !timeBlocks.data) return [];
    return timeBlocks.data
      .filter((block) => {
        const blockDate = new Date(block.startTime);
        // Filtrar por fecha y, si hay una mesa seleccionada, por el código de mesa
        const isSameDate =
          blockDate.getDate() === selectedDate.getDate() &&
          blockDate.getMonth() === selectedDate.getMonth() &&
          blockDate.getFullYear() === selectedDate.getFullYear();
        const isSameTable = selectedTable
          ? block.table.code === selectedTable
          : true;
        return isSameDate && isSameTable;
      })
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );
  }, [timeBlocks, selectedDate, selectedTable]);

  const today = new Date();
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 6,
  );

  return (
    <div className="inset-0 z-40 my-3 flex flex-col items-center justify-center">
      <h1 className="mt-6 text-center text-3xl font-bold">
        Reservas de Mesas de Ping Pong 🏓
      </h1>
      <Calendar onDateChange={setSelectedDate} endDate={endDate} />
      <h3 className="mb-3 text-xl font-bold">Mesa</h3>
      <Pagination
        className="btn-neutral"
        labels={
          tables
            ?.filter((table) => table.isActive)
            .map((table) => table.code) || []
        }
        onPageChange={(label) => setSelectedTable(label ?? null)}
        initialActiveIndex={tables ? 0 : null}
      />
      <div className="mt-2 w-full overflow-x-auto p-4 sm:w-4/5">
        {timeBlocks.isLoading ? (
          <div className="flex items-center justify-center">
            <Loader
              className="text-primary dark:text-neutral"
              size="lg"
              variant="dots"
            />{" "}
          </div>
        ) : filteredTimeBlocks.length === 0 ? (
          <div className="flex items-center justify-center text-center text-lg font-bold">
            Lo Sentimos, no hay horarios disponibles para esta fecha.
          </div>
        ) : (
          <table className="table-lg table w-full items-center justify-center text-center">
            <thead>
              <tr>
                <th className="w-4">Horarios</th>
                <th className="w-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimeBlocks.map((block) => {
                const playersCount = block.booking?.players?.length || 0;
                const maxPlayers =
                  block.booking?.eventType === "1V1"
                    ? 2
                    : block.booking?.eventType === "2V2"
                      ? 4
                      : 0; // Variable para ver la cantidad maxima de jugadores que puede tener un evento
                const timeZone = "America/Caracas"; // Zona horaria de Venezuela
                const blockDate = dayjs(block.startTime).tz(timeZone); // Convertir la fecha al huso horario de Venezuela
                const now = dayjs().tz(timeZone); // Hora actual en la zona horaria de Venezuela
                const isUserJoined = block.booking?.players?.some(
                  (player) => player._id === user?._id,
                );

                return (
                  <tr key={`${block._id}`}>
                    <td>
                      {new Date(block.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>
                      {blockDate.isBefore(now) ? (
                        <span>El horario ya ha pasado</span>
                      ) : block.booking?.eventType === "PRIVATE" ? (
                        <span>Reservado</span>
                      ) : (
                        <>
                          {block.status === "AVAILABLE" && (
                            <Button
                              className="btn-primary btn-sm"
                              label="Reservar"
                              labelSize="text-md"
                              onClick={() => handleReserve(`${block._id}`)}
                              isLoading={
                                timeBlocks.isFetching || cancelBooking.isPending
                              }
                              isLoadinglabel="Actualizando..."
                            />
                          )}
                          {block.status.toLowerCase() === "booked" &&
                            user?._id === block.booking?.owner && (
                              <div className="flex flex-col items-center justify-center gap-2">
                                <Button
                                  className={cn(
                                    "btn-secondary btn-sm mx-2 w-20",
                                    !cancelBooking.isIdle && "btn-disabled",
                                  )}
                                  label="Editar"
                                  labelSize="text-md"
                                  onClick={() => handleEdit(`${block._id}`)}
                                />
                                {!cancelBooking.isIdle ? (
                                  <div className="mt-2 flex items-center justify-center">
                                    <Loader
                                      className="text-secondary"
                                      size="md"
                                      variant="dots"
                                    />
                                  </div>
                                ) : (
                                  <Button
                                    className="btn-link text-secondary btn-sm !no-underline"
                                    label="Eiminar"
                                    labelSize="text-md"
                                    onClick={() =>
                                      handleShowCancelationToast(
                                        block._id.toString(),
                                        block.booking?._id.toString(),
                                      )
                                    }
                                  />
                                )}
                              </div>
                            )}
                          {block.status === "BOOKED" &&
                            user?._id !== block.booking?.owner && (
                              <>
                                {isUserJoined ? (
                                  <>
                                    <Button
                                      className={`btn-secondary btn-sm mx-2 ${loadingBlockId ? "btn-disabled" : ""}`}
                                      label={
                                        loadingBlockId === block._id ? (
                                          <div className="flex items-center justify-center gap-2">
                                            <Loader size="sm" /> Saliéndose...
                                          </div>
                                        ) : (
                                          "Salirse"
                                        )
                                      }
                                      labelSize="text-md"
                                      onClick={() =>
                                        handleShowSalirseToast(block.booking)
                                      }
                                      isLoading={timeBlocks.isFetching}
                                      isLoadinglabel="Actualizando..."
                                    />
                                    {!timeBlocks.isFetching && (
                                      <span>{`${playersCount}/${maxPlayers}`}</span>
                                    )}
                                  </>
                                ) : playersCount < maxPlayers ? (
                                  <>
                                    <Button
                                      className={`btn-primary btn-sm mx-2 ${loadingBlockId ? "btn-disabled" : ""}`}
                                      label={
                                        loadingBlockId === block._id ? (
                                          <div className="flex items-center justify-center gap-2">
                                            <Loader size="sm" /> Uniéndose...
                                          </div>
                                        ) : (
                                          "Unirse"
                                        )
                                      }
                                      labelSize="text-md"
                                      onClick={() =>
                                        handleShowJoinToast(block.booking)
                                      }
                                      isLoading={timeBlocks.isFetching}
                                      isLoadinglabel="Actualizando..."
                                    />
                                    {!timeBlocks.isFetching && (
                                      <span>{`${playersCount}/${maxPlayers}`}</span>
                                    )}
                                  </>
                                ) : (
                                  <span>Reservado</span>
                                )}
                              </>
                            )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
