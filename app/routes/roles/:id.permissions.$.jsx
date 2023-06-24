import { useState } from "react";
import { Switch } from "@headlessui/react";
import { classNames } from "~/utils/helpers";
import { useLoaderData } from "react-router";

const Toggle = () => {
	const [enabled, setEnabled] = useState(false);

	return (
		<Switch
			checked={enabled}
			onChange={setEnabled}
			className={classNames(
				enabled ? "bg-blue-600" : "bg-gray-200",
				"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
			)}
		>
			<span className="sr-only">Use setting</span>
			<span
				aria-hidden="true"
				className={classNames(
					enabled ? "translate-x-5" : "translate-x-0",
					"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
				)}
			/>
		</Switch>
	);
};

const Permission = ({ resource }) => {
	let { name } = resource;
	return (
		<div className="flex flex-row w-full  text-sm py-3">
			<div className="flex flex-col flex-1">{name}</div>
			<div className="flex flex-col w-[100px]">
				<Toggle />
			</div>
			<div className="flex flex-col w-[100px]">
				<Toggle />
			</div>
			<div className="flex flex-col w-[100px]">
				<Toggle />
			</div>
		</div>
	);
};

const Heading = () => {
	return (
		<div className="border-b border-gray-200 pb-2 text-sm">
			<div className="flex flex-row w-full justify-between px-1">
				<div>
					<h3 className="font-semibold text-gray-900">Permissions</h3>
				</div>
				<div>
					<div className="text-blue-600 cursor-pointer">
						Clear permissions
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Permissions() {
	return (
		<div className="flex flex-col w-full h-full border px-3 pt-3 rounded">
			<div className="flex flex-col w-full mb-6">
				<Heading />
			</div>
			<div className="flex flex-row w-full justify-between my-3 text-sm text-gray-400">
				<div className="flex-col flex-1">Resource</div>
				<div className="flex flex-col w-[100px]">Hidden</div>
				<div className="flex flex-col w-[100px]">Read</div>
				<div className="flex flex-col w-[100px]">Edit</div>
			</div>
			<div className="flex flex-col w-full border-b"></div>
			<div className="flex flex-col w-full divide-y">
				<Permission resource={{ name: "Credit" }} />
				<Permission resource={{ name: "Cashflow" }} />
				<Permission resource={{ name: "Vault" }} />
				<Permission resource={{ name: "Chat" }} />
			</div>
		</div>
	);
}
