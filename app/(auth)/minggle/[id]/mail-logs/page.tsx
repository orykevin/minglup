"use client";

import EmailIcon from "@/components/email-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import { Check, Filter } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_LIST = [
  "delivered",
  "clicked",
  "bounced",
  "failed",
  "sent",
  "cancelled",
  "complained",
  "delivered_delayed",
];
const TYPE_LIST = ["create", "cancel", "edit", "invited", "info", "confirmed"];

export default function MailPage() {
  const params = useParams();
  const router = useRouter();
  const minggleId = params.id as Id<"minggle">;
  const [statusFilter, setStatusFilter] = useState<string[]>(STATUS_LIST);
  const [typeFilter, setTypeFilter] = useState<string[]>(TYPE_LIST);

  const data = useQuery(api.emails.getMinggleEmailLogs, { minggleId });

  if (data === undefined) return <SkeletonMailLogs />;

  if (data === null) {
    router.push("/");
    return <div>Back to home...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Mail Logs</h1>
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter /> Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {STATUS_LIST.map((status) => {
                const isSelected = statusFilter.includes(status);
                return (
                  <DropdownMenuItem
                    key={status}
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      if (isSelected) {
                        setStatusFilter((prev) =>
                          prev.filter((s) => s !== status),
                        );
                      } else {
                        setStatusFilter((prev) => [...prev, status]);
                      }
                    }}
                    className="flex items-center gap-1 capitalize"
                  >
                    <div className="min-w-6">{isSelected && <Check />}</div>
                    {status.split("_").join(" ")}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter /> Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {TYPE_LIST.map((type) => {
                const isSelected = typeFilter.includes(type);
                return (
                  <DropdownMenuItem
                    key={type}
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      if (isSelected) {
                        setTypeFilter((prev) => prev.filter((s) => s !== type));
                      } else {
                        setTypeFilter((prev) => [...prev, type]);
                      }
                    }}
                    className="flex items-center gap-1 capitalize"
                  >
                    <div className="min-w-6">{isSelected && <Check />}</div>
                    {type}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-y-2">
        {data.allLogs
          .filter(
            (mailLog) =>
              statusFilter.includes(mailLog.status) &&
              typeFilter.includes(mailLog.type),
          )
          .map((mailLog) => {
            const status = mailLog.status;
            return (
              <div
                key={mailLog._id}
                className={cn(
                  "flex justify-between items-center py-2 px-4 border rounded-md bg-foreground/15",
                  (status === "delivered" || status === "clicked") &&
                    "bg-green-500/10 dark:bg-green-400/15",
                  (status === "complained" || status === "delivered_delayed") &&
                    "bg-yellow-500/10 dark:bg-yellow-400/15",
                  (status === "failed" ||
                    status === "bounced" ||
                    status === "cancelled") &&
                    "bg-red-500/10 dark:bg-red-400/15",
                )}
              >
                <div>
                  <div className="flex gap-1 items-center">
                    <p className="text-sm font-bold" key={mailLog._id}>
                      {dayjs(mailLog._creationTime).format(
                        "YYYY-MM-DD [at] HH:mm",
                      )}
                      {" - "}
                    </p>
                    <Badge className="text-xs h-4.5" variant="secondary">
                      {mailLog.type}
                      {mailLog.type === "edit" && mailLog.minggleRef
                        ? ` #${mailLog.minggleRef}`
                        : ""}
                    </Badge>
                  </div>
                  <p className="font-semibold text-foreground/80">
                    {mailLog.email}
                  </p>
                </div>
                <EmailIcon status={mailLog?.status || "sent"} />
              </div>
            );
          })}
      </div>
    </div>
  );
}

const SkeletonMailLogs = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-32 h-8" />
        <div className="flex gap-1">
          <Skeleton className="w-24 h-8" />
          <Skeleton className="w-24 h-8" />
        </div>
      </div>
      <div className="space-y-2">
        {[...new Array(8)].map((_, i) => (
          <Skeleton key={i} className="w-full h-14" />
        ))}
      </div>
    </div>
  );
};
