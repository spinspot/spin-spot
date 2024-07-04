import {
  IPopulatedBooking,
  TGetBookingParamsDefinition,
  TGetBookingsQueryDefinition,
  TGetUserParamsDefinition,
  TUpdateBookingInputDefinition,
  TUpdateBookingParamsDefinition,
  bookingSchema,
  type TCreateBookingInputDefinition,
} from "@spin-spot/models";
import { model } from "mongoose";

const Booking = model("Booking", bookingSchema);

async function getBookings(filter: TGetBookingsQueryDefinition = {}) {
  const bookings = await Booking.find(filter).populate([
    "owner",
    "players",
    "table",
    {
      path: "timeBlock",
      populate: "table",
    },
  ]);
  return bookings;
}

async function getBooking(_id: TGetBookingParamsDefinition["_id"]) {
  const booking = await Booking.findById<IPopulatedBooking>(_id).populate([
    "owner",
    "players",
    "table",
    {
      path: "timeBlock",
      populate: "table",
    },
  ]);
  return booking;
}

async function createBooking(data: TCreateBookingInputDefinition) {
  const booking = await Booking.create(data);
  return booking;
}

async function updateBooking(
  _id: TUpdateBookingParamsDefinition["_id"],
  data: TUpdateBookingInputDefinition,
) {
  const booking = await Booking.findByIdAndUpdate(_id, data).populate([
    "owner",
    "players",
  ]);
  return booking;
}

async function getBookingsByPlayer(playerId: TGetUserParamsDefinition["_id"]) {
  const bookings = await Booking.find({
    players: playerId,
    owner: { $ne: playerId },
    status: "PENDING",
  }).populate([
    "owner",
    "players",
    "table",
    {
      path: "timeBlock",
      populate: "table",
    },
  ]);
  return bookings;
}

export const bookingService = {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  getBookingsByPlayer,
} as const;
