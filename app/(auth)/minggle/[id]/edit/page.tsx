"use client";

import { FormWrapper } from "@/components/forms/FormWrapper";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TextFormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { TextareaFormInput } from "@/components/forms/FormTextareaInput";
import SearchableMap from "@/components/maps/searchable-map";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { FormDateTimeInput } from "@/components/forms/FormDateTimeInput";
import { MapPin, X } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { timezoneList } from "@/lib/timezones";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex-helpers/react/cache";
import { Id } from "@/convex/_generated/dataModel";
import { setRawDate } from "@/lib/utils";
import { useConvexMutation } from "@/lib/convex-functions";
import { toast } from "@/hooks/use-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_EDIT_COUNT } from "@/convex/constant";
import LinkButton from "@/components/ui/link-button";

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

  // const emailLists = useQuery(api.emailLists.getEmailLists);

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
    }
  }, [data, forms]);

  const editInfo = useMemo(() => {
    return {
      editRemaining: MAX_EDIT_COUNT - (data?.editCount || 0),
      cantEdit: (data?.editCount || 0) >= MAX_EDIT_COUNT,
    };
  }, [data]);

  if (!data) return <SkeletonForm />;

  return (
    <div>
      <h1 className="text-2xl my-3 font-bold">
        Edit minggle{" "}
        <span className="text-sm font-semibold">{`(${editInfo.editRemaining} ${editInfo.editRemaining > 1 ? "edits" : "edit"} left)`}</span>
      </h1>
      <FormWrapper
        forms={forms}
        onSubmitHandler={onSubmitHandler}
        className="space-y-3"
      >
        <TextFormInput name="title" label="Title" isRequired max={100} />
        <TextareaFormInput name="description" label="Description" max={1000} />
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
        <div className="flex gap-3 mt-4">
          <LinkButton
            variant="outline"
            className="flex-1"
            href={`/minggle/${params.id}`}
          >
            Cancel
          </LinkButton>
          <Button
            className="flex-1"
            disabled={(data.editCount || 0) >= MAX_EDIT_COUNT}
          >
            Submit
          </Button>
        </div>
      </FormWrapper>
      <Dialog open={openConfirmation} onOpenChange={setOpenConfirmation}>
        <DialogContent>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>
            <span className="text-red-500/75">
              {" "}
              {editInfo.editRemaining === 1
                ? "This is your last edit"
                : "You have " + editInfo.editRemaining + " edits left"}
            </span>
            <br />
            You will notify all emails, make sure your edit is correct
          </DialogDescription>
          <div>
            <FullInformation
              allValue={{ ...forms.getValues() }}
              editInfo={editInfo}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const FullInformation = ({
  allValue,
  editInfo,
}: {
  allValue: Omit<z.infer<typeof formSchema>, "emails">;
  editInfo: { editRemaining: number; cantEdit: boolean };
}) => {
  const router = useRouter();
  const params = useParams();
  const { mutate: editMinggle, isPending } = useConvexMutation(
    api.minggle.editMinggle,
  );

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
        };
        editMinggle(
          { ...payload, minggleId: params.id as Id<"minggle"> },
          {
            onSuccess: () => {
              toast({
                title: "Success",
                description: "Minggle edited successfully",
                variant: "success",
              });
              router.push(`/minggle/${params.id}`);
            },
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
      <Button
        className="w-full mt-6"
        onClick={createMinggleHandler}
        disabled={editInfo.cantEdit}
      >
        {isPending ? "Loading..." : "Confirm"}
      </Button>
    </div>
  );
};

const SkeletonForm = () => {
  return (
    <div>
      <Skeleton className="w-40 h-8 mb-3" />
      <div className="space-y-3">
        {[...new Array(3)].map((_, i) => (
          <div className="space-y-1" key={i}>
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-full h-8" />
          </div>
        ))}
        {[...new Array(2)].map((_, i) => (
          <div className="space-y-1" key={i}>
            <Skeleton className="w-24 h-6" />
            <div className="w-full flex gap-3">
              <Skeleton className="flex-2 h-8" />
              <Skeleton className="flex-1 h-8" />
            </div>
          </div>
        ))}
        {[...new Array(2)].map((_, i) => (
          <div className="space-y-1" key={i}>
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-full h-8" />
          </div>
        ))}
        <Skeleton className="w-full h-8" />
      </div>
    </div>
  );
};
