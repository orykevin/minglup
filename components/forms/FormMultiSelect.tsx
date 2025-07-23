"use client";

import MultipleSelector, { Option } from "../ui/multi-select";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { Label } from "./FormWrapper";

interface MultiSelectProps extends React.InputHTMLAttributes<HTMLDivElement> {
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

export const FormMultiSelect = ({
  label,
  type = "text",
  name,
  className,
  fieldClassName,
  displayError = true,
  isRequired,
  tooltip,
  ...props
}: MultiSelectProps) => {
  const { control, setValue, watch } = useFormContext();
  const { error, isTouched } = control.getFieldState(name);

  const savedEmail: Option[] = [
    {
      value: "kevinory2020@gmail.com",
      label: "kevinory2020@gmail.com",
    },
    {
      value: "kevinaja2020@gmail.com",
      label: "kevinaja2020@gmail.com",
    },
    {
      value: "kevinoryworks@gmail.com",
      label: "kevinoryworks@gmail.com",
    },
  ];

  const selectedEmail = watch(name);

  return (
    <div className={cn("w-full space-y-2", fieldClassName)}>
      {label && (
        <Label isRequired={isRequired} tooltip={tooltip}>
          {label}
        </Label>
      )}
      <MultipleSelector
        options={savedEmail}
        creatable
        emptyIndicator="No email found"
        onChange={(options) => setValue(name, options)}
        value={selectedEmail}
      />
      {isTouched && error && displayError && (
        <p className="text-red-500"> {error.message} </p>
      )}
    </div>
  );
};
