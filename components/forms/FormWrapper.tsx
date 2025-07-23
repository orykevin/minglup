"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { FormProvider, UseFormReturn } from "react-hook-form";

type Props = {
  onSubmitHandler: (val: any) => void;
  className?: string;
  forms: UseFormReturn<any>;
  children: React.ReactNode;
};

//eslint-disabled-next-line
export const FormWrapper = (props: Props) => {
  const { onSubmitHandler, className, children, forms } = props;
  return (
    <FormProvider {...forms}>
      <form
        onSubmit={forms.handleSubmit(onSubmitHandler)}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export const Label = ({
  children,
  isRequired,
  tooltip,
}: {
  children: React.ReactNode;
  isRequired?: boolean;
  tooltip?: React.ReactNode | string;
}) => {
  return (
    <label className="font-semibold flex gap-1">
      {children}
      {isRequired && <span className="text-red-500">*</span>}
      {tooltip && (
        <Tooltip>
          <TooltipTrigger type="button">
            <Info className="w-3 h-3" strokeWidth={3} />
          </TooltipTrigger>
          <TooltipContent className="w-auto max-w-[360px] border border-primary bg-muted">
            <p className="text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </label>
  );
};
