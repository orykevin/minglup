"use client";
import { useParams } from "next/navigation";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function MingglePage() {
  const params = useParams();
  console.log(params);
  const data = useQuery(api.minggle.getMinggle, {
    minggleId: params.id as Id<"minggle">,
  });
  console.log(data);
  return (
    <div>
      <h1>Minggle {params.id}</h1>
      <h1>Minggle {data?.title}</h1>
    </div>
  );
}
