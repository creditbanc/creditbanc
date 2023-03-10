import { createCookieSessionStorage } from "@remix-run/node";

export const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: "personal_credit_report",
		},
	});
