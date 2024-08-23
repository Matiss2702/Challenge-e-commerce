import type { RouteRecordRaw } from "vue-router";

export const routerPageNameCategory = Object.freeze({
	CATEGORIES_PAGE: "categories",
	CATEGORY_PAGE: "category",
	PRODUCT_PAGE: "product",
	SEARCH_PAGE: "search",
});

export default (): RouteRecordRaw[] => [
	// {
	// 	name: routerPageNameCategory.CATEGORIES_PAGE,
	// 	path: "/categories",
	// 	component: () => import("./pages/CategoriesPage.vue"),
	// },
	// {
	// 	name: routerPageNameCategory.CATEGORY_PAGE,
	// 	path: "/category/:categoryName",
	// 	component: () => import("./pages/ProductsPage.vue"),
	// },
	// {
	// 	name: routerPageNameCategory.PRODUCT_PAGE,
	// 	path: "/product/:productSheetId",
	// 	component: () => import("./pages/ProductPage.vue"),
	// },
	{
		name: routerPageNameCategory.SEARCH_PAGE,
		path: "/search/:productSheetName",
		component: () => import("./pages/ProductsPage.vue"),
	},
];