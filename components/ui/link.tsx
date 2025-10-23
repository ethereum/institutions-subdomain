import { ComponentProps, forwardRef } from "react"
import { ExternalLink, Mail } from "lucide-react"
import NextLink from "next/link"

import { cn } from "@/lib/utils"
import * as url from "@/lib/utils/url"

export type LinkProps = ComponentProps<"a"> &
  ComponentProps<typeof NextLink> & {
    showDecorator?: boolean
    inline?: boolean
  }

/**
 * Link wrapper which handles:
 *
 * - Hashed links
 * e.g. <Link href="/page-2/#specific-section">
 *
 * - External links
 * e.g. <Link href="https://example.com/">
 *
 * - PDFs & static files (which open in a new tab)
 * e.g. <Link href="/eth-whitepaper.pdf">
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, className, showDecorator, inline, ...props }: LinkProps,
  ref
) {
  const isExternal = url.isExternal(href)
  const isMailto = url.isMailto(href)
  const isHash = url.isHash(href)

  const commonProps = {
    ref,
    ...props,
    className: cn("block w-fit no-underline", inline && "inline", className),
    href,
  }

  if (isExternal) {
    return (
      <a target="_blank" rel="noopener" {...commonProps}>
        {isMailto ? (
          <span className="text-nowrap">
            {showDecorator && (
              <Mail className="me-1 !mb-0.5 inline-block size-[1em] shrink-0" />
            )}
            {children}
          </span>
        ) : (
          children
        )}
        <span className="sr-only">
          {isMailto ? " (opens email client)" : " (opens in a new tab)"}
        </span>
        {showDecorator && !isMailto && (
          <ExternalLink className="text-muted group-hover:text-muted-foreground ms-1 !mb-[0.125em] inline size-[1em] shrink-0" />
        )}
      </a>
    )
  }

  if (isHash) {
    return <a {...commonProps}>{children}</a>
  }

  return <NextLink {...commonProps}>{children}</NextLink>
})
Link.displayName = "BaseLink"

export const LinkWithArrow = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, className, ...props }: LinkProps, ref) => (
    <Link className={cn("group", className)} ref={ref} {...props}>
      {children}
      &nbsp;
      <span className="motion-safe:group-hover:animate-x-bounce inline-block">
        →
      </span>
    </Link>
  )
)
LinkWithArrow.displayName = "LinkWithArrow"

export default Link
