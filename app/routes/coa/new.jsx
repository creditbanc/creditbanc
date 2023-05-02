import { Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { firestore } from "~/utils/firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { create } from "zustand";
import { pipe, replace, toLower } from "ramda";
import { mod } from "shades";
import { accounts } from "~/data/coa";
import { sha256 } from "js-sha256";

const useForm = create((set) => ({
	form: {
		name: "",
		type: "",
	},
	setForm: (path, value) =>
		set((state) => pipe(mod("form", ...path)(() => value))(state)),
}));

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const loader = async () => {
	const coa_response = await getDocs(collection(firestore, "coa"));
	let coa = coa_response.docs.map((doc) => doc.data());
	return { coa };
};

function AccountTypeSelect() {
	const form = useForm((state) => state.form);
	const setForm = useForm((state) => state.setForm);

	useEffect(() => {
		if (form.type === "") {
			setForm(["type"], accounts[0]);
		}
	}, []);

	const onSelect = (value) => {
		setForm(["type"], value);
	};

	return (
		<Listbox value={form.type} onChange={onSelect}>
			{({ open }) => (
				<>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
							<span className="block truncate">
								{form.type.name}
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

export const action = async () => {};

function Form() {
	const form = useForm((state) => state.form);
	const setForm = useForm((state) => state.setForm);

	const onCreateAccount = async (e) => {
		e.preventDefault();
		console.log("onCreateAccount");

		console.log("form");
		console.log(form);

		let { name, type } = form;

		let id = pipe(toLower, replace(/\s/g, ""), sha256)(form.name);

		let payload = {
			...type,
			name,
			id,
		};

		const docRef = await setDoc(doc(firestore, "coa", id), payload);
	};

	return (
		<form className="flex flex-col w-full" onSubmit={onCreateAccount}>
			<div className="space-y-12">
				<div className="border-b border-gray-900/10 pb-12">
					<h2 className="text-base font-semibold leading-7 text-gray-900">
						New Account
					</h2>
					<p className="mt-1 text-sm leading-6 text-gray-600">
						Create a new account to track income or expenses.
					</p>

					<div className="mt-5 flex flex-col w-full space-y-6">
						<div className="">
							<label
								htmlFor="username"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								Name
							</label>
							<div className="mt-2">
								<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
									<input
										type="text"
										className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
										placeholder="Accounts Receivable"
										value={form.name}
										onChange={(e) =>
											setForm(["name"], e.target.value)
										}
									/>
								</div>
							</div>
						</div>

						<div className="">
							<label
								htmlFor="username"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								Type
							</label>
							<div className="mt-2">
								<AccountTypeSelect />
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

export default function New() {
	return (
		<div className="flex flex-col items-center w-full pt-10">
			<div className="flex flex-col w-[500px] border rounded p-5">
				<Form />
			</div>
		</div>
	);
}
