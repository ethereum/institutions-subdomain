import type { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

import { routing } from "@/i18n/routing"

const intlMiddleware = createMiddleware(routing)

export function proxy(request: NextRequest) {
  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /static (static files)
  // - /*.* (files with extensions like .ico, .png, etc.)
  matcher: ["/((?!api|_next|_vercel|static|.*\\..*).*)"],
}
