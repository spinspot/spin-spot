"use client";

import { Card, Loader } from "@spin-spot/components";
import { useNotClosedTournaments } from "@spin-spot/services";
import { useRouter } from "next/navigation";

export default function Tournament() {
  const router = useRouter();

  const tournaments = useNotClosedTournaments();
  const tournamentsBeginner = tournaments.data?.filter(
    (tournament) => tournament.tournamentType === "BEGINNER",
  );
  const tournamentsMedium = tournaments.data?.filter(
    (tournament) => tournament.tournamentType === "MEDIUM",
  );
  const tournamentsAdvanced = tournaments.data?.filter(
    (tournament) => tournament.tournamentType === "ADVANCED",
  );

  console.log(tournamentsMedium);

  function handlePlay(tournamentId: string) {
    router.push(`/tournaments/${tournamentId}`);
  }

  // Función para determinar la clase de justificación
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
            <span className="text-white">TORNEOS</span>
            <span className="text-white">UNIMET</span>
          </h1>
        </div>
      </div>
      <div className="mt-10">
        {/* Carrusel para principiantes */}
        <div className="p-4">
          <h3 className="mb-4 text-center text-2xl font-bold">
            Torneos Principiantes
          </h3>
          <div
            className={`carousel carousel-center w-full gap-x-8 bg-inherit px-4 pb-8 ${tournamentsBeginner && getCarouselClass(tournamentsBeginner)}`}
          >
            {tournaments.isPending ? (
              <div className="flex w-full items-center justify-center">
                <Loader size="lg" className="text-primary" variant="dots" />
              </div>
            ) : tournamentsBeginner?.length !== 0 ? (
              tournamentsBeginner &&
              tournamentsBeginner.map((tournament, index) => (
                <Card
                  key={index}
                  label={tournament.description}
                  labelName={tournament.name}
                  labelButton="Jugar"
                  onClick={() => handlePlay(`${tournament._id}`)}
                  className="carousel-item"
                  image={true}
                  imageSrc="/tournamentBackGround.svg"
                />
              ))
            ) : (
              <div className="">
                No se tienen torneos para esta categoria actualmente
              </div>
            )}
          </div>
        </div>

        {/* Carrusel para intermedios */}
        <div className="p-4">
          <h3 className="mb-4 text-center text-2xl font-bold">
            Torneos Intermedios
          </h3>
          <div
            className={`carousel carousel-center w-full gap-x-8 bg-inherit px-4 pb-8 ${tournamentsMedium && getCarouselClass(tournamentsMedium)}`}
          >
            {tournaments.isPending ? (
              <div className="flex w-full items-center justify-center">
                <Loader size="lg" className="text-primary" variant="dots" />
              </div>
            ) : tournamentsMedium?.length !== 0 ? (
              tournamentsMedium &&
              tournamentsMedium.map((tournament, index) => (
                <Card
                  key={index}
                  label={tournament.description}
                  labelName={tournament.name}
                  labelButton="Jugar"
                  onClick={() => handlePlay(`${tournament._id}`)}
                  className="carousel-item"
                  image={true}
                  imageSrc="/tournamentBackGround.svg"
                />
              ))
            ) : (
              <div className="">
                No se tienen torneos para esta categoria actualmente
              </div>
            )}
          </div>
        </div>

        {/* Carrusel para avanzados */}
        <div className="p-4">
          <h3 className="mb-4 text-center text-2xl font-bold">
            Torneos Avanzados
          </h3>
          <div
            className={`carousel carousel-center w-full gap-x-8 bg-inherit px-4 pb-8 ${tournamentsAdvanced && getCarouselClass(tournamentsAdvanced)}`}
          >
            {tournaments.isPending ? (
              <div className="flex w-full items-center justify-center">
                <Loader size="lg" className="text-primary" variant="dots" />
              </div>
            ) : tournamentsAdvanced?.length !== 0 ? (
              tournamentsAdvanced &&
              tournamentsAdvanced.map((tournament, index) => (
                <Card
                  key={index}
                  label={tournament.description}
                  labelName={tournament.name}
                  labelButton="Jugar"
                  onClick={() => handlePlay(`${tournament._id}`)}
                  className="carousel-item"
                  image={true}
                  imageSrc="/tournamentBackGround.svg"
                />
              ))
            ) : (
              <div className="">
                No se tienen torneos para esta categoria actualmente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
