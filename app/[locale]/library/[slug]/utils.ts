import fs from "fs"
import path from "path"

import matter from "gray-matter"

import { formatDateMonthDayYear, isValidDate } from "@/lib/utils/date"

import { POSTS_DIR, VALID_LOCALES } from "./constants"
import type { FrontMatter, PostSummary } from "./types"

const guardValidFrontMatterDate = (frontmatter: FrontMatter, slug: string) => {
  if (!isValidDate(frontmatter.datePublished))
    throw new Error(
      `Invalid datePublished in frontmatter for post: ${slug} - ${
        !!frontmatter.datePublished
          ? "format not recognized: " + frontmatter.datePublished
          : "datePublished front matter field is required"
      }`
    )
}

/**
 * Fetch all posts for a given locale with fallback to English.
 * Reads slug directories under public/posts/, then resolves
 * {slug}/{locale}.md with fallback to {slug}/en.md.
 */
export const fetchPosts = (locale: string = "en"): PostSummary[] => {
  if (!VALID_LOCALES.includes(locale as (typeof VALID_LOCALES)[number])) {
    throw new Error(`Invalid locale: ${locale}`)
  }

  try {
    const slugDirs = fs
      .readdirSync(POSTS_DIR)
      .filter((entry) => fs.statSync(path.join(POSTS_DIR, entry)).isDirectory())

    const posts = slugDirs
      .map((slug) => {
        // Try locale-specific, fallback to English
        let filePath = path.join(POSTS_DIR, slug, `${locale}.md`)
        if (!fs.existsSync(filePath)) {
          filePath = path.join(POSTS_DIR, slug, "en.md")
        }
        if (!fs.existsSync(filePath)) return null

        const file = fs.readFileSync(filePath, "utf-8")
        const { data } = matter(file)
        const frontmatter = data as FrontMatter

        guardValidFrontMatterDate(frontmatter, filePath)

        return { frontmatter, slug } as PostSummary
      })
      .filter((post): post is PostSummary => post !== null)
      .sort(
        (a, b) =>
          new Date(b.frontmatter.datePublished).getTime() -
          new Date(a.frontmatter.datePublished).getTime()
      )

    return posts
  } catch {
    return []
  }
}

/**
 * Get a single post by slug for a given locale with fallback to English.
 * Reads public/posts/{slug}/{locale}.md, falling back to en.md.
 */
export const getPost = (slug: string, locale: string = "en") => {
  if (!VALID_LOCALES.includes(locale as (typeof VALID_LOCALES)[number])) {
    throw new Error(`Invalid locale: ${locale}`)
  }

  // Try locale-specific path first, then fall back to English
  let filePath = path.join(POSTS_DIR, slug, `${locale}.md`)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(POSTS_DIR, slug, "en.md")
  }

  const file = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(file)

  guardValidFrontMatterDate(data as FrontMatter, filePath)

  return { frontmatter: data, content } as {
    frontmatter: FrontMatter
    content: string
  }
}

export const getPostImage = (
  { image, title, datePublished }: FrontMatter,
  locale: string = "en"
): string => {
  if (image) return image

  const date = isValidDate(datePublished)
    ? formatDateMonthDayYear(locale, datePublished)
    : datePublished

  return `/library/og/?title=${encodeURIComponent(title)}&date=${encodeURIComponent(date)}`
}
