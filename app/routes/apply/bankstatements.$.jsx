import { form_params, get, get_entity_id, get_group_id } from "~/utils/helpers";
import { pipe, head } from "ramda";
import { redirect } from "@remix-run/node";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { update_doc } from "~/utils/firebase";
import { filter } from "shades";
import { navigation } from "./navigation";

const bank_img = "/images/bank.jpg";
import ApplicationDocumentsUpload from "~/components/ApplicationDocumentsUpload";

export const action = async ({ request }) => {
	console.log("request.url");
	console.log(request.url);
	let url = new URL(request.url);
	let { pathname } = url;
	let group_id = get_group_id(pathname);
	let entity_id = get_entity_id(pathname);
	let params = await form_params(request);

	console.log("params");
	console.log(params);
	console.log(group_id);
	console.log(entity_id);

	let step = pipe(filter({ id: "inception_date" }), head, get("step"))(navigation);
	let { business_start_date } = params;
	let payload = { business_start_date: JSON.parse(business_start_date), step };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);

	let next = pipe(filter({ id: "inception_date" }), head, get("next"))(navigation);
	return redirect(next({ entity_id, group_id }));
};

const SectionHeading = ({ headline, subheadline }) => {
	return (
		<div className="flex flex-col text-center gap-y-2">
			<div className="text-gray-800 font-semibold">{headline}</div>
			<div className="text-gray-600">{subheadline}</div>
		</div>
	);
};

export default function Container() {
	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll pb-10 justify-center">
			<div className="flex flex-col justify-center h-4/5 w-[900px] ">
				<div className="flex flex-col my-4">
					<SectionHeading
						headline={<div className="flex flex-col text-2xl">Upload last 4 months bank statements</div>}
						subheadline={
							<div className="flex flex-col h-[300px] items-center">
								<img src={bank_img} className="flex flex-col h-full w-fit" />
							</div>
						}
					/>
				</div>
				<div className="flex flex-col w-full my-[40px]">
					<ApplicationDocumentsUpload type={"bankstatements"} />
				</div>
			</div>
		</div>
	);
}
