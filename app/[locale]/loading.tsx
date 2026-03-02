import { Loader, LoadingDots } from "@/components/ui/loader"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="text-primary h-[calc(100vh-6rem)] overflow-hidden">
      <div className="max-w-8xl relative mx-auto grid w-screen grid-cols-1 md:h-[520px] md:grid-cols-2">
        {/* Left: heading + subtext skeletons */}
        <div className="z-10 w-full place-self-center p-10">
          <div className="size-full space-y-8">
            {/* h1 skeleton */}
            <Skeleton className="h-12 w-4/5 md:h-16" />
            {/* subtext skeletons */}
            <div className="size-full space-y-3 font-medium">
              <Skeleton className="h-5 w-[90%]" />
              <Skeleton className="h-5 w-[82%]" />
              <Skeleton className="h-5 w-[70%]" />
            </div>
            {/* loading dots below subtext */}
            <LoadingDots className="mt-16 gap-4 [&_[data-dot]]:size-8" />
          </div>
        </div>

        {/* Right: Loader where HeroBg would be */}
        <div className="text-secondary-foreground relative z-0 grid place-items-center">
          <div className="relative h-[16rem] w-full sm:h-[20rem] md:h-full">
            <Loader className="motion-safe:[&_line]:animate-quick-trace motion-safe:[&_path]:animate-write-on-off absolute inset-0 m-auto h-2/3 w-auto opacity-20 md:h-3/5 [&_line]:delay-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
