"use client";

import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { Label } from "./FormWrapper";

interface InputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  type?: string;
  name: string;
  className?: string;
  fieldClassName?: string;
  displayError?: boolean;
  isRequired?: boolean;
  tooltip?: string;
  heightSize?: "sm" | "md" | "lg" | "xl";
}

export const TextareaFormInput = ({
  label,
  name,
  className,
  fieldClassName,
  displayError = true,
  isRequired,
  tooltip,
  ...props
}: InputProps) => {
  const { register, control } = useFormContext();
  const { error, isTouched } = control.getFieldState(name);

  return (
    <div className={cn("w-full space-y-2", fieldClassName)}>
      {label && (
        <Label isRequired={isRequired} tooltip={tooltip}>
          {label}
        </Label>
      )}
      <Textarea
        {...register(name)}
        className={cn("placeholder:text-primary-foreground/25", className)}
        {...props}
      />
      {isTouched && error && displayError && (
        <p className="text-red-500"> {error.message} </p>
      )}
    </div>
  );
};
