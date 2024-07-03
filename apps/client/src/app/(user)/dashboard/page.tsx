"use client";

import { Button, Card, Loader } from "@spin-spot/components";
import { IPopulatedBooking } from "@spin-spot/models";
import {
  useAuth,
  useBookingsByOwner,
  useBookingsByPlayer,
  useLeaveBooking,
  useToast,
  useTournaments,
} from "@spin-spot/services";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const tournaments = useTournaments();
  const userBookings = useBookingsByOwner(user?._id || "");
  console.log(userBookings.data && userBookings.data[0]?.timeBlock);
  const playerBookings = useBookingsByPlayer(user?._id || "");
  const leaveBooking = useLeaveBooking();
  const { showToast } = useToast();

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
      leaveBooking.mutate(
        { _id: booking._id },
        {
          onSuccess() {
            showToast({
              label: "Se ha salido de la reserva de forma exitosa!",
              type: "success",
              duration: 3000,
            });
            userBookings.refetch();
            playerBookings.refetch();
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

  const handleClick = () => {
    router.push("/tables");
  };

  function handlePlay(tournamentId: string) {
    router.push(`/tournaments/${tournamentId}`);
  }

  function handleEditTournament(timeBlockId: string) {
    router.push(`/edit-reserve/${timeBlockId}`);
  }

  const getCarouselClass = (cards: string | any[]) =>
    cards.length <= 4
      ? cards.length <= 1
        ? "justify-center"
        : "lg:justify-center"
      : "";

  return (
    <div className="flex-grow">
      <div className="grid h-64 w-full items-center justify-items-center bg-[url(/pingPongBackGround.svg)] bg-cover bg-center bg-no-repeat md:h-72">
        <div className="font-title text-center">
          <h1 className="flex flex-col text-3xl">
            <span className="text-white">PING PONG</span>
            <span className="text-white">UNIMET</span>
          </h1>
        </div>
      </div>
      <div className="font-title w-full pt-10 text-center font-normal">
        <h2 className="pb-3 text-xl">¡Bienvenido a Spin-Spot! </h2>
        <p className="px-6 pb-5 text-center">
          En esta página podrás realizar las reservas de las nuevas canchas de
          Ping Pong disponibles para los estudiantes.
        </p>
        <Button
          className="btn-lg btn-primary"
          label="¿Estas listo para empezar a jugar?"
          labelSize="text-md"
          onClick={handleClick}
        />
      </div>
      <div className="font-title w-full pt-6 text-center font-normal">
        <h2 className="h-10 text-2xl">Torneos activos</h2>
      </div>
      <div className="p-4">
        <div
          className={`carousel carousel-center w-full gap-x-8 bg-inherit px-4 pb-8 ${tournaments.data && getCarouselClass(tournaments.data)}`}
        >
          {tournaments.isPending ? (
            <div className="flex w-full items-center justify-center">
              <Loader size="lg" className="text-primary" variant="dots" />
            </div>
          ) : tournaments.data?.length !== 0 ? (
            tournaments.data &&
            tournaments.data.map((tournament, index) => (
              <Card
                key={index}
                label={tournament.description}
                labelName={tournament.name}
                labelButton="Jugar"
                onClick={() => handlePlay(`${tournament._id}`)}
                className="carousel-item"
              />
            ))
          ) : (
            <div className="">
              No se tienen torneos para esta categoria actualmente
            </div>
          )}
        </div>
      </div>
      <div className="font-title w-full  text-center font-normal">
        <h2 className="h-10 text-2xl">Reservas activas</h2>
      </div>
      <div className="p-4">
        <div
          className={`carousel carousel-center w-full gap-x-8 bg-inherit px-4 pb-8 ${userBookings.data && getCarouselClass(userBookings.data)}`}
        >
          {userBookings.isPending ? (
            <div className="flex w-full items-center justify-center">
              <Loader size="lg" className="text-primary" variant="dots" />
            </div>
          ) : userBookings.data?.length !== 0 ? (
            userBookings.data &&
            userBookings.data.map((booking, index) => (
              <Card
                key={index}
                label={`de ${new Date(
                  booking.timeBlock.startTime,
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} a ${new Date(booking.timeBlock.endTime).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}`}
                labelName={new Date(booking.timeBlock.startTime)
                  .toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\//g, "-")}
                labelButton="Editar"
                onClick={() => handleEditTournament(`${booking.timeBlock._id}`)}
                className="carousel-item"
                image={false}
              />
            ))
          ) : playerBookings.data?.length !== 0 ? (
            playerBookings.data &&
            playerBookings.data.map((booking, index) => (
              <Card
                key={index}
                label={`de ${new Date(
                  booking.timeBlock.startTime,
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} a ${new Date(booking.timeBlock.endTime).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}`}
                labelName={new Date(booking.timeBlock.startTime)
                  .toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\//g, "-")}
                labelButton={
                  !leaveBooking.isIdle ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader size="sm" /> Saliéndose...
                    </div>
                  ) : (
                    "Salirse"
                  )
                }
                className="carousel-item"
                image={false}
                classNameButton={`btn-secondary ${!leaveBooking.isIdle ? "btn-disabled" : ""}`}
                onClick={() => handleShowSalirseToast(booking)}
                // isLoading={!leaveBooking.isIdle}
                // isLoadinglabel="Actualizando..."
              />
            ))
          ) : (
            <div className="">Usted no posee ninguna reserva a su nombre</div>
          )}
        </div>
      </div>
    </div>
  );
}
