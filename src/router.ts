import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: () => import(/* webpackChunkName: "about" */ './views/LandingPage.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "about" */ './views/Home.vue'),
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
      path: '/event/create',
      name: 'create-event',
      component: () => import('./components/CreateEvent.vue'),
    },
    {
      path:'/events' ,
      name: 'events' ,
      component: () => import(/* webpackChunkName: "about" */ './views/Events.vue'),
    },
  ],
});
