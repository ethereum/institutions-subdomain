/** @type {import('next-sitemap').IConfig} */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://institutions.ethereum.org"

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  alternateRefs: [
    { href: siteUrl, hreflang: "en" },
    { href: `${siteUrl}/zh`, hreflang: "zh" },
    { href: `${siteUrl}/es`, hreflang: "es" },
    { href: siteUrl, hreflang: "x-default" },
  ],
}
