import * as React from "react"
import Image, { type ImageProps } from "next/image"
import { useLocale } from "next-intl"
import { Slot } from "@radix-ui/react-slot"

import { isValidDate } from "@/lib/utils/date"
import { cn } from "@/lib/utils/index"

import Link, { LinkProps } from "./link"

function LibraryCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("group/card space-y-4", className)}
      {...props}
    />
  )
}

function LibraryCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "from-primary/5 dark:from-primary/20 to-primary/10 h-52 overflow-hidden bg-gradient-to-b",
        className
      )}
      {...props}
    />
  )
}

function LibraryCardImage({ className, alt, ...props }: ImageProps) {
  const sharedClasses = cn(
    "size-full object-cover transition-transform group-has-[a:hover]/card:scale-105 group-has-[a:hover]/card:transition-transform",
    className
  )

  if (typeof props.src === "string")
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={alt || ""} className={sharedClasses} />

  return (
    <Image
      data-slot="card-image"
      alt={alt || ""}
      className={sharedClasses}
      placeholder="blur"
      sizes="(max-width: 640px) 100vw, (max-width: 1400px) 44vw, 608px"
      {...props}
    />
  )
}

const LibraryCardTitle = React.forwardRef<
  React.ComponentRef<"h3">,
  React.ComponentProps<"header"> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "h3"

  return (
    <Comp
      ref={ref}
      data-slot="card-title"
      className={cn("text-h5 tracking-[0.03rem]", className)}
      {...props}
    />
  )
})
LibraryCardTitle.displayName = "LibraryCardTitle"

function LibraryCardTitleLink({
  className,
  href,
  ...props
}: LinkProps & Pick<React.ComponentProps<"a">, "className">) {
  return (
    <Link
      data-slot="card-title-link"
      href={href}
      className={cn("hover:underline", className)}
      {...props}
    />
  )
}

function LibraryCardDate({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const locale = useLocale()
  const date = isValidDate(children as string)
    ? new Intl.DateTimeFormat(locale, {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(children as string))
    : children
  return (
    <div
      data-slot="card-date"
      className={cn(
        "text-muted-foreground text-sm font-medium tracking-[0.0175rem]",
        className
      )}
      {...props}
    >
      {date}
    </div>
  )
}

export {
  LibraryCard,
  LibraryCardDate,
  LibraryCardHeader,
  LibraryCardImage,
  LibraryCardTitle,
  LibraryCardTitleLink,
}
