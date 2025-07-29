import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Mail, MailCheck, MailOpen, MailWarning, MailX } from "lucide-react";

const EmailIcon = ({ status }: { status: Doc<"minggleEmail">["status"] }) => {
  const renderIcon = () => {
    switch (status) {
      case "bounced":
        return <DebouncedMail />;
      case "sent":
        return <Mail />;
      case "delivered":
        return <MailCheck />;
      case "clicked":
        return <MailOpen />;
      case "complained":
        return <MailWarning />;
      case "delivered_delayed":
        return <DelayedMail />;
      default:
        return <MailX />;
    }
  };
  return (
    <Tooltip>
      <TooltipTrigger className="text-foreground">
        {renderIcon()}
      </TooltipTrigger>
      <TooltipContent className="capitalize">{status}</TooltipContent>
    </Tooltip>
  );
};

export default EmailIcon;

export const DebouncedMail = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 15V6C22 5.46957 21.7893 4.96086 21.4142 4.58579C21.0391 4.21071 20.5304 4 20 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V18C2 19.1 2.9 20 4 20H12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M21.3333 20.0417V19.125C21.3333 18.6388 21.1402 18.1724 20.7964 17.8286C20.4525 17.4848 19.9862 17.2917 19.5 17.2917H14"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.2917 19.5833L14 17.2917L16.2917 15"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const DelayedMail = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 15V6C22 5.46957 21.7893 4.96086 21.4142 4.58579C21.0391 4.21071 20.5304 4 20 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V18C2 19.1 2.9 20 4 20H12"
        stroke="currentColor
"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7"
        stroke="currentColor
"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <g clip-path="url(#clip0_58_11)">
        <path
          d="M15.4583 20.4167H19.5416"
          stroke="currentColor
"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M15.4583 14.5833H19.5416"
          stroke="currentColor
"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M18.9584 20.4167V19.1998C18.9583 19.0451 18.8968 18.8968 18.7874 18.7874L17.5 17.5L16.2126 18.7874C16.1032 18.8968 16.0417 19.0451 16.0417 19.1998V20.4167"
          stroke="currentColor
"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M16.0417 14.5833V15.8002C16.0417 15.9549 16.1032 16.1032 16.2126 16.2126L17.5 17.5L18.7874 16.2126C18.8968 16.1032 18.9583 15.9549 18.9584 15.8002V14.5833"
          stroke="currentColor
"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_58_11">
          <rect
            width="7"
            height="7"
            fill="currentColor
"
            transform="translate(14 14)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
