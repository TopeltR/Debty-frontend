import axios from 'axios';

class DebtStore {
    public debtStatus = {
        NEW: 'NEW',
        ACCEPTED: 'ACCEPTED',
        DECLINED: 'DECLINED',
        PAID: 'PAID',
        CONFIRMED: 'CONFIRMED',
    };
    private debts?: [];
    private balance?: number;

    private debtsNotificationCount?: number;

    public clear() {
        this.debts = [];
        this.balance = undefined;
        this.debtsNotificationCount = undefined;
    }

    public getDebtsNotificationCount(userId: number) {
        return {
            count: this.debtsNotificationCount,
            onChange: async (callback: (count: number) => void) => {
                if (this.debtsNotificationCount) {
                    callback(this.debtsNotificationCount);
                }
                let {data: debts} = await axios.get('/debts/user/' + userId);
                debts = debts.filter((debt: object) => this.isActionForDebt(debt, userId));
                this.debtsNotificationCount = debts.length;
                callback(debts.length);
            },
        };
    }

    public isActionForDebt(debt: any, userId: number) {
        const canAcceptDecline = debt.owner.id !== userId && debt.status === this.debtStatus.NEW;
        const canPay = userId === debt.payer.id && debt.status === this.debtStatus.ACCEPTED;
        const canConfirm = userId === debt.receiver.id && debt.status === this.debtStatus.PAID;
        return canAcceptDecline || canPay || canConfirm;
    }

    public getUserDebts(userId: number) {
        return {
            debts: this.debts,
            onChange: async (callback: ([]) => void) => {
                if (this.debts) {
                    callback(this.debts);
                }
                const {data: debts} = await axios.get('/debts/user/' + userId);
                this.debts = debts;
                callback(debts);
            },
        };
    }

    public getUserBalance(userId: number) {
        return {
            balance: this.balance,
            onChange: async (callback: (balance: number) => void) => {
                if (this.balance) {
                    callback(this.balance);
                }
                const {data: balance} = await axios.get('/debts/user/' + userId + '/total');
                this.balance = balance;
                callback(balance);
            },
        };
    }
}

const debtStore = new DebtStore();

export default debtStore;
