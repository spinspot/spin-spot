import z from "zod";
import { IUser, userDefinition } from "../user";

export const signInWithCredentialsInputDefinition = userDefinition.pick({
  email: true,
  password: true,
});
export type TSignInWithCredentialsInputDefinition = z.infer<
  typeof signInWithCredentialsInputDefinition
>;

export const signUpWithCredentialsInputDefinition = userDefinition.pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});
export type TSignUpWithCredentialsInputDefinition = z.infer<
  typeof signUpWithCredentialsInputDefinition
>;

export const signInWithGoogleQueryDefinition = z.object({
  app: z.enum(["client", "admin"]),
  route: z.string(),
});
export type TSignInWithGoogleQueryDefinition = z.infer<
  typeof signInWithGoogleQueryDefinition
>;

export type TSignInWithCredentialsResponse = {
  user: IUser;
};

export type JwtPayload = Pick<
  IUser,
  "_id" | "email" | "firstName" | "lastName" | "userType"
>;
