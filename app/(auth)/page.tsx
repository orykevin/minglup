"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EmptyPlaceholder from "@/components/empty-placeholder";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { MinggleCard } from "@/components/minggle-card";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs";
import { Doc } from "@/convex/_generated/dataModel";

export default function Home() {
  const router = useRouter();
  const allMinggle = useQuery(api.minggle.getActiveMinggle, {});
  const allInvitedMinggle = useQuery(api.invitedPeople.getInvitedList, {});

  const activeInvited = allInvitedMinggle?.filter(
    (minggle) =>
      minggle &&
      !minggle.isFinished &&
      !minggle.isCanceled &&
      dayjs().isBefore(dayjs(minggle.dateTo)),
  ) as Doc<"minggle">[] | undefined;

  const pastInvited = allInvitedMinggle?.filter(
    (minggle) =>
      minggle &&
      (minggle.isFinished ||
        minggle.isCanceled ||
        dayjs().isAfter(dayjs(minggle.dateTo))),
  ) as Doc<"minggle">[] | undefined;

  const activeMinggle = allMinggle?.filter(
    (minggle) =>
      !minggle.isFinished &&
      !minggle.isCanceled &&
      dayjs().isBefore(dayjs(minggle.dateTo)),
  );
  const pastMinggle = allMinggle?.filter(
    (minggle) =>
      minggle.isFinished ||
      minggle.isCanceled ||
      dayjs().isAfter(dayjs(minggle.dateTo)),
  );

  const onClickCreate = () => {
    router.push("/create-new");
  };

  return (
    <div className="flex flex-col">
      <div className="w-full h-full">
        <div className="flex justify-between items-center">
          <h4 className="text-xl font-bold">Your active minggle</h4>
          <Button size="icon" onClick={onClickCreate}>
            <Plus strokeWidth={3} />
          </Button>
        </div>
        <div className="space-y-3 mt-4">
          {allMinggle === undefined ? (
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
          ) : allMinggle.length + (activeInvited?.length || 0) > 0 ? (
            <div>
              {
                <div className="space-y-3">
                  {(activeMinggle?.length || 0) + (activeInvited?.length || 0) >
                  0 ? (
                    [
                      ...(activeMinggle ? activeMinggle : []),
                      ...(activeInvited ? activeInvited : []),
                    ]
                      ?.sort((a, b) => b._creationTime - a._creationTime)
                      .map((minggle) => (
                        <MinggleCard key={minggle._id} data={minggle} />
                      ))
                  ) : (
                    <EmptyPlaceholder
                      title="No Minggle yet"
                      subtitle="Create a new minggle"
                      buttonText="Create a minggle"
                      imageSrc="/wave.png"
                      clickAction={onClickCreate}
                    />
                  )}
                </div>
              }
              {((pastMinggle || []).length > 0 ||
                (pastInvited || []).length > 0) && (
                <div className="mt-4 space-y-3">
                  <h4 className="text-xl font-bold mb-4">Your past minggle</h4>
                  {[
                    ...(pastMinggle ? pastMinggle : []),
                    ...(pastInvited ? pastInvited : []),
                  ]
                    ?.sort((a, b) => b._creationTime - a._creationTime)
                    .map((minggle) => (
                      <MinggleCard key={minggle._id} data={minggle} />
                    ))}
                </div>
              )}
            </div>
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
    </div>
  );
}
