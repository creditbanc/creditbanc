import CreditNav from "~/components/CreditNav";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import { create } from "zustand";
import { useSubmit, useFetcher } from "@remix-run/react";
import { pipe } from "ramda";
import { mod } from "shades";
import { create_group } from "~/utils/group.server";
import { to_resource_pathname } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { redirect } from "@remix-run/node";

const useGroupStore = create((set) => ({
	form: {
		name: "",
	},
	setForm: (path, value) =>
		set((state) => pipe(mod("form", ...path)(() => value))(state)),
}));

export const action = async ({ request }) => {
	const entity_id = await get_user_id(request);
	let form = await request.formData();
	const payload = JSON.parse(form.get("payload"));
	let { name } = payload;
	console.log(name);
	console.log(entity_id);
	let response = await create_group({ name, entity_id });
	console.log(response);
	return redirect(`/root/resource/e/${entity_id}`);
};

const Form = () => {
	const form = useGroupStore((state) => state.form);
	const setForm = useGroupStore((state) => state.setForm);
	const name = useGroupStore((state) => state.form.name);

	const submit = useSubmit();

	const onSubmit = (e) => {
		e.preventDefault();
		console.log("submitting");
		let resource_path = to_resource_pathname(window.location.pathname);

		let payload = JSON.stringify({ ...form });

		submit(
			{ payload },
			{
				method: "post",
				action: "/group/new" + resource_path,
			}
		);
	};

	return (
		<form className="space-y-8" onSubmit={onSubmit}>
			<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
				<div className="sm:col-span-6">
					<label
						htmlFor="group_name"
						className="block text-sm font-medium text-gray-700"
					>
						Group name
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="group_name"
							id="group_name"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={name}
							onChange={(e) => setForm(["name"], e.target.value)}
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-row w-full justify-end pt-3">
				<button
					type="button"
					className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Create
				</button>
			</div>
		</form>
	);
};

const Heading = () => {
	return (
		<div className="bg-transparent">
			<div className="mx-auto max-w-7xl py-4 pb-6 px-2">
				<div className="text-center">
					<h2 className="text-lg font-semibold text-indigo-600">
						New group
					</h2>
				</div>
			</div>
		</div>
	);
};

export default function NewGroup() {
	return (
		<div className="flex flex-col w-full">
			<CreditNav />
			<CreditHeroGradient />
			<div className="flex flex-col w-full p-[20px] max-w-2xl mx-auto">
				<Heading />
				<Form />
			</div>
		</div>
	);
}
