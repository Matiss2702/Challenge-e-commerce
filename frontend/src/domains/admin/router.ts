import AdminPage from './pages/AdminPage.vue';
import ManageUsers from './pages/ManageUsers.vue';
import UserFormPage from './pages/UserFormPage.vue';
import ManageProducts from './pages/ManageProducts.vue';
import ProductFormPage from './pages/ProductFormPage.vue';

const routePageName = (baseName: string) => ({
  admin: `${baseName}-page`,
  users: `${baseName}-users`,
  addUser: `${baseName}-add-user`,
  editUser: `${baseName}-edit-user`,
  products: `${baseName}-products`,
  addProduct: `${baseName}-add-product`,
  editProduct: `${baseName}-edit-product`,
});

const routes = routePageName('admin');

const adminRoutes = () => [
  // Route pour la page d'administration principale
  {
    path: '/admin',
    name: routes.admin,
    component: AdminPage,
    meta: { requiresAuth: true, requiredRole: 'ROLE_ADMIN' },
  },

  // Routes pour la gestion des utilisateurs
  {
    path: '/admin/users',
    name: routes.users,
    component: ManageUsers,
    meta: { requiresAuth: true, requiredRole: 'ROLE_ADMIN' },
  },
  {
    path: '/admin/users/add',
    name: routes.addUser,
    component: UserFormPage,
    meta: { requiresAuth: true, requiredRole: 'ROLE_ADMIN' },
  },
  {
    path: '/admin/users/:id',
    name: routes.editUser,
    component: UserFormPage,
    meta: { requiresAuth: true, requiredRole: 'ROLE_ADMIN' },
  },

  // Routes pour la gestion des produits
  {
    path: '/admin/products',
    name: routes.products,
    component: ManageProducts,
    meta: { requiresAuth: true, requiredRole: 'ROLE_ADMIN' },
  },
  {
    path: '/admin/products/add',
    name: routes.addProduct,
    component: ProductFormPage,
    meta: { requiresAuth: true, requiredRole: 'ROLE_ADMIN' },
  },
  {
    path: '/admin/products/:id',
    name: routes.editProduct,
    component: ProductFormPage,
    meta: { requiresAuth: true, requiredRole: 'ROLE_ADMIN' },
  },
];

export default adminRoutes;
