"use client"

import { Fragment, useRef, useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link, { LinkProps } from "@/components/ui/link"
import { PersistentPanel } from "@/components/ui/persistent-panel"

type MobileNavProps = {
  topNavLinks: LinkProps[]
  useCaseLinks: LinkProps[]
  navLinks: LinkProps[]
  menuLabel: string
  useCasesLabel: string
}

const MobileNav = ({
  topNavLinks,
  useCaseLinks,
  navLinks,
  menuLabel,
  useCasesLabel,
}: MobileNavProps) => {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <>
      {/* Menu trigger button */}
      <Button
        ref={triggerRef}
        variant="ghost"
        className="group-has-[.css-primary-invert]/body:text-primary-foreground hover:group-has-[.css-primary-invert]/body:text-primary-foreground/70 text-lg font-medium md:hidden"
        onClick={() => setOpen(true)}
      >
        {menuLabel}
      </Button>

      {/* Panel with navigation */}
      <PersistentPanel
        open={open}
        onOpenChange={setOpen}
        side="right"
        triggerRef={triggerRef}
        aria-label={menuLabel}
        className="!w-sm max-w-screen"
      >
        {/* Header with close button */}
        <div className="flex items-start justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            className="ms-auto"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-10" />
          </Button>
        </div>

        {/* Navigation links */}
        <nav className="[&_hr]:border-chart-2 flex flex-col gap-y-6 overflow-y-auto p-10 pb-26">
          {topNavLinks.map((props, idx) => (
            <Fragment key={`top-${idx}`}>
              <Link
                className="text-primary-foreground hover:text-primary-foreground/70 block text-2xl font-medium tracking-[0.03rem]"
                onClick={handleLinkClick}
                {...props}
              />
              <hr className="last:hidden" />
            </Fragment>
          ))}
          <p className="text-chart-2">{useCasesLabel}</p>
          {useCaseLinks.map((props, idx) => (
            <Fragment key={`uc-${idx}`}>
              <Link
                className="text-primary-foreground hover:text-primary-foreground/70 block text-2xl font-medium tracking-[0.03rem]"
                onClick={handleLinkClick}
                {...props}
              />
              <hr className="last:hidden" />
            </Fragment>
          ))}
          {navLinks.map((props, idx) => (
            <Fragment key={`nav-${idx}`}>
              <Link
                className="text-primary-foreground hover:text-primary-foreground/70 block text-2xl font-medium tracking-[0.03rem]"
                onClick={handleLinkClick}
                {...props}
              />
              <hr className="last:hidden" />
            </Fragment>
          ))}
        </nav>
      </PersistentPanel>
    </>
  )
}

export default MobileNav
