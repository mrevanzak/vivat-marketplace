import { auth } from "@clerk/nextjs";

export interface AuthSession {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  } | null;
}

export const getUserAuth = async () => {
  // find out more about setting up 'sessionClaims' (custom sessions) here: https://clerk.com/docs/backend-requests/making/custom-session-token
  const { userId } = auth();
  if (userId) {
    return {
      session: {
        user: {
          id: userId,
        },
      },
    } as AuthSession;
  } else {
    return { session: null };
  }
};
