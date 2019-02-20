class BankAccount {
    public number: string;
    public name: string;
    public id: number | undefined;
    public created: Date | undefined;
    public modified: Date | undefined;

    constructor(num: string, name: string) {
        this.number = num;
        this.name = name;
    }
}
