import type { AppLoadContext } from "@remix-run/server-runtime";

interface Env {
  PREVIEW_SECRET?: string;
  NOTION_TOKEN?: string;
  KV?: KVNamespace;
  waitUntil?: (promise: Promise<any>) => void;
}

export const getEnv = (context: AppLoadContext) => {
  let env = {} as Partial<Record<string, unknown>>;
  if (typeof process !== "undefined") {
    env = { ...env, ...process.env };
  }
  if (context) {
    env = { ...env, ...context };
  }
  return env as Env;
};

export const getEnvVariableOrThrow = (
  key: keyof Env,
  context: AppLoadContext,
) => {
  const value = getEnv(context)[key];
  if (!value) {
    throw new Response(`${key} needs to be set`, {
      status: 500,
    });
  }
  return value;
};
