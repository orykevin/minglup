"use client";

import { FormWrapper } from "@/components/forms/FormWrapper";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TextFormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { TextareaFormInput } from "@/components/forms/FormTextareaInput";
import { FormMultiSelect } from "@/components/forms/FormMultiSelect";
import SearchableMap from "@/components/maps/searchable-map";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Option } from "@/components/ui/multi-select";
import { FormDateTimeInput } from "@/components/forms/FormDateTimeInput";
import { MapPin, X } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { timezoneList } from "@/lib/timezones";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex-helpers/react/cache";
import { Id } from "@/convex/_generated/dataModel";
import { setRawDate } from "@/lib/utils";

dayjs.extend(utc);
dayjs.extend(timezone);

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  address: z.string().min(1, "Address is required"),
  latlong: z.array(z.number()),
  dateTo: z.date(),
  dateFrom: z.date(),
  timezone: z.string(),
  emails: z
    .array(z.object({ value: z.email("Invalid email"), label: z.string() }))
    .min(1, "At least one email is required"),
});

export default function EditMingglePage() {
  const params = useParams();
  const data = useQuery(api.minggle.getMinggle, {
    minggleId: params.id as Id<"minggle">,
  });
  const forms = useForm({
    defaultValues: {
      title: "",
      description: "",
      address: "",
      dateFrom: new Date(),
      dateTo: new Date(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      latlong: [],
      emails: [],
    },
    resolver: zodResolver(formSchema),
  });
  const [openDialogMap, setOpenDialogMap] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const onSubmitHandler = () => {
    setOpenConfirmation(true);
  };

  const setAddressFromMap = (address: string, latlong: number[]) => {
    forms.setValue("address", address);
    forms.setValue("latlong", latlong);
    setOpenDialogMap(false);
  };

  const addressValue = forms.watch("address");
  const latlongValue = forms.watch("latlong");

  const emailLists = useQuery(api.emailLists.getEmailLists);

  useEffect(() => {
    if (data) {
      const timzonedFrom = dayjs.utc(data.dateFrom).tz(data.timezone);
      const timzonedTo = dayjs.utc(data.dateTo).tz(data.timezone);

      forms.setValue("title", data.title);
      forms.setValue("description", data?.description || "");
      forms.setValue("address", data.address);
      forms.setValue("latlong", data.latlong);
      forms.setValue("dateFrom", timzonedFrom.toDate());
      forms.setValue("dateTo", timzonedTo.toDate());
      forms.setValue("timezone", data.timezone);
      forms.setValue(
        "emails",
        data.emails.map((email) => ({
          value: email,
          label: email,
          fixed: true,
        })),
      );
    }
  }, [data]);

  if (!data) return <div>Loading ...</div>;

  return (
    <div>
      <h1 className="text-2xl my-3 font-bold">Edit minggle</h1>
      <FormWrapper
        forms={forms}
        onSubmitHandler={onSubmitHandler}
        className="space-y-3"
      >
        <TextFormInput name="title" label="Title" isRequired />
        <TextareaFormInput name="description" label="Description" />
        <div className="relative">
          <TextFormInput name="address" label="Address" isRequired />
          {latlongValue.length > 0 ? (
            <span
              onClick={() => forms.setValue("latlong", [])}
              className="absolute flex items-center gap-1 top-0 right-0 cursor-pointer hover:text-red-500"
            >
              delete pointed pin
              <X size={18} />
            </span>
          ) : (
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
          )}
        </div>
        <FormDateTimeInput
          defaultFrom={setRawDate(data.dateFrom)}
          defaultTo={setRawDate(data.dateTo)}
          defaultTimezone={data.timezone}
        />
        <FormMultiSelect
          name="emails"
          label="Emails"
          addText="Add email"
          options={
            emailLists
              ? emailLists.emails.map((email) => ({
                  value: email,
                  label: email,
                }))
              : []
          }
          isRequired
        />
        <Button className="w-full">Submit</Button>
      </FormWrapper>
      <Dialog open={openConfirmation} onOpenChange={setOpenConfirmation}>
        <DialogContent>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>
            You will notify all emails, make sure your edit is correct
          </DialogDescription>
          <div>
            <FullInformation {...forms.getValues()} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const FullInformation = (allValue: z.infer<typeof formSchema>) => {
  const router = useRouter();
  const params = useParams();
  const editMinggle = useMutation(api.minggle.editMinggle);

  const timezone = timezoneList.find((timezone) =>
    timezone.utc.some((utc) => utc === allValue.timezone),
  );

  const createMinggleHandler = () => {
    if (!params.id) return;
    try {
      const validateData = formSchema.parse(allValue);
      if (validateData) {
        const dateTimeFrom = dayjs(allValue.dateFrom).format(
          "YYYY-MM-DDTHH:mm:ss",
        );
        const dateTimeTo = dayjs(allValue.dateTo).format("YYYY-MM-DDTHH:mm:ss");
        const timezonedFrom = dayjs.tz(dateTimeFrom, allValue.timezone);
        const timezonedStringFrom = timezonedFrom.format();
        const timezonedTo = dayjs.tz(dateTimeTo, allValue.timezone);
        const timezonedStringTo = timezonedTo.format();
        const payload = {
          ...validateData,
          dateFrom: timezonedStringFrom,
          dateTo: timezonedStringTo,
          emails: validateData.emails.map((email) => email.value),
        };
        editMinggle({ ...payload, minggleId: params.id as Id<"minggle"> }).then(
          (res) => {
            console.log(res);
            router.push(`/minggle/${params.id}`);
          },
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <p className="text-primary/95">Title : </p>
      <p className="font-semibold">{allValue.title}</p>
      <p className="text-primary/95 mt-2">Description :</p>
      <p className="font-semibold">{allValue.description}</p>
      <p className="text-primary/95 mt-2">Address :</p>
      <p className="font-semibold">{allValue.address}</p>
      <p className="text-primary/95 mt-2">From :</p>
      <p className="font-semibold">
        {dayjs(allValue.dateFrom).format("dddd DD MMMM YYYY")}
        {", "}
        {dayjs(allValue.dateFrom).format("HH:mm")}
        {` (UTC ${timezone?.offset && (timezone?.offset || 0) > 0 ? "+" : ""}${timezone?.offset})`}
      </p>
      <p className="text-primary/95 mt-2">To :</p>
      <p className="font-semibold">
        {dayjs(allValue.dateTo).format("dddd DD MMMM YYYY")}
        {", "}
        {dayjs(allValue.dateTo).format("HH:mm")}
        {` (UTC ${timezone?.offset && (timezone?.offset || 0) > 0 ? "+" : ""}${timezone?.offset})`}
      </p>
      <p className="text-primary/95 mt-2">Invited Emails : </p>
      <div>
        {allValue.emails.map((email) => (
          <p className="font-semibold" key={email.value}>
            {email.value}
          </p>
        ))}
      </div>
      <Button className="w-full mt-6" onClick={createMinggleHandler}>
        Confirm
      </Button>
    </div>
  );
};
