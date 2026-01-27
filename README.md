[![Netlify Status](https://api.netlify.com/api/v1/badges/e8e487f1-b459-4b2a-bade-c030e1cab733/deploy-status?branch=main)](https://app.netlify.com/projects/institutions-subdomain/deploys)

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

## Adding items to the library

### External library items

File: `app/library/data.ts`

Additions to the library can be made within this list:

```tsx
const externalLibraryItems: LibraryItem[] = [
  ...
]
```

Required fields:

| Field    | Value                              |
| -------- | ---------------------------------- |
| `title`  | title to be displayed for the item |
| `href`   | URL link for the entry             |
| `date`   | Displayed date for the item        |
| `imgSrc` | Card banner image to be used       |

#### `date` value

- Date is also used to automatically sort the library items
- **Must be a valid date format** (match pattern of existing items to avoid parsing issues)

#### `imgSrc` value

Can be either an image internal to the repo (imported at the top and references with it's declared variable name) or a full URL to an external image

- **Internal images** preferred for performance reasons (automatically optimized)
  1. Save file to `/public/images/library/` directory, e.g., `some-image.png`
  2. Add import statement at top of `data.ts` file, e.g., `import someImage from "@/public/images/library/some-image.png"`
  3. Add to `imgSrc` using variable name, e.g., `imgSrc: someImage,` (no quotes)
- **External images** can also be used by simply adding the full URL as a string, e.g., `imgSrc: "https://ethereum.org/images/eth.png",` (with quotes)

#### Example

```tsx
import a16zCrypto from "@/public/images/library/a16z-crypto-1.png"
```

```tsx
  {
    title: "a16zcrypto - State of Crypto ",
    href: "https://stateofcrypto.a16zcrypto.com/",
    date: "October 22, 2025",
    imgSrc: a16zCrypto,
  },
```

### Internal posts

All posts are added as individual markdown files, each containing metadata in the front matter of the file.

#### File Structure

Content should be placed in the following directories: `/public/posts/`

#### File Naming

Name your file using a kebab-case slug that describes the content, for example:

- `enterprise-team-update.md`
- `ethereum-leading-the-way.md`

The filename (without extension) will be used in the URL path for the post when published. Lowercase is not required, but encouraged for consistency. Avoid special characters and spaces in the filename.

#### Front Matter Requirements

Both `title` and `datePublished` fields are required. Ensure proper date formatting, e.g., YYYY-MM-DD

```markdown
---
title: Your Post Title
datePublished: 2025-10-25
---
```

#### Content Format

After the front matter, write your content using standard Markdown syntax.

Beneath front matter data, leave a space and begin article.

```markdown
Lorem ipsum dolor sit amet consectetur adipisicing elit.

## Lorem ipsum

...
```

You can include:

- Headings (`## Heading 2`, `### Header 3` etc.) \*
- Text formatting (`**bold**`, `_italic_`)
- Links `[label](url)`
- Images `![descriptive text](/path/to/image.png)`
- Code blocks, e.g.,
  ```markdown
  JSON uses a `key` and a `value`
  ```
- Ordered or unordered lists
- Block quotes

\*Note: Do not use Heading 1 (H1, `#`) as it is reserved for the main title of the page, automatically handled by the `title` front matter property. Pages should never have more than one H1—use H2 for section titles and H3 for subsections, etc.

Internal images used in content should be stored in the `/public/images/` directory with appropriate subdirectories for organization, referenced by the relative path (excluding domain). External images should use the full URL, including `https://` and domain prefix.

