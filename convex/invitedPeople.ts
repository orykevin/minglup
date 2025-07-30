import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isMinggleOwner } from "./middleware";
import { sendEmailHelper } from "./emails";
import { isAvailableToConfirm } from "./minggle";

export const confirmInvitedPeople = mutation({
    args: {
        invitedId: v.id("invitedPeople")
    },
    handler: async (ctx, args) => {
        const invitedData = await ctx.db.get(args.invitedId)
        if (!invitedData) throw new ConvexError("Invited Data not found")
        if (invitedData.isFailed) throw new ConvexError("Cannot confrim this email, the invitation was failed")
        if (invitedData.confirmedAt) throw new ConvexError("This person is already confirmed")

        const { minggle } = await isMinggleOwner(ctx, invitedData.minggleId);
        if (!isAvailableToConfirm(minggle)) throw new ConvexError("You can't confirm this invitation right now. it must be done at least 3 hours before the event.")

        const allInvitedPeople = await ctx.db.query("invitedPeople").withIndex("byMinggle", (q) => q.eq('minggleId', minggle._id)).collect();
        const confirmed = allInvitedPeople.filter((people) => people.confirmedAt)

        await ctx.db.patch(invitedData._id, {
            confirmedAt: Date.now(),
            rank: confirmed.length + 1
        })

        const emails = allInvitedPeople.filter((invited) => invited.email !== invitedData.email).map((invited) => invited.email)
        const mingglePayload = { minggleId: invitedData.minggleId, minggleRef: (minggle.editCount || 0) }

        await sendEmailHelper(ctx, { emails: [invitedData.email], ...mingglePayload }, 'confirmed')
        await sendEmailHelper(ctx, { emails, ...mingglePayload }, 'info')

        return "The invited person has been successfully confirmed."
    },
})

export const getConfirmed = query({
    args: {
        minggleId: v.id("minggle")
    },
    handler: async (ctx, args) => {
        const allInvited = await ctx.db.query("invitedPeople").withIndex("byMinggle", (q) => q.eq("minggleId", args.minggleId)).collect()
        return allInvited.filter((invited) => invited.rank)
    },
})