import { jsx } from "react/jsx-runtime";
import { RouterProvider } from "@tanstack/react-router";
import { defineHandlerCallback, renderRouterToStream } from "@tanstack/react-router/ssr/server";
import { createMemoryHistory } from "@tanstack/history";
import { json, mergeHeaders, mergeHeaders as mergeHeaders$1 } from "@tanstack/router-core/ssr/client";
import { createSerializationAdapter, defaultSerovalPlugins, executeRewriteInput, isNotFound, isRedirect as isRedirect$1, isResolvedRedirect, joinPaths, makeSerovalPlugin, rootRouteId, trimPath } from "@tanstack/router-core";
import { AsyncLocalStorage } from "node:async_hooks";
import { attachRouterServerSsrUtils, getOrigin } from "@tanstack/router-core/ssr/server";
import { H3Event, deleteCookie, parseCookies, sanitizeStatusCode, sanitizeStatusMessage, setCookie, toResponse } from "h3-v2";
import invariant from "tiny-invariant";
import { fromJSON, toCrossJSONAsync, toCrossJSONStream } from "seroval";
function StartServer(props) {
	return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
	request,
	router,
	responseHeaders,
	children: /* @__PURE__ */ jsx(StartServer, { router })
}));
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = Symbol.for("TSS_SERVER_FUNCTION");
var TSS_SERVER_FUNCTION_FACTORY = Symbol.for("TSS_SERVER_FUNCTION_FACTORY");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
var startStorage = new AsyncLocalStorage();
async function runWithStartContext(context, fn) {
	return startStorage.run(context, fn);
}
function getStartContext(opts) {
	const context = startStorage.getStore();
	if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return context;
}
var getServerContextAfterGlobalMiddlewares = () => {
	return getStartContext().contextAfterGlobalMiddlewares;
};
var getStartOptions = () => getStartContext().startOptions;
var createServerFn = (options, __opts) => {
	const resolvedOptions = __opts || options || {};
	if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
	const res = {
		options: resolvedOptions,
		middleware: (middleware) => {
			const newMiddleware = [...resolvedOptions.middleware || []];
			middleware.map((m) => {
				if (TSS_SERVER_FUNCTION_FACTORY in m) {
					if (m.options.middleware) newMiddleware.push(...m.options.middleware);
				} else newMiddleware.push(m);
			});
			const res2 = createServerFn(void 0, {
				...resolvedOptions,
				middleware: newMiddleware
			});
			res2[TSS_SERVER_FUNCTION_FACTORY] = true;
			return res2;
		},
		inputValidator: (inputValidator) => {
			return createServerFn(void 0, {
				...resolvedOptions,
				inputValidator
			});
		},
		handler: (...args) => {
			const [extractedFn, serverFn] = args;
			const newOptions = {
				...resolvedOptions,
				extractedFn,
				serverFn
			};
			const resolvedMiddleware = [...newOptions.middleware || [], serverFnBaseToMiddleware(newOptions)];
			return Object.assign(async (opts) => {
				return executeMiddleware$1(resolvedMiddleware, "client", {
					...extractedFn,
					...newOptions,
					data: opts?.data,
					headers: opts?.headers,
					signal: opts?.signal,
					context: {}
				}).then((d) => {
					if (d.error) throw d.error;
					return d.result;
				});
			}, {
				...extractedFn,
				__executeServer: async (opts, signal) => {
					const serverContextAfterGlobalMiddlewares = getServerContextAfterGlobalMiddlewares();
					return executeMiddleware$1(resolvedMiddleware, "server", {
						...extractedFn,
						...opts,
						context: {
							...serverContextAfterGlobalMiddlewares,
							...opts.context
						},
						signal
					}).then((d) => ({
						result: d.result,
						error: d.error,
						context: d.sendContext
					}));
				}
			});
		}
	};
	const fun = (options2) => {
		return {
			...res,
			options: {
				...res.options,
				...options2
			}
		};
	};
	return Object.assign(fun, res);
};
async function executeMiddleware$1(middlewares, env, opts) {
	const flattenedMiddlewares = flattenMiddlewares([...getStartOptions()?.functionMiddleware || [], ...middlewares]);
	const next = async (ctx) => {
		const nextMiddleware = flattenedMiddlewares.shift();
		if (!nextMiddleware) return ctx;
		if ("inputValidator" in nextMiddleware.options && nextMiddleware.options.inputValidator && env === "server") ctx.data = await execValidator(nextMiddleware.options.inputValidator, ctx.data);
		const middlewareFn = env === "client" && "client" in nextMiddleware.options ? nextMiddleware.options.client : nextMiddleware.options.server;
		if (middlewareFn) return applyMiddleware(middlewareFn, ctx, async (newCtx) => {
			return next(newCtx).catch((error) => {
				if (isRedirect$1(error) || isNotFound(error)) return {
					...newCtx,
					error
				};
				throw error;
			});
		});
		return next(ctx);
	};
	return next({
		...opts,
		headers: opts.headers || {},
		sendContext: opts.sendContext || {},
		context: opts.context || {}
	});
}
function flattenMiddlewares(middlewares) {
	const seen = /* @__PURE__ */ new Set();
	const flattened = [];
	const recurse = (middleware) => {
		middleware.forEach((m) => {
			if (m.options.middleware) recurse(m.options.middleware);
			if (!seen.has(m)) {
				seen.add(m);
				flattened.push(m);
			}
		});
	};
	recurse(middlewares);
	return flattened;
}
var applyMiddleware = async (middlewareFn, ctx, nextFn) => {
	return middlewareFn({
		...ctx,
		next: (async (userCtx = {}) => {
			return nextFn({
				...ctx,
				...userCtx,
				context: {
					...ctx.context,
					...userCtx.context
				},
				sendContext: {
					...ctx.sendContext,
					...userCtx.sendContext ?? {}
				},
				headers: mergeHeaders(ctx.headers, userCtx.headers),
				result: userCtx.result !== void 0 ? userCtx.result : userCtx instanceof Response ? userCtx : ctx.result,
				error: userCtx.error ?? ctx.error
			});
		})
	});
};
function execValidator(validator, input) {
	if (validator == null) return {};
	if ("~standard" in validator) {
		const result = validator["~standard"].validate(input);
		if (result instanceof Promise) throw new Error("Async validation not supported");
		if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
		return result.value;
	}
	if ("parse" in validator) return validator.parse(input);
	if (typeof validator === "function") return validator(input);
	throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
	return {
		_types: void 0,
		options: {
			inputValidator: options.inputValidator,
			client: async ({ next, sendContext,...ctx }) => {
				const payload = {
					...ctx,
					context: sendContext
				};
				return next(await options.extractedFn?.(payload));
			},
			server: async ({ next,...ctx }) => {
				const result = await options.serverFn?.(ctx);
				return next({
					...ctx,
					result
				});
			}
		}
	};
}
function getDefaultSerovalPlugins() {
	return [...(getStartOptions()?.serializationAdapters)?.map(makeSerovalPlugin) ?? [], ...defaultSerovalPlugins];
}
var eventStorage = new AsyncLocalStorage();
function requestHandler(handler) {
	return (request, requestOpts) => {
		const h3Event = new H3Event(request);
		return toResponse(eventStorage.run({ h3Event }, () => handler(request, requestOpts)), h3Event);
	};
}
function getH3Event() {
	const event = eventStorage.getStore();
	if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return event.h3Event;
}
function getRequestHeaders() {
	return getH3Event().req.headers;
}
function getRequestHeader(name) {
	return getRequestHeaders().get(name) || void 0;
}
function setResponseStatus(code, text) {
	const event = getH3Event();
	if (code) event.res.status = sanitizeStatusCode(code, event.res.status);
	if (text) event.res.statusText = sanitizeStatusMessage(text);
}
function getCookies() {
	return parseCookies(getH3Event());
}
function getCookie(name) {
	return getCookies()[name] || void 0;
}
function setCookie$1(name, value, options) {
	setCookie(getH3Event(), name, value, options);
}
function deleteCookie$1(name, options) {
	deleteCookie(getH3Event(), name, options);
}
function getResponse() {
	return getH3Event()._res;
}
var VIRTUAL_MODULES = {
	startManifest: "tanstack-start-manifest:v",
	serverFnManifest: "tanstack-start-server-fn-manifest:v",
	injectedHeadScripts: "tanstack-start-injected-head-scripts:v"
};
async function loadVirtualModule(id) {
	switch (id) {
		case VIRTUAL_MODULES.startManifest: return await import("./assets/_tanstack-start-manifest_v-L0-YmIu6.js");
		case VIRTUAL_MODULES.serverFnManifest: return await import("./assets/_tanstack-start-server-fn-manifest_v-DEQSzXvQ.js");
		case VIRTUAL_MODULES.injectedHeadScripts: return await import("./assets/_tanstack-start-injected-head-scripts_v-BhzX7Z6T.js");
		default: throw new Error(`Unknown virtual module: ${id}`);
	}
}
async function getStartManifest(opts) {
	const { tsrStartManifest } = await loadVirtualModule(VIRTUAL_MODULES.startManifest);
	const startManifest = tsrStartManifest();
	const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
	rootRoute.assets = rootRoute.assets || [];
	let script = `import('${startManifest.clientEntry}')`;
	rootRoute.assets.push({
		tag: "script",
		attrs: {
			type: "module",
			suppressHydrationWarning: true,
			async: true
		},
		children: script
	});
	return {
		...startManifest,
		routes: Object.fromEntries(Object.entries(startManifest.routes).map(([k, v]) => {
			const { preloads, assets } = v;
			return [k, {
				preloads,
				assets
			}];
		}))
	};
}
async function getServerFnById(serverFnId) {
	const { default: serverFnManifest } = await loadVirtualModule(VIRTUAL_MODULES.serverFnManifest);
	const serverFnInfo = serverFnManifest[serverFnId];
	if (!serverFnInfo) {
		console.info("serverFnManifest", serverFnManifest);
		throw new Error("Server function info not found for " + serverFnId);
	}
	const fnModule = await serverFnInfo.importer();
	if (!fnModule) {
		console.info("serverFnInfo", serverFnInfo);
		throw new Error("Server function module not resolved for " + serverFnId);
	}
	const action = fnModule[serverFnInfo.functionName];
	if (!action) {
		console.info("serverFnInfo", serverFnInfo);
		console.info("fnModule", fnModule);
		throw new Error(`Server function module export not resolved for serverFn ID: ${serverFnId}`);
	}
	return action;
}
function sanitizeBase$1(base) {
	if (!base) throw new Error("🚨 process.env.TSS_SERVER_FN_BASE is required in start/server-handler/index");
	return base.replace(/^\/|\/$/g, "");
}
var handleServerAction = async ({ request, context }) => {
	const controller = new AbortController();
	const signal = controller.signal;
	const abort = () => controller.abort();
	request.signal.addEventListener("abort", abort);
	const method = request.method;
	const url = new URL(request.url, "http://localhost:3000");
	const regex = /* @__PURE__ */ new RegExp(`${sanitizeBase$1("/_serverFn")}/([^/?#]+)`);
	const match = url.pathname.match(regex);
	const serverFnId = match ? match[1] : null;
	const search = Object.fromEntries(url.searchParams.entries());
	const isCreateServerFn = "createServerFn" in search;
	if (typeof serverFnId !== "string") throw new Error("Invalid server action param for serverFnId: " + serverFnId);
	const action = await getServerFnById(serverFnId);
	const formDataContentTypes = ["multipart/form-data", "application/x-www-form-urlencoded"];
	const contentType = request.headers.get("Content-Type");
	const serovalPlugins = getDefaultSerovalPlugins();
	function parsePayload(payload) {
		return fromJSON(payload, { plugins: serovalPlugins });
	}
	const response = await (async () => {
		try {
			let result = await (async () => {
				if (formDataContentTypes.some((type) => contentType && contentType.includes(type))) {
					invariant(method.toLowerCase() !== "get", "GET requests with FormData payloads are not supported");
					const formData = await request.formData();
					const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
					formData.delete(TSS_FORMDATA_CONTEXT);
					const params = {
						context,
						data: formData
					};
					if (typeof serializedContext === "string") try {
						const parsedContext = JSON.parse(serializedContext);
						if (typeof parsedContext === "object" && parsedContext) params.context = {
							...context,
							...parsedContext
						};
					} catch {}
					return await action(params, signal);
				}
				if (method.toLowerCase() === "get") {
					invariant(isCreateServerFn, "expected GET request to originate from createServerFn");
					let payload = search.payload;
					payload = payload ? parsePayload(JSON.parse(payload)) : payload;
					payload.context = {
						...context,
						...payload.context
					};
					return await action(payload, signal);
				}
				if (method.toLowerCase() !== "post") throw new Error("expected POST method");
				if (!contentType || !contentType.includes("application/json")) throw new Error("expected application/json content type");
				const jsonPayload = await request.json();
				if (isCreateServerFn) {
					const payload = parsePayload(jsonPayload);
					payload.context = {
						...payload.context,
						...context
					};
					return await action(payload, signal);
				}
				return await action(...jsonPayload);
			})();
			if (result.result instanceof Response) {
				result.result.headers.set(X_TSS_RAW_RESPONSE, "true");
				return result.result;
			}
			if (!isCreateServerFn) {
				result = result.result;
				if (result instanceof Response) return result;
			}
			if (isNotFound(result)) return isNotFoundResponse(result);
			const response2 = getResponse();
			let nonStreamingBody = void 0;
			if (result !== void 0) {
				let done = false;
				const callbacks = {
					onParse: (value) => {
						nonStreamingBody = value;
					},
					onDone: () => {
						done = true;
					},
					onError: (error) => {
						throw error;
					}
				};
				toCrossJSONStream(result, {
					refs: /* @__PURE__ */ new Map(),
					plugins: serovalPlugins,
					onParse(value) {
						callbacks.onParse(value);
					},
					onDone() {
						callbacks.onDone();
					},
					onError: (error) => {
						callbacks.onError(error);
					}
				});
				if (done) return new Response(nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0, {
					status: response2?.status,
					statusText: response2?.statusText,
					headers: {
						"Content-Type": "application/json",
						[X_TSS_SERIALIZED]: "true"
					}
				});
				const stream = new ReadableStream({ start(controller2) {
					callbacks.onParse = (value) => controller2.enqueue(JSON.stringify(value) + "\n");
					callbacks.onDone = () => {
						try {
							controller2.close();
						} catch (error) {
							controller2.error(error);
						}
					};
					callbacks.onError = (error) => controller2.error(error);
					if (nonStreamingBody !== void 0) callbacks.onParse(nonStreamingBody);
				} });
				return new Response(stream, {
					status: response2?.status,
					statusText: response2?.statusText,
					headers: {
						"Content-Type": "application/x-ndjson",
						[X_TSS_SERIALIZED]: "true"
					}
				});
			}
			return new Response(void 0, {
				status: response2?.status,
				statusText: response2?.statusText
			});
		} catch (error) {
			if (error instanceof Response) return error;
			if (isNotFound(error)) return isNotFoundResponse(error);
			console.info();
			console.info("Server Fn Error!");
			console.info();
			console.error(error);
			console.info();
			const serializedError = JSON.stringify(await Promise.resolve(toCrossJSONAsync(error, {
				refs: /* @__PURE__ */ new Map(),
				plugins: serovalPlugins
			})));
			const response2 = getResponse();
			return new Response(serializedError, {
				status: response2?.status ?? 500,
				statusText: response2?.statusText,
				headers: {
					"Content-Type": "application/json",
					[X_TSS_SERIALIZED]: "true"
				}
			});
		}
	})();
	request.signal.removeEventListener("abort", abort);
	return response;
};
function isNotFoundResponse(error) {
	const { headers,...rest } = error;
	return new Response(JSON.stringify(rest), {
		status: 404,
		headers: {
			"Content-Type": "application/json",
			...headers || {}
		}
	});
}
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
var baseUrl;
function sanitizeBase(base) {
	return base.replace(/^\/|\/$/g, "");
}
var createServerRpc = (functionId, splitImportFn) => {
	if (!baseUrl) {
		const sanitizedAppBase = sanitizeBase("/");
		const sanitizedServerBase = sanitizeBase("/_serverFn");
		baseUrl = `${sanitizedAppBase ? `/${sanitizedAppBase}` : ""}/${sanitizedServerBase}/`;
	}
	invariant(splitImportFn, "🚨splitImportFn required for the server functions server runtime, but was not provided.");
	const url = baseUrl + functionId;
	return Object.assign(splitImportFn, {
		url,
		functionId,
		[TSS_SERVER_FUNCTION]: true
	});
};
var ServerFunctionSerializationAdapter = createSerializationAdapter({
	key: "$TSS/serverfn",
	test: (v) => {
		if (typeof v !== "function") return false;
		if (!(TSS_SERVER_FUNCTION in v)) return false;
		return !!v[TSS_SERVER_FUNCTION];
	},
	toSerializable: ({ functionId }) => ({ functionId }),
	fromSerializable: ({ functionId }) => {
		const fn = async (opts, signal) => {
			return (await (await getServerFnById(functionId))(opts ?? {}, signal)).result;
		};
		return createServerRpc(functionId, fn);
	}
});
function getStartResponseHeaders(opts) {
	return mergeHeaders$1({ "Content-Type": "text/html; charset=utf-8" }, ...opts.router.state.matches.map((match) => {
		return match.headers;
	}));
}
function createStartHandler(cb) {
	const APP_BASE = "/";
	const serverFnBase = joinPaths([
		APP_BASE,
		trimPath("/_serverFn"),
		"/"
	]);
	let startRoutesManifest = null;
	let startEntry = null;
	let routerEntry = null;
	const getEntries = async () => {
		if (routerEntry === null) routerEntry = await import("./assets/router-CDqb61S0.js");
		if (startEntry === null) startEntry = await import("./assets/start-gn-wP8i_.js");
		return {
			startEntry,
			routerEntry
		};
	};
	const originalFetch = globalThis.fetch;
	const startRequestResolver = async (request, requestOpts) => {
		const origin = getOrigin(request);
		globalThis.fetch = async function(input, init) {
			function resolve(url2, requestOptions) {
				return startRequestResolver(new Request(url2, requestOptions), requestOpts);
			}
			if (typeof input === "string" && input.startsWith("/")) return resolve(new URL(input, origin), init);
			else if (typeof input === "object" && "url" in input && typeof input.url === "string" && input.url.startsWith("/")) return resolve(new URL(input.url, origin), init);
			return originalFetch(input, init);
		};
		const url = new URL(request.url);
		const href = url.href.replace(url.origin, "");
		let router = null;
		const getRouter = async () => {
			if (router) return router;
			router = await (await getEntries()).routerEntry.getRouter();
			const isPrerendering = process.env.TSS_PRERENDERING === "true";
			let isShell = process.env.TSS_SHELL === "true";
			if (isPrerendering && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
			const history = createMemoryHistory({ initialEntries: [href] });
			router.update({
				history,
				isShell,
				isPrerendering,
				origin: router.options.origin ?? origin,
				defaultSsr: startOptions.defaultSsr,
				serializationAdapters: startOptions.serializationAdapters
			});
			return router;
		};
		const startOptions = await (await getEntries()).startEntry.startInstance?.getOptions() || {};
		startOptions.serializationAdapters = startOptions.serializationAdapters || [];
		startOptions.serializationAdapters.push(ServerFunctionSerializationAdapter);
		const requestHandlerMiddleware = handlerToMiddleware(async ({ context }) => {
			return await runWithStartContext({
				getRouter,
				startOptions,
				contextAfterGlobalMiddlewares: context
			}, async () => {
				try {
					if (href.startsWith(serverFnBase)) return await handleServerAction({
						request,
						context: requestOpts?.context
					});
					const executeRouter = async ({ serverContext }) => {
						const splitRequestAcceptHeader = (request.headers.get("Accept") || "*/*").split(",");
						if (!["*/*", "text/html"].some((mimeType) => splitRequestAcceptHeader.some((acceptedMimeType) => acceptedMimeType.trim().startsWith(mimeType)))) return json({ error: "Only HTML requests are supported here" }, { status: 500 });
						if (startRoutesManifest === null) startRoutesManifest = await getStartManifest({ basePath: APP_BASE });
						const router2 = await getRouter();
						attachRouterServerSsrUtils({
							router: router2,
							manifest: startRoutesManifest
						});
						router2.update({ additionalContext: { serverContext } });
						await router2.load();
						if (router2.state.redirect) return router2.state.redirect;
						await router2.serverSsr.dehydrate();
						return await cb({
							request,
							router: router2,
							responseHeaders: getStartResponseHeaders({ router: router2 })
						});
					};
					return await handleServerRoutes({
						getRouter,
						request,
						executeRouter
					});
				} catch (err) {
					if (err instanceof Response) return err;
					throw err;
				}
			});
		});
		const response = (await executeMiddleware([...(startOptions.requestMiddleware ? flattenMiddlewares(startOptions.requestMiddleware) : []).map((d) => d.options.server), requestHandlerMiddleware], {
			request,
			context: requestOpts?.context || {}
		})).response;
		if (isRedirect$1(response)) {
			if (isResolvedRedirect(response)) {
				if (request.headers.get("x-tsr-redirect") === "manual") return json({
					...response.options,
					isSerializedRedirect: true
				}, { headers: response.headers });
				return response;
			}
			if (response.options.to && typeof response.options.to === "string" && !response.options.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(response.options)}`);
			if ([
				"params",
				"search",
				"hash"
			].some((d) => typeof response.options[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(response.options).filter((d) => typeof response.options[d] === "function").map((d) => `"${d}"`).join(", ")}`);
			const redirect$1 = (await getRouter()).resolveRedirect(response);
			if (request.headers.get("x-tsr-redirect") === "manual") return json({
				...response.options,
				isSerializedRedirect: true
			}, { headers: response.headers });
			return redirect$1;
		}
		return response;
	};
	return requestHandler(startRequestResolver);
}
async function handleServerRoutes({ getRouter, request, executeRouter }) {
	const router = await getRouter();
	let url = new URL(request.url);
	url = executeRewriteInput(router.rewrite, url);
	const pathname = url.pathname;
	const { matchedRoutes, foundRoute, routeParams } = router.getMatchedRoutes(pathname, void 0);
	const middlewares = flattenMiddlewares(matchedRoutes.flatMap((r) => r.options.server?.middleware).filter(Boolean)).map((d) => d.options.server);
	const server = foundRoute?.options.server;
	if (server) {
		if (server.handlers) {
			const handlers = typeof server.handlers === "function" ? server.handlers({ createHandlers: (d) => d }) : server.handlers;
			const requestMethod = request.method.toLowerCase();
			let method = Object.keys(handlers).find((method2) => method2.toLowerCase() === requestMethod);
			if (!method) method = Object.keys(handlers).find((method2) => method2.toLowerCase() === "all") ? "all" : void 0;
			if (method) {
				const handler = handlers[method];
				if (handler) {
					const mayDefer = !!foundRoute.options.component;
					if (typeof handler === "function") middlewares.push(handlerToMiddleware(handler, mayDefer));
					else {
						const { middleware } = handler;
						if (middleware && middleware.length) middlewares.push(...flattenMiddlewares(middleware).map((d) => d.options.server));
						if (handler.handler) middlewares.push(handlerToMiddleware(handler.handler, mayDefer));
					}
				}
			}
		}
	}
	middlewares.push(handlerToMiddleware((ctx2) => executeRouter({ serverContext: ctx2.context })));
	return (await executeMiddleware(middlewares, {
		request,
		context: {},
		params: routeParams,
		pathname
	})).response;
}
function throwRouteHandlerError() {
	if (process.env.NODE_ENV === "development") throw new Error(`It looks like you forgot to return a response from your server route handler. If you want to defer to the app router, make sure to have a component set in this route.`);
	throw new Error("Internal Server Error");
}
function throwIfMayNotDefer() {
	if (process.env.NODE_ENV === "development") throw new Error(`You cannot defer to the app router if there is no component defined on this route.`);
	throw new Error("Internal Server Error");
}
function handlerToMiddleware(handler, mayDefer = false) {
	if (mayDefer) return handler;
	return async ({ next: _next,...rest }) => {
		const response = await handler({
			...rest,
			next: throwIfMayNotDefer
		});
		if (!response) throwRouteHandlerError();
		return response;
	};
}
function executeMiddleware(middlewares, ctx) {
	let index = -1;
	const next = async (ctx2) => {
		index++;
		const middleware = middlewares[index];
		if (!middleware) return ctx2;
		let result;
		try {
			result = await middleware({
				...ctx2,
				next: async (nextCtx) => {
					const nextResult = await next({
						...ctx2,
						...nextCtx,
						context: {
							...ctx2.context,
							...nextCtx?.context || {}
						}
					});
					return Object.assign(ctx2, handleCtxResult(nextResult));
				}
			});
		} catch (err) {
			if (isSpecialResponse(err)) result = { response: err };
			else throw err;
		}
		return Object.assign(ctx2, handleCtxResult(result));
	};
	return handleCtxResult(next(ctx));
}
function handleCtxResult(result) {
	if (isSpecialResponse(result)) return { response: result };
	return result;
}
function isSpecialResponse(err) {
	return isResponse(err) || isRedirect$1(err);
}
function isResponse(response) {
	return response instanceof Response;
}
var server_default = { fetch: createStartHandler(defaultStreamHandler) };
export { setCookie$1 as a, server_default as default, getRequestHeader as i, deleteCookie$1 as n, setResponseStatus as o, getCookie as r, createServerFn as s, createServerRpc as t };

//# sourceMappingURL=server.js.map