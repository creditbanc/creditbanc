import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import axios from "axios";
import { length, map, pipe } from "ramda";
import { mod } from "shades";
import { create } from "zustand";
import { usePlaidLink } from "react-plaid-link";
import { create_axios_form, inspect } from "~/utils/helpers";
import { useEffect, useState } from "react";
import { set_doc } from "~/utils/firebase";
import {
	get_accounts,
	get_transactions,
	institutions,
	sync_transactions,
} from "~/api/plaid.server";

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

	// let transactions = await sync_transactions();
	// console.log("transactions");
	// inspect(length(transactions));

	// pipe(
	// 	map(async (transaction) => {
	// 		await set_doc(
	// 			["transactions", transaction.transaction_id],
	// 			transaction
	// 		);
	// 		console.log(`transaction ${transaction.transaction_id} saved`);
	// 		return transaction;
	// 	})
	// )(transactions);

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

				let payload = {
					access_token,
				};

				await set_doc(["bank_accounts", access_token], payload);
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
