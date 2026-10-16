import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="w-full bg-black min-h-[calc(100vh-4rem)] text-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2 pt-2 pb-1">
          <Skeleton className="h-9 w-64 bg-zinc-900 rounded-lg" />
          <Skeleton className="h-4 w-48 bg-zinc-900/60 rounded" />
        </div>

        {/* Start Here Skeleton Card */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 sm:p-7 space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-28 bg-zinc-900 rounded" />
            <Skeleton className="h-3.5 w-72 bg-zinc-900/60 rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#0e0e0e] border border-zinc-800/80 rounded-xl p-5 space-y-3"
              >
                <Skeleton className="w-6 h-6 bg-zinc-800 rounded-md" />
                <Skeleton className="h-4 w-36 bg-zinc-800 rounded" />
                <Skeleton className="h-10 w-full bg-zinc-900/50 rounded" />
                <Skeleton className="h-3 w-16 bg-blue-900/30 rounded mt-4" />
              </div>
            ))}
          </div>
        </div>

        {/* 4 Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-5 space-y-3"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-16 bg-zinc-900 rounded" />
                <Skeleton className="w-4 h-4 bg-zinc-900 rounded-full" />
              </div>
              <Skeleton className="h-8 w-20 bg-zinc-800 rounded my-2" />
              <Skeleton className="h-3 w-24 bg-zinc-900/60 rounded" />
            </div>
          ))}
        </div>

        {/* Ecosystem Skeleton */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 sm:p-7 space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-44 bg-zinc-900 rounded" />
            <Skeleton className="h-3.5 w-96 bg-zinc-900/60 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#0e0e0e] border border-zinc-800/80 rounded-xl p-5 space-y-3"
              >
                <Skeleton className="w-8 h-8 bg-zinc-800 rounded-lg" />
                <Skeleton className="h-4 w-32 bg-zinc-800 rounded" />
                <Skeleton className="h-10 w-full bg-zinc-900/50 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
