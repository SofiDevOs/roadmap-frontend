import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  if (!request.referrer.includes("sofidev.blog"))
    return new Response("unauthorized", { status: 401 });

  let obj = {
    hola: "mundo",
  };

  return new Response(JSON.stringify(obj), {
    status: 200,
  });
};

export const GET: APIRoute = async ({ request }) => {
  let obj = {
    hola: "mundo",
  };

  return new Response(JSON.stringify(obj), {
    status: 200,
  });
};

