import { Doc } from "@/convex/_generated/dataModel";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React, { useMemo } from "react";
import { Clock, MapPin, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

dayjs.extend(utc);
dayjs.extend(timezone);

type MinggleData = Doc<"minggle">;
type MinggleCardProps = {
  data: MinggleData;
};

export const MinggleCard = ({ data }: MinggleCardProps) => {
  const router = useRouter();
  const localDate = useMemo(() => {
    const localDateFrom = dayjs(data.dateFrom).local();
    const localDateTo = dayjs(data.dateTo).local();
    const isDifferentDay =
      localDateFrom.format("DD MM") !== localDateTo.format("DD MM");
    const isDifferentMonth =
      localDateFrom.format("MM") !== localDateTo.format("MM");
    return {
      from: localDateFrom,
      to: localDateTo,
      isDifferentDay,
      isDifferentMonth,
    };
  }, [data]);
  return (
    <div
      className="border p-3 rounded-sm bg-card hover:ring ring-blue-400 transition-all cursor-pointer"
      onClick={() => {
        router.push(`/minggle/${data._id}`);
      }}
      key={data._id}
      tabIndex={0}
    >
      <div className="flex gap-3 items-center">
        <div className="relative border p-3 pb-2 min-w-[100px] rounded-[6px]">
          <span
            className={cn(
              "absolute top-0 left-0 w-full h-2 bg-blue-400",
              data.isCanceled && "bg-red-500",
              data.isFinished && "bg-green-600",
            )}
          />
          {localDate.isDifferentDay && localDate.isDifferentMonth ? (
            <div className="flex items-center justify-center gap-2">
              <div>
                <h3 className="text-xl text-center font-semibold">
                  {localDate.from.format("DD")}
                </h3>
                <p className="text-center text-sm">
                  {localDate.from.format("MMM")}
                </p>
              </div>
              {" - "}
              <div>
                <h3 className="text-xl text-center font-semibold">
                  {localDate.to.format("DD")}
                </h3>
                <p className="text-center text-sm">
                  {localDate.to.format("MMM")}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-center">
                {`${localDate.from.format("DD")}${localDate.isDifferentDay ? ` - ${localDate.to.format("DD")}` : ""}`}
              </h3>
              <p className="text-center text-sm">
                {localDate.from.format("MMM")}
              </p>
            </div>
          )}
        </div>
        <div className="flex -mt-1">
          <div className="h-full">
            <h3 className="text-lg font-semibold">{data.title}</h3>
            <p className="text-foreground/75 line-clamp-1">
              {data.description}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="min-w-8" />
          <p>
            {localDate.from.format("dddd DD-MM, HH:mm")} -{" "}
            {localDate.to.format(
              localDate.isDifferentDay ? "dddd DD-MM, HH:mm" : "HH:mm",
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="min-w-8" />
          <p className="line-clamp-1">{data.address}</p>
        </div>
        <div className="flex items-center gap-2">
          <User2 className="min-w-8" />
          <p className="line-clamp-1">
            Invited{" "}
            {`${data.emails.length > 1 ? `${data.emails.length} people` : `${data.emails.length} person`}`}
          </p>
        </div>
      </div>
    </div>
  );
};
