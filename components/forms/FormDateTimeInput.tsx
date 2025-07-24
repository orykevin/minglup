"use client";

import React, { useEffect, useMemo } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { timezoneList } from "@/lib/timezones";
import { SelectWindow } from "../ui/select-window";
import dayjs from "dayjs";
import { Label } from "./FormWrapper";
import { useFormContext } from "react-hook-form";

export function FormDateTimeInput() {
  const { control, setValue, getValues } = useFormContext();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date>(new Date());
  const [time, setTime] = React.useState<string>("00:00:00");

  useEffect(() => {
    if (date) {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const updatedHours = date.setHours(hours, minutes, seconds, 0);
      const newDate = new Date(updatedHours);
      setValue("date", newDate);
    }
  }, [date, time, control]);

  const mappedOptions = useMemo(() => {
    const defaultValue = getValues("timezone");
    return timezoneList.map((timezone) => {
      const utcOption =
        timezone.utc.find((utc) => utc === defaultValue) || timezone.utc[0];
      return {
        value: utcOption,
        label: `${timezone.value} (UTC ${timezone.offset > 0 ? "+" : ""}${timezone.offset})`,
      };
    });
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex-2 flex flex-col gap-3">
        <Label isRequired>Date</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-full justify-between font-normal active:scale-100"
            >
              {date ? dayjs(date).format("dddd DD MMMM YYYY") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date || new Date());
                setOpen(false);
              }}
              disabled={{ before: new Date() }}
              fromYear={new Date().getFullYear()}
              toYear={new Date().getFullYear() + 10}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 flex flex-col gap-3">
          <Label isRequired>Time</Label>
          <Input
            type="time"
            id="time-picker"
            step="1"
            defaultValue="00:00:00"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
            }}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
        <div className="flex-2 flex flex-col gap-3">
          <Label isRequired>Timezone</Label>
          <SelectWindow
            options={mappedOptions}
            onChange={(val) => {
              console.log(val);
              setValue("timezone", val);
            }}
            placeholder="Select timezone"
            className="w-full"
            defaultValue={getValues("timezone")}
          />
        </div>
      </div>
    </div>
  );
}
