"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { itemVariants } from "@/lib/constants";
import { motion } from "framer-motion";

export const ProjectCardSkeleton = () => {
  return (
    <motion.div
      variants={itemVariants}
      className="group w-full flex flex-col gap-y-3 rounded-xl p-3"
    >
      <Skeleton className="relative aspect-[16/10] overflow-hidden rounded-lg" />
      <div className="w-full space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex w-full justify-between items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectsGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
};
