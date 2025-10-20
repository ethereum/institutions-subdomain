/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://institutions.ethereum.org",
  generateRobotsTxt: true,
}
