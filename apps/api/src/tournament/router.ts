import { auth } from "@/middleware";
import { Router } from "express";
import { tournamentController } from "./controller";

const tournamentRouter = Router();

tournamentRouter.get("/", tournamentController.getTournaments);
tournamentRouter.get("/:_id", tournamentController.getTournament);
tournamentRouter.post("/", tournamentController.createTournament);
tournamentRouter.put("/:_id", tournamentController.updateTournament);
tournamentRouter.post(
  "/:_id/join",
  auth(),
  tournamentController.joinTournament,
);
tournamentRouter.post(
  "/:_id/leave",
  auth(),
  tournamentController.leaveTournament,
);
tournamentRouter.get(
  "/:_id/participants",
  tournamentController.getTournamentParticipants,
);
tournamentRouter.get(
  "/user/:userId",
  tournamentController.getUserTournaments,
);


export { tournamentRouter };
