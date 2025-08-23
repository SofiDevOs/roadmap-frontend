export class User {
  constructor(
    readonly username: string,
    readonly fullname: string,
    readonly email: string,
    readonly password: string,
    readonly id?: string,
    readonly emailVerified: boolean = false,
  ) {
    this.id = crypto.randomUUID();
  }

}
