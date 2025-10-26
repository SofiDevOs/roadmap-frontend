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


export const auth = defineMiddleware(
  async ({ originPathname, cookies, locals, redirect }, next) => {

    if ( !originPathname.startsWith("/dashboard") )
      return next();

    const user = await isLoggedIn(cookies);

    if (!user)
      return redirect("/access/login");

    locals.user = import.meta.env.DEV ? { ...user, role: "admin" } : user;

    if ( !originPathname.startsWith(USER_ROLES[locals.user.role].path) )
      return redirect(USER_ROLES[locals.user.role].path);


    return next();
  }
);

export const onRequest = sequence(auth);
