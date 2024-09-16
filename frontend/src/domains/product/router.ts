// router/index.ts
import ProductDetailPage from '@/domains/product/pages/ProductDetailPage.vue';
import ProductsPage from '@/domains/product/pages/ProductsPage.vue';
import CategoriesPage from '@/domains/product/pages/CategoriePage.vue';
import CartPage from '@/domains/product/pages/CartPage.vue'

const routePageName = (baseName: string) => ({
  productList: `${baseName}-product-list`,
  productDetail: `${baseName}-product-detail`,
  categorieList: `${baseName}-categorie-list`,
  categorieDetail: `${baseName}-categorie-detail`,
  cartDetail: `${baseName}-cart-detail`,
});

const productRoutes = () => [
  {
    path: '/products',
    name: routePageName('product').productList,
    component: ProductsPage,
  },
  {
    path: '/products/:id',
    name: routePageName('product').productDetail,
    component: ProductDetailPage,
    props: true, // Assurez-vous que les props sont activés
  },
  {
    path: '/categories',
    name: routePageName('product').categorieList,
    component: CategoriesPage,
  },
  {
    path: '/categories/:id',
    name: routePageName('product').categorieDetail,
    component: ProductDetailPage,
    props: true,
  },
  {
    path: '/cart',
    name: routePageName('product').cartDetail,
    component: CartPage,
  },
];

export default productRoutes;
