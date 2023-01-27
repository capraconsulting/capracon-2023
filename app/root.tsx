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

import remixImageStyles from "remix-image/remix-image.css";

import { Header } from "~/components/header";
import capraconBackground from "./images/capracon-background.svg";
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
    href: "/favicon.ico",
    type: "image/ico",
    sizes: "any",
  },
  {
    rel: "icon",
    href: "/icon.svg",
    type: "image/svg+xml",
  },
  {
    rel: "apple-touch-icon",
    href: "/apple-touch-icon.png",
  },
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: remixImageStyles },
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
        <Meta />
        <Links />
        <link rel="preload" as="image" href={capraconBackground} />
      </head>
      <body className="bg-[#ebeae1]">
        <div className="absolute top-0 bottom-0 -z-10 h-full min-h-screen w-full overflow-hidden">
          <BackgroundSvg />
        </div>
        <Header />
        <Outlet />
        <ScrollRestoration />
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

const BackgroundSvg: React.FC = () => {
  return (
    <div
      style={{ backgroundImage: `url(${capraconBackground})` }}
      className="h-[3000px] w-full bg-cover bg-center bg-no-repeat"
    />
  );
};
