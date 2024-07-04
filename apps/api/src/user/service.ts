import {
  ITournament,
  IUser,
  TGetTournamentParamsDefinition,
  TGetUserParamsDefinition,
  TGetUsersQueryDefinition,
  TUpdateUserInputDefinition,
  TUpdateUserParamsDefinition,
  bookingSchema,
  teamSchema,
  tournamentSchema,
  userSchema,
  type TCreateUserInputDefinition,
} from "@spin-spot/models";
import { hash } from "bcrypt";
import { UpdateQuery, model } from "mongoose";

userSchema.pre("save", async function (next) {
  if (this.password) this.password = await hash(this.password, 10);
  next();
});
userSchema.pre("findOneAndUpdate", async function (next) {
  const user: UpdateQuery<IUser> | null = this.getUpdate();
  if (user?.password) user.password = await hash(user.password, 10);
  next();
});
userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret["password"];
    delete ret["googleId"];
    return ret;
  },
});
const User = model("User", userSchema);
const Booking = model("Booking", bookingSchema);

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

async function getAvailableUsers() {
  const users: IUser[] = await User.aggregate([
    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "players",
        as: "bookings",
      },
    },
    {
      $match: {
        bookings: {
          $not: {
            $elemMatch: {
              status: { $in: ["PENDING", "IN_PROGRESS"] },
            },
          },
        },
      },
    },
    {
      $project: {
        bookings: false,
      },
    },
  ]);

  return users;
}

async function isUserAvailable(_id: TGetUserParamsDefinition["_id"]) {
  const user = await User.findById(_id);
  if (!user) return false;

  const bookings = await Booking.find({
    players: _id,
    status: { $in: ["PENDING", "IN_PROGRESS"] },
  });

  return bookings.length === 0;
}

const Tournament = model("Tournament", tournamentSchema);
const Team = model("Team", teamSchema);

async function getAvailableUsersByTournament(
  _id: TGetTournamentParamsDefinition["_id"],
) {
  const tournamentId: ITournament["_id"] = _id;
  const tournament =
    await Tournament.findById(tournamentId).select("players teams");

  const playersInTournament = tournament?.players ?? [];

  const teamsInTournament = tournament?.teams ?? [];
  const teams = await Team.find({ _id: { $in: teamsInTournament } }).select(
    "players",
  );

  const playersInTeams = teams.flatMap((team) => team.players); //esto crea un nuevo array de jugadores de los equipos

  const allExcludedPlayers = [...playersInTournament, ...playersInTeams];

  const users = await User.aggregate([
    {
      $match: {
        _id: { $nin: allExcludedPlayers },
      },
    },
  ]);

  return users;
}

export const userService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  getAvailableUsers,
  isUserAvailable,
  getAvailableUsersByTournament,
} as const;
