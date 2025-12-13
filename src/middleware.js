import { isLoggedIn } from "@utils/auth/isLoggedIn";
import { defineMiddleware } from "astro:middleware";
import { sequence } from "astro:middleware";

export const USER_ROLES = {
  admin: {
    path: "/dashboard/"
  },
  student: {
    path:"/dashboard/student"
  },
  teacher: {
    path:"/dashboard/teacher"
  },
};

const PRIVATE_PATHS = [
  "/settings",
  "/dashboard",
]

const PRIVATE_PARAMS = [
  "leccion",
]

export const auth = defineMiddleware(
  async ({ params, originPathname, cookies, locals, redirect }, next) => {

    if (
      !PRIVATE_PATHS.some(path => originPathname.startsWith(path))
      && !PRIVATE_PARAMS.some(param => Object.keys(params).includes(param))
    )
      return next();

    const { role, ...user } = await isLoggedIn(cookies);

    if (!user || !role)
      return redirect("/access/login");

    locals.user = import.meta.env.DEV
      ? {...user, role: "admin" }
      : {...user, role };
    if (
      originPathname.startsWith("/dashboard") &&
      !originPathname.startsWith(USER_ROLES[locals.user.role]?.path)
    )
      return redirect(USER_ROLES[role]?.path || "/access/login");

    return next();
  }
);

export const onRequest = sequence(auth);
