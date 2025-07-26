"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery as useQueryCache } from "convex-helpers/react/cache";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export const HeaderAuth = () => {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  const userData = useQueryCache(api.user.getProfile);
  return (
    <header className="bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
      <h4 onClick={() => router.push("/")}>MinglUp</h4>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {userData === undefined ? (
                <Skeleton className="w-full h-6" />
              ) : (
                (userData?.name ?? "")
              )}
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => signOut().then(() => router.push("/"))}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="animate-pulse bg-slate-200 dark:bg-slate-800 text-foreground rounded-full w-10 h-10" />
      )}
    </header>
  );
};
