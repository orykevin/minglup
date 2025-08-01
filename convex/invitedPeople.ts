import { ConvexError, v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
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

        const remainingEmails = allInvitedPeople.filter((invited) => invited.email !== invitedData.email && !invited.confirmedAt).map((invited) => invited.email)
        const mingglePayload = { minggleId: invitedData.minggleId, minggleRef: (minggle.editCount || 0) }
        await sendEmailHelper(ctx, { emails: [invitedData.email], ...mingglePayload }, 'confirmed')
        remainingEmails.length > 0 && await sendEmailHelper(ctx, { emails: remainingEmails, ...mingglePayload }, 'info')

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

export const getInvitedData = internalQuery({
    args: {
        email: v.string(),
        type: v.string(),
        minggleId: v.id("minggle"),
    },
    handler: async (ctx, args) => {
        const invitedPeople = await ctx.db.query("invitedPeople").withIndex("byEmail", (q) => q.eq("email", args.email).eq("minggleId", args.minggleId)).first();
        const minggleData = await ctx.db.get(args.minggleId)
        if (!invitedPeople || !minggleData) {
            throw new ConvexError("Data not found")
        }
        const user = (args.type === "create" || args.type === "invited") ? await ctx.db.get(minggleData.userId) : null
        const allInvitedPeople = args.type === "" ? await ctx.db.query("invitedPeople").withIndex("byMinggle", (q) => q.eq("minggleId", args.minggleId)).collect() : null

        return {
            invitedPeople,
            minggleData,
            user,
            allInvitedPeople,
        }
    }
})