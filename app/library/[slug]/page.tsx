import type { Metadata } from "next"
import { notFound } from "next/navigation"

import Hero from "@/components/Hero"
import MarkdownProvider from "@/components/ui/markdown/provider"

import { formatDateMonthDayYear } from "@/lib/utils/date"
import { getMetadata } from "@/lib/utils/metadata"

import { FrontMatter } from "./types"
import { getPost, getPostImage } from "./utils"

// TODO: Re-enable when posts available
// export async function generateStaticParams() {
//   const allPosts = fetchPosts()
//   return allPosts.map(({ slug }) => ({ slug }))
// }

type Props = { params: Promise<{ slug: string }> }

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

      <article className="max-w-8xl mx-auto mb-24 w-full px-4 sm:px-10">
        <div className="max-w-prose">
          <MarkdownProvider>{content}</MarkdownProvider>
        </div>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const { frontmatter } = getPost(slug)
    const { title, datePublished } = frontmatter

    return getMetadata({
      slug: ["library", slug],
      title,
      description: formatDateMonthDayYear(datePublished),
      image: getPostImage(frontmatter),
    })
  } catch {
    return getMetadata({
      slug: ["library", slug],
      title: "Ethereum Institutional Resources",
      description: "Oops! Post not found",
    })
  }
}
