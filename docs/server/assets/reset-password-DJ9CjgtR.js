import { t as useServerFn } from "./useServerFn-D_M3mnTc.js";
import "./appwrite-BpLq8AMe.js";
import { i as resetPasswordFn } from "./auth-Dh9yZB3l.js";
import "./utils-DY7wRfUn.js";
import { n as AuthForm, r as AuthCard, t as AuthField } from "./auth-field-DXCyhycw.js";
import { n as AlertDescription, t as Alert } from "./alert-BdYX3X60.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
var resetPasswordSchema = z.object({
	password: z.string().min(8, "Password must be at least 8 characters"),
	confirmPassword: z.string().min(8, "Password must be at least 8 characters")
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"]
});
function ResetPasswordPage() {
	const search = useSearch({ from: "/_auth/reset-password" });
	const navigate = useNavigate();
	const [isSuccess, setIsSuccess] = useState(false);
	const resetPassword = useServerFn(resetPasswordFn);
	const form = useForm({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: ""
		}
	});
	const resetPasswordMutation = useMutation({
		mutationFn: async (data) => {
			if (!search.userId || !search.secret) throw new Error("Invalid recovery link");
			await resetPassword({ data: {
				userId: search.userId,
				secret: search.secret,
				password: data.password,
				confirmPassword: data.confirmPassword
			} });
		},
		onSuccess: () => {
			setIsSuccess(true);
			form.reset();
			setTimeout(() => {
				navigate({ to: "/sign-in" });
			}, 3e3);
		},
		onError: (error) => {
			console.error("Reset password error:", error);
			form.setError("root", { message: error.message || "Failed to reset password" });
		}
	});
	if (!search.userId || !search.secret) return /* @__PURE__ */ jsxs(AuthCard, {
		title: "Invalid recovery link",
		description: "The password recovery link is invalid or has expired",
		children: [/* @__PURE__ */ jsxs(Alert, {
			className: "border-red-500 bg-red-50 dark:bg-red-950",
			children: [/* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 text-red-600 dark:text-red-400" }), /* @__PURE__ */ jsx(AlertDescription, {
				className: "text-red-800 dark:text-red-200",
				children: "This recovery link is invalid or has expired. Please request a new password recovery link."
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "text-center text-sm text-muted-foreground mt-4 space-x-1",
			children: /* @__PURE__ */ jsx("div", {
				className: "inline-block",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/forgot-password",
					className: "font-medium text-primary underline-offset-4 hover:underline",
					children: "Request new recovery link"
				})
			})
		})]
	});
	if (isSuccess) return /* @__PURE__ */ jsxs(AuthCard, {
		title: "Password reset successful",
		description: "Your password has been updated",
		children: [/* @__PURE__ */ jsxs(Alert, {
			className: "border-green-500 bg-green-50 dark:bg-green-950",
			children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-green-600 dark:text-green-400" }), /* @__PURE__ */ jsx(AlertDescription, {
				className: "text-green-800 dark:text-green-200",
				children: "Your password has been reset successfully. You'll be redirected to the sign in page shortly."
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "text-center text-sm text-muted-foreground mt-4 space-x-1",
			children: /* @__PURE__ */ jsx("div", {
				className: "inline-block",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/sign-in",
					className: "font-medium text-primary underline-offset-4 hover:underline",
					children: "Sign in now"
				})
			})
		})]
	});
	return /* @__PURE__ */ jsxs(AuthCard, {
		title: "Reset password",
		description: "Enter your new password below",
		children: [/* @__PURE__ */ jsx(AuthForm, {
			schema: resetPasswordSchema,
			defaultValues: {
				password: "",
				confirmPassword: ""
			},
			onSubmit: (data) => resetPasswordMutation.mutate(data),
			submitText: "Reset password",
			loadingText: "Resetting...",
			isLoading: resetPasswordMutation.isPending,
			form,
			children: (form$1) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(AuthField, {
				control: form$1.control,
				name: "password",
				label: "New Password",
				placeholder: "Enter your new password",
				type: "password"
			}), /* @__PURE__ */ jsx(AuthField, {
				control: form$1.control,
				name: "confirmPassword",
				label: "Confirm Password",
				placeholder: "Confirm your new password",
				type: "password"
			})] })
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
export { ResetPasswordPage as component };

//# sourceMappingURL=reset-password-DJ9CjgtR.js.map