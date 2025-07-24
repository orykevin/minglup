"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EmptyPlaceholder from "@/components/empty-placeholder";

export default function Home() {
  const router = useRouter();

  const onClickCreate = () => {
    router.push("/create-new");
  };

  return (
    <div className="flex flex-col">
      <div className="w-full h-full">
        <div className="flex justify-between">
          <h4 className="text-2xl font-semibold">Your active minggle</h4>
          <Button size="icon">
            <Plus strokeWidth={3} />
          </Button>
        </div>
        <div>
          <EmptyPlaceholder
            className="mt-20"
            title="No Minggle yet"
            subtitle="Create a new minggle"
            buttonText="Create a minggle"
            imageSrc="/wave.png"
            clickAction={onClickCreate}
          />
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
