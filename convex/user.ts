import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const getProfile = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null
        return ctx.db.get(userId)
    }
})