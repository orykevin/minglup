import React from "react";
import { Button } from "./button";
import Link, { LinkProps } from "next/link";

type LinkButtonProps = LinkProps & {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  children: React.ReactNode;
};

const LinkButton = ({
  variant,
  size,
  className,
  ...props
}: LinkButtonProps) => {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      asChild
    >
      <Link {...props}>{props.children}</Link>
    </Button>
  );
};

export default LinkButton;
