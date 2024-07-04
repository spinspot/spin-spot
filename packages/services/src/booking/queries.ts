import {
  IBooking,
  IPopulatedBooking,
  TGetBookingParamsDefinition,
  TGetUserParamsDefinition,
} from "@spin-spot/models";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export async function getBookings() {
  const res = await api.get("/booking");
  const timeBlocks: IBooking[] = await res.json();
  return timeBlocks;
}

export function useBookings() {
  return useQuery({ queryKey: ["getBookings"], queryFn: getBookings });
}

export async function getBooking(_id: TGetBookingParamsDefinition["_id"]) {
  const res = await api.get(`/booking/${encodeURIComponent(`${_id}`)}`);
  const booking: IBooking = await res.json();
  return booking;
}

export function useBooking(_id: TGetBookingParamsDefinition["_id"]) {
  return useQuery({
    queryKey: ["getBooking", _id],
    queryFn: () => getBooking(_id),
  });
}

export async function getBookingsByOwner(
  owner: TGetUserParamsDefinition["_id"],
) {
  const ownerId = String(owner);
  const res = await api.get(
    `/booking?owner=${encodeURIComponent(ownerId)}&status=PENDING`,
  );
  const bookings: IPopulatedBooking[] = await res.json();
  return bookings;
}

export function useBookingsByOwner(owner: TGetUserParamsDefinition["_id"]) {
  return useQuery({
    queryKey: ["getBookingByOwner", owner],
    queryFn: () => getBookingsByOwner(owner),
  });
}

export async function getBookingsByPlayer(
  playerId: TGetUserParamsDefinition["_id"],
) {
  const playerID = String(playerId);
  const res = await api.get(`/booking/player/${encodeURIComponent(playerID)}`);
  const bookings: IPopulatedBooking[] = await res.json();
  return bookings;
}

export function useBookingsByPlayer(playerId: TGetUserParamsDefinition["_id"]) {
  return useQuery({
    queryKey: ["getBookingsByPlayer", playerId],
    queryFn: () => getBookingsByPlayer(playerId),
  });
}
