import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl bg-richblack-800" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-richblack-800" />
        <Skeleton className="h-4 w-[200px] bg-richblack-800" />
      </div>
    </div>
  )
}