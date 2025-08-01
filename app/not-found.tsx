"use client";

import EmptyPlaceholder from "@/components/empty-placeholder";
import { redirect } from "next/navigation";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <EmptyPlaceholder
        title="Page not found"
        subtitle="The page you are looking for does not exist."
        imageSrc="/404.png"
        buttonText="Go Back"
        clickAction={() => redirect("/")}
      />
    </div>
  );
}
