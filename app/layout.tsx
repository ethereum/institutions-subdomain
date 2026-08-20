/**
 * Pass-through root layout required for root-level not-found.tsx
 * to render when requests bypass the [locale] middleware matcher
 * (e.g., /unknown.txt matching the file extension exclusion).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
