import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  try {
    await fetchQuery(
      api.minggle.getMinggle,
      { minggleId: resolvedParams.id as Id<"minggle"> },
      { token: await convexAuthNextjsToken() },
    );
  } catch (e) {
    console.log(e);
    redirect("/");
  }

  return <>{children}</>;
}
