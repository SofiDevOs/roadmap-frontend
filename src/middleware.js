import { isLoggedIn } from "@utils/auth/isLoggedIn";
import { defineMiddleware, sequence } from "astro:middleware";

export const USER_ROLES = {
  admin: {
    path: "/dashboard/",
  },
  student: {
    path: "/dashboard/student",
  },
  teacher: {
    path: "/dashboard/teacher",
  },
};

const PRIVATE_PATHS = ["/settings", "/dashboard"];

const PRIVATE_PARAMS = ["leccion"];

export const auth = defineMiddleware(
  async ({ params, originPathname, cookies, locals, redirect }, next) => {
    const isPrivPaths = PRIVATE_PATHS.some((p) => originPathname.startsWith(p));
    const isPrivParams = PRIVATE_PARAMS.some((p) => Object.keys(params).includes(p));
    
    if (!isPrivPaths && !isPrivParams) return next();

    const { role, ...user } = await isLoggedIn(cookies);

    if (!user || !role) return redirect("/access/login");

    locals.user = import.meta.env.DEV
      ? { ...user, role: "admin" }
      : { ...user, role };

    const isDashboardPath = originPathname.startsWith("/dashboard");
    const isUserRolePath = originPathname.startsWith(USER_ROLES[role]?.path || "");
    
    if (isDashboardPath && !isUserRolePath)
      return redirect(USER_ROLES[role]?.path || "/access/login");

    return next();
  }
);

export const onRequest = sequence(auth);
