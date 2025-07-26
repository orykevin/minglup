"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "rounded-[8px] group toast group-[.toaster]:bg-background group-[.toaster]:!text-primary group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-primary/95",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
