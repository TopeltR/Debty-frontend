<template>
    <div>
        <navbar/>
        <background>
            <div v-if='loaded'>
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
                               v-on:change="filterSearch" maxlength="255"/>
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
                <div id='table' class="shadow p-sm-3 mt-2 mb-2">
                    <table class='table table-responsive-sm table-bordered table-hover table-borderless' id='debts'>
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
                            <td>{{debt.title}}</td>
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
            </div>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
    import userStore from '../stores/UserStore';
    import DebtStatus from "../components/DebtStatus";

    export default {
        name: 'events',
        components: {DebtStatus, Navbar, Background},

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
                response.data.forEach((debt) => {
                    if (debt.payer.id === this.user.id) {
                        Object.assign(debt, {type: 'outgoing'});
                        this.debts.push(debt);
                    } else if (debt.receiver.id === this.user.id) {
                        Object.assign(debt, {type: 'incoming'});
                        this.debts.push(debt);
                    }
                });
                this.debts = this.debts.filter((debt) => debt.payer.id === this.user.id
                    || debt.receiver.id === this.user.id);
                this.sortDebts();
                this.filteredDebts = this.debts;
                this.loaded = true;
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

    #table {
        background-color: white;
        border-radius: .25rem;
    }

    table {
        border: none;
    }

    .no-hover:hover {
        background-color: white !important;
    }
</style>
