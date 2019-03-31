<template>
    <div>
        <navbar/>
        <background>
            <div v-if='loaded'>
                <div v-if="debts.length > 0">
                    <h1 class='header pt-4'>My debts</h1>
                    <b-row class='mt-4 mb-4'>
                        <b-col class="col-12 col-md-3">
                            <input class='form-control' type='text' v-model='search' placeholder='Search' v-on:change="filterSearch"/>
                        </b-col>
                        <b-col class="col-12 col-md-3 form-inline mt-3 mt-md-0">
                            <div class="form-group">
                                <label for="statusFilter" class="mr-3">Filter by status:</label>
                                <select id="statusFilter" v-model='selectedStatus' class="form-control float-right" v-on:change="filterStatus">
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
                    <div id='table'>
                        <table class='table table-bordered table-hover' id='debts'>
                            <thead>
                            <tr>
                                <th scope='col'>Sum</th>
                                <th scope='col'>Title</th>
                                <th scope='col'>To/From</th>
                                <th scope='col'>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="debt in filteredDebts" @click="goToDebt(debt.id)">
                                <td v-if="debt.receiver.id === user.id">
                                    <div class="text-success">
                                        +{{debt.sum}} €
                                    </div>
                                </td>
                                <td v-else> -{{debt.sum}} €</td>
                                <td>{{debt.title}}</td>
                                <td v-if='debt.type === "outgoing"'>{{debt.receiver.firstName}} {{debt.receiver.lastName}}</td>
                                <td v-else-if='debt.type === "incoming"'>{{debt.payer.firstName}} {{debt.payer.lastName}}</td>
                                <td>
                                    <debt-status :status="debt.status"></debt-status>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-else class="text-center p-5">
                    <h1>Unfortunately/luckily you have no debts ¯\_(ツ)_/¯</h1>
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

        mounted() {
            this.getDebts();
        },
        data() {
            return {
                loaded: false,
                debts: [],
                filteredDebts: [],
                search: '',
                user: {},
                allStatuses: ["NEW", "ACCEPTED", "DECLINED", "PAID", "CONFIRMED"],
                selectedStatus: "ALL",
            };
        },
        methods: {
            goToDebt(id) {
                router.push('/debts/' + id);
            },
            async getDebts() {
                this.user = await userStore.getUser();
                this.$http.get('debts/user/' + this.user.id)
                    .then((response) => {
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
                    }).catch(() => {
                        router.push('/');
                    },
                );
            },
            filterStatus() {
                this.sortDebts();
                if (this.selectedStatus === "ALL") {
                    this.filteredDebts = this.debts;
                } else {
                    this.filteredDebts = this.debts.filter((debt) => debt.status === this.selectedStatus);
                }
            },
            filterSearch() {
                this.sortDebts();
                this.filteredDebts = this.debts.filter((debt) => {
                    return debt.title.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.payer.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.payer.lastName.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.receiver.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.receiver.lastName.toLowerCase().includes(this.search.toLowerCase());
                });
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
</style>
