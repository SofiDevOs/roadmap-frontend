import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { api } from 'src/consts';
import { SignJWT } from 'jose';
const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET);
export const server = {
  api: defineAction({
    input: z.object({
      resource: z.string(),
      data: z.record(z.any())
    }),
    handler: async (input) => {
      const token = await new SignJWT({}).setProtectedHeader({alg: "HS256"}).sign(secret);
      console.log(input.data) 
      return await api(input.resource)()({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(input.data)
      })     
    }
  })
}
