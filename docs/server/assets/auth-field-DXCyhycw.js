import { t as cn } from "./utils-DY7wRfUn.js";
import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Controller, FormProvider, useFormContext, useFormState } from "react-hook-form";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
function Card({ className,...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card",
		className: cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
		...props
	});
}
function CardHeader({ className,...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-header",
		className: cn("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
		...props
	});
}
function CardTitle({ className,...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-title",
		className: cn("leading-none font-semibold", className),
		...props
	});
}
function CardDescription({ className,...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-description",
		className: cn("text-muted-foreground text-sm", className),
		...props
	});
}
function CardContent({ className,...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-content",
		className: cn("px-6", className),
		...props
	});
}
function AuthCard({ title, description, children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "h-screen w-screen flex items-center justify-center bg-background p-6",
		children: /* @__PURE__ */ jsxs(Card, {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ jsxs(CardHeader, {
				className: "text-center",
				children: [/* @__PURE__ */ jsx(CardTitle, {
					className: "text-lg md:text-2xl",
					children: title
				}), /* @__PURE__ */ jsx(CardDescription, {
					className: "text-sm md:text-base",
					children: description
				})]
			}), /* @__PURE__ */ jsx(CardContent, { children })]
		})
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
			outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2 has-[>svg]:px-3",
			sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
			lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
			icon: "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false,...props }) {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Label({ className,...props }) {
	return /* @__PURE__ */ jsx(LabelPrimitive.Root, {
		"data-slot": "label",
		className: cn("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
		...props
	});
}
var Form = FormProvider;
var FormFieldContext = React.createContext({});
var FormField = ({ ...props }) => {
	return /* @__PURE__ */ jsx(FormFieldContext.Provider, {
		value: { name: props.name },
		children: /* @__PURE__ */ jsx(Controller, { ...props })
	});
};
var useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);
	const { getFieldState } = useFormContext();
	const formState = useFormState({ name: fieldContext.name });
	const fieldState = getFieldState(fieldContext.name, formState);
	if (!fieldContext) throw new Error("useFormField should be used within <FormField>");
	const { id } = itemContext;
	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState
	};
};
var FormItemContext = React.createContext({});
function FormItem({ className,...props }) {
	const id = React.useId();
	return /* @__PURE__ */ jsx(FormItemContext.Provider, {
		value: { id },
		children: /* @__PURE__ */ jsx("div", {
			"data-slot": "form-item",
			className: cn("grid gap-2", className),
			...props
		})
	});
}
function FormLabel({ className,...props }) {
	const { error, formItemId } = useFormField();
	return /* @__PURE__ */ jsx(Label, {
		"data-slot": "form-label",
		"data-error": !!error,
		className: cn("data-[error=true]:text-destructive", className),
		htmlFor: formItemId,
		...props
	});
}
function FormControl({ ...props }) {
	const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
	return /* @__PURE__ */ jsx(Slot, {
		"data-slot": "form-control",
		id: formItemId,
		"aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
		"aria-invalid": !!error,
		...props
	});
}
function FormMessage({ className,...props }) {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error?.message ?? "") : props.children;
	if (!body) return null;
	return /* @__PURE__ */ jsx("p", {
		"data-slot": "form-message",
		id: formMessageId,
		className: cn("text-destructive text-sm", className),
		...props,
		children: body
	});
}
function AuthForm({ onSubmit, children, submitText, loadingText, isLoading = false, className = "space-y-4", form }) {
	const handleSubmit = (data) => {
		onSubmit(data, form);
	};
	return /* @__PURE__ */ jsx(Form, {
		...form,
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: form.handleSubmit(handleSubmit),
			className,
			children: [
				children(form),
				form.formState.errors.root && /* @__PURE__ */ jsx("div", {
					className: "text-sm font-medium text-destructive",
					children: form.formState.errors.root.message
				}),
				/* @__PURE__ */ jsx(Button, {
					type: "submit",
					size: "sm",
					className: "w-full",
					disabled: isLoading,
					children: isLoading ? /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }), loadingText]
					}) : submitText
				})
			]
		})
	});
}
function Input({ className, type,...props }) {
	return /* @__PURE__ */ jsx("input", {
		type,
		"data-slot": "input",
		className: cn("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
		...props
	});
}
function AuthField({ control, name, label, placeholder, type = "text" }) {
	return /* @__PURE__ */ jsx(FormField, {
		control,
		name,
		render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
			/* @__PURE__ */ jsx(FormLabel, {
				className: "text-sm md:text-base",
				children: label
			}),
			/* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, {
				className: "text-sm md:text-base h-8 md:h-9",
				type,
				placeholder,
				...field
			}) }),
			/* @__PURE__ */ jsx(FormMessage, { className: "text-xs md:text-sm" })
		] })
	});
}
export { AuthForm as n, AuthCard as r, AuthField as t };

//# sourceMappingURL=auth-field-DXCyhycw.js.map