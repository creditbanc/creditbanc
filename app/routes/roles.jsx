import { Outlet, useLoaderData } from "@remix-run/react";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";
import { get_user_id } from "~/utils/auth.server";
import { classNames, mapIndexed } from "~/utils/helpers";
import {
	EllipsisHorizontalIcon,
	LinkIcon,
	PlusIcon,
	TrashIcon,
	UserIcon,
	UserPlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useModalStore } from "~/hooks/useModal";
import Modal from "~/components/Modal";
import { delete_doc, get_collection, set_doc } from "~/utils/firebase";
import { isEmpty, pipe } from "ramda";
import { create } from "zustand";
import { mod } from "shades";
import { v4 as uuidv4 } from "uuid";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

export const useRoleStore = create((set) => ({
	role: {},
	set_role: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let entity_id = await get_user_id(request);

	console.log("entity_id");
	console.log(entity_id);

	let roles = await get_collection({
		path: ["role_configs"],
		queries: [
			{
				param: "entity_id",
				predicate: "==",
				value: entity_id,
			},
		],
	});

	// console.log("roles");
	// console.log(roles);

	return { entity_id, roles };
};

export default function Roles() {
	let { entity_id, roles } = useLoaderData();
	// let set_modal = useModalStore((state) => state.set_modal);

	return (
		<div className="flex flex-col w-full h-full bg-gray-50">
			<div className="flex flex-col w-full border-b bg-white">
				<SimpleNavSignedIn user_id={entity_id} />
			</div>

			<div className="flex flex-col w-full h-full p-5 ">
				<div className="flex flex-col w-full">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
