import {
  IBooking,
  TCreateBookingInputDefinition,
  TUpdateBookingInputDefinition,
  TUpdateBookingParamsDefinition,
} from "@spin-spot/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

export async function createBooking(input: TCreateBookingInputDefinition) {
  const res = await api.post("/booking", { body: input });
  const booking: IBooking = await res.json();
  return booking;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createBooking"],
    mutationFn: createBooking,

    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["getTimeBlocks"] });
      queryClient.invalidateQueries({ queryKey: ["getBookings"] });
      queryClient.invalidateQueries({
        queryKey: ["getTimeBlock", data.timeBlock],
      });
    },
  });
}

export async function updateBooking({
  _id,
  ...input
}: {
  _id: TUpdateBookingParamsDefinition["_id"];
} & TUpdateBookingInputDefinition) {
  const res = await api.put("/booking/" + encodeURIComponent(`${_id}`), {
    body: input,
  });
  const booking: IBooking = await res.json();
  return booking;
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateBooking"],
    mutationFn: updateBooking,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["getTimeBlocks"] });
      queryClient.invalidateQueries({ queryKey: ["getBookings"] });
      queryClient.invalidateQueries({
        queryKey: ["getTimeBlock", data.timeBlock],
      });
      queryClient.invalidateQueries({ queryKey: ["getBooking", data._id] });
      queryClient.invalidateQueries({
        queryKey: ["getAvailableUsers"],
      });
    },
  });
}

export async function cancelBooking({
  _id,
}: {
  _id: TUpdateBookingParamsDefinition["_id"];
} & TUpdateBookingInputDefinition) {
  const res = await api.post(`/booking/${encodeURIComponent(`${_id}`)}/cancel`);
  const booking: IBooking = await res.json();
  return booking;
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cancelBooking"],
    mutationFn: cancelBooking,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["getTimeBlocks"] });
      queryClient.invalidateQueries({ queryKey: ["getBookings"] });
      queryClient.invalidateQueries({
        queryKey: ["getTimeBlock", data.timeBlock],
      });
      queryClient.invalidateQueries({ queryKey: ["getBooking", data._id] });
    },
  });
}
