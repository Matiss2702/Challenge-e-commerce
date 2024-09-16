import AuthPage from './pages/AuthPage.vue';

const routePageName = (baseName: string) => ({
    auth: `${baseName}-auth`,
});

const authRoutes = () => [
    {
        path: '/auth',
        name: routePageName('auth').auth,
        component: AuthPage,
        props: true,
    },
];

export default authRoutes;
