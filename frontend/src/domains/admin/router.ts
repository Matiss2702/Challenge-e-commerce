import AdminPage from './pages/AdminPage.vue';

const routePageName = (baseName: string) => ({
    admin: `${baseName}-admin`,
});

const authRoutes = () => [
    {
        path: '/admin',
        name: routePageName('auth').admin,
        component: AdminPage,
    },
];

export default authRoutes;
