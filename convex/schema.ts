import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.

export const minggleTable = defineTable({
  address: v.string(),
  dateFrom: v.string(),
  dateTo: v.string(),
  description: v.optional(v.string()),
  emails: v.array(v.string()),
  latlong: v.array(v.number()),
  timezone: v.string(),
  title: v.string(),
  userId: v.id("users"),
  isFinished: v.optional(v.boolean()),
  isCanceled: v.optional(v.boolean()),
  canceledAt: v.optional(v.number()),
  editCount: v.optional(v.number()),
  lastEditedAt: v.optional(v.number())
}).index("byUser", ["userId", "isFinished", "isCanceled"])

export const emailLists = defineTable({
  emails: v.array(v.string()),
  userId: v.id('users')
}).index("byUser", ["userId"])

export const minggleEmail = defineTable({
  email: v.string(),
  minggleId: v.id("minggle"),
  minggleRef: v.number(), // number to track edited minggle
  resendId: v.optional(v.string()),
  status: v.union(v.literal("failed"), v.literal("sent"), v.literal("delivered"), v.literal("cancelled"), v.literal("bounced"), v.literal("complained"), v.literal("clicked"), v.literal("delivered_delayed"))
}).index("byResendId", ["resendId"]).index("byMinggleId", ["minggleId", "minggleRef"]).index("byEmail", ['email', 'minggleId', 'minggleRef'])

export default defineSchema({
  ...authTables,
  minggle: minggleTable,
  emailLists: emailLists,
  minggleEmail,
});
