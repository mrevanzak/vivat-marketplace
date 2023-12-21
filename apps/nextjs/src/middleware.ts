import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/api/(.*)", "/sign-in"],
  afterAuth: (auth, req) => {
    if (!auth.userId && !auth.isPublicRoute)
      return redirectToSignIn({ returnBackUrl: req.url }) as NextResponse;

    if (new URL(req.url).pathname === "/restricted") return NextResponse.next();

    if (
      auth.userId &&
      auth.sessionClaims?.role !== "admin" &&
      !auth.isPublicRoute
    )
      return NextResponse.redirect(new URL("/restricted", req.url));

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
