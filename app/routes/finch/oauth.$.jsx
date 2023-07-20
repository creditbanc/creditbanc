import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { get_session_entity_id } from "~/utils/auth.server";
import { set_doc } from "~/utils/firebase";
import { get_group_id, use_search_params } from "~/utils/helpers";

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	// let group_id = get_group_id(request.url);
	let group_id = "f615b63d-4599-4f90-b406-e1e4270767b0";
	console.log("finch_oauth_loader");
	let { origin } = new URL(request.url);
	let params = use_search_params(request);
	// console.log("params");
	// console.log(params);

	let { code = undefined } = params;

	let redirect_uri = `http://localhost:3000/finch/oauth`;
	// let redirect_uri = `https://creditbanc.io/finch/oauth`;

	let client_id = `dee75c8c-8aec-487a-9b07-1e5e7f935b2a`;
	let client_secret =
		"finch-secret-sandbox-iTpiE21qLqeJun9TvwI3xMHRouBE1GP6UrOSfqks";

	let authorize_uri = `https://connect.tryfinch.com/authorize?&client_id=${client_id}&products=company directory individual employment payment pay_statement&redirect_uri=${redirect_uri}&sandbox=true`;

	if (!code) {
		return redirect(authorize_uri);
	}

	if (code) {
		let data = JSON.stringify({
			client_id,
			client_secret,
			code,
			redirect_uri,
		});

		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://api.tryfinch.com/auth/token",
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		let { data: token_resposne } = await axios.request(config);

		let { access_token = undefined } = token_resposne;

		if (access_token) {
			// console.log("access_token");
			// console.log(access_token);

			let payload = {
				access_token,
				entity_id,
				group_id,
			};

			// console.log("payload");
			// console.log(payload);

			await set_doc(["finch_credentials", group_id], payload);
			// console.log("finch_credentials_saved");
			return { data: access_token };
		}
	}

	return { data: "oauth error" };
};

export default function FinchOauth() {
	let { data } = useLoaderData();

	return <div>{data}</div>;
}
