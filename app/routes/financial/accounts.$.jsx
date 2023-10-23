import {
	EllipsisHorizontalIcon,
	EyeIcon,
	LinkIcon,
	PlusCircleIcon,
	BuildingLibraryIcon,
	AtSymbolIcon,
	PhoneIcon,
	ArrowRightIcon,
	ListBulletIcon,
	ArrowDownTrayIcon,
	EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
// import { usePlaidLink } from "react-plaid-link";
import {
	create_axios_form,
	currency,
	classNames,
	mapIndexed,
	capitalize,
	truncate,
	formatPhoneNumber,
	jsreduce,
	get_entity_id,
	get_group_id,
	inspect,
} from "~/utils/helpers";
import { useEffect, useState, Fragment } from "react";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import { Link, useActionData, useFetcher, useLoaderData, useLocation, useNavigate, useSubmit } from "@remix-run/react";
import {
	prop,
	pipe,
	groupBy,
	mergeAll,
	map,
	values,
	defaultTo,
	flatten,
	sortBy,
	reverse,
	sum,
	take,
	keys,
	curry,
	pick,
	not,
	head,
	last,
	isNil,
	filter,
} from "ramda";
import { create } from "zustand";
import { all, mod, get, cons } from "shades";
import { isEmpty } from "ramda";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import "chart.js/auto";
import {
	of,
	filter as rxfilter,
	map as rxmap,
	lastValueFrom,
	from,
	retry,
	catchError,
	timer,
	switchMap,
	throwError,
	repeat,
	take as rxtake,
	delay,
	delayWhen,
} from "rxjs";
import { is_authorized_f } from "~/api/auth";
import { redirect } from "@remix-run/node";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import LoadingSpinner from "~/components/LoadingSpinner";
import Finance from "~/api/client/Finance";
// import { disconnect_plaid } from "~/api/client/plaid";

ChartJS.register(ArcElement, Tooltip, Legend);

export const useAccountStore = create((set) => ({
	account: {},
	is_loading: false,
	set_account: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const useAccounstStore = create((set) => ({
	accounts: [],
	set_accounts: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let { pathname, origin } = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(request.url);

	// let is_authorized = await is_authorized_f(
	// 	entity_id,
	// 	group_id,
	// 	"accounts",
	// 	"read"
	// );

	// if (!is_authorized) {
	// 	return redirect(`/home/resource/e/${entity_id}/g/${group_id}`);
	// }

	// return redirect(`/plaid/oauth/resources/e/${entity_id}/g/${group_id}`);

	let finance = new Finance(entity_id, group_id);
	let has_credentials = await lastValueFrom(finance.has_plaid_credentials);

	console.log("has_credentials");
	console.log(has_credentials);

	// if (!has_credentials) {
	// 	return { error: "no credentials" };
	// }

	console.log("plaid_credentials");
	console.log(has_credentials);

	if (!has_credentials) {
		return redirect(`/plaid/oauth/resources/e/${entity_id}/g/${group_id}`);

		// console.log("origin");
		// console.log(origin);

		// let config = {
		// 	method: "post",
		// 	maxBodyLength: Infinity,
		// 	url: `${origin}/plaid/create_link_token`,
		// };

		// let link_token_response = await axios(config);

		// console.log("link_token_response");
		// console.log(link_token_response.data);

		// let { data: link_token = "" } = link_token_response;
		// return { link_token };
	} else {
		let { data = {} } = await axios({
			method: "get",
			url: `${origin}/financial/api/accounts/resource/e/${entity_id}/g/${group_id}`,
		});

		let { accounts = [] } = data;

		console.log("____accounts____");
		console.log(accounts);

		return {
			accounts,
		};
	}
};

const AccountActionsDropdown = ({ document }) => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100">
					<EllipsisHorizontalIcon className="h-5 w-5" />
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<Link
									to={`/financial/transactions`}
									// onClick={onDownloadFileClick}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"flex flex-row px-4 py-2 text-sm cursor-pointer items-center space-x-3"
									)}
								>
									<div>
										<ListBulletIcon className="h-4 w-4" />
									</div>
									<div>View Transactions</div>
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<div
									// onClick={onEditFileClick}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"flex flex-row px-4 py-2 text-sm cursor-pointer items-center space-x-3"
									)}
								>
									<div>
										<LinkIcon className="h-4 w-4" />
									</div>
									<div>Unlink Account</div>
								</div>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const TableRow = ({ account }) => {
	let selected_account = useAccountStore((state) => state.account);
	const set_account = useAccountStore((state) => state.set_account);
	const [is_account_number_visible, set_is_account_number_visible] = useState(false);

	const onSelectAccount = () => {
		if (selected_account.account_id !== account.account_id) {
			set_account(["account"], account);
		}
	};

	const onToggleAccountNumberVisibility = () => {
		set_is_account_number_visible(!is_account_number_visible);
	};

	return (
		<div
			className="flex flex-col lg:flex-row w-full text-gray-700 border-b py-3 hover:bg-gray-50 cursor-pointer text-sm space-x-2 lg:space-x-0 gap-y-3 lg:gap-y-0 divide-y lg:divide-y-0 border rounded px-3 lg:px-0 lg:border-none"
			onClick={onSelectAccount}
		>
			<div className="flex flex-row lg:w-[298px]">
				<div className="hidden lg:flex flex-col justify-center">
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-full ">
						<BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
					</span>
				</div>
				<div className="flex flex-col">
					<div className="flex flex-row space-x-3">
						<div>{capitalize(account.subtype)}</div>
						<div>••{account.account.slice(-4)}</div>
					</div>
					<div className="text-sm text-gray-500">
						{capitalize(account.subtype)} – {account.name}
					</div>
				</div>
			</div>
			<div className="flex flex-row lg:w-[250px] items-center justify-between pt-2 lg:pt-2">
				<div className="lg:hidden">Account number:</div>
				<div className="flex flex-row items-center">
					{!is_account_number_visible && (
						<input
							type="password"
							value={account.account}
							readOnly={true}
							className="bg-transparent w-[130px] border-none p-0 cursor-default focus:ring-0 outline-none"
						></input>
					)}
					{is_account_number_visible && <div className="w-[130px]">{account.account}</div>}
					<div>
						{is_account_number_visible && (
							<EyeSlashIcon className="h-5 w-5 text-gray-400" onClick={onToggleAccountNumberVisibility} />
						)}

						{!is_account_number_visible && (
							<EyeIcon className="h-5 w-5 text-gray-400" onClick={onToggleAccountNumberVisibility} />
						)}
					</div>
				</div>
			</div>
			<div className="flex flex-row lg:w-[200px] items-center justify-between pt-2 lg:pt-2">
				<div className="lg:hidden">Routing number:</div>
				<div>{account.routing}</div>
			</div>
			<div className="flex flex-row lg:flex-1 items-center justify-between pt-2 lg:pt-2">
				<div className="lg:hidden">Balance:</div>
				<div className="flex flex-row">
					<div className="flex flex-col lg:w-[200px]">{currency.format(account.balances.available)}</div>
					<div className="hidden lg:flex flex-col w-[50px] ">
						<AccountActionsDropdown />
					</div>
				</div>
			</div>
		</div>
	);
};

const options = {
	responsive: true,
	maintainAspectRatio: false,
	layout: {
		padding: -5,
	},
	scales: {
		x: {
			display: false,
			offset: false,
			grid: {
				display: false,
			},
			ticks: {
				display: false,
			},
		},
		y: {
			display: false,
			beginAtZero: true,
			ticks: {
				display: false,
			},
			grid: {
				display: false,
			},
		},
	},
	plugins: {
		legend: {
			display: false,
		},
		title: {
			display: false,
			// text: "Chart.js Line Chart",
		},
	},
};

const balances_data = (daily_balances) => ({
	labels: pipe(get(all, "date"))(daily_balances),
	datasets: [
		{
			fill: true,
			lineTension: 0.5,
			data: pipe(get(all, "balance"))(daily_balances),
			borderColor: "#3b82f6",
			backgroundColor: "#BFD7ED",
			backgroundColor: (context) => {
				const ctx = context.chart.ctx;
				const gradient = ctx.createLinearGradient(0, 0, 0, 200);
				gradient.addColorStop(0, "rgba(162,210,241,1)");
				gradient.addColorStop(1, "rgba(162,210,241,0)");
				return gradient;
			},
		},
	],
});

export default function Accounts() {
	let { pathname } = useLocation();
	const { link_token, accounts: accounts_data, balances } = useLoaderData();

	let has_credentials = link_token == null;
	const accounts = useAccounstStore((state) => state.accounts);
	const set_accounts = useAccounstStore((state) => state.set_accounts);
	const account = useAccountStore((state) => state.account);
	const set_account = useAccountStore((state) => state.set_account);
	let fetcher = useFetcher();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let total_balance = pipe(get(all, "balances", "available"), sum)(accounts);

	// useEffect(() => {
	// 	set_accounts(["accounts"], []);
	// }, []);

	useEffect(() => {
		if (!isEmpty(fetcher.data) && fetcher.type == "done") {
			set_accounts(["accounts"], fetcher.data);
		}
	}, [fetcher]);

	useEffect(() => {
		if (accounts_data && !isEmpty(accounts_data)) {
			set_accounts(["accounts"], accounts_data);
		}
	}, [accounts_data]);

	let get_account_transactions = async (account_id) => {
		console.log("get_account_transactions");
		console.log(account_id);

		let { origin } = window.location;

		let { data: transactions } = await axios({
			method: "get",
			url: `${origin}/financial/api/transactions/resource/e/${entity_id}/g/${group_id}?account_id=${account_id}`,
		});

		console.log("transactions5______");
		console.log(transactions);

		if (transactions?.error || transactions?.length == 0) {
			console.log("transactions_error1______");
			console.log("is_error");

			// let { error } = transactions;
			// console.log(error);

			return "four";
		}

		console.log("transactions4______");
		console.log(transactions);

		return transactions;
	};

	let get_account_daily_balances = async (account) => {
		console.log("get_account_daily_balances");
		// let transactions = await get_account_transactions(account.account_id);

		// console.log("transactionstop");
		// console.log(transactions);

		// if (transactions?.error || transactions?.length == 0) {
		// 	transactions = await new Promise((resolve) =>
		// 		setTimeout(() => {
		// 			console.log("call after 2 seconds");
		// 			get_account_transactions(account.account_id);
		// 		}, 5000)
		// 	);
		// }

		let account_balance = pipe(get("balances", "available"))(account);

		let $transactions = from(get_account_transactions(account.account_id)).pipe(
			rxmap((value) => {
				console.log("rxmap");
				if (value == "four") {
					throw new Error("error");
				} else {
					return value;
				}
			}),
			rxfilter((value) => {
				console.log("rxfilter________");
				console.log(value);
				return pipe(isNil, not)(value);
			}),
			retry({ delay: 3000, count: 1 }),
			catchError((value) => {
				console.log("catchError");
				console.log(value);
				return get_account_daily_balances(account);
			})
			// rxfilter((res) => {
			// 	console.log("rxfilter");
			// 	console.log(res);
			// 	return res !== "four";
			// }),
			// rxtake(1)
		);

		const is_expense = (transaction) => {
			return transaction.amount >= 0;
		};

		const is_revenue = pipe(is_expense, not);

		let with_daily_balance = curry((ending_balance, transactions) => {
			if (transactions.length == 0) {
				return [];
			}

			return pipe(
				jsreduce((curr, next, index) => {
					if (index === 1) {
						curr.balance = account_balance;
						next.balance = curr.balance + curr.amount;

						let payload = [curr, next];

						return payload;
					}

					let last_transaction = last(curr);

					next.balance = last_transaction.balance + last_transaction.amount;

					let payload = [...curr, next];

					return payload;
				})
			)(transactions);
		});

		const with_transaction_type = (transaction) => {
			return {
				...transaction,
				type: is_expense(transaction) ? "expense" : "revenue",
			};
		};

		let $recent_activity = $transactions.pipe(
			rxmap(
				pipe(
					filter((value) => {
						console.log("filtervalue_______");
						console.log(value);
						return pipe(isNil, not)(value);
					}),
					sortBy(prop("date")),
					reverse,
					take(30),
					mod(all)(pipe(pick(["name", "date", "amount"]), with_transaction_type)),
					with_daily_balance(account_balance)
				)
			)
		);

		let $balances = $recent_activity.pipe(rxmap(pipe(mod(all)(pick(["balance", "date"])), reverse)));

		let daily_balances = await lastValueFrom($balances);

		// console.log("daily_balances");
		// console.log(daily_balances);

		set_account(["account", "is_loading"], false);
		// set_account(["account", "daily_balances"], daily_balances);
	};

	const on_account_click = (account, e) => {
		e.preventDefault();
		console.log("on_account_click");
		set_account(["account", "is_loading"], true);
		get_account_daily_balances(account);
	};

	// useEffect(() => {
	// 	if (account !== undefined && !isEmpty(account)) {
	// 		get_account_daily_balances(account);
	// 	}
	// }, [account.account_id]);

	const onDisconnectPlaid = async () => {
		// await disconnect_plaid({ group_id });

		set_account(["account"], {});
		set_accounts(["accounts"], []);

		console.log("plaid credentials deleted");
		console.log("plaid bank accounts deleted");
	};

	return (
		<div className="flex flex-row w-full h-full overflow-hidden space-x-3">
			<div className="flex flex-col w-full lg:w-[70%] h-full bg-white rounded p-5 overflow-y-scroll scrollbar-none">
				<div className="border-b border-gray-200 pb-3 flex flex-row justify-between mb-3">
					<div>
						<h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">Accounts</h3>
					</div>
					<div>
						{!has_credentials && (
							<Link
								to={`/plaid/oauth/resources/e/${entity_id}/g/${group_id}`}
								className="rounded-md bg-gray-700 px-3 py-2 text-xs font-semibold text-white shadow-sm"
							>
								Connect Bank Account
							</Link>
						)}

						{has_credentials && (
							<div
								onClick={onDisconnectPlaid}
								className="rounded-md bg-gray-700 px-3 py-2 text-xs font-semibold text-white shadow-sm cursor-pointer"
							>
								Disconnect Bank Account
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-row justify-between">
					<div className="flex flex-col mb-7 space-y-2 my-2">
						<div className="text-gray-700">Total Balance</div>
						<div className="text-4xl">{currency.format(total_balance)}</div>
					</div>
				</div>
				<div className="hidden lg:flex flex-row text-sm border-b pb-3 text-gray-400">
					<div className="flex flex-col w-[300px]">Account</div>
					<div className="flex flex-col w-[250px]">Account number</div>
					<div className="flex flex-col w-[200px]">Routing number</div>
					<div className="flex flex-row flex-1 justify-end">
						<div className="flex flex-col w-[200px]">Balance</div>
						<div className="flex flex-col w-[50px]"></div>
					</div>
				</div>
				{accounts.length > 0 && (
					<div className="flex flex-col w-full pb-3 lg:pb-0 gap-y-5 lg:gap-y-0 lg:last-of-type:border-b">
						{pipe(
							mapIndexed((account, index) => (
								<div key={index} onClick={(e) => on_account_click(account, e)}>
									<TableRow key={account.account_id} account={account} />
								</div>
							))
						)(accounts)}
					</div>
				)}
				<Link
					to={`/plaid/oauth/resources/e/${entity_id}/g/${group_id}`}
					className="flex flex-row items-center space-x-5 border-b border py-3 rounded cursor-pointer pl-1.5 lg:mt-5"
				>
					<div>
						<PlusCircleIcon className="h-7 w-7 text-gray-400" />
					</div>
					<div>Link Account</div>
				</Link>
			</div>
			<div className="hidden lg:flex flex-col lg:w-[30%]">
				{account.is_loading && (
					<div className="flex flex-col bg-white border rounded h-full">
						<LoadingSpinner />
					</div>
				)}
				{!account.is_loading && (
					<div className="flex flex-col bg-white border rounded">
						<div className="p-5">
							<div className="flex flex-row space-x-3 items-center">
								<div>
									<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
										<span className="text-lg font-medium leading-none text-white">
											{account?.official_name?.charAt(0).toUpperCase()}
										</span>
									</span>
								</div>
								<div>{account.official_name}</div>
							</div>
						</div>

						{!isEmpty(account) && (
							<Link
								to={`/financial/transactions`}
								className="px-5 mb-4 flex flex-row items-center space-x-3 text-blue-500 cursor-pointer text-sm"
							>
								<div>
									<ListBulletIcon className="h-4 w-4 text-blue-500" />
								</div>
								<div>Show transactions for this account</div>
								<div>
									<ArrowRightIcon className="h-4 w-4 text-blue-500" />
								</div>
							</Link>
						)}

						<div className="flex flex-row px-5 pb-5">
							<div className="flex flex-col w-1/2 text-sm space-y-1">
								<div className="text-gray-400">Available</div>
								<div className="text-lg">{currency.format(account?.balances?.available || 0)}</div>
							</div>
							<div className="flex flex-col w-1/2 text-sm space-y-1">
								<div className="text-gray-400">Current</div>
								<div className="text-lg">{currency.format(account?.balances?.current || 0)}</div>
							</div>
						</div>

						{account?.daily_balances !== undefined && (
							<div className="flex flex-col w-[calc(100%+11px)] h-[150px] -ml-[5px] -mb-[5px]">
								<Line options={options} data={balances_data(account.daily_balances)} />
							</div>
						)}

						<div className="border-t "></div>
						<div className="flex flex-col p-5 text-sm space-y-2">
							<div className=" text-gray-400">Phone numbers</div>
							<div className="flex flex-col space-y-3">
								{pipe(
									get("owners", all, "phone_numbers"),
									defaultTo([]),
									flatten,
									mapIndexed((phone, index) => (
										<div className="flex flex-row items-center space-x-2" key={index}>
											<div>
												<PhoneIcon className="h-4 w-4 text-gray-400" />
											</div>
											<div>{formatPhoneNumber(phone.data)}</div>
										</div>
									))
								)(account)}
							</div>
						</div>
						<div className="border-t "></div>
						<div className="flex flex-col p-5 text-sm space-y-2">
							<div className=" text-gray-400">Emails</div>
							<div className="flex flex-col space-y-2">
								{pipe(
									get("owners", all, "emails"),
									defaultTo([]),
									flatten,
									mapIndexed((email, index) => (
										<div className="flex flex-row items-center space-x-2" key={index}>
											<div>
												<AtSymbolIcon className="h-4 w-4 text-gray-400" />
											</div>
											<div>{truncate(30, email.data)}</div>
										</div>
									))
								)(account)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
