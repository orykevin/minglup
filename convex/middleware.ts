import { getAuthUserId } from "@convex-dev/auth/server";
import { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

export const isAuthUserId = async (ctx: MutationCtx | QueryCtx | ActionCtx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("user id not found")
    return userId
}

export const isMinggleOwner = async (ctx: MutationCtx | QueryCtx, minggleId: Id<"minggle">) => {
    const userId = await isAuthUserId(ctx)
    const minggle = await ctx.db.get(minggleId)

    if (!minggle) throw new ConvexError("Minggle not found")
    if (minggle.userId !== userId) throw new ConvexError("You're not the owner of this minggle")

    return {
        userId,
        minggle,
    }
}