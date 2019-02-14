class BankAccount {
    public number: string;
    public name: string;
    public id: number | undefined;
    public created: Date | undefined;
    public modified: Date | undefined;

    constructor(number: string, name: string) {
        this.number = number;
        this.name = name;
    }
}
