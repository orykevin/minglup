import { api } from "@/convex/_generated/api";
import { HeaderAuth } from "./_components/header";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPreference = await fetchQuery(
    api.user.getProfile,
    {},
    { token: await convexAuthNextjsToken() },
  );

  if (!userPreference) {
    return redirect("/signin");
  }

  return (
    <>
      <HeaderAuth />
      <main className="p-3 max-w-5xl mx-auto">{children}</main>
    </>
  );
}
