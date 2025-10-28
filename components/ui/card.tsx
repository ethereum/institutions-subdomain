import { type ComponentProps, forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils/index"

import { InlineText } from "./inline-text"

const cardVariants = cva("bg-card text-card-foreground p-6", {
  variants: {
    variant: {
      default: "",
      "flex-height": "flex h-full flex-col justify-between gap-2",
      "flex-column": "flex flex-col gap-y-6",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const Card = ({
  className,
  variant,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof cardVariants>) => (
  <div
    data-slot="card"
    className={cn(cardVariants({ variant }), className)}
    {...props}
  />
)

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-bold", className)}
      {...props}
    />
  )
}

const CardDescription = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="card-description"
    className={cn("text-muted-foreground", className)}
    {...props}
  />
)

function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

const cardContentVariants = cva("", {
  variants: {
    variant: {
      "small-spacing": "space-y-2",
      "flex-1-height-between": "flex flex-1 flex-col justify-between",
    },
  },
  defaultVariants: {
    variant: "small-spacing",
  },
})

const CardContent = ({
  className,
  variant,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof cardContentVariants>) => (
  <div
    data-slot="card-content"
    className={cn(cardContentVariants({ variant }), className)}
    {...props}
  />
)

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

const cardLabelVariants = cva("", {
  variants: {
    variant: {
      default: "text-muted-foreground font-medium",
      large: "!text-h5 text-card-foreground tracking-[0.03rem]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const CardLabel = forwardRef<
  HTMLHeadingElement,
  ComponentProps<"h3"> & { asChild?: boolean } & VariantProps<
      typeof cardLabelVariants
    >
>(({ asChild, className, variant, ...props }, ref) => {
  const Comp = asChild ? Slot : "h3"
  return (
    <Comp
      ref={ref}
      data-slot="card-label"
      className={cn(cardLabelVariants({ variant }), className)}
      {...props}
    />
  )
})
CardLabel.displayName = "CardLabel"

const CardValue = forwardRef<
  HTMLHeadingElement,
  ComponentProps<"p"> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "p"

  return (
    <Comp
      ref={ref}
      data-slot="card-value"
      className={cn("text-big-mobile sm:text-big font-bold", className)}
      {...props}
    />
  )
})
CardValue.displayName = "CardValue"

const CardSmallText = ({ className, ...props }: ComponentProps<"p">) => (
  <p
    data-slot="card-small-text"
    className={cn(
      "text-muted-foreground text-xs font-medium tracking-[0.015rem]",
      className
    )}
    {...props}
  />
)

const CardSource = ({ className, ...props }: ComponentProps<"p">) => (
  <InlineText
    data-label="card-source"
    className={cn(
      "text-muted-foreground [&_a]:text-muted-foreground [&_a]:hover:text-foreground text-xs font-medium tracking-[0.015rem]",
      className
    )}
    {...props}
  />
)

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLabel,
  CardSmallText,
  CardSource,
  CardTitle,
  CardValue,
}
