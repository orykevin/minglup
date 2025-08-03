"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react/cache";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { timezoneList } from "@/lib/timezones";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, MapPin, QrCode, User2 } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { customIcon, FlyToLocation } from "@/components/maps/searchable-map";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import QRCode from "react-qr-code";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function OverviewPage() {
  const params = useParams();
  const data = useQuery(api.minggle.getMinggleOverview, {
    invitedId: params.id as Id<"invitedPeople">,
  });
  const [copied, setCopied] = useState(false);

  const localDate = useMemo(() => {
    if (!data) return;
    const localDateFrom = dayjs(data.minggleData.dateFrom).local();
    const localDateTo = dayjs(data.minggleData.dateTo).local();
    const isDifferentDay =
      localDateFrom.format("DD MM") !== localDateTo.format("DD MM");
    const isDifferentMonth =
      localDateFrom.format("MM") !== localDateTo.format("MM");
    const isExpired = dayjs().isAfter(localDateTo);
    // Convert to UTC to original timezone
    const timezonedFrom = dayjs
      .utc(data.minggleData.dateFrom)
      .tz(data.minggleData.timezone);
    const timezoneTo = dayjs
      .utc(data.minggleData.dateTo)
      .tz(data.minggleData.timezone);

    //get timezone
    const timezone = timezoneList.find((timezone) =>
      timezone.utc.some((utc) => utc === data.minggleData.timezone),
    );

    return {
      from: localDateFrom,
      to: localDateTo,
      sourceFrom: timezonedFrom,
      sourceTo: timezoneTo,
      timezone,
      isDifferentDay,
      isDifferentMonth,
      isExpired,
    };
  }, [data]);

  const handleCopyLink = () => {
    if (!data) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/confirmation/${data.invited._id}`,
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  if (!data) return <SkeletonMinggleOverview />;
  return (
    <main className="p-2 pt-4 flex flex-col gap-3 mx-auto max-w-2xl">
      <h1 className="text-4xl font-bold text-center text-primary">
        {data.invited.rank ? "You're Confirmed" : "You're Invited"}
      </h1>
      {data.invited.rank && (
        <h4 className="text-lg text-foreground/75 text-center -mt-2">
          You&apos;re ranked #{data.invited.rank}
        </h4>
      )}

      <div className="space-y-6">
        <div className="w-full flex justify-between items-center my-3 border-y border-foreground/10 py-3">
          <div className="flex gap-2 items-center justify-center">
            <Avatar>
              <AvatarImage src={data.ownerData?.imageUrl || ""} />
              <AvatarFallback>
                <User2 />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs ">from :</p>
              <p className="font-semibold text-sm">{data.ownerData.email}</p>
            </div>
          </div>
          <Badge
            variant={data.minggleData.isCanceled ? "destructive" : "default"}
            className={cn(
              "text-primary-foreground bg-blue-500",
              localDate?.isExpired && "bg-yellow-600",
              data.minggleData.isFinished && "bg-green-600",
              data.minggleData.isCanceled && "bg-red-500",
            )}
          >
            {data.minggleData?.isCanceled
              ? "Canceled"
              : localDate?.isExpired
                ? "Expired"
                : data.minggleData?.isFinished
                  ? "Finished"
                  : "On-going"}
          </Badge>
        </div>
        <div className="flex justify-between items-start !mb-8">
          <div>
            <h1 className="text-3xl font-bold">{data.minggleData?.title}</h1>
            <p className="text-foreground/75">
              {data.minggleData?.description}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative border rounded-sm p-2 pt-4 px-3 bg-card">
            <div className="absolute -top-3 -left-1 flex gap-1 items-center p-1 px-2 bg-primary test-xs text-primary-foreground rounded-md">
              <Clock size={16} /> <p className="text-xs font-semibold">From</p>
            </div>
            <p className="text-xl font-semibold">
              {localDate?.from.format("dddd, DD-MM-YYYY, HH:mm")}
              {!localDate?.isDifferentDay &&
                " - " + localDate?.to.format("HH:mm")}
            </p>
            <span className="text-sm text-foreground/75">
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
            <div className="relative border rounded-sm p-2 pt-4 px-3 bg-card mt-5">
              <div className="absolute -top-3 -left-1 flex gap-1 items-center p-1 px-2 bg-primary test-xs text-primary-foreground rounded-md">
                <Clock size={16} /> <p className="text-xs font-semibold">To</p>
              </div>
              <p className="text-xl font-semibold">
                {localDate?.to.format("dddd, DD-MM-YYYY, HH:mm")}
              </p>
              <span className="text-sm text-foreground/75">{`
            ${localDate?.from.format("DD-MM-YYYY, HH:mm")}
            (GMT${(localDate?.timezone?.offset || 0) > 0 ? "+" : ""}${localDate?.timezone?.offset})`}</span>
            </div>
          )}
        </div>
        <div className="relative space-y-1 border p-2 pt-4 rounded-md bg-card">
          <div className="absolute -top-3 -left-1 flex gap-1 items-center p-1 px-2 bg-primary test-xs text-primary-foreground rounded-md">
            <MapPin size={16} />{" "}
            <p className="text-xs font-semibold">Location</p>
          </div>
          <p className="text-lg font-semibold rounded-md mb-2 px-1">
            {data.minggleData.address}
          </p>
          <div className="relative w-full">
            {data.minggleData.latlong.length > 0 && (
              <>
                <MapContainer
                  center={data.minggleData.latlong as LatLngExpression}
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
                      position={data.minggleData.latlong as LatLngExpression}
                      icon={customIcon}
                    >
                      <Popup>{data.minggleData.address}</Popup>
                    </Marker>
                    <FlyToLocation
                      position={data.minggleData.latlong as LatLngExpression}
                    />
                  </>
                </MapContainer>
                <Button asChild className="w-full mt-3 mb-1">
                  <a
                    target="_blank"
                    href={`https://www.google.com/maps?q=${data.minggleData.latlong[0]},${data.minggleData.latlong[1]}`}
                  >
                    Open in Google Maps
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="relative border rounded-sm p-2 pt-4 px-3 bg-card">
          <div className="absolute -top-3 -left-1 flex gap-1 items-center p-1 px-2 bg-primary test-xs text-primary-foreground rounded-md">
            <QrCode size={16} />{" "}
            <p className="text-xs font-semibold">QR code</p>
          </div>
          <div className="pt-4 pb-2 px-2">
            <div className="w-full">
              <QRCode
                value={`${window.location.origin}/confirmation/${data.invited._id}`}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                bgColor="white"
                fgColor="black"
              />
            </div>
            <p className="text-sm font-semibold text-foreground/75 my-3">
              Ask the person who invited you to scan this QR code or copy and
              share the link to confirm your attendance.
            </p>
            <Button className="w-full" onClick={handleCopyLink}>
              {copied ? "Copied" : "Copy Link"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

const SkeletonMinggleOverview = () => {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Skeleton className="w-3/4 h-10 mx-auto" />
      <div className="flex items-center gap-2 justify-center">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-2/3 h-6" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-10" />
        <Skeleton className="w-2/3 h-6" />
        <Skeleton className="w-24 h-8" />
      </div>
      <Skeleton className="w-full h-20" />
      <Skeleton className="w-full h-52" />
      <Skeleton className="w-full h-52" />
    </div>
  );
};
