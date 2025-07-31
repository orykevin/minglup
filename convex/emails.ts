import { components, internal } from "./_generated/api";
import { Resend, vEmailId, vEmailEvent, EmailStatus, } from "@convex-dev/resend";
import { internalMutation, MutationCtx, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getMinggleData } from "./minggle";
import { StatusEmailType } from "./schema";
import { isAuthUserId, isMinggleOwner } from "./middleware";

type SendEmailType = "create" | "edit" | "invited" | "cancel" | "info" | "confirmed"

export const resend: Resend = new Resend(components.resend, {
    onEmailEvent: internal.emails.handleEmailEvent,
});

export const getMinggleEmailLogs = query({
    args: {
        minggleId: v.id("minggle")
    }, handler: async (ctx, { minggleId }) => {
        const userId = await isAuthUserId(ctx)
        const minggle = await ctx.db.get(minggleId)

        if (!minggle || minggle.userId !== userId) return null

        const allLogs = await ctx.db.query("minggleEmail").withIndex("byMinggleId", (q) => q.eq("minggleId", minggle._id)).order("desc").collect();
        return {
            minggle,
            allLogs,
        }
    },
})

export const getMinggleEmailStatus = query({
    args: {
        minggleId: v.id("minggle")
    },
    handler: async (ctx, args) => {
        const minggleData = await getMinggleData(ctx, args.minggleId)

        const mappedData = await Promise.all(minggleData.emails.map(async (email) => {
            return await ctx.db.query("minggleEmail").withIndex("byEmail", (q) => q.eq("email", email).eq("minggleId", args.minggleId)).order("desc").first()
        }))

        return mappedData
    }
})

export const sendTestEmail = internalMutation({
    handler: async (ctx) => {
        await resend.sendEmail(ctx, {
            from: "Kevin <testuser@oryworks.com>",
            to: "delivered@resend.dev",
            subject: "Hi there",
            html: "This is a test email",
        });
    },
});

export const handleEmailEvent = internalMutation({
    args: {
        id: vEmailId,
        event: vEmailEvent,
    },
    handler: async (ctx, args) => {
        console.log("Got called back!", args.id, args.event);
        // Probably do something with the event if you care about deliverability!
        const status = args.event.type.split(".")[1] as Doc<"minggleEmail">["status"]
        if (args.event.type !== "email.sent") {
            Array.isArray(args.event.data.to) ?
                args.event.data.to.forEach(async () => {
                    await webhookMinggleEmailHelper(ctx, args.id, status)
                })
                : await webhookMinggleEmailHelper(ctx, args.id, status)
        }
    },
});

export const handleSendOnCreateMinggle = internalMutation({
    args: {
        emails: v.array(v.string()),
        minggleId: v.id("minggle")
    },
    handler: async (ctx, { emails, minggleId },) => {
        await sendEmailHelper(ctx, { emails, minggleId }, 'create')
        return "created"
    }
})

export const sendEmailHelper = async (ctx: MutationCtx, args: { emails: string[], minggleId: Id<"minggle">, minggleRef?: number }, type: SendEmailType) => {
    let html = ""
    switch (type) {
        case 'create':
            html = "Created and you're invited"
            break;
        case 'cancel':
            html = "Event cancelled"
            break;
        case 'edit':
            html = "Event edited"
            break;
        case 'invited':
            html = "You're Invited"
            break;
    }
    args.emails.forEach(async (email) => {
        const lastTwoStatus = await ctx.db.query("minggleEmail").withIndex("byEmail", (q) => q.eq("email", email).eq("minggleId", args.minggleId)).take(2)
        // const previousEmail = lastTwoStatus[0]
        const isLastEmailNotAvailable = lastTwoStatus.some((email) => email.status === "bounced" || email.status === "cancelled" || email.status === "failed")
        if (isLastEmailNotAvailable) return;
        await ctx.scheduler.runAfter(0, internal.emails.index.sendCustomEmail, { email, type, minggleId: args.minggleId, minggleRef: (args.minggleRef || 0) })
    })
}

export const mutateMinggleEmail = internalMutation({
    args: {
        minggleId: v.id("minggle"),
        minggleRef: v.number(),
        email: v.string(),
        status: StatusEmailType,
        type: v.string(),
        resendId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        if (args.status === "failed") {
            const invited = await ctx.db.query("invitedPeople").withIndex("byEmail", (q) => q.eq("email", args.email).eq("minggleId", args.minggleId)).first()
            if (!invited) return;
            await ctx.db.patch(invited._id, {
                isFailed: true,
            })
        }
        await ctx.db.insert("minggleEmail", { ...args })
    },
})

export const webhookMinggleEmailHelper = async (ctx: MutationCtx, emailId: string, status: Doc<"minggleEmail">["status"]) => {
    const minggleData = await ctx.db.query("minggleEmail").withIndex("byResendId", (q) => q.eq("resendId", emailId)).order("desc").first();
    if (!minggleData) throw new ConvexError("minggleData not found");

    let fixedStatus = status
    switch (minggleData.status) {
        case "complained":
            fixedStatus = minggleData.status
            break;
    }

    await ctx.db.insert('minggleEmail', {
        email: minggleData.email,
        minggleId: minggleData.minggleId,
        minggleRef: minggleData.minggleRef,
        resendId: minggleData.resendId,
        type: minggleData.type,
        status: fixedStatus
    })
}