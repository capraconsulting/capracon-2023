import type { AppLoadContext } from "react-router";

interface Env {
  PREVIEW_SECRET?: string;
  NOTION_TOKEN?: string;
  KV?: KVNamespace;
}

export const getEnv = (context: AppLoadContext): Env => {
  return context.cloudflare.env as unknown as Env;
};

export const getWaitUntil = (context: AppLoadContext) => {
  return context.cloudflare.ctx.waitUntil.bind(context.cloudflare.ctx);
};

export const getEnvVariableOrThrow = <K extends keyof Env>(
  key: K,
  context: AppLoadContext,
): NonNullable<Env[K]> => {
  const value = getEnv(context)[key];
  if (!value) {
    throw new Response(`${key} needs to be set`, {
      status: 500,
    });
  }
  return value as NonNullable<Env[K]>;
};
