import * as jose from "jose";
import type { AstroCookies } from "astro";
import { baseDomain } from "@utils/baseDomain";

const { JWT_SECRET, BACKEND_URL, DEV } = import.meta.env;

export async function isLoggedIn(cookies: AstroCookies) {
  const hasToken = cookies.get("access_token");
  if (!hasToken) return false;

  const secret = new TextEncoder().encode(JWT_SECRET);
  const domain = import.meta.env.DEV
    ? "localhost"
    : `.${baseDomain(new URL(BACKEND_URL).hostname)}`;

  try {
    const { payload } = await jose.jwtVerify(hasToken.value || "", secret);
    if (!payload) throw new Error("Invalid token payload");
    return payload;
  } catch (error) {
    console.error("JWT verification error:", error);
    cookies.delete("access_token", {
      path: "/",
      domain: domain,
      secure: true,
      httpOnly: true,
      sameSite: DEV ? "lax" : "none",
    });
    return false;
  }
}
