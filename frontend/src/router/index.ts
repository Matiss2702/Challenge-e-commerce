import { createWebHistory, createRouter } from 'vue-router'
import product from "../domains/product/router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
        {
            path: '/',
			component: () => import("../layouts/BaseLayout.vue"),
            children: [
                    ...product(),
            ],
        },
    ],
})
export default router;

// router.beforeEach((to, form, next) => {
// 	if (to.fullPath === "/") {
// 		return next();
// 	}

// 	axios.get(`/entry${to.fullPath}`)
// 		.info("entry.accepted", () => next())
// 		.e(() => {
// 			next("/");
// 		})
// 		.catch(() => {
// 			next("/");
// 		});
// });

