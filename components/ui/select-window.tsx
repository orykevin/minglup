import React, { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";
import { FixedSizeList } from "react-window";

type SelectWindowType = {
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  placeholder: string;
  className?: string;
  defaultValue?: string;
};

export const SelectWindow = ({
  options,
  placeholder = "Select an option",
  onChange,
  className,
  onOpenChange,
  defaultValue,
}: SelectWindowType) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(defaultValue || "");
  const selectedOptions = useMemo(() => {
    return options.find((options) => options.value === selectedValue);
  }, [selectedValue]);

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <Select
      onValueChange={handleSelectChange}
      onOpenChange={(open) => {
        onOpenChange?.(open);
        setIsOpen(open);
      }}
      defaultValue={defaultValue}
    >
      <SelectTrigger className={className}>
        <span>{selectedOptions?.label || placeholder}</span>
      </SelectTrigger>
      {isOpen && (
        <SelectContent>
          <FixedSizeList
            width={"100%"}
            height={400}
            itemCount={options.length}
            itemSize={48}
          >
            {({ index, style }) => (
              <SelectItem
                key={index}
                style={style}
                value={options[index].value}
              >
                {options[index].label}
              </SelectItem>
            )}
          </FixedSizeList>
        </SelectContent>
      )}
    </Select>
  );
};
