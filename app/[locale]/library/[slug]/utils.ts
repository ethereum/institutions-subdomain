import fs from "fs"
import path from "path"

import matter from "gray-matter"

import { formatDateMonthDayYear, isValidDate } from "@/lib/utils/date"

import { getPostsDir,VALID_LOCALES } from "./constants"
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

export const getSlug = (filePath: string) =>
  filePath.replace(/^\/public|\.md$/g, "")

/**
 * Fetch all posts for a given locale with fallback to English
 */
export const fetchPosts = (locale: string = "en"): PostSummary[] => {
  // Validate locale
  if (!VALID_LOCALES.includes(locale as (typeof VALID_LOCALES)[number])) {
    throw new Error(`Invalid locale: ${locale}`)
  }

  const postsDir = getPostsDir(locale)
  const englishPostsDir = getPostsDir("en")

  // Check if locale-specific posts directory exists
  let targetDir = postsDir
  if (!fs.existsSync(postsDir)) {
    // Fall back to English
    targetDir = englishPostsDir
  }

  try {
    const postsDirContents = fs.readdirSync(targetDir)

    const posts = postsDirContents
      .filter((filename) => filename.endsWith(".md"))
      .map((filename) => {
        const filePath = path.join(targetDir, filename)
        const file = fs.readFileSync(filePath, "utf-8")
        const { data } = matter(file)
        const frontmatter = data as FrontMatter

        guardValidFrontMatterDate(frontmatter, filePath)

        const slug = getSlug(filename)

        return { frontmatter, slug } as PostSummary
      })
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
 * Get a single post by slug for a given locale with fallback to English
 */
export const getPost = (slug: string, locale: string = "en") => {
  // Validate locale
  if (!VALID_LOCALES.includes(locale as (typeof VALID_LOCALES)[number])) {
    throw new Error(`Invalid locale: ${locale}`)
  }

  const postsDir = getPostsDir(locale)
  const englishPostsDir = getPostsDir("en")

  // Try locale-specific path first, then fall back to English
  let filePath = path.join(postsDir, slug + ".md")
  if (!fs.existsSync(filePath)) {
    filePath = path.join(englishPostsDir, slug + ".md")
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

  return `/library/og/?title=${title}&date=${date}`
}
