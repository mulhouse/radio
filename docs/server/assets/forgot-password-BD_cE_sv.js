import { t as useServerFn } from "./useServerFn-D_M3mnTc.js";
import "./appwrite-BpLq8AMe.js";
import { n as forgotPasswordFn } from "./auth-Dh9yZB3l.js";
import "./utils-DY7wRfUn.js";
import { n as AuthForm, r as AuthCard, t as AuthField } from "./auth-field-DXCyhycw.js";
import { n as AlertDescription, t as Alert } from "./alert-BdYX3X60.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
var forgotPasswordSchema = z.object({ email: z.string().email("Please enter a valid email address") });
function ForgotPasswordPage() {
	const [isSuccess, setIsSuccess] = useState(false);
	const forgotPassword = useServerFn(forgotPasswordFn);
	const form = useForm({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: "" }
	});
	const forgotPasswordMutation = useMutation({
		mutationFn: async (data) => {
			await forgotPassword({ data });
		},
		onSuccess: () => {
			setIsSuccess(true);
			form.reset();
		},
		onError: (error) => {
			console.error("Forgot password error:", error);
			form.setError("root", { message: error.message || "Failed to send recovery email" });
		}
	});
	if (isSuccess) return /* @__PURE__ */ jsxs(AuthCard, {
		title: "Check your email",
		description: "We've sent you a password recovery link",
		children: [/* @__PURE__ */ jsxs(Alert, {
			className: "border-green-500 bg-green-50 dark:bg-green-950",
			children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-green-600 dark:text-green-400" }), /* @__PURE__ */ jsx(AlertDescription, {
				className: "text-green-800 dark:text-green-200",
				children: "If an account exists with that email, you'll receive a password recovery link shortly. Please check your inbox and spam folder."
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "text-center text-sm text-muted-foreground mt-4 space-x-1",
			children: [/* @__PURE__ */ jsx("div", {
				className: "inline-block",
				children: "Remember your password? "
			}), /* @__PURE__ */ jsx("div", {
				className: "inline-block",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/sign-in",
					className: "font-medium text-primary underline-offset-4 hover:underline",
					children: "Sign in"
				})
			})]
		})]
	});
	return /* @__PURE__ */ jsxs(AuthCard, {
		title: "Forgot password",
		description: "Enter your email address and we'll send you a recovery link",
		children: [/* @__PURE__ */ jsx(AuthForm, {
			schema: forgotPasswordSchema,
			defaultValues: { email: "" },
			onSubmit: (data) => forgotPasswordMutation.mutate(data),
			submitText: "Send recovery link",
			loadingText: "Sending...",
			isLoading: forgotPasswordMutation.isPending,
			form,
			children: (form$1) => /* @__PURE__ */ jsx(AuthField, {
				control: form$1.control,
				name: "email",
				label: "Email",
				placeholder: "john@doe.com",
				type: "email"
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "text-center text-sm text-muted-foreground mt-4 space-x-1",
			children: [/* @__PURE__ */ jsx("div", {
				className: "inline-block",
				children: "Remember your password? "
			}), /* @__PURE__ */ jsx("div", {
				className: "inline-block",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/sign-in",
					className: "font-medium text-primary underline-offset-4 hover:underline",
					children: "Sign in"
				})
			})]
		})]
	});
}
export { ForgotPasswordPage as component };

//# sourceMappingURL=forgot-password-BD_cE_sv.js.map