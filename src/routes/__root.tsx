import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";

import { Analytics } from "@/components/analytics";
import { seo } from "@/lib/public-config";
const APP_NAME = "Встановлення інвертора в Одесі та області | Growatt Energy";
const APP_DESC =
  "Встановлення інвертора Growatt в Одесі та Одеській області: підбір потужності, акумулятора, захисту й монтаж резервного живлення для дому.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      ...seo(APP_NAME, APP_DESC).meta,
      { name: "theme-color", content: "#0c1210" },
    ],
    links: [
      ...seo(APP_NAME, APP_DESC).links,
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  notFoundComponent: () => <main id="main" className="mx-auto max-w-3xl px-6 py-24"><h1 className="text-3xl">Сторінку не знайдено</h1><a href="/" className="mt-6 inline-block underline">На головну</a></main>,
  component: () => (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <a className="skip-link" href="#main">Перейти до вмісту</a>
          <Outlet />
          <Analytics />
        <Scripts />
      </body>
    </html>
  ),
});
