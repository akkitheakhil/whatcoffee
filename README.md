# WhatCoffee

WhatCoffee is a small, local-first coffee discovery PWA. Spin for a drink, tune a few preferences, browse the coffee shelf, and open a concise recipe when something catches your eye.

## Features

- Surprise-me coffee reel with paced transitions and reduced-motion support
- 54 coffee and tea-latte recipes with ingredients, steps, origin, and serving details
- Preference matching for temperature, milk, perceived strength, and perceived sweetness
- Search and filters for hot, cold, with-milk, and no-milk drinks
- Responsive layouts designed for desktop and mobile browsers
- System, light, and dark themes with a saved theme preference
- Installable PWA manifest and a service worker for shell and page caching
- Local-first prototype: no account or analytics; recipe suggestions are sent to GitHub for review when configured

## Tech stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS v4 with shared CSS design tokens
- `next-themes` for theme switching
- Zod for coffee data validation
- `pnpm` for package management

## Getting started

Requirements: Node.js 20 or newer and pnpm 11 or newer.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub recipe suggestions

The suggestion form creates an issue in [`akkitheakhil/whatcoffee`](https://github.com/akkitheakhil/whatcoffee) through a server-side route. The GitHub token is never exposed to the browser.

Create a fine-grained GitHub personal access token with **Issues: Read and write** permission for the repository, then add these variables to `.env.local` for local testing or to the Vercel project settings for production:

```env
GITHUB_TOKEN=github_pat_...
GITHUB_REPOSITORY=akkitheakhil/whatcoffee
```

`GITHUB_REPOSITORY` defaults to `akkitheakhil/whatcoffee`, so only `GITHUB_TOKEN` is required for this project. Without a token, the form shows a clear unavailable state and does not submit anything.

## Search and sharing configuration

WhatCoffee generates canonical URLs, an XML sitemap, social sharing images, recipe structured data, and machine-readable recipe indexes. On Vercel, canonical URLs use `VERCEL_PROJECT_PRODUCTION_URL` automatically. Set `SITE_URL` when you want to force a custom production domain:

```env
SITE_URL=https://your-domain.example
```

After deployment:

1. Add the site to [Google Search Console](https://search.google.com/search-console/about) and verify the preferred production domain.
2. Add the verification value to `GOOGLE_SITE_VERIFICATION` in Vercel, then redeploy.
3. Submit `https://your-domain.example/sitemap.xml` in Search Console and Bing Webmaster Tools.
4. Test several drink pages with Google's [Rich Results Test](https://search.google.com/test/rich-results).

AI assistants can discover the concise catalogue at `/llms.txt` and the complete recipe text at `/llms-full.txt`. Both files point back to the canonical recipe pages.

For a production build:

```bash
pnpm build
pnpm start
```

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Create an optimised production build |
| `pnpm start` | Serve the production build locally |
| `pnpm typecheck` | Run TypeScript without emitting files |
| `pnpm lint` | Run ESLint across the project |

## Project structure

```text
app/                 App Router pages, metadata, manifest, and shared CSS
components/          Interactive experience and reusable UI components
lib/coffees.ts       Validated coffee catalogue and recipe data
public/sw.js         Service worker used by the production PWA
```

Coffee content lives in [`lib/coffees.ts`](lib/coffees.ts). Shared light and dark design tokens live at the top of [`app/globals.css`](app/globals.css).

## How to contribute

Contributions are welcome. The easiest way to help is to make a focused change and open a pull request:

1. Fork the [WhatCoffee repository](https://github.com/akkitheakhil/whatcoffee) and create a branch for your change.
2. Make the change, keeping recipe content accurate and the existing keyboard, responsive, and reduced-motion behaviour intact.
3. Run the checks locally:

   ```bash
   pnpm typecheck
   pnpm lint
   pnpm build
   ```

4. Push your branch and create a pull request against `master`.

In the pull request description, explain:

- **Why is this change needed?** Describe the problem, incorrect information, or user experience it improves. Include a source or reference for factual recipe corrections when possible.
- **What type of change is it?** Choose the category that best fits:
  - Bug fix
  - New recipe
  - Recipe or content correction
  - Feature or enhancement
  - Design or accessibility improvement
  - Documentation or maintenance
- **What changed and how was it tested?** Summarise the implementation and list the checks you ran. Include screenshots for visual changes when helpful.

For a new recipe or recipe correction, please verify the drink name, origin, serving temperature, ingredients, proportions, preparation steps, and description before submitting the pull request.

## License

WhatCoffee is distributed under the MIT License. See [`LICENSE`](LICENSE) in the repository.
