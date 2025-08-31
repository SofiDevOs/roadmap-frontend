import { UserRepository } from '../repositories/userRepository';
import { jwtVerify } from "jose";
import { JWT_SECRET, RESEND_API_KEY } from '../../../src/config';
import { InvalidTokenError } from '../errors';
import { JOSEError } from 'jose/errors';
import { Resend } from "resend"

export class VerifyUserService {
  constructor(private readonly repository: UserRepository) {}
  async verify(token: string): Promise<void> {
    const secret = new TextEncoder().encode(JWT_SECRET);

    try {
      const { payload } = await jwtVerify(token, secret);
      const userEmail = payload.email as string;
      const user =  await this.repository.findByEmail(userEmail);
      if (!user) throw new Error("User not found");
      const newUser = {
        ...user,
        emailVerified: true,
      }
      // no estoy haciendo nada....
      await this.repository.update(newUser);

    } catch (error) {
      if (error instanceof JOSEError) throw new InvalidTokenError();
      throw error;
    }
  }

  async sendVerificationEmail(email:string, token:string): Promise<void> {
    const resend = new Resend(RESEND_API_KEY);
    const verifyLink = new URL(`/api/verify?token=${token}`, import.meta.env.SITE);
    await resend.emails.send({
      from: "Roadmap <onboarding@updates.stron.me>",
      to: [email],
      subject: "verify your email",
      html: `<a href=${verifyLink}">verify your email</a>`
    });
  }
}