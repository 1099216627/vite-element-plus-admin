import { Menu } from "@/models/menu-model";
import { floatToTree } from "@/utils";
export const Layout = () => import("@/layout/index.vue");
const LayoutMap = new Map<string, () => Promise<typeof import("*.vue")>>();
LayoutMap.set("LAYOUT", Layout);
let viewsModules: Record<string, () => Promise<Recordable>> = import.meta.glob("../views/**/*.{vue,tsx}");
// 根据后端返回数据生成路由
export function generateRoutes(routes: Menu.ItemRaw[]) {
	const res: any[] = [];
	const newRoutes = floatToTree(routes);
	newRoutes.forEach((route: Menu.ItemRaw) => {
		let tmp: any = generateRoute(route);
		if (tmp.children) {
			tmp.children = generateRoutes(tmp.children);
		}

		tmp = asyncImportRoute(tmp);
		res.push(tmp);
	});
	return res;
}

export function generateRoute(route: Menu.ItemRaw) {
	const res: any = {};
	res.path = route.path;
	res.name = route.name;
	res.component = route.component;
	res.redirect = route.redirect;
	res.meta = {
		title: route.title,
		icon: route.icon,
		affix: route.affix,
		hidden: route.hidden,
		cache: route.cache
	};
	res.children = route.children || [];
	return res;
}

/**
 * 查找views中对应的组件文件
 * */
export const asyncImportRoute = (route: Menu.AppRouteRaw) => {
	let tmp = { ...route };
	const { component, children } = tmp;
	if (component) {
		const layoutFound = LayoutMap.get(component as string);
		if (layoutFound) {
			tmp.component = layoutFound;
		} else {
			tmp.component = dynamicImport(viewsModules, component as string);
		}
	}
	children && children.forEach(item => asyncImportRoute(item));
	return tmp;
};

export function dynamicImport(viewsModules: Record<string, () => Promise<Recordable>>, component: string): any {
	const keys = Object.keys(viewsModules);
	const matchKeys = keys.filter(key => {
		let k = key.replace("../views", "");
		const lastIndex = k.lastIndexOf(".");
		k = k.substring(0, lastIndex);
		return k === component;
	});
	if (matchKeys?.length === 1) {
		const matchKey = matchKeys[0];
		return viewsModules[matchKey];
	}
	if (matchKeys?.length > 1) {
		console.warn(
			"Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure"
		);
		return;
	}
}
