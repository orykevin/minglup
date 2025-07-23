"use client";

import { Input } from "../ui/input";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "./FormWrapper";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  name: string;
  fieldClassName?: string;
  displayError?: boolean;
  isRequired?: boolean;
  heightSize?: "sm" | "md" | "lg" | "xl";
  tooltip?: string;
}

export const TextFormInput = ({
  label,
  type = "text",
  name,
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
      <Input {...register(name)} type={type} {...props} />
      {isTouched && error && displayError && (
        <p className="text-red-500"> {error.message} </p>
      )}
    </div>
  );
};
