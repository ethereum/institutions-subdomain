[![Netlify Status](https://api.netlify.com/api/v1/badges/be8e1a60-7b3f-45b1-9aa9-56c18c57b7b4/deploy-status)](https://app.netlify.com/projects/ef-institutions/deploys) <!-- TODO: Update for production when launched -->

<div align="center" style="margin-top: 1em; margin-bottom: 3em;">
  <a href="https://institutions.ethereum.org"><img alt="ethereum institutions logo" src="./public/images/banners/black-white-site-hero.svg" alt="institutions.ethereum.org" width="420"></a>
  <h1>Ethereum for Institutions</h1>
</div>

## Stack

- [Next.js](https://nextjs.org/) - React framework for server-rendered applications
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- [Prettier](https://prettier.io/) - Code formatter
- [shadcn/ui](https://ui.shadcn.com/) - UI components built with Radix UI and Tailwind CSS

## Getting started with local development

This repo contains a `.nvmrc` file that declares the canonical Node.js version for this project. If you use `nvm`, you can run `nvm use` to automatically switch to the correct version.

**Use current node version (recommended)**

```sh
nvm use
```

Corepack is a tool that allows you to use package managers like pnpm without needing to install them globally. It ensures that the correct version of the package manager is used for your project.

**Enable corepack (recommended):**

```sh
corepack enable
```

This repo uses `pnpm` as a package manager. If you don't have it installed, see [Installing pnpm](https://pnpm.io/installation).

Then, run the following command to install the dependencies:

```bash
pnpm install
```

Next, you can run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
