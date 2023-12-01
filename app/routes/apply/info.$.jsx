import { form_params, get, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { head, pipe } from "ramda";
import useStore from "./store";
import { Link, useLocation, useSubmit } from "@remix-run/react";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { update_doc } from "~/utils/firebase";
import { redirect } from "@remix-run/node";
import { filter } from "shades";
import { navigation } from "./navigation";
import ApplicationProgress from "~/components/ApplicationProgress";

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

	let step = pipe(filter({ id: "info" }), head, get("step"))(navigation);
	let { ein, legal_name, dba } = params;
	let payload = { ein, legal_name, dba, step };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);

	let next = pipe(filter({ id: "info" }), head, get("next"))(navigation);
	return redirect(next({ entity_id, group_id }));
};

const SectionHeading = ({ headline, subheadline }) => {
	return (
		<div className="flex flex-col text-center gap-y-2">
			<div className="text-gray-800 font-semibold">{headline}</div>
			<div className="text-gray-600">{subheadline}</div>
		</div>
	);
};

const AddressForm = () => {
	let { legal_name, ein, set_path, dba } = useStore();

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
								Business legal name
							</label>
							<div className="mt-2">
								<input
									value={legal_name}
									type="text"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={(e) => {
										set_path(["legal_name"], e.target.value);
									}}
								/>
							</div>
						</div>

						<div className="col-span-full">
							<div className="flex flex-row justify-between items-end w-full">
								<label
									htmlFor="street-address"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Doing business as (DBA)
								</label>
								<div className="flex flex-col text-xs text-gray-400">optional</div>
							</div>
							<div className="mt-2">
								<input
									value={dba}
									type="text"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={(e) => {
										set_path(["dba"], e.target.value);
									}}
								/>
							</div>
						</div>

						<div className="col-span-full">
							<label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
								Employer identification number (EIN)
							</label>
							<div className="mt-2">
								<input
									value={ein}
									type="text"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={(e) => {
										set_path(["ein"], e.target.value);
									}}
								/>
							</div>
						</div>

						{/* <div className="col-span-full">
							<label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
								Business Phone Number
							</label>
							<div className="mt-2">
								<input
									value={ein}
									type="text"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={(e) => {
										set_path(["ein"], e.target.value);
									}}
								/>
							</div>
						</div> */}
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
	let { ein, legal_name, dba } = useStore();

	let back = pipe(filter({ id: "info" }), head, get("back"))(navigation);

	const onSubmit = () => {
		console.log("onSubmit");
		let payload = { ein, legal_name, dba };

		// console.log("payload");
		// console.log(payload);

		submit(payload, {
			action: `/apply/info/resource/e/${entity_id}/g/${group_id}`,
			method: "post",
		});
	};

	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll pb-10">
			<div className="flex flex-col w-full">
				{/* <Progress /> */}
				<ApplicationProgress />
			</div>
			<div className="flex flex-col justify-center h-4/5 w-[600px]">
				<div className="flex flex-col my-4">
					<SectionHeading
						headline={<div>Lets start your loan application</div>}
						subheadline={
							<div className="flex flex-col gap-x-2">
								<div className="">Business Info</div>
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
						className="flex flex-col py-3 px-4 rounded-full text-blue-600 w-1/2 items-center cursor-pointer border-2 border-blue-600"
					>
						Back
					</Link>
					<div
						onClick={onSubmit}
						// to={`/apply/entity/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col bg-blue-600 py-3 px-4 rounded-full text-white w-1/2 items-center cursor-pointer"
					>
						Continue to pre-qualify
					</div>
				</div>
			</div>
		</div>
	);
}
