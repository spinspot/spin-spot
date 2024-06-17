import {
  ApiError,
  createTournamentInputDefinition,
  getTournamentParamsDefinition,
  getTournamentsQueryDefinition,
  updateTournamentInputDefinition,
  updateTournamentParamsDefinition,
} from "@spin-spot/models";
import { Request, Response } from "express";
import { tournamentService } from "./service";

async function createTournament(req: Request, res: Response) {
  const tournamentData = createTournamentInputDefinition.parse(req.body);
  const currentTime = new Date();

  if (currentTime > tournamentData?.startTime) {
    throw new ApiError({
      status: 400,
      errors: [{ message: "Fecha invalida para crear el torneo" }],
    });
  }

  const tournament = await tournamentService.createTournament(tournamentData);
  res.status(200).json(tournament);
}

async function getTournaments(req: Request, res: Response) {
  const query = getTournamentsQueryDefinition.parse(req.query);
  const tournaments = await tournamentService.getTournaments(query);
  return res.status(200).json(tournaments);
}

async function getTournament(req: Request, res: Response) {
  const params = getTournamentParamsDefinition.parse(req.params);
  const tournament = await tournamentService.getTournament(params._id);
  return res.status(200).json(tournament);
}

async function updateTournament(req: Request, res: Response) {
  const params = updateTournamentParamsDefinition.parse(req.params);
  const input = updateTournamentInputDefinition.parse(req.body);
  const tournament = await tournamentService.updateTournament(
    params._id,
    input,
  );
  return res.status(200).json(tournament);
}

export const tournamentController = {
  getTournament,
  getTournaments,
  updateTournament,
  createTournament,
} as const;
