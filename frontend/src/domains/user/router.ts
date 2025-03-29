import UserProfilePage from "./pages/UserProfilePage.vue";
import MyOrderPage from "./pages/MyOrderPage.vue";
const routePageName = (baseName: string) => ({
  profile: `${baseName}-profile`,
  myOrders: `${baseName}-my-orders`,
});

const userRoutes = () => [
  {
    path: "/profile",
    name: routePageName("user").profile,
    component: UserProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/my-orders",
    name: "my-orders",
    component: MyOrderPage,
    meta: { requiresAuth: true },
  },
];

export default userRoutes;
