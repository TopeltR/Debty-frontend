import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'landing-page',
            component: () => import('./views/LandingPage.vue'),
        },
        {
            path: '/home',
            name: 'home',
            component: () => import( './views/Home.vue'),
        },
        {
            path: '/register',
            name: 'register',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/Register.vue'),
        },
        {
            path: '/events/create',
            name: 'create-event',
            component: () => import('./views/CreateEvent.vue'),
        },
        {
            path: '/events',
            name: 'events',
            component: () => import('./views/Events.vue'),
        },
        {
            path: '/events/:id',
            name: 'event-id',
            component: () => import('./views/Event.vue'),
            props: true,
        },
        {
            path: '/debts/create',
            name: 'create-debt',
            component: () => import('./views/CreateDebt.vue'),
        },
        {
            path: '/debts',
            name: 'debts',
            component: () => import('./views/Debts.vue'),
        },
    ],
});
