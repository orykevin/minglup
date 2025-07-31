/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as constant from "../constant.js";
import type * as emailLists from "../emailLists.js";
import type * as emails_index from "../emails/index.js";
import type * as emails_template_cancelledMinggle from "../emails/template/cancelledMinggle.js";
import type * as emails_template_component from "../emails/template/component.js";
import type * as emails_template_confirmedMinggle from "../emails/template/confirmedMinggle.js";
import type * as emails_template_createMinggle from "../emails/template/createMinggle.js";
import type * as emails_template_editedMinggle from "../emails/template/editedMinggle.js";
import type * as emails_template_informedMinggle from "../emails/template/informedMinggle.js";
import type * as emails from "../emails.js";
import type * as helper from "../helper.js";
import type * as http from "../http.js";
import type * as invitedPeople from "../invitedPeople.js";
import type * as middleware from "../middleware.js";
import type * as minggle from "../minggle.js";
import type * as user from "../user.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  constant: typeof constant;
  emailLists: typeof emailLists;
  "emails/index": typeof emails_index;
  "emails/template/cancelledMinggle": typeof emails_template_cancelledMinggle;
  "emails/template/component": typeof emails_template_component;
  "emails/template/confirmedMinggle": typeof emails_template_confirmedMinggle;
  "emails/template/createMinggle": typeof emails_template_createMinggle;
  "emails/template/editedMinggle": typeof emails_template_editedMinggle;
  "emails/template/informedMinggle": typeof emails_template_informedMinggle;
  emails: typeof emails;
  helper: typeof helper;
  http: typeof http;
  invitedPeople: typeof invitedPeople;
  middleware: typeof middleware;
  minggle: typeof minggle;
  user: typeof user;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  resend: {
    lib: {
      cancelEmail: FunctionReference<
        "mutation",
        "internal",
        { emailId: string },
        null
      >;
      cleanupAbandonedEmails: FunctionReference<
        "mutation",
        "internal",
        { olderThan?: number },
        null
      >;
      cleanupOldEmails: FunctionReference<
        "mutation",
        "internal",
        { olderThan?: number },
        null
      >;
      get: FunctionReference<
        "query",
        "internal",
        { emailId: string },
        {
          complained: boolean;
          createdAt: number;
          errorMessage?: string;
          finalizedAt: number;
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          opened: boolean;
          replyTo: Array<string>;
          resendId?: string;
          segment: number;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
          subject: string;
          text?: string;
          to: string;
        } | null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { emailId: string },
        {
          complained: boolean;
          errorMessage: string | null;
          opened: boolean;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
        } | null
      >;
      handleEmailEvent: FunctionReference<
        "mutation",
        "internal",
        { event: any },
        null
      >;
      sendEmail: FunctionReference<
        "mutation",
        "internal",
        {
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          options: {
            apiKey: string;
            initialBackoffMs: number;
            onEmailEvent?: { fnHandle: string };
            retryAttempts: number;
            testMode: boolean;
          };
          replyTo?: Array<string>;
          subject: string;
          text?: string;
          to: string;
        },
        string
      >;
    };
  };
};
