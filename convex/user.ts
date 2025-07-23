import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { isAuthUserId } from "./middleware";

export const getProfile = query({
    handler: async (ctx) => {
        const userId = await isAuthUserId(ctx)

        return ctx.db.get(userId)
    }
})