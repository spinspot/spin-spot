import { auth } from "@/middleware";
import { Router } from "express";
import { bookingController } from "./controller";

const bookingRouter = Router();

bookingRouter.get("/", bookingController.getBookings);
bookingRouter.get("/:_id", bookingController.getBooking);
bookingRouter.get("/player/:playerId", bookingController.getBookingsByPlayer);
bookingRouter.post("/", auth(), bookingController.bookingWithUser);
bookingRouter.put("/:_id", bookingController.updateBooking);
bookingRouter.post("/:_id/cancel", bookingController.cancelBooking);
bookingRouter.post("/:_id/join", auth(), bookingController.joinBooking);
bookingRouter.post("/:_id/leave", auth(), bookingController.leaveBooking);

export { bookingRouter };
