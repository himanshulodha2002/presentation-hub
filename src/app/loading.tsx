"use client";

import { ProjectsGridSkeleton } from "@/components/global/project-card/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar Skeleton */}
      <div className="w-64 border-r p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Upper Info Bar Skeleton */}
        <div className="border-b p-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Content Area Skeleton */}
        <div className="p-4">
          <div className="w-full flex flex-col gap-6 relative md:p-0 p-4">
            <div className="flex flex-col-reverse items-start w-full gap-6 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex flex-col items-start space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>

            <ProjectsGridSkeleton count={8} />
          </div>
        </div>
      </div>
    </div>
  );
}
