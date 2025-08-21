export class User {
  constructor(
    readonly username: string,
    readonly fullname: string,
    readonly email: string,
    readonly password: string,
    readonly id?: string,
  ) {
    this.id = this.setID();
  }

  public setID(): string {
    return crypto.randomUUID();
  }
}

