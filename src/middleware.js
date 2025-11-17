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
  "/dashboard"
]

export const auth = defineMiddleware(
  async ({ originPathname, cookies, locals, redirect }, next) => {

    if (!PRIVATE_PATHS.some(path => originPathname.startsWith(path)))
      return next();

    const { role, ...user } = await isLoggedIn(cookies);

    if (!user)
      return redirect("/access/login");

    locals.user = import.meta.env.DEV
      ? {...user, role: "admin" }
      : {...user, role };
    
    if (
      originPathname.startsWith("/dashboard") &&
      (!role || !USER_ROLES[role] || !originPathname.startsWith(USER_ROLES[role].path))
    )
      return redirect(USER_ROLES[role].path);


    return next();
  }
);

export const onRequest = sequence(auth);
