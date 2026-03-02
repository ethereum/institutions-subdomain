import { defineRouting } from "next-intl/routing";

export const locales = ["en", "zh", "es"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false, // Only change locale when user explicitly selects
  alternateLinks: false, // Handled by getMetadata() alternates.languages
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 31536000, // 1 year
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});
