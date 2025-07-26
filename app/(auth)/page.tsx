"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EmptyPlaceholder from "@/components/empty-placeholder";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { MinggleCard } from "@/components/minggle-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const router = useRouter();
  const activeMinggle = useQuery(api.minggle.getActiveMinggle, {});

  const onClickCreate = () => {
    router.push("/create-new");
  };

  return (
    <div className="flex flex-col">
      <div className="w-full h-full">
        <div className="flex justify-between">
          <h4 className="text-2xl font-semibold">Your active minggle</h4>
          <Button size="icon" onClick={onClickCreate}>
            <Plus strokeWidth={3} />
          </Button>
        </div>
        <div className="space-y-3 mt-4">
          {activeMinggle === undefined ? (
            <div className="space-y-3">
              {[...new Array(3)].map((_, index) => (
                <Skeleton className="w-full h-44" key={index}>
                  <div className="flex gap-2 p-3 items-center">
                    <Skeleton className="w-[100px] h-18 bg-primary/20" />
                    <Skeleton className="w-1/2 h-10 bg-primary/20" />
                  </div>
                  <div className="space-y-2 px-3">
                    <Skeleton className="w-[75%] h-4 bg-primary/20" />
                    <Skeleton className="w-[75%] h-4 bg-primary/20" />
                    <Skeleton className="w-[75%] h-4 bg-primary/20" />
                  </div>
                </Skeleton>
              ))}
            </div>
          ) : activeMinggle.length > 0 ? (
            activeMinggle.map((minggle) => <MinggleCard data={minggle} />)
          ) : (
            <EmptyPlaceholder
              className="mt-20"
              title="No Minggle yet"
              subtitle="Create a new minggle"
              buttonText="Create a minggle"
              imageSrc="/wave.png"
              clickAction={onClickCreate}
            />
          )}
        </div>
      </div>
      {false && (
        <div className="w-full h-full border">
          <div className="flex justify-between">
            <h4>Finished minggle</h4>
            <Button size="icon">
              <Plus />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
