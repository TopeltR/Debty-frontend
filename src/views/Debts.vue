<template>
    <div>
        <navbar/>
        <background>
            <div v-if="debts.length > 0">
                <h1 class='header'>My debts</h1>
                <div class='search-wrapper'>
                    <input class='form-control' type='text' v-model='search' placeholder='Search'/>
                </div>
                <div id='table'>
                    <table class='table table-bordered table-hover' id='debts'>
                        <thead>
                        <tr>
                            <th scope='col'>Title</th>
                            <th scope='col'>To/From</th>
                            <th scope='col'>Sum</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="debt in filteredList" @click="goToDebt(debt.id)">
                            <td>{{debt.title}}</td>
                            <td v-if='debt.type === "out"'>{{debt.receiver.firstName}} {{debt.receiver.lastName}}</td>
                            <td v-else-if='debt.type === "in"'>{{debt.payer.firstName}} {{debt.payer.lastName}}</td>
                            <td v-if="debt.receiver.id === user.id">
                                <div class="text-success">
                                    +{{debt.sum}} €
                                </div>
                            </td>
                            <td v-else> -{{debt.sum}} €</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else class="text-center p-5">
                <h1>Unfortunately/luckily you have no debts ¯\_(ツ)_/¯</h1>
            </div>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
    import userStore from '../stores/UserStore';

    export default {
        name: 'events',
        components: {Navbar, Background},

        mounted() {
            this.getDebts();
        },
        data() {
            return {
                debts: [],
                search: '',
                user: {},
            };
        },
        methods: {
            goToDebt(id) {
                router.push('/debts/' + id);
            },
            async getDebts() {
                this.user = await userStore.getUser();
                this.$http.get('debts/user/' + this.user.id)
                    .then((data) => {
                        data.data.forEach((debt) => {
                            if (debt.payer.id === this.user.id) {
                                Object.assign(debt, { type:'out'});
                                this.debts.push(debt);
                            } else if (debt.receiver.id === this.user.id) {
                                Object.assign(debt, {type: 'in'});
                                this.debts.push(debt);
                            }
                        });
                        this.debts = this.debts.filter((debt) => debt.payer.id === this.user.id
                            || debt.receiver.id === this.user.id);
                    }).catch(() => {
                        router.push('/');
                    },
                );
            },
        },
        computed: {
            filteredList() {
                this.debts.sort((a, b) => {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.modifiedAt) - new Date(a.modifiedAt);
                });
                return this.debts.filter((debt) => {
                    return debt.title.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.payer.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.payer.lastName.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.receiver.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.receiver.lastName.toLowerCase().includes(this.search.toLowerCase());
                });
            }
            ,
        }
        ,
    }
    ;
</script>

<style scoped>
    .header {
        padding-top: 30px
    }

    .search-wrapper {
        margin: 30px 30px 30px 0;
    }

    .form-control {
        width: 300px !important;
    }
</style>
