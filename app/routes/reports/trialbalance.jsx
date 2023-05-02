import { firestore } from "~/utils/firebase";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import {
	flatten,
	pipe,
	sum,
	map,
	head,
	groupBy,
	prop,
	mapObjIndexed,
	values,
} from "ramda";
import { all, filter, get } from "shades";
import { useLoaderData } from "@remix-run/react";
import { create } from "zustand";
import { inspect } from "~/utils/helpers";

const usReport = create((set) => ({
	accounts_recievable: {
		debits: 0,
		credits: 0,
		name: "Accounts Recievable A/R",
	},
	set_report: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async () => {
	const invoice_response = await getDocs(collection(firestore, "invoices"));
	let invoices = invoice_response.docs.map((doc) => doc.data());
	// console.log("invoices");
	// console.log(invoices);

	let invoice_items = pipe(
		get(all, "items"),
		flatten,
		groupBy(prop("asset_id")),
		mapObjIndexed((items, asset_id) => ({
			asset_id,
			items,
		}))
	)(invoices);

	// console.log("invoice_items");
	// console.log(invoice_items);

	let asset_ids = pipe(get(all, "items", all, "asset_id"), flatten)(invoices);

	const get_asset = async (id) => {
		const docRef = doc(firestore, "assets", id);
		const docSnap = await getDoc(docRef);
		let data = docSnap.data();
		return data;
	};

	const get_revenue_account = async (id) => {
		const docRef = doc(firestore, "coa", id);
		const docSnap = await getDoc(docRef);
		let data = docSnap.data();
		return data;
	};

	const get_revenue_accounts = async (asset_ids) => {
		let assets = await Promise.all(
			pipe(map(async (asset_id) => await get_asset(asset_id)))(asset_ids)
		);

		// console.log("assets");
		// console.log(assets);

		let revenue_account_ids = pipe(get(all, "revenue_account_id"))(assets);

		// console.log("revenue_account_ids");
		// console.log(revenue_account_ids);

		let revenue_accounts = await Promise.all(
			pipe(map(async (id) => await get_revenue_account(id)))(
				revenue_account_ids
			)
		);

		// console.log("revenue_accounts");
		// console.log(revenue_accounts);

		assets = pipe(
			map((asset) => ({
				...asset,
				revenue_account: pipe(
					filter({ id: asset.revenue_account_id }),
					head
				)(revenue_accounts),
			}))
		)(assets);

		// console.log("assets");
		// inspect(assets);

		return assets;
	};

	// console.log("asset_ids");
	// console.log(asset_ids);

	let assets = await get_revenue_accounts(asset_ids);

	// console.log("assets");
	// inspect(assets);

	let revenue_accounts = pipe(
		map((item) => ({
			...item,
			...pipe(filter({ id: item.asset_id }), head)(assets),
		})),
		values,
		map((account) => ({
			balance_type: account.revenue_account.balance_type,
			revenue_account_id: account.revenue_account.id,
			name: account.revenue_account.name,
			credits: pipe(get(all, "total"), sum)(account.items),
			debits: 0,
		}))
	)(invoice_items);

	// console.log("revenue_accounts");
	// inspect(revenue_accounts);

	let accounts_recievable_debits = pipe(get(all, "balance"), sum)(invoices);
	let accounts_recievable = {
		name: "Accounts Recievable (A/R)",
		debits: accounts_recievable_debits,
		credits: 0,
	};

	let accounts = [accounts_recievable, ...revenue_accounts];

	let total_credits = pipe(get(all, "credits"), sum)(accounts);
	let total_debits = pipe(get(all, "debits"), sum)(accounts);

	let total = {
		name: "Total",
		debits: total_debits,
		credits: total_credits,
	};

	// console.log("total");
	// console.log(total);

	return { accounts_recievable, revenue_accounts, total };
};

const ReportRow = ({ account }) => {
	// console.log("account");
	// console.log(account);

	return (
		<div className="flex flex-row w-full py-2 text-sm">
			<div className="flex flex-col w-2/4">{account.name}</div>
			<div className="flex flex-col w-1/4 items-end">
				{account.debits}
			</div>
			<div className="flex flex-col w-1/4 items-end">
				{account.credits}
			</div>
		</div>
	);
};

const Report = () => {
	let { accounts_recievable, revenue_accounts, total } = useLoaderData();

	return (
		<div>
			<div className="flex flex-row w-full border-b-2 border-t-2 border-black py-2 font-semibold text-sm">
				<div className="flex flex-col w-2/4"></div>
				<div className="flex flex-col w-1/4 items-end">DEBIT</div>
				<div className="flex flex-col w-1/4 items-end">CREDIT</div>
			</div>
			<ReportRow account={accounts_recievable} />
			<div>
				{pipe(
					map((account) => (
						<ReportRow key={account.name} account={account} />
					))
				)(revenue_accounts)}
			</div>
			<div className="flex flex-col border-t-2 border-black mt-2"></div>
			<div className="font-semibold">
				<ReportRow account={total} />
			</div>
		</div>
	);
};

export default function TrialBalance() {
	return (
		<div className="flex flex-col items-center w-full py-10">
			<div className="flex flex-col w-[500px] border rounded p-5">
				<div className="flex flex-col w-full items-center font-semibold my-3">
					Trial Balance
				</div>
				<div className="flex flex-col w-full">
					<Report />
				</div>
			</div>
		</div>
	);
}
