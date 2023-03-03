//是否为开发环境
import { ConfigEnv, loadEnv } from "vite";

export function isDevFn(mode: string): boolean {
	return mode === "development";
}
//是否为生产环境
export function isProdFn(mode: string): boolean {
	return mode === "production";
}
//是否生成包预览
export function isReportMode(): boolean {
	return process.env.VITE_REPORT === "true";
}
//读取env文件配置
export function wrapperEnv(envConf: Recordable): ViteEnv {
	const ret: any = {};

	for (const envName of Object.keys(envConf)) {
		let realName = envConf[envName].replace(/\\n/g, "\n");
		realName = realName === "true" ? true : realName === "false" ? false : realName;

		if (envName === "VITE_PORT") {
			realName = Number(realName);
		}
		if (envName === "VITE_PROXY") {
			try {
				realName = JSON.parse(realName);
			} catch (error) {}
		}
		ret[envName] = realName;
		process.env[envName] = realName;
	}
	return ret;
}

export function getEnvConfig(mode: ConfigEnv["mode"]): ViteEnv {
	const env = loadEnv(mode, process.cwd());
	return wrapperEnv(env);
}
