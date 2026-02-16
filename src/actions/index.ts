import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { api } from "src/consts";
import { isLoggedIn } from "@utils/auth/isLoggedIn";

const statuses = {
  400: "BAD_REQUEST",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  401: "UNAUTHORIZED",
  500: "INTERNAL_SERVER_ERROR",
} as const;

export const server = {
  api: defineAction({
    input: z.object({
      resource: z.string(),
      data: z.record(z.any()).optional(),
      method: z
        .enum(["GET", "POST", "PUT", "DELETE"])
        .default("GET")
        .optional(),
      id: z.string().optional(),
    }),
    handler: async ({ resource, id, method, ...input }, ctx) => {
      const user = ctx.locals?.user || (await isLoggedIn(ctx.cookies));

      if (!user)
        return new ActionError({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });

      const token = ctx.cookies.get("access_token")?.value;
      const body = JSON.stringify(input.data) || undefined;

      const [data, error, status] = await api(resource)(id ?? "")({
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const statusCode =
        error && statuses[(status as keyof typeof statuses) ?? 500];

      if (!data && error)
        throw new ActionError({
          message: error?.message || "An error occurred",
          code: statusCode || "INTERNAL_SERVER_ERROR",
        });

      const resData = (data as any)?.data || data;
      return { data: resData, status };
    },
  }),
};
