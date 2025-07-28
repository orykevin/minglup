import React from "react";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogContent,
} from "./ui/dialog";

type DialogProps = React.ComponentProps<typeof Dialog> & {
  title: string;
  description?: string;
  dialogContentProps?: React.ComponentProps<typeof DialogContent>;
};

export const ControlledDialog = ({
  title,
  description,
  children,
  dialogContentProps,
  ...props
}: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent {...dialogContentProps}>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
        {children}
      </DialogContent>
    </Dialog>
  );
};
