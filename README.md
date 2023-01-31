# CapraCon 2023

> [https://capracon.no](https://capracon.no)

- UI med [React](https://reactjs.org/)
- Server side rendering med [Remix](https://remix.run/)
- Styling med [Tailwind](https://tailwindcss.com/)
- Hosted hos [Cloudflare Pages](https://pages.cloudflare.com/)
- Innhold og bilder hos [Notion](https://www.notion.so/capra/CapraCon-2023-d84d4b2667ff40c49103e3455b7c98c8)

## Utvikling

For lokal utvikling trenger du å lage `.dev.vars` fil i rotmappa. Den skal se slik ut

```
NOTION_TOKEN=<api-key-here>
PREVIEW_SECRET=<secret-here>
```

Spør noen i [#tema_capraweb](https://capra.slack.com/archives/C01A1QLRKJM) for secrets, alle i capra skal få tilgang 😊

Kjør opp dev serveren slik

```sh
npm install # Hvis du ikke har gjort det allerede

# start the remix dev server and wrangler
npm run dev
```

Trykk `b` i terminalen eller åpne [http://127.0.0.1:8788](http://127.0.0.1:8788) og siden burde vises

## Deployment

Vi deployer på Cloudflare Pages [her](https://dash.cloudflare.com/1df81eff3a3cb0e9662170a4b25ad52b/pages/view/capracon-2023). Alle commits til main går rett ut i PROD. Alle branches vil få en preview build.
