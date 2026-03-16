import { createRequestHandler } from "react-router";

// @ts-ignore - virtual module provided by React Router at build time
import * as build from "virtual:react-router/server-build";

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

interface Env {
  NOTION_TOKEN: string;
  PREVIEW_SECRET: string;
  KV: KVNamespace;
}

const requestHandler = createRequestHandler(build);

export default {
  fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
