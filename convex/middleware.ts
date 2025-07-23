import { getAuthUserId } from "@convex-dev/auth/server";
import { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";
import { ConvexError } from "convex/values";

export const isAuthUserId = async (ctx: MutationCtx | QueryCtx | ActionCtx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("user id not found")
    return userId
}