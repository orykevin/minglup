"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useMemo, useState } from "react";
import { timezoneList } from "@/lib/timezones";
import { EllipsisVertical, MapPin, Pencil, Plus, User2, X } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { customIcon, FlyToLocation } from "@/components/maps/searchable-map";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useConvexMutation } from "@/lib/convex-functions";
import { toast } from "@/hooks/use-hooks";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import EmailIcon from "@/components/email-icons";
import { MAX_EDIT_COUNT } from "@/convex/constant";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function MingglePage() {
  const router = useRouter();
  const params = useParams();

  const [openDialog, setOpenDialog] = useState(false);

  const statusEmailData = useQuery(api.emails.getMinggleEmailStatus, {
    minggleId: params.id as Id<"minggle">,
  });
  const data = useQuery(api.minggle.getMinggle, {
    minggleId: params.id as Id<"minggle">,
  });
  const userData = useQuery(api.user.getProfile);
  const { mutate: cancelMinggle, isPending: isCanceling } = useConvexMutation(
    api.minggle.cancelMinggle,
  );

  const localDate = useMemo(() => {
    if (!data) return;
    const localDateFrom = dayjs(data.dateFrom).local();
    const localDateTo = dayjs(data.dateTo).local();
    const isDifferentDay =
      localDateFrom.format("DD MM") !== localDateTo.format("DD MM");
    const isDifferentMonth =
      localDateFrom.format("MM") !== localDateTo.format("MM");

    // Convert to UTC to original timezone
    const timezonedFrom = dayjs.utc(data.dateFrom).tz(data.timezone);
    const timezoneTo = dayjs.utc(data.dateTo).tz(data.timezone);

    //get timezone
    const timezone = timezoneList.find((timezone) =>
      timezone.utc.some((utc) => utc === data.timezone),
    );

    return {
      from: localDateFrom,
      to: localDateTo,
      sourceFrom: timezonedFrom,
      sourceTo: timezoneTo,
      timezone,
      isDifferentDay,
      isDifferentMonth,
    };
  }, [data]);

  const isCanEdit = useMemo(() => {
    if (!data) return false;
    return (data.editCount || 0) >= MAX_EDIT_COUNT;
  }, [data]);

  if (!data) return <SkeletonMinggleInfo />;

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-between items-center mb-1">
        <Badge
          variant={data.isCanceled ? "destructive" : "default"}
          className={cn(
            "mb-3 text-primary",
            data.isFinished ? "bg-green-500" : "bg-blue-500",
          )}
        >
          {data.isCanceled ? "Canceled" : "On-going"}
        </Badge>
        {userData?._id === data.userId && !data.isCanceled && (
          <span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  disabled={isCanEdit}
                  onClick={() => router.push(`/minggle/${data._id}/edit`)}
                >
                  <Pencil />
                  <p>Edit</p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/minggle/${data._id}/invite`)}
                >
                  <Plus />
                  <p>Invite</p>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                  <X />
                  <p>Cancel</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        )}
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{data?.title}</h1>
          <p className="text-primary/95">{data?.description}</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="border rounded-sm p-2 px-3">
          <p>From</p>
          <p className="text-xl font-semibold">
            {localDate?.from.format("dddd, DD-MM-YYYY, HH:mm")}
            {!localDate?.isDifferentDay &&
              " - " + localDate?.to.format("HH:mm")}
          </p>
          <span className="text-sm text-primary/95">
            {`${localDate?.sourceFrom.format("YYYY-MM-DD, HH:mm")}
            ${
              !localDate?.isDifferentDay
                ? " - " + localDate?.sourceTo.format("HH:mm")
                : ""
            }
            (GMT${(localDate?.timezone?.offset || 0) > 0 ? "+" : ""}${localDate?.timezone?.offset})`}
          </span>
        </div>
        {localDate?.isDifferentDay && (
          <div className="border rounded-sm p-2 px-3">
            <p>To</p>
            <p className="text-xl font-semibold">
              {localDate?.to.format("dddd, DD-MM-YYYY, HH:mm")}
            </p>
            <span className="text-sm text-primary/95">{`
            ${localDate?.from.format("DD-MM-YYYY, HH:mm")}
            (GMT${(localDate?.timezone?.offset || 0) > 0 ? "+" : ""}${localDate?.timezone?.offset})`}</span>
          </div>
        )}
      </div>
      <div className="space-y-1 border p-2 rounded-md">
        <p className="flex gap-1 items-center">
          <MapPin size={18} /> Location{" "}
        </p>
        <p className="text-lg font-semibold rounded-md mb-2">{data.address}</p>
        <div className="relative w-full">
          {data.latlong.length > 0 && (
            <MapContainer
              center={data.latlong as LatLngExpression}
              zoom={16}
              scrollWheelZoom
              style={{ width: "100%", height: "400px" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <>
                <Marker
                  position={data.latlong as LatLngExpression}
                  icon={customIcon}
                >
                  <Popup>{data.address}</Popup>
                </Marker>
                <FlyToLocation position={data.latlong as LatLngExpression} />
              </>
            </MapContainer>
          )}
        </div>
      </div>
      <div className="space-y-1 border p-2 rounded-md">
        <p className="flex gap-1 items-center">
          <User2 size={18} /> Invited people
        </p>
        <div className="space-y-2">
          {data.emails.map((email) => {
            const emailStatus = statusEmailData?.find(
              (e) => e?.email === email,
            );
            return (
              <div className="flex justify-between items-center p-3 border rounded-md">
                <p className="text-lg font-semibold" key={email}>
                  {email}
                </p>
                <EmailIcon status={emailStatus?.status || "sent"} />
              </div>
            );
          })}
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>Cancel Minggle</DialogHeader>
          <DialogDescription>
            Are you sure you want to cancel this minggle? <br /> this action
            cannot be undone
          </DialogDescription>
          <div className="flex gap-3">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              variant="destructive"
              onClick={() => {
                cancelMinggle(
                  {
                    minggleId: data._id,
                  },
                  {
                    onSuccess(res) {
                      toast({
                        title: "Success",
                        description: res,
                        variant: "success",
                      });
                      setOpenDialog(false);
                    },
                  },
                );
              }}
            >
              {isCanceling ? "Cancelling..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const SkeletonMinggleInfo = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="w-24 h-8" />
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-10" />
        <Skeleton className="w-2/3 h-6" />
      </div>
      <Skeleton className="w-full h-20" />
      <Skeleton className="w-full h-52" />
      <Skeleton className="w-full h-52" />
    </div>
  );
};
