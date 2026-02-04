import { t as useServerFn } from "./useServerFn-D_M3mnTc.js";
import "./appwrite-BpLq8AMe.js";
import { s as signUpFn } from "./auth-Dh9yZB3l.js";
import { t as Route } from "./sign-up-RDk4p_7C.js";
import "./utils-DY7wRfUn.js";
import { n as AuthForm, r as AuthCard, t as AuthField } from "./auth-field-DXCyhycw.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Link, useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
var signUpSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters")
});
function SignUpPage() {
	const search = useSearch({ from: Route.id });
	const navigate = useNavigate();
	const router = useRouter();
	const signUp = useServerFn(signUpFn);
	const form = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});
	const signUpMutation = useMutation({
		mutationFn: async (data) => {
			await signUp({ data: {
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
			console.error("Sign up error:", error);
			form.setError("root", { message: error.message || "Failed to sign up" });
		}
	});
	return /* @__PURE__ */ jsxs(AuthCard, {
		title: "Sign up",
		description: "Enter your details to create a new account",
		children: [/* @__PURE__ */ jsx(AuthForm, {
			schema: signUpSchema,
			defaultValues: {
				email: "",
				password: ""
			},
			onSubmit: (data) => signUpMutation.mutate(data),
			submitText: "Sign up",
			loadingText: "Signing up...",
			isLoading: signUpMutation.isPending,
			form,
			children: (form$1) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(AuthField, {
				control: form$1.control,
				name: "email",
				label: "Email",
				placeholder: "john@doe.com",
				type: "email"
			}), /* @__PURE__ */ jsx(AuthField, {
				control: form$1.control,
				name: "password",
				label: "Password",
				placeholder: "Enter your password",
				type: "password"
			})] })
		}), /* @__PURE__ */ jsxs("div", {
			className: "text-center text-sm text-muted-foreground mt-4 space-x-1",
			children: [/* @__PURE__ */ jsx("div", {
				className: "inline-block",
				children: "Already have an account? "
			}), /* @__PURE__ */ jsx("div", {
				className: "inline-block",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/sign-in",
					search: search.redirect ? { redirect: search.redirect } : void 0,
					className: "font-medium text-primary underline-offset-4 hover:underline",
					children: "Sign in"
				})
			})]
		})]
	});
}
export { SignUpPage as component };

//# sourceMappingURL=sign-up-BbD4IO-5.js.map