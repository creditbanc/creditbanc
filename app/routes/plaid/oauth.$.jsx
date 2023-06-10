import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import axios from "axios";
import { pipe } from "ramda";
import { mod } from "shades";
import { create } from "zustand";
import { usePlaidLink } from "react-plaid-link";
import { create_axios_form } from "~/utils/helpers";
import { useEffect, useState } from "react";

const usePlaidStore = create((set) => ({
	link_token: "",
	public_token: "",
	set_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let location = new URL(request.url);
	let { origin } = location;

	let plaid_create_link_token_url = `${origin}/plaid/create_link_token`;

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: plaid_create_link_token_url,
	};

	let response = await axios(config);

	let { data } = response;
	let { link_token } = data;
	return { link_token };
};

export default function PlaidOauth() {
	const { link_token } = useLoaderData();
	const set_plaid = usePlaidStore((state) => state.set_state);
	const [location, setLocation] = useState(null);

	useEffect(() => setLocation(window.location), []);

	const { open, ready } = usePlaidLink({
		token: link_token,
		onSuccess: async (public_token, metadata) => {
			// send public_token to server
			// console.log("public_token");
			// console.log(public_token);
			// console.log("metadata");
			// console.log(metadata);

			set_plaid(["public_token"], public_token);
			let plaid_exchange_public_token_url = `${location.origin}/plaid/exchange_public_token`;
			let data = create_axios_form({ public_token });

			let config = {
				method: "post",
				maxBodyLength: Infinity,
				headers: { "Content-Type": "multipart/form-data" },
				url: plaid_exchange_public_token_url,
				data,
			};

			let response = await axios(config);
			let { access_token } = response.data;

			if (access_token) {
				console.log("plaid_exchange_public_token_response");
				console.log(access_token);
			}
		},
	});

	return (
		<div className="h-full w-full flex flex-col items-center justify-center">
			<button onClick={() => open()} disabled={!ready}>
				Connect a bank account
			</button>
		</div>
	);
}
