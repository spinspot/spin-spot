"use client";

import { Button, Calendar, Loader, Pagination } from "@spin-spot/components";
import { IPopulatedBooking, IPopulatedTimeBlock } from "@spin-spot/models";
import {
  useAuth,
  useCancelBooking,
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

export default function reserves() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const { data: tables } = useTables();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const timeBlocks = useTimeBlocks(selectedTable || undefined);
  const { user } = useAuth();
  const router = useRouter();

  const { showToast } = useToast();
  const updateTimeBlock = useUpdateTimeBlock();
  const cancelBooking = useCancelBooking();

  const [loadingBlockId, setLoadingBlockId] = useState<string | null>(null);

  const handleShowCancelationToast = (
    timeBlockId: string,
    bookingId: string,
    booking: IPopulatedBooking,
  ) => {
    showToast({
      label: "¿Seguro que quieres cancelar la reserva?",
      type: "warning",
      acceptButtonLabel: "Sí",
      denyButtonLabel: "No",
      onAccept() {
        handleCancelReservation(timeBlockId, bookingId, booking);
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
    booking: IPopulatedBooking,
  ) => {
    setLoadingBlockId(booking.timeBlock.toString());
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
    router.push(`/reserves/reserve/${timeBlockId}`);
    console.log(
      `Reserva solicitada para el bloque de tiempo con ID: ${timeBlockId}`,
    );
  }

  function handleEdit(timeBlockId: string) {
    router.push(`/reserves/edit-reserve/${timeBlockId}`);
    console.log(
      `Editar reserva solicitada para el bloque de tiempo con ID: ${timeBlockId}`,
    );
  }

  useEffect(() => {
    if (!timeBlocks.isFetching) {
      setLoadingBlockId(null);
    }
  }, [timeBlocks.isFetching]);

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
                const timeZone = "America/Caracas"; // Zona horaria de Venezuela
                const blockDate = dayjs(block.startTime).tz(timeZone); // Convertir la fecha al huso horario de Venezuela
                const now = dayjs().tz(timeZone); // Hora actual en la zona horaria de Venezuela

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
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span>Reserva privada</span>
                          {loadingBlockId === block._id ? (
                            <div className="mt-2 flex items-center justify-center">
                              <Loader
                                className="text-secondary"
                                size="md"
                                variant="dots"
                              />
                            </div>
                          ) : (
                            !cancelBooking.isPending &&
                            !timeBlocks.isFetching && (
                              <Button
                                className="btn-link text-secondary btn-sm !no-underline"
                                label="Eiminar"
                                labelSize="text-md"
                                onClick={() =>
                                  handleShowCancelationToast(
                                    block._id.toString(),
                                    block.booking?._id.toString(),
                                    block.booking,
                                  )
                                }
                              />
                            )
                          )}
                        </div>
                      ) : (
                        <>
                          {block.status.toLowerCase() === "available" && (
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
                          {block.status.toLowerCase() === "booked" && (
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Button
                                className={cn(
                                  "btn-secondary btn-sm mx-2 w-20",
                                  (cancelBooking.isPending ||
                                    timeBlocks.isFetching) &&
                                    "btn-disabled",
                                )}
                                label="Editar"
                                labelSize="text-md"
                                onClick={() => handleEdit(`${block._id}`)}
                              />
                              {loadingBlockId === block._id ? (
                                <div className="mt-2 flex items-center justify-center">
                                  <Loader
                                    className="text-secondary"
                                    size="md"
                                    variant="dots"
                                  />
                                </div>
                              ) : (
                                !cancelBooking.isPending &&
                                !timeBlocks.isFetching && (
                                  <Button
                                    className="btn-link text-secondary btn-sm !no-underline"
                                    label="Eiminar"
                                    labelSize="text-md"
                                    onClick={() =>
                                      handleShowCancelationToast(
                                        block._id.toString(),
                                        block.booking?._id.toString(),
                                        block.booking,
                                      )
                                    }
                                  />
                                )
                              )}
                            </div>
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
