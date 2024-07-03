import {
  ITournament,
  TCreateTeamInputDefinition,
  TCreateTournamentInputDefinition,
  TUpdateTournamentInputDefinition,
  TUpdateTournamentParamsDefinition,
} from "@spin-spot/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

export async function createTournament(
  input: TCreateTournamentInputDefinition,
) {
  const res = await api.post("/tournaments", { body: input });
  const tournament: ITournament = await res.json();
  return tournament;
}

export function useCreateTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTournament"],
    mutationFn: createTournament,

    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["getTournaments"] });
      queryClient.invalidateQueries({ queryKey: ["getTournament", data._id] });
    },
  });
}

export async function updateTournament({
  _id,
  ...input
}: {
  _id: TUpdateTournamentInputDefinition["_id"];
} & TUpdateTournamentInputDefinition) {
  const res = await api.put(`/tournaments/${encodeURIComponent(`${_id}`)}`, {
    body: input,
  });
  const tournament: ITournament = await res.json();
  return tournament;
}

export function useUpdateTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateTournament"],
    mutationFn: updateTournament,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["getTournaments"] });
      queryClient.invalidateQueries({ queryKey: ["getTournament", data._id] });
      queryClient.invalidateQueries({ queryKey: ["getNotClosedTournaments"]}); 
    },
  });
}

export async function joinTournament({
  _id,
  ...input
}: {
  _id: TUpdateTournamentParamsDefinition["_id"];
} & TCreateTeamInputDefinition) {
  const res = await api.post(
    `/tournaments/${encodeURIComponent(`${_id}`)}/join`,
    {
      body: input,
    },
  );
  const tournament: ITournament = await res.json();
  return tournament;
}

export async function leaveTournament({
  _id,
}: {
  _id: TUpdateTournamentParamsDefinition["_id"];
}) {
  const res = await api.post(
    `/tournaments/${encodeURIComponent(`${_id}`)}/leave`,
  );
  const tournament: ITournament = await res.json();
  return tournament;
}

export function useJoinTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["joinTournament"],
    mutationFn: joinTournament,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["getTournaments"] });
      queryClient.invalidateQueries({ queryKey: ["getTournament", data._id] });
    },
  });
}

export function useLeaveTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["leaveTournament"],
    mutationFn: leaveTournament,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["getTournaments"] });
      queryClient.invalidateQueries({ queryKey: ["getTournament", data._id] });
    },
  });
}
