import AdminPage from "./pages/AdminPage.vue";
import ManageUsers from "./pages/ManageUsers.vue";
import UserFormPage from "./pages/UserFormPage.vue";
import ManageProducts from "./pages/ManageProducts.vue";
import ProductFormPage from "./pages/ProductFormPage.vue";

const routePageName = (baseName: string) => ({
  admin: `${baseName}-page`,
  users: `${baseName}-users`,
  addUser: `${baseName}-add-user`,
  editUser: `${baseName}-edit-user`,
  products: `${baseName}-products`,
  addProduct: `${baseName}-add-product`,
  editProduct: `${baseName}-edit-product`,
});

const routesNames = routePageName("admin");

const adminRoutes = (): any[] => [
  {
    path: "/admin",
    name: routesNames.admin,
    component: AdminPage,
    meta: { requiresAuth: true, requiredRole: "ROLE_ADMIN" },
  },
  {
    path: "/admin/users",
    name: routesNames.users,
    component: ManageUsers,
    meta: { requiresAuth: true, requiredRole: "ROLE_ADMIN" },
  },
  {
    path: "/admin/users/add",
    name: routesNames.addUser,
    component: UserFormPage,
    meta: { requiresAuth: true, requiredRole: "ROLE_ADMIN" },
  },
  {
    path: "/admin/users/:id",
    name: routesNames.editUser,
    component: UserFormPage,
    meta: { requiresAuth: true, requiredRole: "ROLE_ADMIN" },
  },
  {
    path: "/admin/products",
    name: routesNames.products,
    component: ManageProducts,
    meta: { requiresAuth: true, requiredRole: ["ROLE_ADMIN", "ROLE_STORE_KEEPER"] },
  },
  {
    path: "/admin/products/add",
    name: routesNames.addProduct,
    component: ProductFormPage,
    meta: { requiresAuth: true, requiredRole: "ROLE_ADMIN" },
  },
  {
    path: "/admin/products/:id",
    name: routesNames.editProduct,
    component: ProductFormPage,
    meta: { requiresAuth: true, requiredRole: ["ROLE_ADMIN", "ROLE_STORE_KEEPER"] },
  },
];

export default adminRoutes;
