import {
  IPopulatedTournament,
  TCreateTournamentInputDefinition,
  TGetTournamentsQueryDefinition,
  TGetUsersQueryDefinition,
  TUpdateTournamentInputDefinition,
  TUpdateTournamentParamsDefinition,
  tournamentSchema,
} from "@spin-spot/models";
import { model } from "mongoose";

const Tournament = model("Tournament", tournamentSchema);

async function createTournament(data: TCreateTournamentInputDefinition) {
  const tournament = await Tournament.create(data);
  return tournament;
}

async function getTournaments(filter: TGetTournamentsQueryDefinition = {}) {
  const tournaments = await Tournament.find(filter).populate([
    "players",
    {
      path: "teams",
      populate: {
        path: "players",
      },
    },
  ]);
  return tournaments;
}

async function getTournament(_id: TGetTournamentsQueryDefinition["_id"]) {
  const tournament = await Tournament.findById<IPopulatedTournament>(
    _id,
  ).populate([
    "players",
    {
      path: "teams",
      populate: {
        path: "players",
      },
    },
  ]);
  return tournament;
}

async function updateTournament(
  _id: TUpdateTournamentParamsDefinition["_id"],
  data: TUpdateTournamentInputDefinition,
) {
  const tournament = await Tournament.findByIdAndUpdate(_id, data, {
    new: true,
  });
  return tournament;
}

async function getParticipants(_id: TGetTournamentsQueryDefinition["_id"]) {
  const tournament = await Tournament.findById<IPopulatedTournament>(_id)
    .populate([
      {
        path: "players",
        select: "_id firstName lastName",
      },
      {
        path: "teams",
        populate: {
          path: "players",
          select: "_id firstName lastName",
        },
      },
    ])
    .exec();

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  if (tournament.eventType === "1V1") {
    return tournament.players;
  } else if (tournament.eventType === "2V2") {
    return tournament.teams;
  } else {
    throw new Error("Invalid event type");
  }
}

async function getUserTournaments(userId: TGetUsersQueryDefinition["_id"]) {
  const tournaments = await Tournament.find({
    $or: [
      { players: userId },
      { "teams.players": userId },
    ],
  }).populate([
    "players",
    {
      path: "teams",
      populate: {
        path: "players",
      },
    },
  ]);
  return tournaments;
}

export const tournamentService = {
  createTournament,
  getTournament,
  getTournaments,
  updateTournament,
  getParticipants,
  getUserTournaments,
} as const;
