"use client";

import EmptyPlaceholder from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react/cache";
import { useParams } from "next/navigation";
import React from "react";

export default function ConfirmationPage() {
  const params = useParams();
  const userData = useQuery(api.user.getProfile);

  const data = useQuery(
    api.minggle.getMinggleOverview,
    userData
      ? {
          invitedId: params.id as Id<"invitedPeople">,
        }
      : "skip",
  );

  if (userData === undefined)
    <Container>
      <h1>Loading...</h1>
    </Container>;

  if (userData === null)
    <Container>
      <h1>You're not signed in</h1>
      <h4>You need to be signed in to confirm invitation</h4>
    </Container>;

  if (data && userData && userData._id !== data?.ownerData.id)
    <Container>
      <h1>You're not the minggle planner</h1>
      <h4>Just minggle planner can confirm invitation</h4>
    </Container>;

  return data ? (
    <Container>
      <div className="flex gap-3">
        <EmptyPlaceholder
          imageSrc="/checklist.png"
          buttonText="Confirm"
          title={
            <div>
              Do you want to confirm <br /> {data.invited.email}
            </div>
          }
          clickAction={() => console.log("Confirmed")}
        />
      </div>
    </Container>
  ) : (
    <Container>
      <h1>Loading...</h1>
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
