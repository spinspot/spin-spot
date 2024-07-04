"use client";

import { AuthGuard } from "@spin-spot/components";
import {
  useAuth,
  useCreateUser,
  useSignInWithCredentials,
  useSignInWithGoogle,
  useSignOut,
  useUsers,
} from "@spin-spot/services";

export default function UserService() {
  const auth = useAuth();
  const users = useUsers();
  const createUser = useCreateUser();
  const signInWithCredentials = useSignInWithCredentials();
  const signInWithGoogle = useSignInWithGoogle();
  const signOut = useSignOut();

  const handleSubmit = () => {
    createUser.mutate(
      {
        email: Date.now() + "new@mail.com",
        firstName: "John",
        lastName: "Doe",
        gender: "MALE",
        password: "password123A",
        isActive: true,
      },
      {
        onSuccess() {
          users.refetch();
        },
      },
    );
  };

  return (
    <AuthGuard validate={(user) => user?.userType === "PLAYER"}>
      <div className="flex flex-col gap-4">
        <h1 className="font-xl">
          Te has loggeado como: {auth.user?.firstName} {auth.user?.lastName}
        </h1>
        <button
          onClick={() =>
            signInWithCredentials.mutate({
              email: "new@mail.com",
              password: "password123A",
              userType: "PLAYER",
            })
          }
        >
          Sign In With Credentials
        </button>
        <button
          onClick={() =>
            signInWithGoogle.mutate({
              app: "client",
              route: "/user-service-test",
            })
          }
        >
          Sign In With Google
        </button>
        <button onClick={() => signOut.mutate()}>Sign Out</button>
        <button onClick={handleSubmit}>Agregar</button>
        {users.data?.map((user) => <pre>{JSON.stringify(user)}</pre>)}
      </div>
    </AuthGuard>
  );
}
