import { type Components } from "react-markdown"

import Link from "@/components/ui/link"

const MarkdownComponents: Components = {
  a: ({ children, href }) => {
    if (!href) return <a>{children}</a>
    return (
      <Link inline href={href} className="max-w-full break-all">
        {children}
      </Link>
    )
  },
  img: ({ src, alt }) => {
    if (typeof src !== "string") return null
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ""} className="mx-auto block" />
  },
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 text-4xl first:mt-0 md:mt-16 md:text-5xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-10 mb-4 text-3xl md:mt-12 md:text-4xl">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-4">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc ps-8">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal ps-8">{children}</ol>,
  li: ({ children }) => <li className="mb-2">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 ps-4">{children}</blockquote>
  ),
  hr: () => <hr className="my-12" />,
}

export default MarkdownComponents
