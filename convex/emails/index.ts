"use node";

import { ConvexError, v } from "convex/values";
import { ActionCtx, internalAction, internalQuery, query } from "../_generated/server";
import { resend } from "../emails";
import React from "react"
import EmailCreateMinggle from "./template/createMinggle"
import { pretty, render } from "@react-email/components";
import { internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";
import EmailEditedMinggle from "./template/editedMinggle";
import EmailCancelledMinggle from "./template/cancelledMinggle";
import EmailConfirmedMinggle from "./template/confirmedMinggle";
import EmailInformedMinggle from "./template/informedMinggle";

export const sendCustomEmail = internalAction({
    args: {
        email: v.string(),
        type: v.string(),
        minggleId: v.id("minggle"),
        minggleRef: v.number()
    },
    handler: async (ctx, args) => {
        const data = await ctx.runQuery(internal.invitedPeople.getInvitedData, {
            email: args.email,
            type: args.type,
            minggleId: args.minggleId,
        })

        const peopleLeft = data.allInvitedPeople?.filter((invited) => !invited.rank).length

        const html = await htmlRenderer(ctx, args.type, data.minggleData, data.invitedPeople, data.user || undefined, peopleLeft)

        try {
            const resendId = await resend.sendEmail(ctx, {
                from: "MinglUp <minglup@oryworks.com>",
                to: args.email,
                subject: `[MinglUp] ${subjectRenderer(args.type, data.minggleData.title)}`,
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

export const htmlRenderer = async (ctx: ActionCtx, type: string, minggleData: Doc<"minggle">, invitedData: Doc<"invitedPeople">, userData?: Doc<"users">, peopleLeft?: number) => {
    switch (type) {
        case "create":
        case "invited":
            return await pretty(await render(React.createElement(EmailCreateMinggle, { invitedBy: userData?.email || "", invitedId: invitedData._id })))
        case "edit":
            return await pretty(await render(React.createElement(EmailEditedMinggle, { invitedId: invitedData._id, minggleRef: (minggleData.editCount || 0) })))
        case "cancel":
            return await pretty(await render(React.createElement(EmailCancelledMinggle, { invitedId: invitedData._id })))
        case "confirmed":
            return await pretty(await render(React.createElement(EmailConfirmedMinggle, { invitedId: invitedData._id, rank: (invitedData.rank || 0) })))
        case "info":
            return await pretty(await render(React.createElement(EmailInformedMinggle, { invitedId: invitedData._id, peopleLeft: (peopleLeft || 0) })))
    }
}

export const subjectRenderer = (type: string, title: string) => {
    switch (type) {
        case "create":
        case "invited":
            return `You’re Invited to ${title}`
        case "edit":
            return `${title} Just Got Updated – See What’s New`
        case "cancel":
            return `Minggle Event Cancelled`
        case "confirmed":
            return `You’re Confirmed for ${title}`
        case "info":
            return `Attendance Info for ${title}`
    }
}
