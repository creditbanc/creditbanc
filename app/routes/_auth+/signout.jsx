import { redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server";

export const loader = async ({ request }) => {
	return await logout("/", request);
};
