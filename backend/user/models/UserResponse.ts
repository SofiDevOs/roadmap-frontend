export class UserResponse {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly fullname: string,
    readonly email: string,
  ) {}
}
