import ProductDetailPage from "@/domains/product/pages/ProductDetailPage.vue";
import ProductsPage from "@/domains/product/pages/ProductsPage.vue";
import CategoriesPage from "@/domains/product/pages/CategoriePage.vue";
import CartPage from "@/domains/product/pages/CartPage.vue";
import SuccessPage from "@/domains/product/pages/SuccessPage.vue";
import CancelPage from "@/domains/product/pages/CancelPage.vue";

const routePageName = (baseName: string) => ({
  productList: `${baseName}-product-list`,
  productDetail: `${baseName}-product-detail`,
  categorieList: `${baseName}-categorie-list`,
  categorieDetail: `${baseName}-categorie-detail`,
  cartDetail: `${baseName}-cart-detail`,
  success: `${baseName}-success`,
  cancel: `${baseName}-cancel`,
});

const productRoutes = () => [
  {
    path: "/products",
    name: routePageName("product").productList,
    component: ProductsPage,
  },
  {
    path: "/products/:id",
    name: routePageName("product").productDetail,
    component: ProductDetailPage,
    props: true,
  },
  {
    path: "/categories",
    name: routePageName("product").categorieList,
    component: CategoriesPage,
  },
  {
    path: "/categories/:id",
    name: routePageName("product").categorieDetail,
    component: ProductDetailPage,
    props: true,
  },
  {
    path: "/cart",
    name: routePageName("product").cartDetail,
    component: CartPage,
  },
  {
    path: "/success",
    name: routePageName("product").success,
    component: SuccessPage,
  },
  {
    path: "/cancel",
    name: routePageName("product").cancel,
    component: CancelPage,
  },
];

export default productRoutes;
