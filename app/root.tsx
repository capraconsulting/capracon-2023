import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";

import { Header } from "~/components/header";
import { ThemeProvider } from "./hooks/useTheme";
import { getDataCachedAndFiltered } from "./notion-conference/client-cached-and-filtered";
import "./app.css";
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
];

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const data = await getDataCachedAndFiltered(request, context);

  let formattedConferenceDate: string | undefined;
  try {
    if (data?.conference?.date) {
      const df = new Intl.DateTimeFormat("nb-NO", {
        dateStyle: "medium",
        timeZone,
      });
      formattedConferenceDate = df.format(new Date(data.conference.date));
    }
  } catch {
    formattedConferenceDate = data?.conference?.date
      ? new Date(data.conference.date).toISOString().substring(0, 10)
      : undefined;
  }

  return { ...data, formattedConferenceDate };
};

export type RootLoader = typeof loader;
export const useRootData = () =>
  useRouteLoaderData("root") as Awaited<ReturnType<typeof loader>>;

export default function App() {
  return (
    <html lang="no">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <title>CapraCon</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-primary dark:bg-[#09090B] dark:text-white">
        <ThemeProvider>
          <Header />
          <Outlet />
          <ScrollRestoration
            getKey={(location) => {
              const paths = ["/"];
              return paths.includes(location.pathname)
                ? location.pathname
                : null;
            }}
          />
          <Scripts />

          {/* Cloudflare Web Analytics */}
          {import.meta.env.PROD && (
            <script
              defer
              src="https://static.cloudflareinsights.com/beacon.min.js"
              data-cf-beacon='{"token": "6943920f1eb54a2998aec281c9ddbb76"}'
            />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
