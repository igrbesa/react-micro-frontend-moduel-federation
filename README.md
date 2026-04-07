# Microfrontend POC (Module Federation + Vite)

Monorepo with three apps aligned with [react-redux-toolkit-app](https://github.com/igrbesa/react-redux-toolkit-app) (Vite 8, React 19, Redux Toolkit, React Router, Vitest):

- **`shell/`** — host app (top bar app switcher, home listing, lazy-loaded remotes)
- **`products/`** — remote exposing `ProductsApp`
- **`cart/`** — remote exposing `CartApp`

`react` and `react-dom` are **shared singletons** via `@module-federation/vite`.

## Prerequisites

- Node.js 20+ (recommended)

## Install

From the repo root:

```bash
npm install
```

## Development

Remotes must be running before the shell can load them.

**Option A — one command (recommended)**

```bash
npm run dev
```

This starts `products` (port **5171**), `cart` (**5172**), and `shell` (**5173**) together.

**Option B — three terminals**

```bash
npm run dev -w products
npm run dev -w cart
npm run dev -w shell
```

Open the shell at **http://localhost:5173/**.

## Production build

Build order matters: remotes first, then the host.

```bash
npm run build
```

For deployed environments, point shell remote entries at real `remoteEntry.js` URLs (see `shell/vite.config.ts`).

## Lint / test (per package)

```bash
npm run lint -w shell
npm run test -w shell
```
