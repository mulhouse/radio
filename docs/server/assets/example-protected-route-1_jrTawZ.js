import { t as useServerFn } from "./useServerFn-D_M3mnTc.js";
import "./appwrite-BpLq8AMe.js";
import { o as signOutFn } from "./auth-Dh9yZB3l.js";
import { jsxs } from "react/jsx-runtime";
import { useLoaderData, useRouter } from "@tanstack/react-router";
function useAuth() {
	const { currentUser } = useLoaderData({ from: "__root__" });
	const signOutServer = useServerFn(signOutFn);
	const router = useRouter();
	const signOut = async () => {
		await signOutServer();
		await router.invalidate();
	};
	return {
		currentUser,
		signOut
	};
}
function RouteComponent({}) {
	const { currentUser } = useAuth();
	return /* @__PURE__ */ jsxs("div", { children: ["Protected ", currentUser?.email] });
}
export { RouteComponent as component };

//# sourceMappingURL=example-protected-route-1_jrTawZ.js.map