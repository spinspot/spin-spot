import {
  TGetUserParamsDefinition,
  TGetUsersQueryDefinition,
  TUpdateUserInputDefinition,
  TUpdateUserParamsDefinition,
  userSchema,
  type TCreateUserInputDefinition,
} from "@spin-spot/models";
import { hash } from "bcrypt";
import { model } from "mongoose";

userSchema.pre("save", async function (next) {
  if (this.password) this.password = await hash(this.password, 10);
  next();
});
userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret["password"];
    return ret;
  },
});
const User = model("User", userSchema);

async function getUsers(filter: TGetUsersQueryDefinition = {}) {
  const users = await User.find(filter);
  return users;
}

async function getUser(_id: TGetUserParamsDefinition["_id"]) {
  const user = await User.findById(_id);
  return user;
}

async function createUser(data: TCreateUserInputDefinition) {
  const user = await User.create(data);
  return user;
}

async function updateUser(
  _id: TUpdateUserParamsDefinition["_id"],
  data: TUpdateUserInputDefinition,
) {
  const user = await User.findByIdAndUpdate(_id, data);
  return user;
}

export const userService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
} as const;
