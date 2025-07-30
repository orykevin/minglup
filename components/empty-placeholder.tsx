import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const EmptyPlaceholder = ({
  title,
  subtitle,
  buttonText,
  clickAction,
  imageSrc,
  className,
  buttonProps,
}: {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  buttonText: string;
  imageSrc?: string;
  clickAction: () => void;
  className?: string;
  buttonProps?: React.ComponentProps<typeof Button>;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 items-center text-center px-3",
        className,
      )}
    >
      <div>
        <h4 className="text-2xl font-bold">{title}</h4>
        <h6 className="text-base font-semibold text-foreground/75">
          {subtitle}
        </h6>
      </div>
      <div className="max-w-[400px]">
        {imageSrc && <img src={imageSrc} className="mt-3 " />}
        <Button
          onClick={clickAction}
          className="h-10 text-lg font-semibold w-full"
          {...buttonProps}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default EmptyPlaceholder;
