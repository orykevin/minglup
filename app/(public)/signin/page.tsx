"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/icons/google";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  return (
    <div className="flex flex-col gap-8 w-full max-w-[480px] py-[5vh] mx-auto h-[calc(100vh-24px)] max-h-[1000px] justify-between">
      <h1 className="text-6xl leading-[1] font-semibold">Ready to Minggle?</h1>
      <div className="w-full overflow-hidden">
        <img
          alt="minggle-group"
          src="/minggle-group.png"
          className="object-cover"
        ></img>
      </div>
      <div className="w-full flex flex-col gap-4">
        <p className="text-center text-foreground/50">
          login to create your minggle
        </p>
        <Button
          className="h-12 text-lg font-semibold bg-black dark:bg-white text-background"
          onClick={() => signIn("google").then(() => router.push("/"))}
        >
          <GoogleIcon />
          Login with google
        </Button>
      </div>
    </div>
  );
}
