"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { resend } from "../emails";
import React from "react"
import EmailCreateMinggle from "./template/createMinggle"
import { pretty, render } from "@react-email/components";
import { internal } from "../_generated/api";

export const sendCustomEmail = internalAction({
    args: {
        email: v.string(),
        type: v.string(),
        minggleId: v.id("minggle"),
        minggleRef: v.number()
    },
    handler: async (ctx, args) => {
        const html = await pretty(await render(React.createElement(EmailCreateMinggle)));

        try {
            const resendId = await resend.sendEmail(ctx, {
                from: "MinglUp <testuser@oryworks.com>",
                to: args.email,
                subject: args.type,
                html: html,
            });

            ctx.runMutation(internal.emails.mutateMinggleEmail, {
                ...args,
                resendId,
                status: 'sent'
            })
        } catch (e) {
            console.log(e)
            ctx.runMutation(internal.emails.mutateMinggleEmail, {
                ...args,
                status: 'failed'
            })
        }
    },
});
