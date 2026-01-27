import Hero from "@/components/Hero"
import ParentPathLink from "@/components/ParentPathLink"
import { LinkWithArrow } from "@/components/ui/link"

export default function Page() {
  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading="Oops!" shape="eth-glyph">
        Page not found...
      </Hero>

      <div className="mx-auto mb-20 flex flex-col items-center gap-y-2">
        <ParentPathLink className="flex text-xl [&_svg]:-rotate-90" />

        <LinkWithArrow
          href="/"
          className="inline-flex flex-row-reverse gap-[0.75em] text-xl [&_span]:rotate-180"
        >
          Return home
        </LinkWithArrow>
      </div>
    </main>
  )
}
