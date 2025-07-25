"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EmptyPlaceholder from "@/components/empty-placeholder";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { MinggleCard } from "@/components/minggle-card";

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
            <p>Loading ...</p>
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
