import { a as setCookie, i as getRequestHeader, n as deleteCookie, o as setResponseStatus, r as getCookie, s as createServerFn, t as createServerRpc } from "../server.js";
import { n as createSessionClient, t as createAdminClient } from "./appwrite-BpLq8AMe.js";
import { redirect } from "@tanstack/react-router";
import z$1 from "zod";
import { ID } from "node-appwrite";
var getAppwriteSessionFn_createServerFn_handler = createServerRpc("src_server_functions_auth_ts--getAppwriteSessionFn_createServerFn_handler", (opts, signal) => {
	return getAppwriteSessionFn.__executeServer(opts, signal);
});
var setAppwriteSessionCookiesSchema = z$1.object({
	id: z$1.string(),
	secret: z$1.string(),
	expires: z$1.string().optional()
});
var setAppwriteSessionCookiesFn_createServerFn_handler = createServerRpc("src_server_functions_auth_ts--setAppwriteSessionCookiesFn_createServerFn_handler", (opts, signal) => {
	return setAppwriteSessionCookiesFn.__executeServer(opts, signal);
});
var signUpInSchema = z$1.object({
	email: z$1.email("Please enter a valid email address"),
	password: z$1.string().min(8, "Password must be at least 8 characters"),
	redirect: z$1.string().optional()
});
var signUpFn_createServerFn_handler = createServerRpc("src_server_functions_auth_ts--signUpFn_createServerFn_handler", (opts, signal) => {
	return signUpFn.__executeServer(opts, signal);
});
var signInFn_createServerFn_handler = createServerRpc("src_server_functions_auth_ts--signInFn_createServerFn_handler", (opts, signal) => {
	return signInFn.__executeServer(opts, signal);
});
var signOutFn_createServerFn_handler = createServerRpc("src_server_functions_auth_ts--signOutFn_createServerFn_handler", (opts, signal) => {
	return signOutFn.__executeServer(opts, signal);
});
var authMiddleware_createServerFn_handler = createServerRpc("src_server_functions_auth_ts--authMiddleware_createServerFn_handler", (opts, signal) => {
	return authMiddleware.__executeServer(opts, signal);
});
var clearAuthCookies = () => {
	deleteCookie(`appwrite-session-secret`);
	deleteCookie(`appwrite-session-id`);
	deleteCookie(`a_session_${process.env.APPWRITE_PROJECT_ID}`);
};
var getCurrentUser_createServerFn_handler = createServerRpc("src_server_functions_auth_ts--getCurrentUser_createServerFn_handler", (opts, signal) => {
	return getCurrentUser.__executeServer(opts, signal);
});
var forgotPasswordSchema = z$1.object({ email: z$1.string().email("Please enter a valid email address") });
var forgotPasswordFn_createServerFn_handler = createServerRpc("src_server_functions_auth_ts--forgotPasswordFn_createServerFn_handler", (opts, signal) => {
	return forgotPasswordFn.__executeServer(opts, signal);
});
var resetPasswordSchema = z$1.object({
	userId: z$1.string().min(1, "User ID is required"),
	secret: z$1.string().min(1, "Secret is required"),
	password: z$1.string().min(8, "Password must be at least 8 characters"),
	confirmPassword: z$1.string().min(8, "Password must be at least 8 characters")
});
var resetPasswordFn_createServerFn_handler = createServerRpc("src_server_functions_auth_ts--resetPasswordFn_createServerFn_handler", (opts, signal) => {
	return resetPasswordFn.__executeServer(opts, signal);
});
var getAppwriteSessionFn = createServerFn({ method: "GET" }).handler(getAppwriteSessionFn_createServerFn_handler, async () => {
	const session = getCookie(`appwrite-session-secret`);
	if (!session) return null;
	return session;
});
var setAppwriteSessionCookiesFn = createServerFn({ method: "POST" }).inputValidator(setAppwriteSessionCookiesSchema).handler(setAppwriteSessionCookiesFn_createServerFn_handler, async ({ data }) => {
	const { id, secret, expires } = data;
	let maxAge = 720 * 60 * 60;
	if (expires) {
		const expireTime = Math.floor(new Date(expires).getTime() / 1e3);
		const now = Math.floor(Date.now() / 1e3);
		maxAge = Math.max(0, expireTime - now);
	}
	setCookie(`appwrite-session-secret`, secret, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge,
		path: "/"
	});
	setCookie(`appwrite-session-id`, id, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge,
		path: "/"
	});
});
var signUpFn = createServerFn({ method: "POST" }).inputValidator(signUpInSchema).handler(signUpFn_createServerFn_handler, async ({ data }) => {
	const { email, password, redirect: redirectUrl } = data;
	const { account } = createAdminClient();
	try {
		await account.create({
			userId: ID.unique(),
			email,
			password
		});
		const session = await account.createEmailPasswordSession({
			email,
			password
		});
		await setAppwriteSessionCookiesFn({ data: {
			id: session.$id,
			secret: session.secret,
			expires: session.expire || void 0
		} });
	} catch (_error) {
		const error = _error;
		setResponseStatus(error.code);
		throw {
			message: error.message,
			status: error.code
		};
	}
	if (redirectUrl) throw redirect({ to: redirectUrl });
	else throw redirect({ to: "/" });
});
var signInFn = createServerFn({ method: "POST" }).inputValidator(signUpInSchema).handler(signInFn_createServerFn_handler, async ({ data }) => {
	const { email, password, redirect: redirectUrl } = data;
	try {
		const { account } = createAdminClient();
		const session = await account.createEmailPasswordSession({
			email,
			password
		});
		await setAppwriteSessionCookiesFn({ data: {
			id: session.$id,
			secret: session.secret,
			expires: session.expire || void 0
		} });
	} catch (_error) {
		const error = _error;
		setResponseStatus(error.code);
		throw {
			message: error.message,
			status: error.code
		};
	}
	if (redirectUrl) throw redirect({ to: redirectUrl });
	else throw redirect({ to: "/" });
});
var signOutFn = createServerFn({ method: "GET" }).handler(signOutFn_createServerFn_handler, async () => {
	try {
		const session = await getAppwriteSessionFn();
		if (session) await (await createSessionClient(session)).account.deleteSession({ sessionId: "current" });
	} catch (error) {
		console.error("Error deleting session:", error);
	} finally {
		clearAuthCookies();
	}
});
var authMiddleware = createServerFn({ method: "GET" }).handler(authMiddleware_createServerFn_handler, async () => {
	return { currentUser: await getCurrentUser() };
});
var getCurrentUser = createServerFn({ method: "GET" }).handler(getCurrentUser_createServerFn_handler, async () => {
	const session = await getAppwriteSessionFn();
	if (!session) return null;
	try {
		return await (await createSessionClient(session)).account.get();
	} catch (_error) {
		if (_error.code === 401) clearAuthCookies();
		return null;
	}
});
var forgotPasswordFn = createServerFn({ method: "POST" }).inputValidator(forgotPasswordSchema).handler(forgotPasswordFn_createServerFn_handler, async ({ data }) => {
	const { email } = data;
	const { account } = createAdminClient();
	try {
		const origin = getRequestHeader("origin");
		if (!origin) throw new Error("Missing origin header");
		const resetUrl = `${origin}/reset-password`;
		await account.createRecovery({
			email,
			url: resetUrl
		});
		return {
			success: true,
			message: "Password recovery email sent successfully"
		};
	} catch (_error) {
		const error = _error;
		setResponseStatus(error.code);
		throw {
			message: error.message,
			status: error.code
		};
	}
});
var resetPasswordFn = createServerFn({ method: "POST" }).inputValidator(resetPasswordSchema).handler(resetPasswordFn_createServerFn_handler, async ({ data }) => {
	const { userId, secret, password, confirmPassword } = data;
	if (password !== confirmPassword) {
		setResponseStatus(400);
		throw {
			message: "Passwords do not match",
			status: 400
		};
	}
	try {
		const { account } = createAdminClient();
		await account.updateRecovery({
			userId,
			secret,
			password
		});
		return {
			success: true,
			message: "Password reset successfully"
		};
	} catch (_error) {
		const error = _error;
		setResponseStatus(error.code);
		throw {
			message: error.message,
			status: error.code
		};
	}
});
export { authMiddleware_createServerFn_handler, forgotPasswordFn_createServerFn_handler, getAppwriteSessionFn_createServerFn_handler, getCurrentUser_createServerFn_handler, resetPasswordFn_createServerFn_handler, setAppwriteSessionCookiesFn_createServerFn_handler, signInFn_createServerFn_handler, signOutFn_createServerFn_handler, signUpFn_createServerFn_handler };

//# sourceMappingURL=auth-BJGJPVAh.js.map