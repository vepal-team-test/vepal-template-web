import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 引入等比适配插件
const px2rem = require('postcss-px2rem')

// 配置基本大小
const postcss = px2rem({
	// 基准大小 baseSize，需要和rem.js中相同
	remUnit: 16
})

const common = defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': resolve(__dirname, '/src')
		}
	},
	lintOnSave: true,
	css: {
		loaderOptions: {
			postcss: {
				plugins: [postcss]
			}
		}
	},
	// 强制预构建插件包
	optimizeDeps: {
		include: ['axios']
	},
	// 打包配置
	build: {
		target: 'modules',
		outDir: 'dist', //指定输出路径
		assetsDir: 'assets', // 指定生成静态资源的存放路径
		minify: 'terser' // 混淆器，terser构建后文件体积更小
	},
	// 本地运行配置，及反向代理配置
	server: {
		host: '0.0.0.0',
		port: 8085,
		cors: true, // 默认启用并允许任何源
		open: true, // 在服务器启动时自动在浏览器中打开应用程序
		//反向代理配置，注意rewrite写法，开始没看文档在这里踩了坑
		proxy: {
			'/api/elearning': {
				target: 'http://api.yunxuetang.cn/el/sso', // 测试
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api\/elearning/, '')
			},
			'/api/wxapi': {
				// target: "http://10.1.56.23:8093",
				target: 'https://api.weixin.qq.com',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api\/wxapi/, '')
			},
			'/api/lmc': {
				target: 'http://192.168.112.168:8100', // 测试
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api\/lmc/, '')
			},
			'/api/umc': {
				// target: 'http://10.1.54.77:8093', // 桂林
				// target: 'http://10.1.56.81:8093', // 立杰
				// target: 'http://10.1.56.80:8093', // 红姐
				target: 'http://192.168.112.210:8093', // 测试
				// target: 'http://10.1.52.96:8093', // 正式
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api\/umc/, '')
			},
			'/api/fmc': {
				target: '192.168.112.210:8087',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api\/fmc/, '')
			},
			'/api/vmc': {
				// target: 'http://10.1.54.52:9111', // 桂林
				// target: 'http://192.168.112.168:8087', // 正式
				target: 'http://192.168.112.210:9111',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api\/vmc/, '')
			},
			'/api/test': {
				target: 'http://10.1.56.67:8116',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api\/test/, '')
			},
			'/api/hrmc': {
				target: 'http://192.168.112.210:8116',
				// target: 'http://10.1.56.49:8116',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api\/hrmc/, '')
			},
			'/api/tvc': {
				// target: 'http://192.168.112.168:8092',
				// target: 'http://192.168.112.210:8092', // 测试
				target: 'http://192.168.112.210:8113', // 电视系统
				// target: 'http://10.8.0.3:8113', // 电视系统
				// target: 'http://10.1.54.141:8092',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api\/tvc/, '')
			},
			'/api/rvc': {
				// target: 'http://192.168.112.210:9111',
				target: 'http://192.168.112.210:8114', // 测试
				// target: 'http://10.1.54.141:8092',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api\/rvc/, '')
			},
			'/api/nmc': {
				// target: 'http://10.1.56.65:8123',
				target: 'http://192.168.112.210:8123', // 测试
				// target: 'http://10.1.54.141:8118',
				changeOrigin: true,

				rewrite: path => path.replace(/^\/api\/nmc/, '')
			},
			// '/api/memc': {
			//   target: 'http://10.1.56.88:8124',
			//   // target: 'http://192.168.112.210:8124', // 测试
			//   // target: 'http://10.1.54.141:8118',
			//   changeOrigin: true,
			//   // ws: true,

			//  rewrite: path => path.replace(/^\/api\/memc/, '')

			'/api/nec': {
				target: 'http://192.168.112.210:9138/', //代理接口
				changeOrigin: true
			},
			'/api/pdc': {
				target: 'http://www.visionvepal.com:9089/', //代理接口
				changeOrigin: true
			},
			'/api': {
				// target: 'http://www.visionvepal.com:8092',
				target: 'http://192.168.112.210:8092', // 测试
				// target: 'http://10.1.54.141:8092',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '')
			}
		}
	}
})

export default ({ command, mode }) => {
	if (command === 'serve') {
		return {
			...common
			// serve 独有配置
		}
	} else {
		return {
			...common
			// build 独有配置
		}
	}
}
