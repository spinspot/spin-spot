import z from "zod";
import { passwordDefinition } from "../definitions";
import { IUser, userDefinition } from "../user";

export const signInWithCredentialsInputDefinition = userDefinition.pick({
  email: true,
  password: true,
  userType: true,
});
export type TSignInWithCredentialsInputDefinition = z.infer<
  typeof signInWithCredentialsInputDefinition
>;

export const forgotPasswordInputDefinition = userDefinition.pick({
  email: true,
});
export type TForgotPasswordInputDefinition = z.infer<
  typeof forgotPasswordInputDefinition
>;

export const resetPasswordInputDefinition = z.object({
  user: userDefinition.shape._id,
  token: z.string(),
  password: passwordDefinition,
  confirmPassword: passwordDefinition,
});
export type TResetPasswordInputDefinition = z.infer<
  typeof resetPasswordInputDefinition
>;

export const signUpWithCredentialsInputDefinition = userDefinition.pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  gender: true,
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
  token: string;
};

export type JwtPayload = Pick<
  IUser,
  "_id" | "email" | "firstName" | "lastName" | "userType"
>;
