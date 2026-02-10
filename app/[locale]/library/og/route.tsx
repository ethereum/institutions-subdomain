import { ImageResponse } from "next/og"

import { DEFAULT_OG_IMAGE, SITE_ORIGIN } from "@/lib/constants"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title")
  const date = searchParams.get("date")

  // Load Satoshi font
  const fontResponse = await fetch(
    new URL("/fonts/Satoshi-Bold.ttf", SITE_ORIGIN)
  )
  const fontData = await fontResponse.arrayBuffer()

  const imageResponse = new ImageResponse(
    (
      <div tw="relative w-full h-full flex flex-col justify-center items-center">
        <div tw="absolute inset-0 bg-[#040847]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={new URL(DEFAULT_OG_IMAGE, SITE_ORIGIN).toString()}
          alt=""
          tw="object-cover absolute inset-0 opacity-40"
        />

        <div tw="flex flex-col items-center text-center text-white max-w-full p-16">
          {title && <h1 tw="text-6xl mb-12">{title}</h1>}
          {date && <p tw="text-4xl">{date}</p>}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Satoshi",
          data: fontData,
          style: "normal",
        },
      ],
    }
  )

  // Set cache headers to prevent stale content
  const response = new Response(imageResponse.body, {
    headers: {
      ...imageResponse.headers,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  })

  return response
}
