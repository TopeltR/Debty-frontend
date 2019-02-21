class User {
    public static from(data: any): User {
        return new User(data.email, data.firstName, data.lastName);
    }
    public id: number | undefined;
    public email: string;
    public firstName: string;
    public lastName: string;
    public created: Date | undefined;
    public modified: Date | undefined;

    public bankAccount: BankAccount | undefined;

    constructor(email: string, firstName: string, lastName: string) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

export default User;
