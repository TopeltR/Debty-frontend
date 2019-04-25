<template>
    <div>
        <navbar/>
        <background>
            <spinner :loaded='loaded'>
                <h1 class='header pt-4'>My debts
                    <font-awesome-icon icon='plus' class='ml-3 mt-2 green' v-on:click='createNewDebt'/>
                </h1>
                <b-row>
                    <b-col>
                        <h4>Total balance: {{totalBalance}}€</h4>
                    </b-col>
                </b-row>
                <b-row class='mt-4 mb-4'>
                    <b-col class="col-12 col-md-3">
                        <input class='form-control' type='text' v-model='search' placeholder='Search'
                               v-on:change="filterSearch"/>
                    </b-col>
                    <b-col class="col-12 col-md-3 form-inline mt-3 mt-md-0">
                        <div class="form-group">
                            <label for="statusFilter" class="mr-3">Filter by status:</label>
                            <select id="statusFilter" v-model='selectedStatus' class="form-control float-right"
                                    v-on:change="filterStatus">
                                <option selected value="ALL">All</option>
                                <option value="NEW">New</option>
                                <option value="ACCEPTED">Accepted</option>
                                <option value="DECLINED">Declined</option>
                                <option value="PAID">Paid</option>
                                <option value="CONFIRMED">Confirmed</option>
                            </select>
                        </div>
                    </b-col>
                </b-row>
                <div id='table' class="shadow rounded p-sm-3 mt-2 mb-2 bg-white">
                    <table class='table table-responsive-sm table-hover' id='debts'>
                        <thead>
                        <tr>
                            <th scope='col'>Sum</th>
                            <th scope='col'>Title</th>
                            <th scope='col'>To/From</th>
                            <th scope='col'>Status</th>
                        </tr>
                        </thead>
                        <tbody v-if="filteredDebts.length > 0">
                        <tr v-for="debt in filteredDebts" @click="goToDebt(debt.id)">
                            <td v-if="debt.receiver.id === user.id">
                                <div class="text-success">
                                    +{{debt.sum}} €
                                </div>
                            </td>
                            <td v-else> -{{debt.sum}} €</td>
                            <td>{{debt.title}}
                                <span v-if="debt.action"
                                      class='badge badge-primary badge-pill m-0 ml-2 bg-lime'>!</span>
                            </td>
                            <td v-if='debt.type === "outgoing"'>{{debt.receiver.firstName}}
                                {{debt.receiver.lastName}}
                            </td>
                            <td v-else-if='debt.type === "incoming"'>{{debt.payer.firstName}}
                                {{debt.payer.lastName}}
                            </td>
                            <td>
                                <debt-status :status="debt.status"></debt-status>
                            </td>
                        </tr>
                        </tbody>
                        <tbody v-else>
                        <tr class="no-hover">
                            <td colspan="4">
                                <span class="text-grey">You have no debts, start by clicking on the plus sign!</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </spinner>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
    import userStore from '@/stores/UserStore';
    import DebtStatus from "@/components/DebtStatus.vue";
    import Spinner from "@/components/Spinner.vue";

    export default {
        name: 'events',
        components: {DebtStatus, Navbar, Background, Spinner},

        async mounted() {
            this.user = await userStore.getUser();
            this.totalBalance = await this.getBalance();
            this.getDebts();
        },
        data() {
            return {
                loaded: false,
                debts: [],
                filteredDebts: [],
                totalBalance: 0,
                search: '',
                user: {},
                allStatuses: ["NEW", "ACCEPTED", "DECLINED", "PAID", "CONFIRMED"],
                selectedStatus: "ALL",
                debtStatus: {
                    NEW: 'NEW',
                    ACCEPTED: 'ACCEPTED',
                    DECLINED: 'DECLINED',
                    PAID: 'PAID',
                    CONFIRMED: 'CONFIRMED',
                },
            };
        },
        methods: {
            createNewDebt() {
                router.push('/debts/create');
            },
            goToDebt(id) {
                router.push('/debts/' + id);
            },
            async getBalance() {
                const response = await this.$http.get("/debts/user/" + this.user.id + "/total");
                return response.data;
            },
            async getDebts() {
                const response = await this.$http.get('/debts/user/' + this.user.id);
                this.debts = response.data;
                this.debts.map((debt) => this.addKeysToDebt(debt));
                this.sortDebts();
                this.filteredDebts = this.debts;
                this.loaded = true;
            },
            addKeysToDebt(debt) {
                let key = 'type';
                debt[key] = debt.payer.id === this.user.id ? 'outgoing' : 'incoming';
                key = 'action';
                debt[key] = this.isActionForDebt(debt);
                return debt;
            },
            isActionForDebt(debt) {
                const canAcceptDecline = debt.owner.id !== this.user.id && debt.status === this.debtStatus.NEW;
                const canPay = this.user.id === debt.payer.id && debt.status === this.debtStatus.ACCEPTED;
                const canConfirm = this.user.id === debt.receiver.id && debt.status === this.debtStatus.PAID;
                return canAcceptDecline || canPay || canConfirm;
            },
            async filterSearch() {
                this.sortDebts();
                this.filteredDebts = this.debts.filter((debt) => {
                    return debt.title.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.payer.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.payer.lastName.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.receiver.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.receiver.lastName.toLowerCase().includes(this.search.toLowerCase());
                });
            },
            filterStatus() {
                this.sortDebts();
                if (this.selectedStatus === "ALL") {
                    this.filteredDebts = this.debts;
                } else {
                    this.filteredDebts = this.debts.filter((debt) => debt.status === this.selectedStatus);
                }
            },
            sortDebts() {
                this.debts.sort((a, b) => {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
            },
        },
    }
    ;
</script>

<style scoped>
    .green {
        color: limegreen;
    }

    table thead tr th {
        border-top-color: white;
        border-bottom-color: white;
    }

    .text-grey {
        color: grey;
    }

    @media (max-width: 576px) {
        #debts {
            width: 100%;
        }

        #table {
            margin: -30px;
        }
    }

    .no-hover:hover {
        background-color: white !important;
    }

    .bg-lime {
        background-color: limegreen !important;
    }
</style>
