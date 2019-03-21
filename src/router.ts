import Vue from 'vue';
import Router from 'vue-router';
import userStore from '@/stores/UserStore';

Vue.use(Router);

const router = new Router({
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
        {
            path: '/debts/:id',
            name: 'debts-id',
            component: () => import('./views/Debt.vue'),
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: () => import('./views/Contacts.vue'),
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('./views/UserProfile.vue'),
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    const publicPages = ['/register', '/'];
    const authRequired = !publicPages.includes(to.path);

    let loggedIn = true;
    try {
        const user = await userStore.getUser();
    } catch (e) {
        loggedIn = false;
    }

    if (authRequired && !loggedIn) {
        alert("You are not logged in!");
        return next('/');
    }
    next();
});

export default router;
