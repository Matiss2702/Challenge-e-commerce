import { createRouter, createWebHistory } from "vue-router";
import homeRoutes from "@/domains/home/router";
import adminRoutes from "@/domains/admin/router";
import authRoutes from "@/domains/auth/router";
import productRoutes from "@/domains/product/router";
import userRoutes from "@/domains/user/router";
import { useAuthStore } from "@/stores/authStore";
import NotFound from "@/domains/common/NotFound.vue";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/BaseLayout.vue"),
    children: [...homeRoutes(), ...adminRoutes(), ...authRoutes(), ...productRoutes(), ...userRoutes()],
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  console.log("Navigating to:", to.name, "with params:", to.params);
  console.log("Auth Store State:", authStore.isAuthenticated, authStore.user);

  const publicRoutes = ["verify-account", "auth"];

  if (!publicRoutes.includes(to.name as string)) {
    if (!authStore.user && authStore.token) {
      await authStore.verifyTokenAndRole();
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return next({ name: "auth-login" });
    }

    if (to.meta.requiredRole) {
      const requiredRoles = Array.isArray(to.meta.requiredRole) ? to.meta.requiredRole : [to.meta.requiredRole];
      const hasRole = requiredRoles.some((role) => authStore.hasRole(role));
      if (!hasRole) {
        return next({ name: "NotFound" });
      }
    }
  }

  return next();
});

export default router;
