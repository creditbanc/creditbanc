import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { firestore } from "~/utils/firebase";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import {
	isEmpty,
	pipe,
	toLower,
	replace,
	head,
	findIndex,
	sum,
	length,
	reject,
	dissoc,
} from "ramda";
import { filter, get, mod, all } from "shades";
import { useLoaderData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const new_invoice_item = () => ({
	id: uuidv4(),
	balance: 0,
	paid: 0,
	total: 0,
	quantity: 1,
	rate: 0,
	asset_id: "",
});

const useInvoice = create((set) => ({
	id: uuidv4(),
	type: "invoice",
	customer_id: "",
	name: "",
	description: "",
	total: 0,
	paid: 0,
	balance: 0,
	invoice_date: "",
	due_date: "",
	terms: "",
	created_at: "",
	items: [new_invoice_item()],
	set_invoice: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

const useAccounts = create((set) => ({
	accounts: [],
	set_accounts: (accounts) => set((state) => ({ accounts })),
}));

const useProductsAndServices = create((set) => ({
	products_and_services: [],
	set_products_and_services: (products_and_services) =>
		set((state) => ({ products_and_services })),
}));

export const loader = async () => {
	const coa_response = await getDocs(collection(firestore, "coa"));
	let coa = coa_response.docs.map((doc) => doc.data());
	coa = pipe(filter({ account_type: "revenue" }))(coa);

	const products_response = await getDocs(collection(firestore, "assets"));
	let products_and_services = products_response.docs.map((doc) => doc.data());

	const customers_response = await getDocs(
		collection(firestore, "customers")
	);

	let customers = customers_response.docs.map((doc) => doc.data());

	return { coa, products_and_services, customers };
};

function ProductsAndServicesSelect({ invoice_item_index }) {
	let set_invoice = useInvoice((state) => state.set_invoice);
	let products_and_services = useProductsAndServices(
		(state) => state.products_and_services
	);

	const [selected_asset, set_selected_asset] = useState({});

	useEffect(() => {
		let has_empty_value =
			isEmpty(selected_asset) && !isEmpty(products_and_services);

		if (has_empty_value) {
			set_selected_asset(products_and_services[0]);
		}
	}, [products_and_services]);

	useEffect(() => {
		if (!isEmpty(selected_asset)) {
			set_invoice(
				["items", invoice_item_index, "asset_id"],
				selected_asset.id
			);
		}
	}, [selected_asset]);

	const onSelect = (value) => {
		set_selected_asset(value);
	};

	return (
		<Listbox value={selected_asset} onChange={onSelect}>
			{({ open }) => (
				<>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
							<span className="block truncate">
								{selected_asset?.name}
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
								{products_and_services.map((item) => (
									<Listbox.Option
										key={item.id}
										className={({ active }) =>
											classNames(
												active
													? "bg-indigo-600 text-white"
													: "text-gray-900",
												"relative cursor-default select-none py-2 pl-3 pr-9"
											)
										}
										value={item}
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
													{item.name}
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

function CustomersSelect() {
	let { customers } = useLoaderData();

	let set_invoice = useInvoice((state) => state.set_invoice);
	const [selected, set_selected] = useState({});

	useEffect(() => {
		let has_empty_value = isEmpty(selected);

		if (has_empty_value) {
			set_selected(customers[0]);
		}
	}, [customers]);

	useEffect(() => {
		if (!isEmpty(selected)) {
			set_invoice(["customer_id"], selected.id);
		}
	}, [selected]);

	const onSelect = (value) => {
		set_selected(value);
	};

	return (
		<Listbox value={selected} onChange={onSelect}>
			{({ open }) => (
				<>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
							<div className="flex flex-row space-x-1">
								<span className="block truncate">
									{selected?.personal?.company_name}
								</span>
							</div>
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
								{customers.map((item) => (
									<Listbox.Option
										key={item.id}
										className={({ active }) =>
											classNames(
												active
													? "bg-indigo-600 text-white"
													: "text-gray-900",
												"relative cursor-default select-none py-2 pl-3 pr-9"
											)
										}
										value={item}
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
													{item.personal.company_name}
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

const InvoiceItem = ({ id, item_index }) => {
	const get_item = (id) => pipe(filter({ id }), head);
	let invoice_item = useInvoice((state) => get_item(id)(state.items));
	let set_invoice = useInvoice((state) => state.set_invoice);
	let quantity = invoice_item.quantity;
	let rate = invoice_item.rate;
	let invoice_item_total = quantity * rate;
	let asset_id = invoice_item.asset_id;

	const update_item_rate = async () => {
		if (asset_id) {
			let docRef = doc(firestore, "assets", asset_id);
			let docSnap = await getDoc(docRef);
			let asset = docSnap.data();
			let { price_rate } = asset;
			set_invoice(["items", item_index, "rate"], price_rate);
		}
	};

	useEffect(() => {
		set_invoice(["items", item_index, "total"], invoice_item_total);
	}, [invoice_item_total]);

	useEffect(() => {
		update_item_rate();
	}, [asset_id]);

	return (
		<div className="flex flex-row items-baseline space-x-2">
			<div className="flex flex-col h-[35px] w-[250px]">
				<ProductsAndServicesSelect invoice_item_index={item_index} />
			</div>
			<div className="flex flex-col rounded-md shadow-sm ring-1 ring-inset ring-gray-300 h-[35px]">
				<input
					type="number"
					className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
					placeholder="quantity"
					value={invoice_item.quantity}
					onChange={(e) =>
						set_invoice(
							["items", item_index, "quantity"],
							Number(e.target.value)
						)
					}
				/>
			</div>
			<div className="flex flex-col rounded-md shadow-sm ring-1 ring-inset ring-gray-300 h-[35px]">
				<input
					type="number"
					className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
					placeholder="rate"
					value={invoice_item.rate}
					onChange={(e) =>
						set_invoice(
							["items", item_index, "rate"],
							Number(e.target.value)
						)
					}
				/>
			</div>
			<div className="flex flex-col rounded-md shadow-sm ring-1 ring-inset ring-gray-300 h-[35px]">
				<input
					type="number"
					className="flex flex-col w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
					placeholder="Product name"
					value={invoice_item_total}
					readOnly={true}
				/>
			</div>
		</div>
	);
};

function Form() {
	const invoice_items = useInvoice((state) => state.items);
	const set_invoice = useInvoice((state) => state.set_invoice);
	const invoice_total = useInvoice((state) => state.total);
	const invoice = useInvoice((state) => pipe(dissoc("set_invoice"))(state));

	const onCreateInvoice = async (e) => {
		e.preventDefault();

		let balance = invoice.total;

		let payload = {
			...invoice,
			balance,
		};

		await setDoc(doc(firestore, "invoices", invoice.id), payload);
	};

	const onAddProductServiceItem = () => {
		set_invoice(["items"], [...invoice_items, new_invoice_item()]);
	};

	const onDeleteInvoiceItem = (id) => {
		set_invoice(
			["items"],
			pipe(reject((item) => item.id == id))(invoice_items)
		);
	};

	useEffect(() => {
		let total = pipe(get(all, "total"), sum)(invoice_items);
		set_invoice(["total"], total);
	}, [invoice_items]);

	return (
		<form className="flex flex-col w-full" onSubmit={onCreateInvoice}>
			<div className="space-y-6">
				<div className="border-b border-gray-900/10 pb-6">
					<h2 className="text-base font-semibold leading-7 text-gray-900">
						New Invoice
					</h2>
					{/* <p className="mt-1 text-sm leading-6 text-gray-600">
						Add a new inventory item.
					</p> */}

					<div className="flex flex-col w-full space-y-6 pt-5">
						<div className="flex flex-col w-full">
							<label className="block text-sm font-medium leading-6 text-gray-900">
								Customer
							</label>
							<div className="mt-2">
								<CustomersSelect />
							</div>
						</div>

						<div className="flex flex-col w-full">
							<label className="block text-sm font-medium leading-6 text-gray-900">
								Product or service
							</label>
							<div className="mt-2 space-y-2">
								{invoice_items.map((item, item_index) => (
									<div
										onMouseOver={() =>
											set_invoice(
												["items", item_index, "hover"],
												true
											)
										}
										onMouseLeave={() =>
											set_invoice(
												["items", item_index, "hover"],
												false
											)
										}
										key={item.id}
										className="w-[calc(100%+50px)] flex flex-row justify-between h-[45px]"
									>
										<div className="w-[calc(100%-50px)]">
											<InvoiceItem
												id={item.id}
												item_index={item_index}
											/>
										</div>
										{item.hover &&
											length(invoice_items) !== 1 && (
												<div
													className="flex flex-col items-center h-full justify-center w-[30px] cursor-pointer pl-1"
													onClick={() =>
														onDeleteInvoiceItem(
															item.id
														)
													}
												>
													<div className="flex flex-col w-[20px]">
														<TrashIcon />
													</div>
												</div>
											)}
									</div>
								))}
							</div>
							<div
								className="border-t flex flex-row w-full mt-3 text-sm pt-3 space-x-2 text-blue-700 justify-center cursor-pointer"
								onClick={onAddProductServiceItem}
							>
								<div className="flex flex-col w-[20px]">
									<PlusCircleIcon />
								</div>
								<div>Add product or service</div>
							</div>
						</div>

						{/* <div className="flex flex-col w-full">
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
						</div> */}
					</div>
				</div>

				<div className="border-b border-gray-900/10 pb-6 flex flex-row">
					<div className="w-1/2"></div>
					<div className="w-1/2 flex flex-col items-end text-sm">
						<div className="flex flex-row justify-between w-full">
							<div>Subtotal</div>
							<div>{invoice_total}</div>
						</div>
						<div className="border-t w-full flex flex-col h-[1px] my-3"></div>
						<div className="flex flex-row justify-between w-full font-semibold">
							<div>Invoice total</div>
							<div>{invoice_total}</div>
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

export default function NewInvoice() {
	const { coa, products_and_services } = useLoaderData();
	const setAccounts = useAccounts((state) => state.set_accounts);
	const setProductsAndServices = useProductsAndServices(
		(state) => state.set_products_and_services
	);

	useEffect(() => {
		setAccounts(coa);
	}, [coa]);

	useEffect(() => {
		setProductsAndServices(products_and_services);
	}, [products_and_services]);

	return (
		<div className="flex flex-col items-center w-full py-10">
			<div className="flex flex-col w-[500px] border rounded p-5">
				<Form />
			</div>
		</div>
	);
}
