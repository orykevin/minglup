import { toast as sonnerToast } from "sonner";
import { CircleAlert, CircleCheck, CircleX, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastOptions = {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning";
  action?: React.ReactNode;
  icon?: React.ReactNode;
};

const backgroundVariant = {
  default: "bg-background border-primary",
  destructive: "bg-red-500/10 border-red-500",
  success: "bg-green-500/10 border-green-500",
  warning: "bg-orange-500/10 border-orange-500",
};

export const toast = (options: ToastOptions) => {
  const { title, description, variant, action, icon } = options;

  sonnerToast.custom((t) => {
    return (
      <div
        className={cn(
          "relative gap-4 flex items-center border p-2 pb-2 pt-1.5 pr-12 rounded-[8px] !text-foreground",
          backgroundVariant[variant || "default"],
        )}
      >
        <X
          size={16}
          className="absolute top-1.5 right-1.5 cursor-pointer"
          onClick={() => sonnerToast.dismiss(t)}
        />
        <div className="flex items-center gap-2">
          <div className={description ? "-mt-3" : ""}>
            {icon ? (
              icon
            ) : variant === "success" ? (
              <CircleCheck size={20} />
            ) : variant === "destructive" ? (
              <CircleX size={20} />
            ) : variant === "warning" ? (
              <CircleAlert size={20} />
            ) : null}
          </div>

          <div>
            <h1 className="text-base font-semibold">{title}</h1>
            {description && <p className="text-sm -mt-0.5">{description}</p>}
          </div>
        </div>
        {action}
      </div>
    );
  });
};
