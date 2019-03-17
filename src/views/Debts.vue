<template>
    <div>
        <navbar/>
        <background>
            <h1 class='header'>My debts</h1>
            <div class='search-wrapper'>
                <input class='form-control' type='text' v-model='search' placeholder='Search'/>
            </div>
            <div id='table'>
                <table class='table table-bordered table-hover'>
                    <thead>
                    <tr>
                        <th scope='col'>Title</th>
                        <th scope='col'>Sum</th>
                        <th scope='col'>Payer</th>
                        <th scope='col'>Receiver</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="debt in filteredList" @click="goToDebt(debt.id)">
                        <td>{{debt.title}}</td>
                        <td  >{{debt.sum}} {{debt.currency}} </td>
                        <td class=''>{{debt.payer.firstName}} {{debt.payer.lastName}}</td>
                        <td class=''>{{debt.receiver.firstName}} {{debt.receiver.lastName}}</td>
                    </tr>
                    </tbody>
                </table>
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

            };
        },
        methods: {
            goToDebt(id) {
                router.push('/debts/' + id);
            },
            getDebts() {
                const self = this;
                userStore.getUser().then((user) => {
                    self.$http.get('debts/user/' + user.id)
                        .then((data) => {
                            console.log(data.data);
                            self.debts = data.data;
                        }).catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
        },
        computed: {

            filteredList() {
                this.debts.sort(function(a,b){
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.modifiedAt) - new Date(a.modifiedAt);
                });
                return this.debts.filter((debt) => {
                    return debt.title.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.payer.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.payer.lastName.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.receiver.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
                        debt.receiver.lastName.toLowerCase().includes(this.search.toLowerCase())
                });
            },
        },
    };
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