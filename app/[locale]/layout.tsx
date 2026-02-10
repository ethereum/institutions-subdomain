import localFont from "next/font/local"
import { notFound } from "next/navigation"
import type { Metadata } from "next/types"
import { NextIntlClientProvider } from "next-intl"
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server"

import EnterpriseContactForm from "@/components/ContactForm"
import DigitalAssetsDropdown from "@/components/DigitalAssetsDropdown"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import MobileNav from "@/components/MobileNav"
import EthereumOrgLogo from "@/components/svg/ethereum-org-logo"
import Farcaster from "@/components/svg/farcaster"
import LinkedIn from "@/components/svg/linked-in"
import Twitter from "@/components/svg/twitter"
import Link, { LinkProps } from "@/components/ui/link"

import { cn } from "@/lib/utils"

import { DA_NAV_ITEMS, NAV_ITEMS } from "@/lib/constants"

import "../globals.css"

import { routing } from "@/i18n/routing"

const satoshi = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
})

const SOCIAL_LINKS: LinkProps[] = [
  {
    href: "https://www.linkedin.com/company/ethereum/posts/",
    children: <LinkedIn />,
    "aria-label": "LinkedIn",
  },
  {
    href: "https://x.com/ethereum",
    children: <Twitter />,
    "aria-label": "Twitter/X",
  },
  {
    href: "https://farcaster.xyz/ethereum",
    children: <Farcaster />,
    "aria-label": "Farcaster",
  },
]

// External links are built inside the component using translations

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params

  // Ensure the locale is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Get messages for the locale
  const messages = await getMessages()
  const t = await getTranslations("common")
  const tNav = await getTranslations("nav")
  const tFooter = await getTranslations("footer")
  const tLayout = await getTranslations("layout")

  // Build navigation links with translations
  const daNavLinks: LinkProps[] = DA_NAV_ITEMS.map((item) => ({
    href: item.href,
    children: tNav(item.translationKey),
  }))

  const navLinks: LinkProps[] = NAV_ITEMS.map((item) => ({
    href: item.href,
    children: tNav(item.translationKey),
  }))

  return (
    <html lang={locale}>
      <body
        className={cn(
          satoshi.className,
          "grid min-h-screen grid-rows-[auto_1fr_auto] items-center justify-items-center",
          "group/body antialiased"
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <header className="group-has-[.css-primary-invert]/body:bg-primary w-full max-w-screen">
            <div className="max-w-8xl mx-auto flex justify-between p-4 pb-10 sm:p-10">
              <Link
                href="/"
                aria-label={tLayout("goHome")}
                className="group/link inline-flex items-center gap-x-2.5"
              >
                <EthereumOrgLogo
                  aria-label="ethereum.org ETH glyph"
                  className="group-hover/link:stroke-secondary-foreground group-hover/link:stroke-[0.25]"
                />
                <span className="group-has-[.css-primary-invert]/body:text-primary-foreground text-//foreground group-hover/link:group-has-[.css-primary-invert]/body:text-primary-foreground/80 text-lg font-medium tracking-[0.045rem]">
                  {t("institutions")}
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <nav className="flex items-center gap-4 max-md:hidden">
                  <DigitalAssetsDropdown
                    label={tNav("digitalAssets")}
                    links={daNavLinks}
                  />

                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="css-primary-conditional"
                    >
                      {link.children}
                    </Link>
                  ))}
                </nav>
                <LanguageSwitcher />
                {/* <LanguageSwitcher className="text-primary-foreground text-xl" /> */}
                <MobileNav
                  daNavLinks={daNavLinks}
                  navLinks={navLinks}
                  menuLabel={t("menu")}
                  digitalAssetsLabel={tNav("digitalAssets")}
                />
              </div>
            </div>
          </header>
          {children}
          <footer className="row-start-3">
            <div className="bg-primary text-primary-foreground w-screen px-4 py-20 sm:px-10">
              <div className="mx-auto grid max-w-3xl grid-cols-1 gap-10 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-h4">{t("getInTouch")}</h3>
                  <p>{t("getInTouchDescription")}</p>
                </div>
                <EnterpriseContactForm />
              </div>
            </div>
            <div className="max-w-8xl mx-auto space-y-14 px-12 py-10 sm:space-y-9 xl:space-y-28">
              <div className="flex justify-between gap-x-4 gap-y-10 max-sm:flex-col max-sm:items-center">
                <div className="flex items-center gap-4 sm:gap-6">
                  {SOCIAL_LINKS.map((props) => (
                    <Link key={props.href} {...props} />
                  ))}
                </div>
                <nav className="*:text-muted-foreground *:hover:text-foreground flex items-center gap-x-6 gap-y-1.5 text-nowrap *:block *:text-sm *:tracking-[0.0175rem] max-xl:flex-col sm:ms-auto sm:max-xl:items-end">
                  {[...daNavLinks, ...navLinks].map((props) => (
                    <Link key={props.href} {...props} />
                  ))}
                </nav>
              </div>
              <div className="text-muted-foreground space-y-3 text-xs font-medium *:tracking-[0.0175rem]">
                <nav className="mx-auto flex justify-center gap-4 max-sm:flex-col max-sm:items-center">
                  {[
                    {
                      href: "https://ethereum.org/privacy-policy/",
                      children: tFooter("privacyPolicy"),
                    },
                    {
                      href: "https://ethereum.org/terms-of-use/",
                      children: tFooter("termsOfUse"),
                    },
                    {
                      href: "https://ethereum.org/cookie-policy/",
                      children: tFooter("cookiePolicy"),
                    },
                    {
                      href: "https://ethereum.foundation/",
                      children: tFooter("ethereumFoundation"),
                    },
                    {
                      href: "https://ethereum.org/",
                      children: tFooter("ethereumOrg"),
                    },
                  ].map((props) => (
                    <Link
                      key={props.href}
                      className="text-muted-foreground hover:text-foreground group block"
                      showDecorator
                      {...props}
                    />
                  ))}
                </nav>
                <div className="text-center">
                  © {new Date().getFullYear()} {tFooter("copyright")}
                </div>
              </div>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "layout" })

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  }
}
