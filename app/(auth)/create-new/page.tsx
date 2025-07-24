"use client";

import { FormWrapper } from "@/components/forms/FormWrapper";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TextFormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { TextareaFormInput } from "@/components/forms/FormTextareaInput";
import { FormMultiSelect } from "@/components/forms/FormMultiSelect";
import SearchableMap from "@/components/maps/searchable-map";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Option } from "@/components/ui/multi-select";
import { FormDateTimeInput } from "@/components/forms/FormDateTimeInput";
import { MapPin } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  address: z.string().min(1, "Address is required"),
  latlong: z.array(z.number()),
  date: z.date(),
  timezone: z.string(),
  emails: z
    .array(z.object({ value: z.email("Invalid email"), label: z.string() }))
    .min(1, "At least one email is required"),
});

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

export default function CreateNewPage() {
  const forms = useForm({
    defaultValues: {
      title: "",
      description: "",
      address: "",
      date: new Date(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      latlong: [],
      emails: [],
    },
    resolver: zodResolver(formSchema),
  });
  const [openDialogMap, setOpenDialogMap] = useState(false);

  const onSubmitHandler = (val: z.infer<typeof formSchema>) => {
    const dateTimeString = dayjs(val.date).format("YYYY-MM-DDTHH:mm:ss");
    const timezoned = dayjs.tz(dateTimeString, val.timezone);
    const timezonedString = timezoned.format();
    const localTime = dayjs(timezonedString).local();

    console.log(timezoned.format(), localTime.format());

    console.log(val);
  };

  const setAddressFromMap = (address: string, latlong: number[]) => {
    forms.setValue("address", address);
    forms.setValue("latlong", latlong);
    setOpenDialogMap(false);
  };

  const addressValue = forms.watch("address");
  const latlongValue = forms.watch("latlong");

  return (
    <div>
      <h1 className="text-2xl my-3 font-bold">Create new minggle</h1>
      <FormWrapper
        forms={forms}
        onSubmitHandler={onSubmitHandler}
        className="space-y-3"
      >
        <TextFormInput name="title" label="Title" isRequired />
        <TextareaFormInput name="description" label="Description" />
        <div className="relative">
          <TextFormInput name="address" label="Address" isRequired />
          <Dialog open={openDialogMap} onOpenChange={setOpenDialogMap}>
            <DialogTrigger className="absolute top-0 right-0 cursor-pointer hover:underline">
              <span className="flex gap-1 items-center">
                select on map <MapPin size={18} />
              </span>
            </DialogTrigger>
            <DialogContent className="p-3 py-3">
              <SearchableMap
                defaultPos={
                  latlongValue.length > 0 ? latlongValue : [-6.2, 106.816666]
                }
                defaultAddress={addressValue || ""}
                setForm={setAddressFromMap}
                onCancel={() => setOpenDialogMap(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <FormDateTimeInput />
        <FormMultiSelect
          name="emails"
          label="Emails"
          addText="Add email"
          options={savedEmail}
          isRequired
        />
        <Button className="w-full mt-6" type="submit" size="lg">
          Submit
        </Button>
      </FormWrapper>
    </div>
  );
}
