import { ConvexError, convexToJson, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { isAuthUserId, isMinggleOwner } from "./middleware";
import { addEmailListsHelper } from "./emailLists";
import { Id } from "./_generated/dataModel";
import { sendEmailHelper } from "./emails";
import { MAX_EDIT_COUNT } from "./constant";

const minggleArgs = {
    address: v.string(),
    dateTo: v.string(),
    dateFrom: v.string(),
    description: v.optional(v.string()),
    latlong: v.array(v.number()),
    timezone: v.string(),
    title: v.string()
}

export const getMinggle = query({
    args: {
        minggleId: v.id("minggle")
    },
    handler: async (ctx, args) => {
        const { minggle } = await isMinggleOwner(ctx, args.minggleId)

        return minggle
    }
})

export const getActiveMinggle = query({
    handler: async (ctx) => {
        const userId = await isAuthUserId(ctx)

        return await ctx.db.query("minggle").withIndex("byUser", (q) => q.eq("userId", userId).eq("isFinished", undefined)).collect()
    }
})

export const createMinggle = mutation({
    args: { ...minggleArgs, emails: v.array(v.string()) },
    handler: async (ctx, args) => {
        const userId = await isAuthUserId(ctx)
        const minggleId = await ctx.db.insert("minggle", { ...args, userId })

        if (!minggleId) throw new ConvexError("Error when creating minggle")
        await addEmailListsHelper(ctx, userId, args.emails)
        await sendEmailHelper(ctx, { minggleId, emails: args.emails }, "create")
        return minggleId
    },
})

export const editMinggle = mutation({
    args: {
        ...minggleArgs,
        minggleId: v.id("minggle")
    },
    handler: async (ctx, { minggleId, ...minggleArgs }) => {
        const { minggle } = await isMinggleOwner(ctx, minggleId)

        if (minggle.editCount && minggle.editCount >= MAX_EDIT_COUNT) throw new ConvexError("Max edit exceed")
        const editCount = (minggle?.editCount || 0) + 1
        await ctx.db.patch(minggle._id, {
            ...minggleArgs,
            editCount
        })
        await sendEmailHelper(ctx, { minggleId, emails: minggle.emails, minggleRef: editCount }, "edit")
        return "Success Edit Minggle"
    }
})

export const inviteMinggle = mutation({
    args: {
        emails: v.array(v.string()),
        minggleId: v.id("minggle")
    }, handler: async (ctx, { minggleId, emails }) => {
        const { minggle, userId } = await isMinggleOwner(ctx, minggleId)
        const newEmails = emails.filter((email) => !minggle.emails.includes(email))

        await ctx.db.patch(minggle._id, {
            emails: [...minggle.emails, ...newEmails]
        })
        await addEmailListsHelper(ctx, userId, newEmails)
        await sendEmailHelper(ctx, { minggleId, emails: newEmails, minggleRef: (minggle.editCount || 0) }, "invited")
        return `Successfully add ${emails.length} email`
    }
})

export const cancelMinggle = mutation({
    args: {
        minggleId: v.id("minggle")
    },
    handler: async (ctx, args) => {
        const { minggle } = await isMinggleOwner(ctx, args.minggleId)
        if (minggle.isFinished) throw new ConvexError("This minggle is already finished")
        if (minggle.isCanceled) throw new ConvexError("This minggle is already cancelled")

        await ctx.db.patch(minggle._id, {
            isCanceled: true,
            canceledAt: Date.now()
        })

        return "Minggle is cancelled successfully"
    }
})

export const getMinggleData = async (ctx: MutationCtx | QueryCtx, minggleId: Id<"minggle">) => {
    const minggleData = await ctx.db.get(minggleId)
    if (!minggleData) throw new ConvexError("No minggle found")
    return minggleData
}