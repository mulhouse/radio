import "./appwrite-BpLq8AMe.js";
import { o as signOutFn, r as getCurrentUser, t as authMiddleware } from "./auth-Dh9yZB3l.js";
import { t as Route$6 } from "./sign-up-RDk4p_7C.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { HeadContent, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useLocation } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { useEffect, useRef } from "react";
import { z } from "zod";
function getContext() {
	return { queryClient: new QueryClient() };
}
function Provider({ children, queryClient }) {
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children
	});
}
var styles_default = "/assets/styles-BQO3Lfxl.css";
var Toaster$1 = ({ ...props }) => {
	const { theme = "system" } = useTheme();
	return /* @__PURE__ */ jsx(Toaster, {
		theme,
		className: "toaster group",
		style: {
			"--normal-bg": "var(--popover)",
			"--normal-text": "var(--popover-foreground)",
			"--normal-border": "var(--border)"
		},
		...props
	});
};
var scripts = [];
const Route = createRootRouteWithContext()({
	loader: async () => {
		const { currentUser } = await authMiddleware();
		return { currentUser };
	},
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Web Radio Streaming PWA" },
			{
				name: "description",
				content: "A Progressive Web App for streaming favorite radio stations with quick access, real-time metadata, offline support, and seamless playback control."
			},
			{
				name: "theme-color",
				content: "#0a0e27"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Bebas+Neue&display=swap"
			},
			{
				rel: "manifest",
				href: "/manifest.json"
			}
		],
		scripts: [...scripts]
	}),
	shellComponent: RootDocument
});
function RootDocument({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [/* @__PURE__ */ jsxs(ThemeProvider, {
			attribute: "class",
			defaultTheme: "dark",
			enableSystem: true,
			disableTransitionOnChange: true,
			children: [children, /* @__PURE__ */ jsx(Toaster$1, {})]
		}), /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
const Route$1 = createFileRoute("/_public")({ loader: async () => {
	const { currentUser } = await authMiddleware();
	return { currentUser };
} });
const Route$2 = createFileRoute("/_protected")({ loader: async ({ location }) => {
	const { currentUser } = await authMiddleware();
	if (!currentUser) {
		if (location.pathname !== "/sign-in" && location.pathname !== "/sign-up") throw redirect({
			to: "/sign-in",
			search: { redirect: location.href }
		});
	}
	return { currentUser };
} });
const Route$3 = createFileRoute("/_auth")({ loader: async ({ location }) => {
	const currentUser = await getCurrentUser();
	if (currentUser && location.pathname !== "/sign-out") throw redirect({ to: "/" });
	return { currentUser };
} });
var $$splitComponentImporter$4 = () => import("./_public-KQCLTocC.js");
const Route$4 = createFileRoute("/_public/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./example-protected-route-1_jrTawZ.js");
const Route$5 = createFileRoute("/_protected/example-protected-route")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
const Route$7 = createFileRoute("/_auth/sign-out")({ loader: async () => {
	await signOutFn();
	throw redirect({ to: "/" });
} });
var $$splitComponentImporter$2 = () => import("./sign-in-CqGtS4Kf.js");
var searchSchema$1 = z.object({ redirect: z.string().optional() });
const Route$8 = createFileRoute("/_auth/sign-in")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	validateSearch: searchSchema$1
});
var $$splitComponentImporter$1 = () => import("./reset-password-DJ9CjgtR.js");
var searchSchema = z.object({
	userId: z.string().optional(),
	secret: z.string().optional()
});
const Route$9 = createFileRoute("/_auth/reset-password")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	validateSearch: searchSchema
});
var $$splitComponentImporter = () => import("./forgot-password-BD_cE_sv.js");
const Route$10 = createFileRoute("/_auth/forgot-password")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
const Route$11 = createFileRoute("/_api/hello")({ server: { handlers: { GET: async ({ request }) => {
	return new Response("Hello, World! from " + request.url);
} } } });
var PublicRoute = Route$1.update({
	id: "/_public",
	getParentRoute: () => Route
});
var ProtectedRoute = Route$2.update({
	id: "/_protected",
	getParentRoute: () => Route
});
var AuthRoute = Route$3.update({
	id: "/_auth",
	getParentRoute: () => Route
});
var PublicIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => PublicRoute
});
var ProtectedExampleProtectedRouteRoute = Route$5.update({
	id: "/example-protected-route",
	path: "/example-protected-route",
	getParentRoute: () => ProtectedRoute
});
var AuthSignUpRoute = Route$6.update({
	id: "/sign-up",
	path: "/sign-up",
	getParentRoute: () => AuthRoute
});
var AuthSignOutRoute = Route$7.update({
	id: "/sign-out",
	path: "/sign-out",
	getParentRoute: () => AuthRoute
});
var AuthSignInRoute = Route$8.update({
	id: "/sign-in",
	path: "/sign-in",
	getParentRoute: () => AuthRoute
});
var AuthResetPasswordRoute = Route$9.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => AuthRoute
});
var AuthForgotPasswordRoute = Route$10.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => AuthRoute
});
var ApiHelloRoute = Route$11.update({
	id: "/_api/hello",
	path: "/hello",
	getParentRoute: () => Route
});
var AuthRouteChildren = {
	AuthForgotPasswordRoute,
	AuthResetPasswordRoute,
	AuthSignInRoute,
	AuthSignOutRoute,
	AuthSignUpRoute
};
var AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren);
var ProtectedRouteChildren = { ProtectedExampleProtectedRouteRoute };
var ProtectedRouteWithChildren = ProtectedRoute._addFileChildren(ProtectedRouteChildren);
var PublicRouteChildren = { PublicIndexRoute };
var rootRouteChildren = {
	AuthRoute: AuthRouteWithChildren,
	ProtectedRoute: ProtectedRouteWithChildren,
	PublicRoute: PublicRoute._addFileChildren(PublicRouteChildren),
	ApiHelloRoute
};
const routeTree = Route._addFileChildren(rootRouteChildren)._addFileTypes();
function ErrorComponent({ error, info }) {
	const randomErrorId = useRef(Math.random().toString(36).substring(2, 15));
	const { theme } = useTheme();
	const location = useLocation();
	const message = {
		type: "NOTIFY_ERROR",
		data: {
			errorId: randomErrorId.current,
			href: location.href,
			errorMessage: error.message,
			errorStack: error.stack,
			errorCause: error.cause,
			errorComponentStack: info?.componentStack
		}
	};
	useEffect(() => {
		const interval = setInterval(() => {
			window.parent.postMessage(message);
		}, 2e3);
		return () => clearInterval(interval);
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex-grow flex flex-col justify-center items-center gap-6 text-center my-20",
		children: [
			/* @__PURE__ */ jsx("img", {
				src: theme === "dark" ? "/imagine-logo-dark.svg" : "/imagine-logo-light.svg",
				alt: "Imagine Logo",
				className: "size-14"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-medium",
				children: "Oops! Something went wrong."
			}),
			/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("pre", {
				className: "text-xs border border-red-500 p-2 text-red-500 overflow-auto rounded-md",
				children: error.message ? /* @__PURE__ */ jsx("code", { children: error.message }) : null
			}) })
		]
	});
}
const getRouter = () => {
	const rqContext = getContext();
	const router = createRouter({
		routeTree,
		context: { ...rqContext },
		defaultPreload: "intent",
		defaultErrorComponent: ({ error, info, reset }) => /* @__PURE__ */ jsx(ErrorComponent, {
			error,
			info,
			reset
		}),
		Wrap: (props) => {
			return /* @__PURE__ */ jsx(Provider, {
				...rqContext,
				children: props.children
			});
		}
	});
	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient
	});
	return router;
};
export { getRouter };

//# sourceMappingURL=router-CDqb61S0.js.map