import type { Metadata } from "next"
import { notFound } from "next/navigation"

import Hero from "@/components/Hero"
import MarkdownProvider from "@/components/ui/markdown/provider"

import { formatDateMonthDayYear, isValidDate } from "@/lib/utils/date"
import { getMetadata } from "@/lib/utils/metadata"

import { FrontMatter } from "./types"
import { fetchPosts, getPost } from "./utils"

export async function generateStaticParams() {
  const allPosts = fetchPosts()
  return allPosts.map(({ slug }) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const {
      frontmatter: { title, image, datePublished },
    } = getPost(slug)

    return getMetadata({
      slug: ["library", slug],
      title,
      description: isValidDate(datePublished)
        ? formatDateMonthDayYear(datePublished)
        : datePublished,
      image: image || "images/og/library.png",
    })
  } catch {
    return getMetadata({
      slug: ["library", slug],
      title: "Ethereum for Institutions",
      description: "Oops! Page not found",
    })
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params

  let frontmatter: FrontMatter | undefined
  let content: string | undefined
  try {
    const post = getPost(slug)
    frontmatter = post.frontmatter
    content = post.content
  } catch {
    return notFound()
  }
  const { title, datePublished } = frontmatter

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading={title} shape="book-open-text-fill">
        <time dateTime={datePublished}>
          {formatDateMonthDayYear(datePublished)}
        </time>
      </Hero>

      <article className="mx-auto mb-24 w-full max-w-5xl px-4 sm:px-10">
        <MarkdownProvider>{content}</MarkdownProvider>
      </article>
    </main>
  )
}
