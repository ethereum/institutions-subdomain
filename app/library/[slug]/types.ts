export type FrontMatter = {
  title: string
  datePublished: string
  image?: string
}

export type PostSummary = {
  frontmatter: FrontMatter
  slug: string
}
