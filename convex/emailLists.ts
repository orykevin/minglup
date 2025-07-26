import { Id } from "./_generated/dataModel";
import { MutationCtx, query } from "./_generated/server";
import { arraysHaveSameValues } from "./helper";
import { isAuthUserId } from "./middleware";

export const getEmailLists = query({
    handler: async (ctx) => {
        const userId = await isAuthUserId(ctx)
        const emailListUser = await ctx.db.query("emailLists").withIndex("byUser", (q) => q.eq("userId", userId)).first();

        return emailListUser
    }
})

export const addEmailListsHelper = async (ctx: MutationCtx, userId: Id<"users">, emails: string[]) => {
    const emailListUser = await ctx.db.query("emailLists").withIndex("byUser", (q) => q.eq("userId", userId)).first();

    if (!emailListUser) {
        await ctx.db.insert("emailLists", { userId, emails })
    } else if (!arraysHaveSameValues(emails, emailListUser.emails)) {
        const newEmails = [...new Set([...emailListUser.emails, ...emails])]
        await ctx.db.patch(emailListUser._id, { emails: newEmails })
    }
}