import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { wrapperEnv } from "./src/utils/env";
import { visualizer } from "rollup-plugin-visualizer";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import viteCompression from "vite-plugin-compression";
import vueSetupExtend from "vite-plugin-vue-setup-extend-plus";
import eslintPlugin from "vite-plugin-eslint";
import vueJsx from "@vitejs/plugin-vue-jsx";
import importToCDN from "vite-plugin-cdn-import";
// import fs from "fs";
// // import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";
// import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// @see: https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	const env = loadEnv(mode, process.cwd());
	const viteEnv = wrapperEnv(env);

	return {
		base: process.env.NODE_ENV === "production" ? "./" : "/",
		resolve: {
			alias: {
				"@": resolve(__dirname, "src"),
				"vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "@/styles/var.scss";`
				}
			}
		},
		server: {
			port: 4000 || viteEnv.VITE_PORT,
			open: viteEnv.VITE_OPEN,
			// https: {
			// 	key: fs.readFileSync(resolve(__dirname, "./ssl/key.pem")),
			// 	cert: fs.readFileSync(resolve(__dirname, "./ssl/cert.pem"))
			// },
			// cors: true,
			// 跨域代理配置(http协议下暂用，解决跨域请求无法携带cookie问题)
			proxy: {
				"/api": {
					target: "http://localhost:3000",
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api/, "/api")
				}
			}
		},
		plugins: [
			vue(),
			createHtmlPlugin({
				inject: {
					data: {
						title: viteEnv.VITE_GLOB_APP_TITLE
					}
				}
			}),
			// * 使用 svg 图标
			createSvgIconsPlugin({
				iconDirs: [resolve(__dirname, "./src/assets/icons")],
				symbolId: "icon-[name]"
			}),
			// * EsLint 报错信息显示在浏览器界面上
			eslintPlugin(),
			// * vite 可以使用 jsx/tsx 语法
			vueJsx(),
			// * name 可以写在 script 标签上
			vueSetupExtend(),
			// * 是否生成包预览(分析依赖包大小,方便做优化处理)
			viteEnv.VITE_REPORT && visualizer(),
			// * gzip compress
			viteEnv.VITE_BUILD_GZIP &&
				viteCompression({
					verbose: true,
					disable: false,
					threshold: 10240,
					algorithm: "gzip",
					ext: ".gz"
				}),
			// * cdn 引入（vue按需引入会导致依赖vue的插件出现问题(列如:pinia/vuex)）
			importToCDN({
				modules: [
					// {
					// 	name: "vue",
					// 	var: "Vue",
					// 	path: "https://unpkg.com/vue@next"
					// },
					// 使用cdn引入element-plus时,开发环境还是需要在main.js中引入element-plus,可以不用引入css
					// {
					// 	name: "element-plus",
					// 	var: "ElementPlus",
					// 	path: "https://unpkg.com/element-plus",
					// 	css: "https://unpkg.com/element-plus/dist/index.css"
					// }
				]
			})
			// * demand import element
			// AutoImporimport { fs } from 'fs';

			// 	resolvers: [ElementPlusResolver()]
			// }),
			// Components({
			// 	resolvers: [ElementPlusResolver()]
			// }),
		],
		// * 打包去除 console.log && debugger
		esbuild: {
			pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
		},
		build: {
			outDir: "dist",
			minify: "esbuild",
			// esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
			// minify: "terser",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: viteEnv.VITE_DROP_CONSOLE,
			// 		drop_debugger: true
			// 	}
			// },
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					// Static resource classification and packaging
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
				}
			}
		}
	};
});
