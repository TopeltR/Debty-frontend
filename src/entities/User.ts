class User {
    public static from(data: any): User {
        const user = new User(data.email, data.firstName, data.lastName, data.bankAccount);
        user.id = data.id;
        return user;
    }
    public id: number | undefined;
    public email: string;
    public firstName: string;
    public lastName: string;
    public created: Date | undefined;
    public modified: Date | undefined;

    public bankAccount: BankAccount | undefined;

    constructor(email: string, firstName: string, lastName: string, bankAccount: any) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bankAccount = bankAccount;
    }
}

export default User;
