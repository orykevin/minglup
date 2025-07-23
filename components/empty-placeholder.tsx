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
  title: string;
  subtitle: string;
  buttonText: string;
  imageSrc?: string;
  clickAction: () => void;
  className?: string;
}) => {
  return (
    <div className={cn("text-center", className)}>
      <h4 className="text-2xl font-bold">{title}</h4>
      <h6 className="text-base font-semibold text-primary/90">{subtitle}</h6>
      <div>
        {imageSrc && <img src={imageSrc} className="-mb-2 mt-3" />}
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
