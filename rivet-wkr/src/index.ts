import { createInlineClient } from "@rivetkit/cloudflare-workers";
import { registry } from "./registry";

const {
	client,
	fetch: rivetFetch,
	ActorHandler,
} = createInlineClient(registry);

export { ActorHandler };

export default {
	fetch: async (request, env, ctx) => {
		const url = new URL(request.url);
		if (url.pathname.startsWith("/rivet")) {
			const strippedPath = url.pathname.substring("/rivet".length);
			url.pathname = strippedPath;
			const modifiedRequest = new Request(url.toString(), request);
			return rivetFetch(modifiedRequest, env, ctx);
		}

		return new Response("Not Found", { status: 404 });
	}
} satisfies ExportedHandler;