// import { routerPageNameAdminPanel } from "@/domains/admin/router";
// import { routerPageNameAuth } from "@/domains/auth/router";
// import { routerPageNameUser } from "@/domains/user/router";
import { routerPageNameCategory } from '../../domains/product/router';
// import { routerPageNamePayment } from "@/domains/payment/router";

export const routerPageName = Object.freeze({
	// ...routerPageNameAdminPanel,
	// ...routerPageNameAuth,
	// ...routerPageNameUser,
	...routerPageNameCategory,
	// ...routerPageNamePayment,
});