import { form_params, get, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { head, pipe } from "ramda";
import useStore from "./store";
import { Link, useLocation, useSubmit } from "@remix-run/react";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { set_doc, update_doc } from "~/utils/firebase";
import { redirect } from "@remix-run/node";
import { navigation } from "./navigation";
import { filter } from "shades";
import ApplicationProgress from "~/components/ApplicationProgress";

const update_onboarding = async ({ entity_id, group_id, step }) => {
	return set_doc(["onboarding", group_id], { step, entity_id, group_id }, true);
};

export const action = async ({ request }) => {
	console.log("request.url");
	console.log(request.url);
	let url = new URL(request.url);
	let { pathname } = url;
	let group_id = get_group_id(pathname);
	let entity_id = get_entity_id(pathname);
	let params = await form_params(request);

	console.log("params");
	console.log(params);
	console.log(group_id);
	console.log(entity_id);

	let step = pipe(filter({ id: "address" }), head, get("step"))(navigation);
	let { business_address } = params;
	let payload = { business_address: JSON.parse(business_address), step };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);

	await update_onboarding({ entity_id, group_id, step });

	let next = pipe(filter({ id: "address" }), head, get("next"))(navigation);
	return redirect(next({ entity_id, group_id }));
};

const SectionHeading = ({ headline, subheadline }) => {
	return (
		<div className="flex flex-col text-center gap-y-2 my-7">
			<div className="text-gray-800 font-semibold">{headline}</div>
			<div className="text-gray-600">{subheadline}</div>
		</div>
	);
};

const AddressForm = () => {
	let { business_address, set_path } = useStore();

	return (
		<form>
			<div className="space-y-12">
				<div className="border-b border-gray-900/10 pb-12">
					<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
						<div className="col-span-full">
							<label
								htmlFor="street-address"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								Street address
							</label>
							<div className="mt-2">
								<input
									value={business_address.street}
									type="text"
									name="street-address"
									id="street-address"
									autoComplete="street-address"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={(e) => {
										set_path(["business_address", "street"], e.target.value);
									}}
								/>
							</div>
						</div>

						<div className="sm:col-span-2 sm:col-start-1">
							<label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
								City
							</label>
							<div className="mt-2">
								<input
									value={business_address.city}
									type="text"
									name="city"
									id="city"
									autoComplete="address-level2"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={(e) => {
										set_path(["business_address", "city"], e.target.value);
									}}
								/>
							</div>
						</div>

						<div className="sm:col-span-2">
							<label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
								State / Province
							</label>
							<div className="mt-2">
								<input
									value={business_address.state}
									type="text"
									name="region"
									id="region"
									autoComplete="address-level1"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={(e) => {
										set_path(["business_address", "state"], e.target.value);
									}}
								/>
							</div>
						</div>

						<div className="sm:col-span-2">
							<label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
								ZIP / Postal code
							</label>
							<div className="mt-2">
								<input
									value={business_address.zip}
									type="text"
									name="postal-code"
									id="postal-code"
									autoComplete="postal-code"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={(e) => {
										set_path(["business_address", "zip"], e.target.value);
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
};

export default function Container() {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	const submit = useSubmit();
	let { business_address } = useStore();

	let back = pipe(filter({ id: "address" }), head, get("back"))(navigation);

	const onSubmit = () => {
		console.log("onSubmit");
		let payload = { business_address: JSON.stringify(business_address) };

		// console.log("payload");
		// console.log(payload);

		submit(payload, {
			action: `/apply/address/resource/e/${entity_id}/g/${group_id}`,
			method: "post",
		});
	};

	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll pb-10">
			<div className="flex flex-col w-full">
				<ApplicationProgress />
			</div>
			<div className="flex flex-col justify-center h-4/5 w-[600px]">
				<div className="flex flex-col my-4">
					<SectionHeading
						headline={<div>Tell us where your business is located so we can MapQuest directions.</div>}
						subheadline={
							<div className="flex flex-col gap-x-2">
								<div>Just kidding. But we do need an address.</div>
								<div>Have multiple locations? Please provide the primary business address.</div>
								<div> No business address? Your home one will be fine.</div>
							</div>
						}
					/>
				</div>
				<div className="flex flex-col w-full">
					<AddressForm />
				</div>
				<div className="flex flex-row w-full items-center gap-y-4 my-5 gap-x-3">
					<Link
						to={back({ entity_id, group_id })}
						className="flex flex-col py-3 px-4 rounded-full text-[#56CF9E] w-1/2 items-center cursor-pointer border-2 border-[#56CF9E]"
					>
						Back
					</Link>
					<div
						onClick={onSubmit}
						// to={`/apply/entity/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col bg-[#56CF9E] py-3 px-4 rounded-full text-white w-1/2 items-center cursor-pointer"
					>
						Continue to pre-qualify
					</div>
				</div>
			</div>
		</div>
	);
}
