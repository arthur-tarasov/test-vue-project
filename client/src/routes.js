import VueRouter from 'vue-router';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import Details from './components/Details';

let routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        component: Dashboard
    },
    {
        path: '/dashboard/:id',
        component: Details
    },
    { path: '*', component: NotFound }
];

export default new VueRouter({
    routes,
});