import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { firestore } from "~/utils/firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { create } from "zustand";
import { isEmpty, pipe, toLower, replace } from "ramda";
import { filter, mod } from "shades";
import { accounts as default_accounts } from "~/data/coa";
import { useLoaderData } from "@remix-run/react";
import { sha256 } from "js-sha256";

const useAsset = create((set) => ({
	form: {
		name: "",
		description: "",
		price_rate: "",
		type: "inventory",
	},
	set_asset: (path, value) =>
		set((state) => pipe(mod("form", ...path)(() => value))(state)),
}));

const useRevenueAccount = create((set) => ({
	account: { name: "" },
	set_account: (account) => set((state) => ({ account })),
}));

const useAccounts = create((set) => ({
	accounts: [],
	set_accounts: (accounts) => set((state) => ({ accounts })),
}));

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const loader = async () => {
	const coa_response = await getDocs(collection(firestore, "coa"));
	let coa = coa_response.docs.map((doc) => doc.data());
	coa = pipe(filter({ account_type: "revenue" }))(coa);
	return { coa };
};

function RevenueAccountSelect() {
	let account = useRevenueAccount((state) => state.account);
	let set_account = useRevenueAccount((state) => state.set_account);
	let accounts = useAccounts((state) => state.accounts);

	useEffect(() => {
		if (account.name === "" && !isEmpty(accounts)) {
			set_account(accounts[0]);
		}
	}, [accounts]);

	const onSelect = (value) => {
		set_account(value);
	};

	return (
		<Listbox value={account} onChange={onSelect}>
			{({ open }) => (
				<>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
							<span className="block truncate">
								{account.name}
							</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{accounts.map((account) => (
									<Listbox.Option
										key={account.id}
										className={({ active }) =>
											classNames(
												active
													? "bg-indigo-600 text-white"
													: "text-gray-900",
												"relative cursor-default select-none py-2 pl-3 pr-9"
											)
										}
										value={account}
									>
										{({ selected, active }) => (
											<>
												<span
													className={classNames(
														selected
															? "font-semibold"
															: "font-normal",
														"block truncate"
													)}
												>
													{account.name}
												</span>

												{selected ? (
													<span
														className={classNames(
															active
																? "text-white"
																: "text-indigo-600",
															"absolute inset-y-0 right-0 flex items-center pr-4"
														)}
													>
														<CheckIcon
															className="h-5 w-5"
															aria-hidden="true"
														/>
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
}

function Form() {
	const asset = useAsset((state) => state.form);
	const setAsset = useAsset((state) => state.set_asset);
	const revenue_account = useRevenueAccount((state) => state.account);

	const onCreateAccount = async (e) => {
		e.preventDefault();

		// console.log("form");
		// console.log(asset);
		// console.log(revenue_account);

		let { id: revenue_account_id } = revenue_account;
		let id = pipe(toLower, replace(/\s/g, ""), sha256)(asset.name);

		let payload = {
			...asset,
			id,
			revenue_account_id,
		};

		console.log("payload");
		console.log(payload);

		const docRef = await setDoc(doc(firestore, "assets", id), payload);
	};

	return (
		<form className="flex flex-col w-full" onSubmit={onCreateAccount}>
			<div className="space-y-6">
				<div className="border-b border-gray-900/10 pb-6">
					<h2 className="text-base font-semibold leading-7 text-gray-900">
						New Asset
					</h2>
					<p className="mt-1 text-sm leading-6 text-gray-600">
						Add a new inventory item.
					</p>

					<div className="flex flex-col w-full space-y-6 pt-5">
						<div className="flex flex-col w-full">
							<label className="block text-sm font-medium leading-6 text-gray-900">
								Name
							</label>
							<div className="mt-2">
								<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
									<input
										type="text"
										className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
										placeholder="Product name"
										value={asset.name}
										onChange={(e) =>
											setAsset(["name"], e.target.value)
										}
									/>
								</div>
							</div>
						</div>

						<div className="flex flex-col w-full">
							<label
								htmlFor="about"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								Description
							</label>
							<div className="mt-2">
								<textarea
									id="about"
									name="about"
									rows={3}
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									defaultValue={""}
								/>
							</div>
							<p className="mt-3 text-xs leading-6 text-gray-600">
								Write a few sentences about the product.
							</p>
						</div>
					</div>
				</div>

				<div className="border-b border-gray-900/10 pb-6">
					<div className="flex flex-col w-full space-y-6">
						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Sales price/rate
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="number"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={asset.price_rate || ""}
											onChange={(e) =>
												setAsset(
													["price_rate"],
													Number(e.target.value)
												)
											}
										/>
									</div>
								</div>
							</div>
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Revenue account
								</label>

								<RevenueAccountSelect />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-6 flex items-center justify-end gap-x-6">
				<button
					type="button"
					className="text-sm font-semibold leading-6 text-gray-900"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>
					Save
				</button>
			</div>
		</form>
	);
}

export default function NewInventoryItem() {
	const { coa } = useLoaderData();
	const setAccounts = useAccounts((state) => state.set_accounts);

	useEffect(() => {
		setAccounts(coa);
	}, [coa]);

	return (
		<div className="flex flex-col items-center w-full pt-10">
			<div className="flex flex-col w-[500px] border rounded p-5">
				<Form />
			</div>
		</div>
	);
}
