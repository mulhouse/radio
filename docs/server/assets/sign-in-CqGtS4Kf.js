import { t as useServerFn } from "./useServerFn-D_M3mnTc.js";
import "./appwrite-BpLq8AMe.js";
import { a as signInFn } from "./auth-Dh9yZB3l.js";
import "./utils-DY7wRfUn.js";
import { n as AuthForm, r as AuthCard, t as AuthField } from "./auth-field-DXCyhycw.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Link, useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
var signInSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required")
});
function SignInPage() {
	const search = useSearch({ from: "/_auth/sign-in" });
	const navigate = useNavigate();
	const router = useRouter();
	const signIn = useServerFn(signInFn);
	const form = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});
	const signInMutation = useMutation({
		mutationFn: async (data) => {
			await signIn({ data: {
				...data,
				redirect: search.redirect
			} });
		},
		onSuccess: async () => {
			await router.invalidate();
			if (search.redirect) await navigate({ to: search.redirect });
		},
		onError: async (error) => {
			if (error?.status === 302 || error?.redirect || error?.message?.includes("redirect")) {
				await router.invalidate();
				if (search.redirect) await navigate({ to: search.redirect });
				return;
			}
			console.error("Sign in error:", error);
			form.setError("root", { message: error.message || "Failed to sign in" });
		}
	});
	return /* @__PURE__ */ jsxs(AuthCard, {
		title: "Sign in",
		description: "Enter your email and password to access your account",
		children: [/* @__PURE__ */ jsx(AuthForm, {
			schema: signInSchema,
			defaultValues: {
				email: "",
				password: ""
			},
			onSubmit: (data) => signInMutation.mutate(data),
			submitText: "Sign in",
			loadingText: "Signing in...",
			isLoading: signInMutation.isPending,
			form,
			children: (form$1) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(AuthField, {
				control: form$1.control,
				name: "email",
				label: "Email",
				placeholder: "john@doe.com",
				type: "email"
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ jsx(AuthField, {
					control: form$1.control,
					name: "password",
					label: "Password",
					placeholder: "Enter your password",
					type: "password"
				}), /* @__PURE__ */ jsx("div", {
					className: "text-right",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/forgot-password",
						className: "text-xs md:text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline",
						children: "Forgot password?"
					})
				})]
			})] })
		}), /* @__PURE__ */ jsxs("div", {
			className: "text-center text-sm text-muted-foreground mt-4 space-x-1",
			children: [/* @__PURE__ */ jsx("div", {
				className: "inline-block",
				children: "Don't have an account? "
			}), /* @__PURE__ */ jsx("div", {
				className: "inline-block",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/sign-up",
					search: search.redirect ? { redirect: search.redirect } : void 0,
					className: "font-medium text-primary underline-offset-4 hover:underline",
					children: "Sign up"
				})
			})]
		})]
	});
}
export { SignInPage as component };

//# sourceMappingURL=sign-in-CqGtS4Kf.js.map