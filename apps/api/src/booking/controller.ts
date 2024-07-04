import { sendMail } from "@/email";
import { tableService } from "@/table";
import { timeBlockService } from "@/time-block";
import { userService } from "@/user";
import {
  ApiError,
  IPopulatedBooking,
  createBookingInputDefinition,
  getBookingParamsDefinition,
  getBookingsQueryDefinition,
  updateBookingInputDefinition,
  updateBookingParamsDefinition,
} from "@spin-spot/models";
import { Request, Response } from "express";
import { startSession } from "mongoose";
import { bookingService } from "./service";

async function bookingWithUser(req: Request, res: Response) {
  const user = req.user;
  const reservationData = createBookingInputDefinition.parse(req.body);

  const timeBlock = await timeBlockService.getTimeBlock(
    reservationData.timeBlock,
  );

  if (!timeBlock || !timeBlock.table || timeBlock.status !== "AVAILABLE") {
    throw new ApiError({
      status: 400,
      errors: [{ message: "El horario seleccionado no está disponible" }],
    });
  }

  const currentTime = new Date();
  if (currentTime > timeBlock.startTime) {
    throw new ApiError({
      status: 400,
      errors: [{ message: "El horario seleccionado ya pasó" }],
    });
  }

  const table = await tableService.getTable(timeBlock.table);

  if (!table || !table.isActive || reservationData.table !== `${table._id}`) {
    throw new ApiError({
      status: 400,
      errors: [{ message: "La mesa seleccionada no está disponible" }],
    });
  }

  const session = await startSession();

  if (reservationData.eventType === "PRIVATE") {
    const booking = await session.withTransaction(async () => {
      const booking = await bookingService.createBooking({
        ...reservationData,
        table: table!._id,
      });

      await timeBlockService.updateTimeBlock(reservationData.timeBlock, {
        booking: booking._id,
        status: "BOOKED",
      });

      return booking;
    });

    return res.status(200).json(booking);
  }

  if (
    user?.userType === "PLAYER" &&
    user?._id?.toString() !== reservationData.owner
  ) {
    throw new ApiError({
      status: 401,
      errors: [{ message: "No puedes crear una reserva para otro usuario" }],
    });
  }

  const uniquePlayers =
    new Set(reservationData.players?.map((player) => `${player}`)).size ===
    reservationData.players?.length;

  if (!uniquePlayers) {
    throw new ApiError({
      status: 400,
      errors: [{ message: "Hay jugadores repetidos en la reserva" }],
    });
  }
  if (!(await userService.isUserAvailable(reservationData.owner ?? ""))) {
    throw new ApiError({
      status: 400,
      errors: [{ message: "Ya tienes una Reserva Activa" }],
    });
  }

  const booking = await session.withTransaction(async () => {
    const booking = await bookingService.createBooking({
      ...reservationData,
      owner: user!._id,
      table: table!._id,
    });

    await timeBlockService.updateTimeBlock(reservationData.timeBlock, {
      booking: booking._id,
      status: "BOOKED",
    });

    return booking;
  });

  res.status(200).json(booking);
}

async function getBookings(req: Request, res: Response) {
  const query = getBookingsQueryDefinition.parse(req.query);
  const bookings = await bookingService.getBookings(query);
  return res.status(200).json(bookings);
}

async function getBooking(req: Request, res: Response) {
  const params = getBookingParamsDefinition.parse(req.params);
  const booking = await bookingService.getBooking(params._id);
  return res.status(200).json(booking);
}

async function updateBooking(req: Request, res: Response) {
  const params = updateBookingParamsDefinition.parse(req.params);
  const input = updateBookingInputDefinition.parse(req.body);

  const prevBooking: IPopulatedBooking | any = await bookingService.getBooking(
    params._id,
  );

  //Obtenemos los jugadores de la reserva actual, esto para no revisar si están disponibles
  const currentPlayers = prevBooking.players.map((player: { _id: string }) =>
    player._id.toString(),
  );

  const unavailablePlayers = [];
  for (const player of input.players ?? []) {
    // Verificar si el jugador ya está en la reserva actual
    if (!currentPlayers.includes(player.toString())) {
      if (!(await userService.isUserAvailable(player))) {
        unavailablePlayers.push(player);
      }
    }
  }

  if (unavailablePlayers.length > 0) {
    throw new ApiError({
      status: 400,
      errors: [{ message: "Hay jugadores que ya están en una reserva activa" }],
    });
  }

  const booking: IPopulatedBooking | any = await bookingService.updateBooking(
    params._id,
    input,
  );

  const newBooking: IPopulatedBooking | any = await bookingService.getBooking(
    params._id,
  );

  let actionMessage = "";

  // Comparar los jugadores antes y después para determinar el cambio
  if (prevBooking?.players && newBooking?.players) {
    const prevPlayerIds = prevBooking.players.map(
      (player: { _id: { toString: () => any } }) => player._id.toString(),
    );
    const newPlayerIds = newBooking.players.map(
      (player: { _id: { toString: () => any } }) => player._id.toString(),
    );

    // Encontrar jugadores que se unieron
    const joinedPlayers = newBooking.players.filter(
      (player: { _id: { toString: () => any } }) =>
        !prevPlayerIds.includes(player._id.toString()),
    );

    // Encontrar jugadores que se salieron
    const leftPlayers = prevBooking.players.filter(
      (player: { _id: { toString: () => any } }) =>
        !newPlayerIds.includes(player._id.toString()),
    );

    if (joinedPlayers.length > 0) {
      const joinedPlayerNames = joinedPlayers
        .map(
          (player: { firstName: string; lastName: string }) =>
            `${player.firstName} ${player.lastName}`,
        )
        .join(", ");
      actionMessage = `Hola! ${booking.owner.firstName} ${booking.owner.lastName}, este correo informativo es para notificarle que los siguientes jugadores se han unido a su reserva: <br> ${joinedPlayerNames}`;
    } else if (leftPlayers.length > 0) {
      const leftPlayerNames = leftPlayers
        .map(
          (player: { firstName: string; lastName: string }) =>
            `${player.firstName} ${player.lastName}`,
        )
        .join(", ");
      actionMessage = `Hola! ${booking.owner.firstName} ${booking.owner.lastName}, este correo informativo es para notificarle que los siguientes jugadores se han salido de su reserva: <br> ${leftPlayerNames}`;
    } else if (leftPlayers.length === 0 && joinedPlayers.length === 0) {
      actionMessage = `Hola! ${booking.owner.firstName} ${booking.owner.lastName}, este correo informativo es para notificarle que su reserva ha sido editada recientemente. A continuación puede presionar el botón para visualizar los cambios`;
    }
  }

  const link = new URL(
    `/edit-reserve/${booking.timeBlock}`,
    process.env.CLIENT_APP_URL,
  ).href;

  console.log(booking.timeBlock);
  await sendMail({
    from: `Spin Spot 🏓 <${process.env.EMAIL_USER}>`,
    to: `${booking.owner.email}`,
    subject: "Reserve Notification 🚨 SpinSpot",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .button {
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #02415a;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .button:hover {
          background-color: #022431;
          color: #ffffff;
        }

        .text {
          color: #000000;
        }
      </style>
    </head>
    <body>
      <p class="text">${actionMessage}</p>
      <a href="${link}" class="button">Editar Reserva</a>
    </body>
    </html>
  `,
  });
  return res.status(200).json(booking);
}

async function joinBooking(req: Request, res: Response) {
  const user = req.user;
  const params = updateBookingParamsDefinition.parse(req.params);

  const booking = await bookingService.getBooking(params._id);
  if (
    user &&
    booking &&
    booking.eventType === "1V1" &&
    booking.players &&
    booking.players.length < 2 &&
    !booking.players.some(
      (player) => player._id.toString() === user._id.toString(),
    )
  ) {
    const updatedPlayers = [
      ...booking.players.map((player) => player._id),
      user._id,
    ];
    bookingService.updateBooking(booking._id, {
      players: updatedPlayers,
    });
    return res.status(200).json(booking);
  } else if (
    user &&
    booking &&
    booking.eventType === "2V2" &&
    booking.players &&
    booking.players.length < 4 &&
    !booking.players.some(
      (player) => player._id.toString() === user._id.toString(),
    )
  ) {
    const updatedPlayers = [
      ...booking.players.map((player) => player._id),
      user._id,
    ];
    bookingService.updateBooking(booking._id, {
      players: updatedPlayers,
    });
    return res.status(200).json(booking);
  } else {
    throw new ApiError({
      status: 400,
      errors: [
        {
          message:
            "El usuario ya está en la reserva o hay un error al ingresar a la reserva ",
        },
      ],
    });
  }
}

async function leaveBooking(req: Request, res: Response) {
  const user = req.user;
  const params = updateBookingParamsDefinition.parse(req.params);

  const booking = await bookingService.getBooking(params._id);
  if (user && booking && booking.players) {
    const playerIndex = booking.players.findIndex(
      (player) => player._id.toString() === user._id.toString(),
    );
    if (playerIndex !== -1) {
      booking.players.splice(playerIndex, 1);
      await bookingService.updateBooking(params._id, {
        players: booking.players.map((player) => player._id),
      });
    } else {
      throw new ApiError({
        status: 400,
        errors: [
          {
            message: "El usuario no está en la reserva",
          },
        ],
      });
    }
  } else {
    throw new ApiError({
      status: 400,
      errors: [
        {
          message: "Error al salir de la reserva",
        },
      ],
    });
  }
  return res.status(200).json(booking);
}

async function cancelBooking(req: Request, res: Response) {
  const params = updateBookingParamsDefinition.parse(req.params);

  const session = await startSession();

  const booking = await session.withTransaction(async () => {
    const booking = await bookingService.updateBooking(params._id, {
      status: "FINISHED",
    });

    if (booking?.timeBlock) {
      await timeBlockService.updateTimeBlock(booking.timeBlock, {
        booking: null,
        status: "AVAILABLE",
      });
    } else {
      console.error("booking.timeBlock is undefined");
    }

    return booking;
  });

  return res.status(200).json(booking);
}

async function getBookingsByPlayer(req: Request, res: Response) {
  const { playerId } = req.params;
  const validPlayerId = playerId ?? "";
  const bookings = await bookingService.getBookingsByPlayer(validPlayerId);
  return res.status(200).json(bookings);
}

export const bookingController = {
  bookingWithUser,
  getBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  joinBooking,
  leaveBooking,
  getBookingsByPlayer,
} as const;
