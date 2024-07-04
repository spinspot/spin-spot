import { Schema } from "mongoose";
import { IBooking } from "./dto";

export const bookingSchema = new Schema<IBooking>(
  {
    eventType: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    players: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    timeBlock: {
      type: Schema.Types.ObjectId,
      ref: "TimeBlock",
      required: true,
    },
    status: String,
    equipment: Boolean,
  },
  { timestamps: true },
);
