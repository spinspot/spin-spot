import { Router } from "express";
import { authRouter } from "./auth";
import { bookingRouter } from "./booking";
import { invitationRouter } from "./invitation";
import { tableRouter } from "./table";
import { teamRouter } from "./team";
import { timeBlockRouter } from "./time-block";
import { timeBlockTemplateRouter } from "./time-block-template";
import { tournamentRouter } from "./tournament";
import { tournamentMatchRouter } from "./tournament-match";
import { userRouter } from "./user";

const router = Router();

router.use("/auth", authRouter);
router.use("/booking", bookingRouter);
router.use("/users", userRouter);
router.use("/tables", tableRouter);
router.use("/time-blocks", timeBlockRouter);
router.use("/time-block-templates", timeBlockTemplateRouter);
router.use("/booking", bookingRouter);
router.use("/tournaments", tournamentRouter);
router.use("/teams", teamRouter);
router.use("/tournament-matches", tournamentMatchRouter);
router.use("/invitations", invitationRouter);

/* Cron job */
router.use("/api/time-blocks", timeBlockRouter);

export { router };
