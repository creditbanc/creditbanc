import { useState } from "react";
import { Switch } from "@headlessui/react";
import { get_user_id, get_user } from "~/utils/auth.server";
import { useLoaderData } from "@remix-run/react";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const loader = async ({ request }) => {
	let entity_id = await get_user_id(request);
	let entity = await get_user(request);

	return { entity_id, entity };
};

const BankAccounts = () => {
	return (
		<div>
			<h2 className="text-base font-semibold leading-7 text-gray-900">
				Bank accounts
			</h2>
			<p className="mt-1 text-sm leading-6 text-gray-500">
				Connect bank accounts to your account.
			</p>

			<ul
				role="list"
				className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
			>
				<li className="flex justify-between gap-x-6 py-6">
					<div className="font-medium text-gray-900">
						TD Canada Trust
					</div>
					<button
						type="button"
						className="font-semibold text-indigo-600 hover:text-indigo-500"
					>
						Update
					</button>
				</li>
				<li className="flex justify-between gap-x-6 py-6">
					<div className="font-medium text-gray-900">
						Royal Bank of Canada
					</div>
					<button
						type="button"
						className="font-semibold text-indigo-600 hover:text-indigo-500"
					>
						Update
					</button>
				</li>
			</ul>

			<div className="flex border-t border-gray-100 pt-6">
				<button
					type="button"
					className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
				>
					<span aria-hidden="true">+</span> Add another bank
				</button>
			</div>
		</div>
	);
};

const Integrations = () => {
	return (
		<div>
			<h2 className="text-base font-semibold leading-7 text-gray-900">
				Integrations
			</h2>
			<p className="mt-1 text-sm leading-6 text-gray-500">
				Connect applications to your account.
			</p>

			<ul
				role="list"
				className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
			>
				<li className="flex justify-between gap-x-6 py-6">
					<div className="font-medium text-gray-900">QuickBooks</div>
					<button
						type="button"
						className="font-semibold text-indigo-600 hover:text-indigo-500"
					>
						Update
					</button>
				</li>
			</ul>

			<div className="flex border-t border-gray-100 pt-6">
				<button
					type="button"
					className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
				>
					<span aria-hidden="true">+</span> Add another application
				</button>
			</div>
		</div>
	);
};

const Profile = () => {
	const { entity } = useLoaderData();
	return (
		<div>
			<h2 className="text-base font-semibold leading-7 text-gray-900">
				Profile
			</h2>
			<p className="mt-1 text-sm leading-6 text-gray-500">
				This is your profile information.
			</p>

			<dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
				<div className="pt-6 sm:flex">
					<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
						Full name
					</dt>
					<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
						<div className="text-gray-900">Tom Cook</div>
						<button
							type="button"
							className="font-semibold text-indigo-600 hover:text-indigo-500"
						>
							Update
						</button>
					</dd>
				</div>
				<div className="pt-6 sm:flex">
					<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
						Email address
					</dt>
					<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
						<div className="text-gray-900">{entity.email}</div>
						<button
							type="button"
							className="font-semibold text-indigo-600 hover:text-indigo-500"
						>
							Update
						</button>
					</dd>
				</div>
			</dl>
		</div>
	);
};

export default function Account() {
	return (
		<main className="px-4 sm:px-6 lg:flex-auto lg:px-0">
			<div className="mx-auto max-w-4xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
				<Profile />
				{/* <BankAccounts /> */}
				{/* <Integrations /> */}
			</div>
		</main>
	);
}
