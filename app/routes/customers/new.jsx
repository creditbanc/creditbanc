import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { firestore } from "~/utils/firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { create } from "zustand";
import { isEmpty, pipe, toLower, replace, dissoc } from "ramda";
import { filter, mod } from "shades";
import { accounts as default_accounts } from "~/data/coa";
import { useLoaderData } from "@remix-run/react";
import { sha256 } from "js-sha256";
import { v4 as uuidv4 } from "uuid";

const useCustomer = create((set) => ({
	id: uuidv4(),
	personal: {
		first_name: "",
		middle_name: "",
		last_name: "",
		company_name: "",
		display_name: "",
		email: "",
		phone: "",
		mobile: "",
		fax: "",
		website: "",
		check_name: "",
	},
	address: {
		address1: "",
		address2: "",
		city: "",
		state: "",
		zip: "",
		country: "",
	},
	notes: {
		notes: "",
		attachments: [],
	},
	payments: {
		terms: "",
	},
	additional: {
		opening_balance: {
			amount: "",
			date: "",
		},
	},
	set_customer: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

function Form() {
	const customer = useCustomer((state) =>
		pipe(dissoc("set_customer"))(state)
	);
	const set_customer = useCustomer((state) => state.set_customer);

	const onCreateCustomer = async (e) => {
		e.preventDefault();

		// console.log("form");
		// console.log(asset);
		// console.log(revenue_account);

		// let { id: revenue_account_id } = customer;
		// let id = pipe(toLower, replace(/\s/g, ""), sha256)(asset.name);

		// let payload = {
		// 	...asset,
		// 	id,
		// 	revenue_account_id,
		// };

		console.log("payload");
		console.log(customer);

		const docRef = await setDoc(
			doc(firestore, "customers", customer.id),
			customer
		);
	};

	return (
		<form className="flex flex-col w-full" onSubmit={onCreateCustomer}>
			<div className="space-y-6">
				<div className="border-b border-gray-900/10 pb-6">
					<h2 className="text-base font-semibold leading-7 text-gray-900">
						New Customer
					</h2>
					{/* <p className="mt-1 text-sm leading-6 text-gray-600">
						Add a new inventory item.
					</p> */}

					<div className="flex flex-col w-full space-y-3 pt-5">
						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									First Name
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.personal.first_name}
											onChange={(e) =>
												set_customer(
													["personal", "first_name"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Last Name
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.personal.last_name}
											onChange={(e) =>
												set_customer(
													["personal", "last_name"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Company name
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={
												customer.personal.company_name
											}
											onChange={(e) =>
												set_customer(
													[
														"personal",
														"company_name",
													],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Customer display name
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={
												customer.personal.display_name
											}
											onChange={(e) =>
												set_customer(
													[
														"personal",
														"display_name",
													],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Email
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.personal.email}
											onChange={(e) =>
												set_customer(
													["personal", "email"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Phone number
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.personal.phone}
											onChange={(e) =>
												set_customer(
													["personal", "phone"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Mobile number
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.personal.mobile}
											onChange={(e) =>
												set_customer(
													["personal", "mobile"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Fax
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.personal.fax}
											onChange={(e) =>
												set_customer(
													["personal", "fax"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-full">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Website
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.personal.website}
											onChange={(e) =>
												set_customer(
													["personal", "website"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-full">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Name to print on checks
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.personal.check_name}
											onChange={(e) =>
												set_customer(
													["personal", "check_name"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="border-b border-gray-900/10 pb-6">
					<div className="flex flex-col w-full space-y-3">
						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Street address 1
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.address.address1}
											onChange={(e) =>
												set_customer(
													["address", "address1"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Street address 2
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.address.address2}
											onChange={(e) =>
												set_customer(
													["address", "address2"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									City
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.address.city}
											onChange={(e) =>
												set_customer(
													["address", "city"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									State
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.address.state}
											onChange={(e) =>
												set_customer(
													["address", "state"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									ZIP code
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.address.zip}
											onChange={(e) =>
												set_customer(
													["address", "zip"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Country
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.address.country}
											onChange={(e) =>
												set_customer(
													["address", "country"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="border-b border-gray-900/10 pb-6">
					<div className="flex flex-col w-full space-y-3">
						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-full">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Notes
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<textarea
											id="about"
											name="about"
											rows={3}
											className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											defaultValue={""}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="border-b border-gray-900/10 pb-6">
					<div className="flex flex-col w-full space-y-3">
						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-full">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Terms
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.first_name}
											onChange={(e) =>
												set_customer(
													["name"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="border-b border-gray-900/10 pb-6">
					<div className="flex flex-col w-full space-y-3">
						<div className="flex flex-row w-full space-x-5">
							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									Opening balance
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.first_name}
											onChange={(e) =>
												set_customer(
													["name"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
							</div>

							<div className="flex flex-col w-1/2">
								<label className="block text-sm font-medium leading-6 text-gray-900">
									As of date
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
										<input
											type="text"
											className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
											value={customer.first_name}
											onChange={(e) =>
												set_customer(
													["name"],
													e.target.value
												)
											}
										/>
									</div>
								</div>
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
	return (
		<div className="flex flex-col items-center w-full pt-10">
			<div className="flex flex-col w-[500px] border rounded p-5">
				<Form />
			</div>
		</div>
	);
}
