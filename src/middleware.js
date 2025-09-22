import { isLoggedIn } from "@utils/auth/isLoggedIn";
import { defineMiddleware } from "astro:middleware";


export const onRequest = defineMiddleware(async ({originPathname, cookies, locals, redirect}, next) => {
  
  if(!originPathname.startsWith('/dashboard')) return next()

  const user = await isLoggedIn(cookies)
  if(!user) return redirect('/access/login')
  
  locals.user = user
  return next()

})
