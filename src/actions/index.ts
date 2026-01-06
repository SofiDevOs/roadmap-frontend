import { defineAction, ActionError, type ActionErrorCode } from 'astro:actions';
import { z } from 'astro:schema';
import { api } from 'src/consts';
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(
  import.meta.env.JWT_SECRET
);

const statuses = {
  400: 'BAD_REQUEST',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  401: 'UNAUTHORIZED',
  500: 'INTERNAL_SERVER_ERROR'
}

export const server = {
  api: defineAction({
    input: z.object({
      resource: z.string(),
      data: z.record(z.any()).optional(),
      method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET').optional(),
      id: z.string().optional()
    }),
    handler: async (input) => {
      console.log('API Action Input:', input);
      const token = await new SignJWT({})
        .setProtectedHeader({alg: "HS256"})
        .sign(secret);
      
      const [data, error, status] = await api(input.resource)(input.id ?? '')({
        method: input.method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(input.data) || undefined
      });

      if( error || statuses[status as keyof typeof statuses ?? 500] ) 
        throw new ActionError({ 
          message: error?.message || 'An error occurred', 
          code: statuses[status as keyof typeof statuses] as ActionErrorCode 
            || 'INTERNAL_SERVER_ERROR' 
        });

      const resData = (data as any)?.data || data;
      return { data: resData , status };
    }
  })
}
