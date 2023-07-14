import {
	useFetcher,
	useLoaderData,
	useLocation,
	useNavigate,
} from "@remix-run/react";
import axios from "axios";
import { length, map, pipe } from "ramda";
import { mod } from "shades";
import { create } from "zustand";
import { usePlaidLink } from "react-plaid-link";
import {
	create_axios_form,
	get_entity_id,
	get_group_id,
	inspect,
} from "~/utils/helpers";
import { useEffect, useState } from "react";
import { set_doc } from "~/utils/firebase";

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
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	const { link_token } = useLoaderData();
	const set_plaid = usePlaidStore((state) => state.set_state);
	const [location, setLocation] = useState(null);
	let navigate = useNavigate();

	useEffect(() => setLocation(window.location), []);

	const save_plaid_credentials = async (public_token, metadata) => {
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
		let { access_token } = response?.data;
		if (access_token) {
			let payload = {
				entity_id,
				group_id,
				...response.data,
			};
			await set_doc(["plaid_credentials", group_id], payload);
			console.log("plaid_credentials_saved");
			navigate(
				`/financial/accounts/resource/e/${entity_id}/g/${group_id}`
			);
		}
	};

	const { open, ready } = usePlaidLink({
		token: link_token,
		onSuccess: save_plaid_credentials,
	});

	return (
		<div className="h-full w-full flex flex-col items-center justify-center">
			{open()}
			{/* <button onClick={() => open()} disabled={!ready}>
				Connect a bank account
			</button> */}
		</div>
	);
}
