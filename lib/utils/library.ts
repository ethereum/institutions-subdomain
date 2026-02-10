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
const POSTS_DIR = path.join(process.cwd(), "public", "posts")

/**
 * Get all library posts for a given locale (falls back to English).
 * Reads slug directories under public/posts/, then resolves
 * {slug}/{locale}.md with fallback to {slug}/en.md.
 * This is used by generateStaticParams.
 */
export async function getLibraryPosts(
  locale: string = "en"
): Promise<PostSummary[]> {
  // Validate locale
  if (!VALID_LOCALES.includes(locale as (typeof VALID_LOCALES)[number])) {
    throw new Error(`Invalid locale: ${locale}`)
  }

  // If posts directory doesn't exist, return empty array
  if (!fs.existsSync(POSTS_DIR)) {
    return []
  }

  try {
    const slugDirs = fs
      .readdirSync(POSTS_DIR)
      .filter((entry) =>
        fs.statSync(path.join(POSTS_DIR, entry)).isDirectory()
      )

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

        return {
          slug,
          title: data.title || slug,
          datePublished: data.datePublished || "",
        }
      })
      .filter((post): post is PostSummary => post !== null)
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
