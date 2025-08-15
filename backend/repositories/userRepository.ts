export class User {
    public username: string;
    public fullname: string;
    public id: string;
    public email: string;
    public password: string;
    constructor(username: string, fullname:string, email: string, password:string){
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.id = this.setID()
    }

    public setID():string{
        this.id = crypto.randomUUID()
        return this.id
    }

 }


export class UserRepository {

    private users: User[] = [];

    constructor(){}


    public add(user: User): void {


        const users = this.users
        users.push(user)
    }

    public delete(id:string): void {
        const users = this.users

        const newUsers = users.filter(user => user.id !== id)
        this.users = newUsers
    }

    public all(): User[] {
        return this.users
    }
}

export const userRepository = new UserRepository()