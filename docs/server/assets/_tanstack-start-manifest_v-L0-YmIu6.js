const tsrStartManifest = () => ({
	"routes": {
		"__root__": {
			"filePath": "/Users/david/Downloads/wr/src/routes/__root.tsx",
			"children": [
				"/_auth",
				"/_protected",
				"/_public",
				"/_api/hello"
			],
			"preloads": ["/assets/main-nBXvAf8O.js"],
			"assets": []
		},
		"/_auth": {
			"filePath": "/Users/david/Downloads/wr/src/routes/_auth.tsx",
			"children": [
				"/_auth/forgot-password",
				"/_auth/reset-password",
				"/_auth/sign-in",
				"/_auth/sign-out",
				"/_auth/sign-up"
			]
		},
		"/_protected": {
			"filePath": "/Users/david/Downloads/wr/src/routes/_protected.tsx",
			"children": ["/_protected/example-protected-route"]
		},
		"/_public": {
			"filePath": "/Users/david/Downloads/wr/src/routes/_public.tsx",
			"children": ["/_public/"]
		},
		"/_api/hello": { "filePath": "/Users/david/Downloads/wr/src/routes/_api/hello.tsx" },
		"/_auth/forgot-password": {
			"filePath": "/Users/david/Downloads/wr/src/routes/_auth/forgot-password.tsx",
			"parent": "/_auth",
			"assets": [],
			"preloads": [
				"/assets/forgot-password-BTcmWxww.js",
				"/assets/zod-CHCjAJAU.js",
				"/assets/loader-circle-ay3JJMrH.js",
				"/assets/useServerFn-DsTzOVMO.js",
				"/assets/alert-C9E30bFM.js"
			]
		},
		"/_auth/reset-password": {
			"filePath": "/Users/david/Downloads/wr/src/routes/_auth/reset-password.tsx",
			"parent": "/_auth",
			"assets": [],
			"preloads": [
				"/assets/reset-password-DfLKSAfR.js",
				"/assets/zod-CHCjAJAU.js",
				"/assets/loader-circle-ay3JJMrH.js",
				"/assets/useServerFn-DsTzOVMO.js",
				"/assets/circle-alert-DFvHrm34.js",
				"/assets/alert-C9E30bFM.js"
			]
		},
		"/_auth/sign-in": {
			"filePath": "/Users/david/Downloads/wr/src/routes/_auth/sign-in.tsx",
			"parent": "/_auth",
			"assets": [],
			"preloads": [
				"/assets/sign-in-qCZU1taP.js",
				"/assets/zod-CHCjAJAU.js",
				"/assets/loader-circle-ay3JJMrH.js",
				"/assets/useServerFn-DsTzOVMO.js"
			]
		},
		"/_auth/sign-out": {
			"filePath": "/Users/david/Downloads/wr/src/routes/_auth/sign-out.tsx",
			"parent": "/_auth"
		},
		"/_auth/sign-up": {
			"filePath": "/Users/david/Downloads/wr/src/routes/_auth/sign-up.tsx",
			"parent": "/_auth",
			"assets": [],
			"preloads": [
				"/assets/sign-up-D7R0OnaA.js",
				"/assets/zod-CHCjAJAU.js",
				"/assets/loader-circle-ay3JJMrH.js",
				"/assets/useServerFn-DsTzOVMO.js"
			]
		},
		"/_protected/example-protected-route": {
			"filePath": "/Users/david/Downloads/wr/src/routes/_protected/example-protected-route.tsx",
			"parent": "/_protected",
			"assets": [],
			"preloads": ["/assets/example-protected-route-DWQ7_mNv.js", "/assets/useServerFn-DsTzOVMO.js"]
		},
		"/_public/": {
			"filePath": "/Users/david/Downloads/wr/src/routes/_public/index.tsx",
			"parent": "/_public",
			"assets": [],
			"preloads": [
				"/assets/_public-CZylU2LY.js",
				"/assets/loader-circle-ay3JJMrH.js",
				"/assets/circle-alert-DFvHrm34.js"
			]
		}
	},
	"clientEntry": "/assets/main-nBXvAf8O.js"
});
export { tsrStartManifest };
