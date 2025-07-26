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
  isFinished: v.optional(v.boolean())
}).index("byUser", ["userId", "isFinished"])

export const emailLists = defineTable({
  emails: v.array(v.string()),
  userId: v.id('users')
}).index("byUser", ["userId"])

export default defineSchema({
  ...authTables,
  minggle: minggleTable,
  emailLists: emailLists
});
