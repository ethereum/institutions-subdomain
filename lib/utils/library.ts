import fs from "fs"
import path from "path"

import matter from "gray-matter"

import { isValidDate } from "./date"

import { locales } from "@/i18n/routing"

export type PostSummary = {
  slug: string
  title: string
  datePublished: string
}

const VALID_LOCALES = locales

const getPostsDir = (locale: string) =>
  path.join(process.cwd(), "public", "posts", locale)

/**
 * Get all library posts for a given locale (falls back to English)
 * This is used by generateStaticParams
 */
export async function getLibraryPosts(
  locale: string = "en"
): Promise<PostSummary[]> {
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

  // If even English doesn't exist, return empty array
  if (!fs.existsSync(targetDir)) {
    return []
  }

  try {
    const files = fs.readdirSync(targetDir)

    const posts = files
      .filter((filename) => filename.endsWith(".md"))
      .map((filename) => {
        const filePath = path.join(targetDir, filename)
        const file = fs.readFileSync(filePath, "utf-8")
        const { data } = matter(file)

        const slug = filename.replace(/\.md$/, "")

        return {
          slug,
          title: data.title || slug,
          datePublished: data.datePublished || "",
        }
      })
      .filter((post) => isValidDate(post.datePublished))
      .sort(
        (a, b) =>
          new Date(b.datePublished).getTime() -
          new Date(a.datePublished).getTime()
      )

    return posts
  } catch (error) {
    console.error(`Error reading posts for locale ${locale}:`, error)
    return []
  }
}
