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
  const [openFrom, setOpenFrom] = React.useState(false);
  const [openTo, setOpenTo] = React.useState(false);
  const [dateFrom, setDateFrom] = React.useState<Date>(new Date());
  const [timeFrom, setTimeFrom] = React.useState<string>("00:00");
  const [dateTo, setDateTo] = React.useState<Date>(new Date());
  const [timeTo, setTimeTo] = React.useState<string>("00:00");

  useEffect(() => {
    if (dateFrom) {
      const [hours, minutes] = timeFrom.split(":").map(Number);
      const updatedHours = dateFrom.setHours(hours, minutes, 0, 0);
      const newDate = new Date(updatedHours);
      setValue("dateFrom", newDate);
      if (dateFrom > dateTo) {
        setDateTo(dateFrom);
      }
    }
  }, [dateFrom, dateTo, timeFrom, control]);

  useEffect(() => {
    if (dateTo) {
      const [hours, minutes] = timeTo.split(":").map(Number);
      const updatedHours = dateTo.setHours(hours, minutes, 0, 0);
      const newDate = new Date(updatedHours);
      setValue("dateTo", newDate);
    }
  }, [dateTo, timeTo, control]);

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
      <div className="flex gap-3 items-end">
        <div className="flex-2 flex flex-col gap-2">
          <Label isRequired>From</Label>
          <Popover open={openFrom} onOpenChange={setOpenFrom}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="w-full justify-between font-normal active:scale-100"
              >
                {dateFrom
                  ? dayjs(dateFrom).format("dddd DD MMMM YYYY")
                  : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateFrom}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDateFrom(date || new Date());
                  setOpenFrom(false);
                }}
                disabled={{ before: new Date() }}
                fromYear={new Date().getFullYear()}
                toYear={new Date().getFullYear() + 10}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <Input
            type="time"
            id="time-picker"
            step="60"
            defaultValue="00:00"
            value={timeFrom}
            onChange={(e) => {
              setTimeFrom(e.target.value);
            }}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
      <div className="flex gap-3 items-end">
        <div className="flex-2 flex flex-col gap-2">
          <Label isRequired>To</Label>
          <Popover open={openTo} onOpenChange={setOpenTo}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="w-full justify-between font-normal active:scale-100"
              >
                {dateTo
                  ? dayjs(dateTo).format("dddd DD MMMM YYYY")
                  : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateTo}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDateTo(date || new Date());
                  setOpenTo(false);
                }}
                disabled={{ before: dateFrom }}
                fromYear={new Date(dateFrom).getFullYear()}
                toYear={new Date(dateFrom).getFullYear() + 10}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <Input
            type="time"
            id="time-picker"
            step="60"
            defaultValue="00:00"
            value={timeTo}
            onChange={(e) => {
              setTimeTo(e.target.value);
            }}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
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
  );
}
