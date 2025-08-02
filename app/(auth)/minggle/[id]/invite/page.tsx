"use client";

import { ControlledDialog } from "@/components/control-dialog";
import EmailIcon from "@/components/email-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import LinkButton from "@/components/ui/link-button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MAX_INVITED_PEOPLE } from "@/convex/constant";
import { toast } from "@/hooks/use-hooks";
import { useConvexMutation } from "@/lib/convex-functions";
import { cn } from "@/lib/utils";
import { useQuery } from "convex-helpers/react/cache";
import dayjs from "dayjs";
import { Check, MailPlus, Plus, Trash, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import z from "zod";

const emailSchema = z.email();

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const [invites, setInvites] = useState([
    { id: crypto.randomUUID(), email: "" },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openExistingDialog, setOpenExistingDialog] = useState(false);

  const statusEmailData = useQuery(api.emails.getMinggleEmailStatus, {
    minggleId: params.id as Id<"minggle">,
  });
  const data = useQuery(api.minggle.getMinggle, {
    minggleId: params.id as Id<"minggle">,
  });
  const userData = useQuery(api.user.getProfile);
  const emailList = useQuery(api.emailLists.getEmailLists);

  const { mutate, isPending } = useConvexMutation(api.minggle.inviteMinggle);

  const emailChecker = useMemo(() => {
    return invites.map((invite) => {
      const isValidEmail = emailSchema.safeParse(invite.email);
      const isExist = data?.emails.includes(invite.email);
      const isNotUserEmail = userData?.email === invite.email;
      return isValidEmail.success && !isExist && !isNotUserEmail;
    });
  }, [invites, data]);

  const handleInviteMinggle = () => {
    if (emailChecker.includes(false)) return;
    mutate(
      {
        minggleId: params.id as Id<"minggle">,
        emails: invites.map((invite) => invite.email),
      },
      {
        onSuccess(res) {
          setOpenDialog(false);
          toast({
            title: "Success",
            description: res,
            variant: "success",
          });
          router.push(`/minggle/${params.id}`);
        },
        onError(error) {
          toast({
            title: "Error",
            description: error.data,
            variant: "destructive",
          });
        },
      },
    );
  };

  const maximumExceed =
    invites.length + (data?.emails.length || 0) > MAX_INVITED_PEOPLE;

  const editInfo = useMemo(() => {
    return {
      isExpired: dayjs().isAfter(dayjs(data?.dateTo)),
      isNotAvailable:
        data?.isCanceled ||
        data?.isFinished ||
        dayjs().isAfter(dayjs(data?.dateTo)),
    };
  }, [data]);

  if (data === undefined) return <div>Loading...</div>;

  return (
    <div>
      <h4 className="font-bold text-lg mb-2">Invited</h4>
      <div className="space-y-2">
        {data.emails.map((email) => {
          const emailStatus = statusEmailData?.find((e) => e?.email === email);
          return (
            <div
              className="flex justify-between items-center p-3 border rounded-md"
              key={email}
            >
              <p className="text-lg font-semibold" key={email}>
                {email}
              </p>
              <EmailIcon status={emailStatus?.status || "sent"} />
            </div>
          );
        })}
      </div>
      <div className="flex h-max items-center justify-between mb-3 mt-4">
        <h4 className="font-bold text-lg">Invite More</h4>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            disabled={maximumExceed || editInfo.isNotAvailable}
          >
            <Button size="sm">
              <MailPlus />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => setOpenExistingDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus />
              <span>Invite from existing list</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setInvites((invites) => [
                  ...invites,
                  { id: crypto.randomUUID(), email: "" },
                ])
              }
            >
              <Plus />
              <span>Invite new email</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <div className="space-y-3">
          {invites.map((invite, index) => (
            <MemoEmailInput
              invitedEmails={data.emails}
              key={invite.id}
              invite={invite}
              index={index}
              setInvites={setInvites}
              userEmail={userData?.email}
            />
          ))}
        </div>
        {maximumExceed && (
          <p className="text-red-500 font-semibold mt-3">
            You can invite maximum {MAX_INVITED_PEOPLE} people
          </p>
        )}
        {editInfo.isNotAvailable && (
          <p className="text-red-500 font-semibold mt-3">
            {editInfo.isExpired
              ? "Minggle is expired"
              : data?.isCanceled
                ? "Minggle is canceled"
                : "Minggle is finished"}
          </p>
        )}
        <div className="flex gap-3 mt-8">
          <LinkButton
            className="flex-1"
            variant={"outline"}
            href={`/minggle/${params.id}`}
          >
            Cancel
          </LinkButton>
          <Button
            onClick={() => setOpenDialog(true)}
            className="flex-1"
            disabled={
              !emailChecker.every(Boolean) ||
              invites.length < 1 ||
              maximumExceed ||
              editInfo.isNotAvailable
            }
          >
            Submit
          </Button>
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>Invite more</DialogHeader>
          <DialogDescription>
            You will invite {invites.length} people, you can&apos;t remove
            invited emails later, make sure you invite the right emails
          </DialogDescription>
          <div className="space-y-2">
            {invites.map((invite) => (
              <p className="font-semibold" key={invite.id}>
                {invite.email}
              </p>
            ))}
          </div>
          <div className="flex gap-3">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleInviteMinggle}>
              {isPending ? "Inviting..." : "Yes, Invite"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ControlledDialog
        open={openExistingDialog}
        onOpenChange={setOpenExistingDialog}
        title="Invite from existing list"
      >
        <div className="flex flex-col gap-2">
          {emailList?.emails.map((email) => {
            const isListed =
              invites.some((invite) => invite.email === email) ||
              data.emails.includes(email);
            const onClick = () => {
              if (isListed) return;
              setInvites((invites) => [
                ...invites,
                { id: crypto.randomUUID(), email, exsist: true },
              ]);
            };
            return (
              <div
                key={email}
                onClick={onClick}
                className={cn(
                  "flex p-2 font-semibold border rounded-md hover:ring ring-blue-500 items-center justify-between",
                  isListed && "pointer-events-none opacity-50",
                )}
              >
                {email}
                {isListed && <Check />}
              </div>
            );
          })}
        </div>
      </ControlledDialog>
    </div>
  );
}

const EmailInput = ({
  invitedEmails,
  invite,
  index,
  setInvites,
  userEmail,
}: {
  invitedEmails: string[];
  invite: { id: string; email: string; exsist?: boolean };
  index: number;
  setInvites: React.Dispatch<
    React.SetStateAction<{ id: string; email: string }[]>
  >;
  userEmail?: string;
}) => {
  const isExist = invitedEmails.includes(invite.email);
  const isNotUserEmail = invite.email !== userEmail;
  const isValidEmail =
    emailSchema.safeParse(invite.email).success && !isExist && isNotUserEmail;
  const isEmpty = invite.email === "";

  return (
    <div className="flex gap-3 items-center">
      <div className="relative w-full">
        <Input
          defaultValue={invite.exsist ? invite.email : undefined}
          type="email"
          placeholder="Email"
          key={invite.id}
          onChange={(e) =>
            setInvites((invites) => {
              const newInvites = [...invites];
              newInvites[index] = {
                id: newInvites[index].id,
                email: e.target.value,
              };
              return newInvites;
            })
          }
          className={cn(
            "pr-8",
            isValidEmail && !isEmpty ? "border-green-500" : "",
            !isValidEmail && !isEmpty ? "border-red-500" : "",
          )}
        />
        {!isEmpty && (
          <span className="absolute right-2 top-2.5">
            {isValidEmail ? (
              <Check className="text-green-500" size={18} />
            ) : (
              <X className="text-red-500" size={18} />
            )}
          </span>
        )}
      </div>
      <div>
        <Button
          size={"icon"}
          variant="outline"
          className="hover:bg-red-500/25 hover:text-red-500/75"
          onClick={() =>
            setInvites((invites) =>
              invites.filter((data) => data.id !== invite.id),
            )
          }
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
};

const MemoEmailInput = React.memo(EmailInput);
