"use client";

import EmptyPlaceholder from "@/components/empty-placeholder";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/hooks/use-hooks";
import { useConvexMutation } from "@/lib/convex-functions";
import { useQuery } from "convex-helpers/react/cache";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { MIN_HOUR_BEFORE_CONFIRM } from "@/convex/constant";
import LinkButton from "@/components/ui/link-button";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ConfirmationPage() {
  const router = useRouter();
  const params = useParams();
  const userData = useQuery(api.user.getProfile);
  const [isRecentConfirmation, setRecentConfirmation] = React.useState(false);

  const data = useQuery(
    api.minggle.getMinggleOverview,
    userData
      ? {
          invitedId: params.id as Id<"invitedPeople">,
        }
      : "skip",
  );

  const { mutate: confirmInvited, isPending } = useConvexMutation(
    api.invitedPeople.confirmInvitedPeople,
  );

  const handleConfrim = () => {
    confirmInvited(
      {
        invitedId: params.id as Id<"invitedPeople">,
      },
      {
        onSuccess(res) {
          setRecentConfirmation(true);
          toast({
            title: "Success",
            description: res,
            variant: "success",
          });
          router.push(`/minggle/${data?.minggleData._id}`);
        },
        onError(error) {
          toast({
            title: "Error",
            description: error.data || "Something went wrong",
            variant: "destructive",
          });
        },
      },
    );
  };

  const isAvailable = useMemo(() => {
    const dateFromMs = dayjs(data?.minggleData.dateFrom).valueOf();
    const dateToMs = dayjs(data?.minggleData.dateTo).valueOf();
    const now = Date.now();
    const isMinTime =
      dateFromMs - now <= MIN_HOUR_BEFORE_CONFIRM * 60 * 60 * 1000;
    const isMaxTime = dateToMs - now <= 0;
    const isConfirmTime = isMinTime && !isMaxTime;

    return {
      isAvailable: isConfirmTime,
      isMinTime,
      isExpired: isMaxTime,
      isCancelled: data?.minggleData.isCanceled,
      isFinished: data?.minggleData.isFinished,
    };
  }, [data]);

  if (userData === undefined) {
    return (
      <Container>
        <div className="flex gap-2 items-center">
          <Loader2 className="animate-spin" />
          <h1>Loading...</h1>
        </div>
      </Container>
    );
  }

  if (userData === null) {
    return (
      <Container>
        <EmptyPlaceholder
          imageSrc="/restricted.png"
          buttonText="Sign in"
          title="You're not signed in"
          subtitle="You need to be signed in to confirm invitation"
          clickAction={() => router.push("/")}
        />
      </Container>
    );
  }

  if (data && userData && userData._id !== data?.ownerData.id) {
    return (
      <Container>
        <EmptyPlaceholder
          imageSrc="/restricted.png"
          buttonText="Back to Home"
          title="You're not the minggle planner"
          subtitle="Just minggle planner can confirm invitation"
          clickAction={() => router.push("/")}
        />
      </Container>
    );
  }

  if (data && data.invited.confirmedAt && !isRecentConfirmation) {
    return (
      <Container>
        <EmptyPlaceholder
          imageSrc="/confirmed.png"
          buttonText="Back to Minggle"
          title={<div>{data.invited.email} is already confirmed</div>}
          clickAction={() => router.push(`/minggle/${data.minggleData._id}`)}
        />
      </Container>
    );
  }

  return data ? (
    <Container>
      <div className="flex flex-col gap-1">
        <EmptyPlaceholder
          imageSrc={
            !isAvailable.isAvailable ||
            isAvailable.isFinished ||
            isAvailable.isCancelled
              ? "/restricted.png"
              : "/checklist.png"
          }
          buttonText={isPending ? "Confirming..." : "Confirm"}
          title={
            isAvailable.isFinished ? (
              <div>Minggle is finished</div>
            ) : isAvailable.isCancelled ? (
              <div>Minggle is canceled</div>
            ) : !isAvailable.isMinTime ? (
              <div>
                You can start confirming from
                <h4 className="text-lg text-foreground/75">
                  {dayjs(data?.minggleData.dateFrom)
                    .local()
                    .add(-MIN_HOUR_BEFORE_CONFIRM, "hour")
                    .format("DD-MM-YYYY [at] HH:mm")}
                </h4>
              </div>
            ) : isAvailable.isExpired ? (
              <div>Confirmation time is over</div>
            ) : (
              <div>
                Do you want to confirm <br /> {data.invited.email}?
              </div>
            )
          }
          buttonProps={{
            disabled:
              isPending ||
              isAvailable.isCancelled ||
              isAvailable.isFinished ||
              !isAvailable.isAvailable,
          }}
          clickAction={handleConfrim}
        />
        {(isAvailable.isCancelled ||
          isAvailable.isExpired ||
          !isAvailable.isAvailable) && (
          <div className="px-3">
            <LinkButton
              className="mt-3 w-full h-10 text-base"
              href={`/minggle/${data.minggleData._id}`}
            >
              Back to minggle
            </LinkButton>
          </div>
        )}
      </div>
    </Container>
  ) : (
    <Container>
      <div className="flex gap-2 items-center">
        <Loader2 className="animate-spin" />
        <h1>Loading...</h1>
      </div>
    </Container>
  );
}

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-[calc(100vh-64px)] p-3 flex flex-col items-center justify-center">
      {children}
    </main>
  );
};
