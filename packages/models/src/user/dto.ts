import z from "zod";
import {
  baseModelDefinition,
  genderDefinition,
  passwordDefinition,
  userTypeDefinition,
} from "../definitions";

export const userDefinition = baseModelDefinition.extend({
  email: z.string().email({ message: "Correo inválido" }),
  password: passwordDefinition.optional(),
  googleId: z.string().optional(),
  firstName: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(25, { message: "El nombre no puede tener más de 50 caracteres" }),
  lastName: z
    .string()
    .min(1, { message: "El apellido es requerido" })
    .max(25, { message: "El apellido no puede tener más de 50 caracteres" }),
  gender: genderDefinition.optional(),
  userType: userTypeDefinition,
  isActive: z.boolean().optional(),
});
export type IUser = z.infer<typeof userDefinition>;

export const getUsersQueryDefinition = userDefinition
  .omit({ password: true })
  .partial();
export type TGetUsersQueryDefinition = z.infer<typeof getUsersQueryDefinition>;

export const getUserParamsDefinition = userDefinition.pick({ _id: true });
export type TGetUserParamsDefinition = z.infer<typeof getUserParamsDefinition>;

export const createUserInputDefinition = userDefinition.omit({ _id: true, userType: true});
export type TCreateUserInputDefinition = z.infer<
  typeof createUserInputDefinition
>;

export const updateUserParamsDefinition = userDefinition.pick({ _id: true });
export type TUpdateUserParamsDefinition = z.infer<
  typeof getUserParamsDefinition
>;

export const updateUserInputDefinition = userDefinition.partial().omit({userType: true});
export type TUpdateUserInputDefinition = z.infer<
  typeof updateUserInputDefinition
>;
