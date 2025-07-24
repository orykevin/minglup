import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isAuthUserId, isMinggleOwner } from "./middleware";

export const getMinggle = query({
    args: {
        minggleId: v.id("minggle")
    },
    handler: async (ctx, args) => {
        const { minggle } = await isMinggleOwner(ctx, args.minggleId)

        return minggle
    }
})

export const createMinggle = mutation({
    args: {
        address: v.string(),
        dateTo: v.string(),
        dateFrom: v.string(),
        description: v.optional(v.string()),
        emails: v.array(v.string()),
        latlong: v.array(v.number()),
        timezone: v.string(),
        title: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await isAuthUserId(ctx)
        const minggleId = await ctx.db.insert("minggle", { ...args, userId })

        if (!minggleId) throw new ConvexError("Error when creating minggle")
        return minggleId
    },
})