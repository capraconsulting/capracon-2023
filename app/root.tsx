import type {
  LinksFunction,
  LoaderArgs,
  MetaFunction,
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
import { getDataCachedAndFiltered } from "./notion-conference/notion-conference-cached";
import styles from "./tailwind.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

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
];

export const loader = async ({ request, context }: LoaderArgs) => {
  const data = await getDataCachedAndFiltered(request, context);

  const formattedConferenceDate = new Intl.DateTimeFormat("no-nb", {
    dateStyle: "medium",
  }).format(new Date(data.conference.date));

  return json({ ...data, date: formattedConferenceDate });
};

export type RootLoader = typeof loader;
export const useRootData = () =>
  useRouteLoaderData("root") as SerializeFrom<typeof loader>;

export default function App() {
  return (
    <html lang="no">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <BackgroundSvg />
        <Header />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

const BackgroundSvg: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 z-[-1] inline-block h-[3000px] min-w-[100vw] bg-[#ccc] bg-[url('../public/images/test.svg')] bg-cover bg-center bg-no-repeat" />
  );
};
