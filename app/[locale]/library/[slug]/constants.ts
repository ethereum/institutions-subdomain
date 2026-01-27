import { locales } from "@/i18n/routing"

export const PATH_POSTS = "posts"
export const getPostsDir = (locale: string) => `public/${PATH_POSTS}/${locale}`
export const VALID_LOCALES = locales

// Legacy constant for backwards compatibility during migration
export const MD_DIR_POSTS = getPostsDir("en")
