import type {
  LinksFunction,
  LoaderArgs,
  SerializeFrom,
} from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";

import { Header } from "~/components/header";
import { getDataCachedAndFiltered } from "./notion-conference/client-cached-and-filtered";
import styles from "./tailwind.css";
import { timeZone } from "./utils/consts";

export const links: LinksFunction = () => [
  {
    rel: "manifest",
    href: "/manifest.webmanifest",
  },
  {
    rel: "icon",
    href: "/favicon-group.ico",
    type: "image/ico",
    sizes: "any",
  },
  {
    rel: "icon",
    href: "/icon-group.svg",
    type: "image/svg+xml",
  },
  {
    rel: "apple-touch-icon",
    href: "/apple-touch-icon-group.png",
  },
  { rel: "stylesheet", href: styles },
];

export const loader = async ({ request, context }: LoaderArgs) => {
  const data = await getDataCachedAndFiltered(request, context);

  const formattedConferenceDate = new Intl.DateTimeFormat("no-nb", {
    dateStyle: "medium",
    timeZone,
  }).format(new Date(data.conference.date));

  return json({ ...data, formattedConferenceDate });
};

export type RootLoader = typeof loader;
export const useRootData = () =>
  useRouteLoaderData("root") as SerializeFrom<typeof loader>;

export default function App() {
  return (
    <html lang="no" className="relative">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-primary">
        <Header />
        <Outlet />
        <ScrollRestoration
          getKey={(location) => {
            const paths = ["/"];
            return paths.includes(location.pathname) ? location.pathname : null;
          }}
        />
        <Scripts />
        <LiveReload />

        {/* Cloudflare Web Analytics */}
        {process.env.NODE_ENV === "production" && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "6943920f1eb54a2998aec281c9ddbb76"}'
          />
        )}
      </body>
    </html>
  );
}
