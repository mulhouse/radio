import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
var $$splitComponentImporter = () => import("./sign-up-BbD4IO-5.js");
var searchSchema = z.object({ redirect: z.string().optional() });
const Route = createFileRoute("/_auth/sign-up")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	validateSearch: searchSchema
});
export { Route as t };

//# sourceMappingURL=sign-up-RDk4p_7C.js.map