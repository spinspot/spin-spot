import {
  IPopulatedTournament,
  TGetTournamentParamsDefinition,
} from "@spin-spot/models";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export async function getTournaments() {
  const res = await api.get("/tournaments");
  const tournaments: IPopulatedTournament[] = await res.json();
  return tournaments;
}

export function useTournaments() {
  return useQuery({ queryKey: ["getTournaments"], queryFn: getTournaments });
}

export async function getTournament(
  _id: TGetTournamentParamsDefinition["_id"],
) {
  const res = await api.get(`/tournaments/${encodeURIComponent(`${_id}`)}`);
  const tournament: IPopulatedTournament = await res.json();
  return tournament;
}

export function useTournament(_id: TGetTournamentParamsDefinition["_id"]) {
  return useQuery({
    queryKey: ["getTournament", _id],
    queryFn: () => getTournament(_id),
  });
}

export async function getTournamentParticipants(
  _id: TGetTournamentParamsDefinition["_id"],
) {
  const res = await api.get(`/tournaments/${encodeURIComponent(`${_id}`)}/participants`);
  const participants = await res.json();
  return participants;
}

export function useTournamentParticipants(_id: TGetTournamentParamsDefinition["_id"]) {
  return useQuery({
    queryKey: ["getTournamentParticipants", _id],
    queryFn: () => getTournamentParticipants(_id),
  });
}

export async function getNotClosedTournaments() {
  const res = await api.get(`/tournaments`);
  const tournaments: IPopulatedTournament[] = await res.json();
  return tournaments.filter(tournament => tournament.status !== 'FINISHED');
}

export function useNotClosedTournaments(){
  return useQuery({ queryKey: ["getNotClosedTournaments"], queryFn: getNotClosedTournaments });
}
