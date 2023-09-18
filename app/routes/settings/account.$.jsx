import { useState } from "react";
import { Switch } from "@headlessui/react";
import {
	get_user_id,
	get_user,
	get_session_entity_id,
	get_entity,
} from "~/utils/auth.server";
import { useLoaderData } from "@remix-run/react";
import {
	map as rxmap,
	filter as rxfilter,
	concatMap,
	tap,
	take,
	reduce as rxreduce,
} from "rxjs/operators";
import {
	from,
	lastValueFrom,
	forkJoin,
	Subject,
	of as rxof,
	merge,
} from "rxjs";
import { fold } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";

import { head, identity, map, pickAll, pipe, uniq } from "ramda";
import { all, get } from "shades";

const log_route = `settings.account`;

const subject = new Subject();

const $loader = subject.pipe(
	rxfilter((message) => message.id == "load"),
	concatMap(({ args: { request } }) => {
		console.log(`${log_route}.load`);
		let entity_id = from(get_session_entity_id(request));
		let entity = from(get_entity(request));

		return entity.pipe(
			tap((value) => {
				console.log(`${log_route}.tap`);
				console.log(value);
			})
		);
	})
);

export const loader = async ({ request }) => {
	const on_success = async (response) => {
		console.log(`${log_route}.success`);

		subject.next({
			id: "response",
			next: () => response,
		});
	};

	const on_error = (error) => {
		console.log(`${log_route}.error`);
		console.log(error);

		subject.next({
			id: "response",
			next: () => error,
		});
	};

	const on_complete = (value) => value.id === "response";

	$loader.pipe(fold(on_success, on_error)).subscribe();

	subject.next({ id: "load", args: { request } });

	let response = await lastValueFrom(
		subject.pipe(rxfilter(on_complete), take(1))
	);

	return response.next();
};

// export const loader = async ({ request }) => {
// 	let entity_id = await get_session_entity_id(request);
// 	let entity = await get_entity(request);

// 	return { entity };
// };

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
					<div className="font-medium text-gray-900">Plaid</div>
					<button
						type="button"
						className="font-semibold text-blue-600 hover:text-blue-500"
					>
						Connect
					</button>
				</li>
			</ul>

			<div className="flex border-t border-gray-100 pt-6">
				<button
					type="button"
					className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500"
				>
					<span aria-hidden="true">+</span> Add another application
				</button>
			</div>
		</div>
	);
};

const Profile = () => {
	const entity = useLoaderData();

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
						<div className="text-gray-900">
							{entity?.first_name} {entity?.last_name}
						</div>
						{/* <button
							type="button"
							className="font-semibold text-blue-600 hover:text-blue-500"
						>
							Update
						</button> */}
					</dd>
				</div>
				<div className="pt-6 sm:flex">
					<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
						Email address
					</dt>
					<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
						<div className="text-gray-900">{entity?.email}</div>
						{/* <button
							type="button"
							className="font-semibold text-blue-600 hover:text-blue-500"
						>
							Update
						</button> */}
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
