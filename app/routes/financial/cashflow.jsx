import { Fragment, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
	FaceFrownIcon,
	FaceSmileIcon,
	FireIcon,
	HandThumbUpIcon,
	HeartIcon,
	PaperClipIcon,
	XMarkIcon,
	ArrowDownIcon,
	ArrowUpIcon,
} from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import { classNames, currency } from "~/utils/helpers";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import "chart.js/auto";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const activity = [
	{
		id: 1,
		type: "created",
		person: { name: "Chelsea Hagon" },
		date: "7d ago",
		dateTime: "2023-01-23T10:32",
	},
	{
		id: 2,
		type: "edited",
		person: { name: "Chelsea Hagon" },
		date: "6d ago",
		dateTime: "2023-01-23T11:03",
	},
	{
		id: 3,
		type: "sent",
		person: { name: "Chelsea Hagon" },
		date: "6d ago",
		dateTime: "2023-01-23T11:24",
	},
	{
		id: 4,
		type: "commented",
		person: {
			name: "Chelsea Hagon",
			imageUrl:
				"https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		comment:
			"Called client, they reassured me the invoice would be paid by the 25th.",
		date: "3d ago",
		dateTime: "2023-01-23T15:56",
	},
	{
		id: 5,
		type: "viewed",
		person: { name: "Alex Curren" },
		date: "2d ago",
		dateTime: "2023-01-24T09:12",
	},
	{
		id: 6,
		type: "paid",
		person: { name: "Alex Curren" },
		date: "1d ago",
		dateTime: "2023-01-24T09:20",
	},
];

const moods = [
	{
		name: "Excited",
		value: "excited",
		icon: FireIcon,
		iconColor: "text-white",
		bgColor: "bg-red-500",
	},
	{
		name: "Loved",
		value: "loved",
		icon: HeartIcon,
		iconColor: "text-white",
		bgColor: "bg-pink-400",
	},
	{
		name: "Happy",
		value: "happy",
		icon: FaceSmileIcon,
		iconColor: "text-white",
		bgColor: "bg-green-400",
	},
	{
		name: "Sad",
		value: "sad",
		icon: FaceFrownIcon,
		iconColor: "text-white",
		bgColor: "bg-yellow-400",
	},
	{
		name: "Thumbsy",
		value: "thumbsy",
		icon: HandThumbUpIcon,
		iconColor: "text-white",
		bgColor: "bg-blue-500",
	},
	{
		name: "I feel nothing",
		value: null,
		icon: XMarkIcon,
		iconColor: "text-gray-400",
		bgColor: "bg-transparent",
	},
];

const ActivityFeed = () => {
	const [selected, setSelected] = useState(moods[5]);

	return (
		<>
			<ul role="list" className="space-y-6">
				{activity.map((activityItem, activityItemIdx) => (
					<li key={activityItem.id} className="relative flex gap-x-4">
						<div
							className={classNames(
								activityItemIdx === activity.length - 1
									? "h-6"
									: "-bottom-6",
								"absolute left-0 top-0 flex w-6 justify-center"
							)}
						>
							<div className="w-px bg-gray-200" />
						</div>
						{activityItem.type === "commented" ? (
							<>
								<img
									src={activityItem.person.imageUrl}
									alt=""
									className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
								/>
								<div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
									<div className="flex justify-between gap-x-4">
										<div className="py-0.5 text-xs leading-5 text-gray-500">
											<span className="font-medium text-gray-900">
												{activityItem.person.name}
											</span>{" "}
											commented
										</div>
										<time
											dateTime={activityItem.dateTime}
											className="flex-none py-0.5 text-xs leading-5 text-gray-500"
										>
											{activityItem.date}
										</time>
									</div>
									<p className="text-sm leading-6 text-gray-500">
										{activityItem.comment}
									</p>
								</div>
							</>
						) : (
							<>
								<div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
									{activityItem.type === "paid" ? (
										<CheckCircleIcon
											className="h-6 w-6 text-indigo-600"
											aria-hidden="true"
										/>
									) : (
										<div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
									)}
								</div>
								<p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
									<span className="font-medium text-gray-900">
										{activityItem.person.name}
									</span>{" "}
									{activityItem.type} the invoice.
								</p>
								<time
									dateTime={activityItem.dateTime}
									className="flex-none py-0.5 text-xs leading-5 text-gray-500"
								>
									{activityItem.date}
								</time>
							</>
						)}
					</li>
				))}
			</ul>

			{/* New comment form */}
			<div className="mt-6 flex gap-x-3">
				<img
					src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
					alt=""
					className="h-6 w-6 flex-none rounded-full bg-gray-50"
				/>
				<form action="#" className="relative flex-auto">
					<div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
						<label htmlFor="comment" className="sr-only">
							Add your comment
						</label>
						<textarea
							rows={2}
							name="comment"
							id="comment"
							className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
							placeholder="Add your comment..."
							defaultValue={""}
						/>
					</div>

					<div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
						<div className="flex items-center space-x-5">
							<div className="flex items-center">
								<button
									type="button"
									className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
								>
									<PaperClipIcon
										className="h-5 w-5"
										aria-hidden="true"
									/>
									<span className="sr-only">
										Attach a file
									</span>
								</button>
							</div>
							<div className="flex items-center">
								<Listbox
									value={selected}
									onChange={setSelected}
								>
									{({ open }) => (
										<>
											<Listbox.Label className="sr-only">
												Your mood
											</Listbox.Label>
											<div className="relative">
												<Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
													<span className="flex items-center justify-center">
														{selected.value ===
														null ? (
															<span>
																<FaceSmileIcon
																	className="h-5 w-5 flex-shrink-0"
																	aria-hidden="true"
																/>
																<span className="sr-only">
																	Add your
																	mood
																</span>
															</span>
														) : (
															<span>
																<span
																	className={classNames(
																		selected.bgColor,
																		"flex h-8 w-8 items-center justify-center rounded-full"
																	)}
																>
																	<selected.icon
																		className="h-5 w-5 flex-shrink-0 text-white"
																		aria-hidden="true"
																	/>
																</span>
																<span className="sr-only">
																	{
																		selected.name
																	}
																</span>
															</span>
														)}
													</span>
												</Listbox.Button>

												<Transition
													show={open}
													as={Fragment}
													leave="transition ease-in duration-100"
													leaveFrom="opacity-100"
													leaveTo="opacity-0"
												>
													<Listbox.Options className="absolute bottom-10 z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
														{moods.map((mood) => (
															<Listbox.Option
																key={mood.value}
																className={({
																	active,
																}) =>
																	classNames(
																		active
																			? "bg-gray-100"
																			: "bg-white",
																		"relative cursor-default select-none px-3 py-2"
																	)
																}
																value={mood}
															>
																<div className="flex items-center">
																	<div
																		className={classNames(
																			mood.bgColor,
																			"flex h-8 w-8 items-center justify-center rounded-full"
																		)}
																	>
																		<mood.icon
																			className={classNames(
																				mood.iconColor,
																				"h-5 w-5 flex-shrink-0"
																			)}
																			aria-hidden="true"
																		/>
																	</div>
																	<span className="ml-3 block truncate font-medium">
																		{
																			mood.name
																		}
																	</span>
																</div>
															</Listbox.Option>
														))}
													</Listbox.Options>
												</Transition>
											</div>
										</>
									)}
								</Listbox>
							</div>
						</div>
						<button
							type="submit"
							className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							Comment
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export const options = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		// title: {
		// 	display: true,
		// 	text: "Chart.js Bar Chart - Stacked",
		// },

		legend: {
			display: false,
		},
		title: {
			display: false,
			// text: "Chart.js Line Chart",
		},
	},
	responsive: true,
	scales: {
		x: {
			stacked: true,
			grid: {
				display: false,
			},
			// barPercentage: 0.1,
			// barThickness: 2,
			// barPercentage: 0.2,
		},
		y: {
			stacked: true,
			beginAtZero: true,
			// grid: {
			// 	display: false,
			// },
		},
	},
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
	labels,
	datasets: [
		{
			label: "Dataset 1",
			data: labels.map(() =>
				faker.datatype.number({ min: 0, max: 1000 })
			),
			backgroundColor: "rgb(13,98,254)",
			stack: "Stack 0",
			barThickness: 30,
		},
		{
			label: "Dataset 2",
			data: labels.map(() =>
				faker.datatype.number({ min: -1000, max: 0 })
			),
			backgroundColor: "rgb(234,238,241)",
			stack: "Stack 0",
			barThickness: 30,
		},
	],
};

export const revenue_data = {
	labels,
	datasets: [
		{
			label: "Dataset 1",
			data: labels.map(() =>
				faker.datatype.number({ min: 0, max: 1000 })
			),
			backgroundColor: "rgb(13,98,254)",
			// stack: "Stack 0",
			barThickness: 30,
		},
		// {
		// 	label: "Dataset 2",
		// 	data: labels.map(() =>
		// 		faker.datatype.number({ min: -1000, max: 0 })
		// 	),
		// 	backgroundColor: "rgb(234,238,241)",
		// 	stack: "Stack 0",
		// 	barThickness: 30,
		// },
	],
};

export const expenses_data = {
	labels,
	datasets: [
		// {
		// 	label: "Dataset 1",
		// 	data: labels.map(() =>
		// 		faker.datatype.number({ min: 0, max: 1000 })
		// 	),
		// 	backgroundColor: "rgb(13,98,254)",
		// 	stack: "Stack 0",
		// 	barThickness: 30,
		// },
		{
			label: "Dataset 2",
			data: labels.map(() =>
				faker.datatype.number({ min: 0, max: 1000 })
			),
			backgroundColor: "rgb(234,238,241)",
			// stack: "Stack 0",
			barThickness: 30,
		},
	],
};

const CashflowChart = () => {
	return (
		<div className="flex flex-col w-full h-full">
			<div className="px-5 pt-5 text-base font-semibold leading-6 text-gray-900">
				Cashflow
			</div>
			<div className="flex flex-col w-full border-t my-3"></div>
			<div className="flex flex-col w-full h-full p-3 overflow-hidden">
				<Bar options={options} data={data} />
			</div>
		</div>
	);
};

const stats_data = [
	{
		name: "Month over month revenue change",
		stat: "71,897",
		previousStat: "70,946",
		change: "12%",
		changeType: "increase",
	},
	{
		name: "Highest revenue in last 6 months",
		stat: "58.16%",
		previousStat: "56.14%",
		change: "2.02%",
		changeType: "increase",
	},
];

const HealthStats = () => {
	return (
		<div className="bg-white divide-y rounded">
			{stats_data.map((item) => (
				<div key={item.name} className="px-4 py-3 sm:p-6">
					<div className="text-sm font-normal text-gray-900">
						{item.name}
					</div>
					<div className="mt-1 flex items-baseline justify-between md:block lg:flex">
						<div className="flex items-baseline text-xl font-semibold text-blue-600">
							{item.stat}
							<span className="ml-2 text-sm font-medium text-gray-500">
								from {item.previousStat}
							</span>
						</div>

						<div
							className={classNames(
								item.changeType === "increase"
									? "bg-green-100 text-green-800"
									: "bg-red-100 text-red-800",
								"inline-flex items-baseline rounded-full px-2.5 py-0.5 text-xs font-medium md:mt-2 lg:mt-0"
							)}
						>
							{item.changeType === "increase" ? (
								<ArrowUpIcon
									className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center text-green-500"
									aria-hidden="true"
								/>
							) : (
								<ArrowDownIcon
									className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center text-red-500"
									aria-hidden="true"
								/>
							)}

							{item.change}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

const RevenueChart = () => {
	return (
		<div className="flex flex-col w-full h-full">
			<div className="px-5 pt-5 text-base font-semibold leading-6 text-gray-900">
				Revenue
			</div>
			<div className="flex flex-col w-full border-t my-3"></div>

			<div className="flex flex-row justify-between px-5">
				<div className="flex flex-col mb-3 space-y-2 my-2">
					<div className="text-gray-700">Total revenue in June</div>
					<div className="text-3xl">
						{currency.format(5144707.08)}
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full h-[250px] p-3 overflow-hidden">
				<Bar options={options} data={revenue_data} />
			</div>

			<div>
				<HealthStats />
			</div>
		</div>
	);
};

const ExpensesChart = () => {
	return (
		<div className="flex flex-col w-full h-full">
			<div className="px-5 pt-5 text-base font-semibold leading-6 text-gray-900">
				Expenses
			</div>
			<div className="flex flex-col w-full border-t my-3"></div>

			<div className="flex flex-row justify-between px-5">
				<div className="flex flex-col mb-3 space-y-2 my-2">
					<div className="text-gray-700">Total spending in June</div>
					<div className="text-3xl">
						{currency.format(5144707.08)}
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full h-[250px] p-3 overflow-hidden">
				<Bar options={options} data={expenses_data} />
			</div>

			<div>
				<HealthStats />
			</div>
		</div>
	);
};

const stats = [
	{
		name: "Revenue",
		value: "$405,091.00",
		change: "+4.75%",
		changeType: "positive",
	},
	{
		name: "Overdue invoices",
		value: "$12,787.00",
		change: "+54.02%",
		changeType: "negative",
	},
	{
		name: "Outstanding invoices",
		value: "$245,988.00",
		change: "-1.39%",
		changeType: "positive",
	},
	{
		name: "Expenses",
		value: "$30,156.00",
		change: "+10.18%",
		changeType: "negative",
	},
	{
		name: "Outstanding invoices",
		value: "$245,988.00",
		change: "-1.39%",
		changeType: "positive",
	},
	{
		name: "Expenses",
		value: "$30,156.00",
		change: "+10.18%",
		changeType: "negative",
	},
];

const Stats = () => {
	return (
		<div className="flex flex-wrap w-full rounded-lg gap-x-3 gap-y-3 justify-between">
			{stats.map((stat) => (
				<div
					key={stat.name}
					className="flex flex-col w-full md:w-[48%] lg:w-[32%] justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 border rounded-lg"
				>
					<div className="text-sm font-medium leading-6 text-gray-500">
						{stat.name}
					</div>
					<div
						className={classNames(
							stat.changeType === "negative"
								? "text-rose-600"
								: "text-gray-700",
							"text-xs font-medium"
						)}
					>
						{stat.change}
					</div>
					<div className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
						{stat.value}
					</div>
				</div>
			))}
		</div>
	);
};

const FinancialHealthEvaluationHeading = () => {
	return (
		<div className="flex flex-col">
			<h3 className="text-base font-semibold leading-6 text-gray-900">
				Financial Health Evaluation
			</h3>
			<p className="mt-1 text-sm text-gray-500">
				The 6 key data points lenders may review in their evaluation of
				your business:
			</p>
		</div>
	);
};

export default function Cashflow() {
	return (
		<div className="flex flex-col w-full h-full overflow-hidden">
			<div className="flex flex-row h-full w-full p-5 space-x-5 ">
				<div className="flex flex-col h-full w-[70%] rounded  gap-y-5 overflow-scroll scrollbar-none">
					<div className="flex flex-col w-full max-h-[400px] bg-white rounded">
						<CashflowChart />
					</div>
					<div className="flex flex-row w-full gap-x-5 h-full">
						<div className="flex flex-col w-1/2 bg-white h-full rounded">
							<RevenueChart />
						</div>
						<div className="flex flex-col w-1/2 bg-white h-full rounded">
							<ExpensesChart />
						</div>
					</div>
					<div className="flex flex-col w-full bg-white rounded ">
						<div className="flex flex-col py-4 px-5">
							<FinancialHealthEvaluationHeading />
						</div>
						<div className="flex flex-col w-full border-t"></div>
						<div className="flex flex-col w-full p-3">
							<div className="flex flex-col w-full rounded-lg">
								<Stats />
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-[30%] rounded border">
					<div className="flex flex-col w-full h-full rounded bg-white">
						<div className="flex flex-col py-4 px-5">
							<div>Recent transactions</div>
						</div>
						<div className="flex flex-col w-full border-t"></div>
						<div className="flex flex-col p-5 overflow-scroll">
							<ActivityFeed />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
