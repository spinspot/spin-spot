import { Types, isValidObjectId } from "mongoose";
import z from "zod";
import { baseModelDefinition } from "../definitions";
import { IUser } from "../user";

export const teamDefinition = baseModelDefinition.extend({
  name: z
    .string()
    .min(1, { message: "El nombre del equipo es requerido" })
    .max(25, { message: "El nombre no puede tener más de 50 caracteres" }),
  players: z
    .array(z.instanceof(Types.ObjectId).or(z.string().refine(isValidObjectId)))
    .refine((players) => players.length === 2, {
      message: "El equipo debe tener exactamente 2 jugadores",
    }),
});
export type TTeamDefinition = z.infer<typeof teamDefinition>;

export type ITeam = z.infer<typeof teamDefinition>;
export type IPopulatedTeam = Omit<ITeam, "players"> & {
  players: IUser[];
};

export const getTeamsQueryDefinition = teamDefinition.partial();
export type TGetTeamsQueryDefinition = z.infer<typeof getTeamsQueryDefinition>;

export const getTeamsByUserIdParamsDefinition = teamDefinition
  .pick({ players: true })
  .extend({
    players: z
      .instanceof(Types.ObjectId)
      .or(z.string().refine(isValidObjectId)),
  });
export type TGetTeamsByUserIdParamsDefinition = z.infer<
  typeof getTeamsByUserIdParamsDefinition
>;

export const getTeamParamsDefinition = teamDefinition.pick({ _id: true });
export type TGetTeamParamsDefinition = z.infer<typeof getTeamParamsDefinition>;

export const createTeamInputDefinition = teamDefinition.omit({
  _id: true,
});
export type TCreateTeamInputDefinition = z.infer<
  typeof createTeamInputDefinition
>;

export const updateTeamParamsDefinition = teamDefinition.pick({
  _id: true,
});
export type TUpdateTeamParamsDefinition = z.infer<
  typeof getTeamParamsDefinition
>;

export const updateTeamInputDefinition = teamDefinition.partial();
export type TUpdateTeamInputDefinition = z.infer<
  typeof updateTeamInputDefinition
>;
