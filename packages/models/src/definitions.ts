import { Types, isValidObjectId } from "mongoose";
import z from "zod";

export const objectIdDefinition = z
  .instanceof(Types.ObjectId)
  .or(z.string().refine(isValidObjectId));

export const baseModelDefinition = z.object({
  _id: objectIdDefinition,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const genderDefinition = z.enum(["MALE", "FEMALE", "OTHER"], {
  message: "Debe seleccionar una opción",
});
export type TGenderEnum = z.infer<typeof genderDefinition>;

export const dayOfWeekDefinition = z.enum([
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
]);
export type TDayOfWeek = z.infer<typeof dayOfWeekDefinition>;

export const userTypeDefinition = z.enum(["PLAYER", "ADMIN"]);
export type TUserTypeEnum = z.infer<typeof userTypeDefinition>;

export const eventTypeDefinition = z.enum(["1V1", "2V2"], {
  message: "Se debe seleccionar una de las siguientes opciones: 1V1 | 2V2",
});
export type TEventTypeEnum = z.infer<typeof eventTypeDefinition>;
export const statusTypeDefinition = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "FINISHED",
]);
export type TStatusTypeEnum = z.infer<typeof eventTypeDefinition>;

export const timeBlockStatusDefinition = z.enum([
  "AVAILABLE",
  "UNAVAILABLE",
  "BOOKED",
]);
export type TStatusTimeTypeEnum = z.infer<typeof timeBlockStatusDefinition>;

export const tournamentLevelTypeDefinition = z.enum(
  ["MEDIUM", "ADVANCED", "BEGINNER"],
  {
    message:
      "Se debe seleccionar una de las siguientes opciones: MEDIUM | ADVANCED | BEGINNER",
  },
);
export type TTournamentLevelTypeEnum = z.infer<
  typeof tournamentLevelTypeDefinition
>;

export const tournamentFormatTypeDefinition = z.enum(
  ["LEAGUE", "ELIMINATION"],
  {
    message:
      "Se debe seleccionar una de las siguientes opciones: LEAGUE | ELIMINATION",
  },
);
export type TTournamentFormatTypeEnum = z.infer<
  typeof tournamentFormatTypeDefinition
>;

export const statusTournamentTypeDefinition = z
  .enum(["OPEN", "CLOSED", "IN_PROGRESS", "FINISHED"])
  .optional();
export type TStatusTournamentTypeEnum = z.infer<
  typeof statusTournamentTypeDefinition
>;

export const teamSideTypeDefinition = z.enum(["LEFT", "RIGHT"]);
export type TTeamSideTypeEnum = z.infer<typeof teamSideTypeDefinition>;

export const passwordDefinition = z
  .string()
  .regex(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/, {
    message:
      "Debe incluir al menos una letra minúscula, una letra mayúscula y un número.",
  });

export class ApiError extends Error {
  status: TApiError["status"];
  errors: TApiError["errors"];
  constructor(error: TApiError, options?: ErrorOptions) {
    super(
      `Error ${error.status}: ${error.errors.map(({ message }) => message).join(". ")}`,
      options,
    );
    this.status = error.status;
    this.errors = error.errors;
  }
}
export interface TApiError {
  status: number;
  errors: {
    message: string;
  }[];
}
