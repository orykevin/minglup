import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { resend } from "./emails";
import { httpAction } from "./_generated/server";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
    path: "/resend-webhook",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
        return await resend.handleResendEventWebhook(ctx, req);
    }),
});

export default http;
