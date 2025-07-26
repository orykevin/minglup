import { ConvexError, convexToJson, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isAuthUserId, isMinggleOwner } from "./middleware";
import { addEmailListsHelper } from "./emailLists";

const minggleArgs = {
    address: v.string(),
    dateTo: v.string(),
    dateFrom: v.string(),
    description: v.optional(v.string()),
    emails: v.array(v.string()),
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
    args: minggleArgs,
    handler: async (ctx, args) => {
        const userId = await isAuthUserId(ctx)
        const minggleId = await ctx.db.insert("minggle", { ...args, userId })

        if (!minggleId) throw new ConvexError("Error when creating minggle")
        await addEmailListsHelper(ctx, userId, args.emails)
        return minggleId
    },
})

export const editMinggle = mutation({
    args: {
        ...minggleArgs,
        minggleId: v.id("minggle")
    },
    handler: async (ctx, { minggleId, ...minggleArgs }) => {
        const { minggle, userId } = await isMinggleOwner(ctx, minggleId)

        await ctx.db.patch(minggle._id, {
            ...minggleArgs
        })
        await addEmailListsHelper(ctx, userId, minggleArgs.emails)
        return "Success Edit Minggle"
    }
})