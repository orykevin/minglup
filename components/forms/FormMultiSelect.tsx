"use client";

import MultipleSelector, { Option } from "../ui/multi-select";
import { cn } from "@/lib/utils";
import { useFormContext, useFormState } from "react-hook-form";
import { Label } from "./FormWrapper";
import { useMemo } from "react";
import { MAX_INVITED_PEOPLE } from "@/convex/constant";

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
  addText?: string;
  options: Option[];
  customErrorMessage?: string;
}

type MultipleErrorField = {
  value: {
    message: string;
    type: string;
    ref: undefined | string;
  };
};

export const FormMultiSelect = ({
  label,
  name,
  fieldClassName,
  displayError = true,
  isRequired,
  tooltip,
  addText,
  options,
}: MultiSelectProps) => {
  const { setValue, watch } = useFormContext();
  const { errors } = useFormState({ name });

  const multipleFieldError = useMemo(
    () => errors[name] as unknown as MultipleErrorField[],
    [errors],
  );

  const errorFileds = useMemo(() => {
    if (!multipleFieldError || !multipleFieldError.length) return undefined;
    const index: number[] = [];
    let errorMessage: string = "";
    multipleFieldError.forEach((error, i) => {
      index.push(i + 1);
      errorMessage = `${error.value.message}`;
    });
    return {
      index,
      errorMessage: errorMessage,
    };
  }, [multipleFieldError]);

  const selectedEmail = watch(name);

  return (
    <div className={cn("w-full space-y-2", fieldClassName)}>
      {label && (
        <Label isRequired={isRequired} tooltip={tooltip}>
          {label}
        </Label>
      )}
      <MultipleSelector
        options={options}
        creatable
        emptyIndicator="No email found"
        onChange={(options) => setValue(name, options)}
        value={selectedEmail}
        addText={addText}
        maxSelected={MAX_INVITED_PEOPLE}
      />
      {displayError && errorFileds && errorFileds.index.length > 0 && (
        <p className="text-red-500">
          {" "}
          {errorFileds.errorMessage + ` ${errorFileds.index.join(", ")}`}{" "}
        </p>
      )}
      {errors[name] && displayError && (
        <p className="text-red-500">
          {" "}
          {(errors[name].message as unknown as string | undefined) || ""}{" "}
        </p>
      )}
    </div>
  );
};
