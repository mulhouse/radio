import { isRedirect, useRouter } from "@tanstack/react-router";
import * as React from "react";
function useServerFn(serverFn) {
	const router = useRouter();
	return React.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.state.location;
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
export { useServerFn as t };

//# sourceMappingURL=useServerFn-D_M3mnTc.js.map