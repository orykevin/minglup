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
}: {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  buttonText: string;
  imageSrc?: string;
  clickAction: () => void;
  className?: string;
}) => {
  return (
    <div className={cn("text-center px-3", className)}>
      <h4 className="text-2xl font-bold">{title}</h4>
      <h6 className="text-base font-semibold text-foreground/75">{subtitle}</h6>
      <div className="max-w-[400px]">
        {imageSrc && <img src={imageSrc} className="-mb-2 mt-3 " />}
        <Button
          onClick={clickAction}
          className="h-12 text-xl font-semibold w-full"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default EmptyPlaceholder;
