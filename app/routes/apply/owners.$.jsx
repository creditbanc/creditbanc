import { classNames, form_params, get, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe, map, head, values, length, dissoc } from "ramda";
import useStore from "./store";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Link, useLoaderData, useLocation, useSubmit } from "@remix-run/react";
import { filter } from "shades";
import { v4 as uuidv4 } from "uuid";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { get_doc, update_doc } from "~/utils/firebase";
import { redirect } from "@remix-run/node";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { get_session_entity_id } from "~/utils/auth.server";
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

	let step = pipe(filter({ id: "owners" }), head, get("step"))(navigation);
	let { owners } = params;
	let payload = { owners: JSON.parse(owners), step };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);

	let next = pipe(filter({ id: "owners" }), head, get("next"))(navigation);
	return redirect(next({ entity_id, group_id }));
};

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	let application = await lastValueFrom(from(get_doc(["application", entity_id])));

	return { application };
};

const SectionHeading = ({ headline, subheadline }) => {
	return (
		<div className="flex flex-col text-center gap-y-2 my-7">
			<div className="text-gray-800 font-semibold">{headline}</div>
			<div className="text-gray-600">{subheadline}</div>
		</div>
	);
};

const OwnerForm = ({ owner }) => {
	const { set_path, owners } = useStore();

	const onDeleteOwner = () => {
		console.log("onDeleteOwner");
		console.log(owner);
		set_path(["owners"], dissoc(owner.id, owners));
	};

	return (
		<div className="flex flex-col border p-5 rounded">
			<div className="border-b border-gray-200 bg-white pb-3 mb-3">
				<div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
					<div className="ml-4 mt-2">
						<h3 className="text-base font-semibold leading-6 text-gray-900">Owner</h3>
					</div>
					<div className="ml-4 mt-2 flex-shrink-0">
						<button
							onClick={onDeleteOwner}
							type="button"
							className="relative inline-flex items-center rounded-md px-2 py-2 text-xs font-semibold  border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
						>
							<XMarkIcon className="h-5 w-5 text-gray-300" />
						</button>
					</div>
				</div>
			</div>

			<form>
				<div className=" border-gray-900/10">
					<div className=" grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
						<div className="col-span-full">
							<label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
								Ownership percentage
							</label>
							<div className="mt-2 flex flex-row items-center">
								<input
									value={owner?.ownership_percentage}
									type="text"
									name="percentage"
									id="percentage"
									placeholder="0"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 text-right pr-6"
									onChange={(e) => {
										set_path(
											["owners", owner.id, "ownership_percentage"],
											e.target.value.replace(/\d+% ?/g, "")
										);
									}}
								/>
								<div className="flex flex-col -ml-5 text-sm">%</div>
							</div>
						</div>

						<div className="sm:col-span-3">
							<label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
								First name
							</label>
							<div className="mt-2">
								<input
									value={owner.first_name}
									type="text"
									name="first-name"
									id="first-name"
									autoComplete="given-name"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
									onChange={(e) => set_path(["owners", owner.id, "first_name"], e.target.value)}
								/>
							</div>
						</div>

						<div className="sm:col-span-3">
							<label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
								Last name
							</label>
							<div className="mt-2">
								<input
									value={owner.last_name}
									type="text"
									name="last-name"
									id="last-name"
									autoComplete="family-name"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
									onChange={(e) => set_path(["owners", owner.id, "last_name"], e.target.value)}
								/>
							</div>
						</div>

						<div className="col-span-full">
							<label className="block text-sm font-medium leading-6 text-gray-900">SSN #</label>
							<div className="mt-2">
								<input
									value={owner?.ssn}
									id="ssn"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
									onChange={(e) => set_path(["owners", owner.id, "ssn"], e.target.value)}
								/>
							</div>
						</div>

						<div className="col-span-full">
							<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
								Email address
							</label>
							<div className="mt-2">
								<input
									value={owner.email}
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
									onChange={(e) => set_path(["owners", owner.id, "email"], e.target.value)}
								/>
							</div>
						</div>

						<div className="col-span-full">
							<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
								Phone number
							</label>
							<div className="mt-2">
								<input
									value={owner.phone}
									id="phone"
									name="phone"
									type="phone"
									autoComplete="phone"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
									onChange={(e) => set_path(["owners", owner.id, "phone"], e.target.value)}
								/>
							</div>
						</div>

						<div className="col-span-full">
							<label
								htmlFor="street-address"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								Street address
							</label>
							<div className="mt-2">
								<input
									value={owner?.address?.street}
									type="text"
									name="street-address"
									id="street-address"
									autoComplete="street-address"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
									onChange={(e) =>
										set_path(["owners", owner.id, "address", "street"], e.target.value)
									}
								/>
							</div>
						</div>

						<div className="sm:col-span-2 sm:col-start-1">
							<label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
								City
							</label>
							<div className="mt-2">
								<input
									value={owner?.address?.city}
									type="text"
									name="city"
									id="city"
									autoComplete="address-level2"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
									onChange={(e) => set_path(["owners", owner.id, "address", "city"], e.target.value)}
								/>
							</div>
						</div>

						<div className="sm:col-span-2">
							<label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
								State / Province
							</label>
							<div className="mt-2">
								<input
									value={owner?.address?.state}
									type="text"
									name="region"
									id="region"
									autoComplete="address-level1"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
									onChange={(e) => set_path(["owners", owner.id, "address", "state"], e.target.value)}
								/>
							</div>
						</div>

						<div className="sm:col-span-2">
							<label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
								ZIP / Postal code
							</label>
							<div className="mt-2">
								<input
									value={owner?.address?.zip}
									type="text"
									name="postal-code"
									id="postal-code"
									autoComplete="postal-code"
									className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
									onChange={(e) => set_path(["owners", owner.id, "address", "zip"], e.target.value)}
								/>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

const owners = [
	{
		name: "Person",
		type: "person",
		model: {
			first_name: "",
			last_name: "",
			email: "",
			address: {
				street: "",
				city: "",
				state: "",
				zip: "",
			},
		},
	},
	{
		name: "Business",
	},
];

const Owners = () => {
	const [selected, setSelected] = useState(owners[0]);
	const { set_path, owners: business_owners } = useStore();

	const onAddOwner = (type) => {
		console.log("onAddOwner");

		let { model } = pipe(filter({ type }), head)(owners);
		let owner_id = uuidv4();

		let payload = {
			id: owner_id,
			type,
			...model,
		};

		set_path(["owners", owner_id], payload);
	};

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col w-full gap-y-6">
				{pipe(
					values,
					mapIndexed((owner, index) => (
						<div key={index}>
							<OwnerForm owner={owner} />
						</div>
					))
				)(business_owners)}
			</div>
			<RadioGroup value={selected} onChange={setSelected}>
				<RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
				<div className="space-y-4 my-4">
					{length(values(business_owners)) > 0 && (
						<div className="font-semibold flex flex-col items-center py-4">Add another owner</div>
					)}
					{pipe(
						mapIndexed((plan, index) => (
							<RadioGroup.Option
								key={index}
								value={plan}
								className={({ active }) =>
									classNames(
										"relative block cursor-pointer rounded-full border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between border-gray-300"
									)
								}
								onClick={() => onAddOwner(plan.type)}
							>
								{({ active, checked }) => (
									<>
										<div className="flex items-center w-full">
											<div className="flex flex-col text-sm items-center w-full">
												<RadioGroup.Label
													as="span"
													className="flex flex-col items-center text-align center w-full font-medium text-gray-900"
												>
													{plan.name}
												</RadioGroup.Label>
											</div>
										</div>

										<div
											className={classNames(
												"pointer-events-none absolute -inset-px rounded-full border-transparent border-2"
											)}
											aria-hidden="true"
										/>
									</>
								)}
							</RadioGroup.Option>
						))
					)(owners)}
				</div>
			</RadioGroup>
		</div>
	);
};

export default function Container() {
	let { application } = useLoaderData();
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let { owners: business_owners } = useStore((state) => state);
	const submit = useSubmit();

	let back = pipe(filter({ id: "owners" }), head, get("back"))(navigation);

	const onSubmit = () => {
		console.log("onSubmit");
		let payload = { owners: JSON.stringify(business_owners) };

		// console.log("payload");
		// console.log(payload);

		submit(payload, {
			action: `/apply/owners/resource/e/${entity_id}/g/${group_id}`,
			method: "post",
		});
	};

	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll">
			<div className="flex flex-col w-full mb-10">
				<ApplicationProgress />
			</div>
			<div
				className="flex flex-col h-full w-[600px]"
				style={{ justifyContent: length(values(business_owners)) == 0 ? "center" : "start" }}
			>
				<div className="flex flex-col">
					<SectionHeading
						headline={<div>Who owns 20% or more of {application?.legal_name}?</div>}
						subheadline={
							<div className="flex flex-row gap-x-2">
								<div>
									Enter all owners of the business who own 20% or more of roas. Rest easy, this won’t
									impact your credit and won’t show up as an inquiry on your credit report.
								</div>
							</div>
						}
					/>
				</div>
				<div className="flex flex-col w-full ">
					<Owners />
				</div>
				<div className="flex flex-row w-full items-center gap-y-4 my-5 gap-x-3 pb-[50px]">
					<Link
						to={back({ entity_id, group_id })}
						className="flex flex-col py-3 px-4 rounded-full text-[#56CF9E] w-1/2 items-center cursor-pointer border-2 border-[#56CF9E]"
					>
						Back
					</Link>
					<div
						onClick={onSubmit}
						// to={`/apply/owner/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col bg-[#56CF9E] py-3 px-4 rounded-full text-white w-[450px] items-center cursor-pointer"
					>
						Continue to pre-qualify
					</div>
				</div>
			</div>
		</div>
	);
}
