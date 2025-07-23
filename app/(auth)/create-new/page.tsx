"use client";

import { FormWrapper } from "@/components/forms/FormWrapper";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TextFormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { TextareaFormInput } from "@/components/forms/FormTextareaInput";
import { FormMultiSelect } from "@/components/forms/FormMultiSelect";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  address: z.string(),
  mapLink: z.string().optional(),
  emails: z.array(z.object({ value: z.string(), label: z.string() })),
});

export default function CreateNewPage() {
  const forms = useForm({
    defaultValues: {
      title: "",
      description: "",
      address: "",
      mapLink: "",
      emails: [],
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmitHandler = (val: z.infer<typeof formSchema>) => {
    console.log(val);
  };

  return (
    <div>
      <h1 className="text-2xl my-3 font-bold">Create new minggle</h1>
      <FormWrapper forms={forms} onSubmitHandler={onSubmitHandler}>
        <TextFormInput name="title" label="Title" isRequired />
        <TextareaFormInput name="description" label="Description" isRequired />
        <TextFormInput name="address" label="Address" isRequired />
        <TextFormInput name="mapLink" label="Map Link" />
        <FormMultiSelect name="emails" label="Emails" />
        <Button type="submit">Submit</Button>
      </FormWrapper>
    </div>
  );
}
