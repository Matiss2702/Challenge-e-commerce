import AuthPage from "./pages/AuthPage.vue";
import VerifyAccountPage from "./pages/VerifyAccountPage.vue";
import CheckMailPage from "./pages/CheckMailPage.vue";
import RequestResetPassword from "./pages/RequestResetPassword.vue";
import ResetPassword from "./pages/ResetPassword.vue";
import { RouteLocationNormalized } from "vue-router";

const authRoutes = () => [
  {
    path: "/auth",
    name: "auth",
    component: AuthPage,
    props: true,
    meta: { requiresAuth: false },
  },
  {
    path: "/verify-account",
    name: "verify-account",
    component: VerifyAccountPage,
    props: true,
    meta: { requiresAuth: false },
  },
  {
    path: "/check-email",
    name: "check-email",
    component: CheckMailPage,
    props: true,
    meta: { requiresAuth: false },
  },
  {
    path: "/request-reset-password",
    name: "request-reset-password",
    component: RequestResetPassword,
    props: true,
    meta: { requiresAuth: false },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword,
    beforeEnter: () => {
      console.log("Entering /reset-password");
      return true;
    },
    props: (route: RouteLocationNormalized) => ({ token: route.query.token }),
    meta: { requiresAuth: false },
  },
];

export default authRoutes;
