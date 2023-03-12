import { App } from "vue";
import auth from "./modules/auth";
const directivesList: any = {
	auth
};

const directives = {
	install: function (app: App<Element>) {
		Object.keys(directivesList).forEach(key => {
			// 注册所有自定义指令
			app.directive(key, directivesList[key]);
		});
	}
};
export function setupDirectives(app: App<Element>) {
	app.use(directives);
}
export default directives;
