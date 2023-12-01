import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
const signature_hero_img = "/images/sign.jpg";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { form_params, get, get_entity_id, get_group_id } from "~/utils/helpers";
import { head, pipe } from "ramda";
import { filter } from "shades";
import { Link, useLocation, useSubmit } from "@remix-run/react";
import { navigation } from "./navigation";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { update_doc } from "~/utils/firebase";
import { redirect } from "@remix-run/node";
import ApplicationProgress from "~/components/ApplicationProgress";

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

	let step = pipe(filter({ id: "signature" }), head, get("step"))(navigation);
	let { base_64_img } = params;
	let payload = { signature_base_64_img: JSON.parse(base_64_img), step };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);
	let next = pipe(filter({ id: "signature" }), head, get("next"))(navigation);
	return redirect(next({ entity_id, group_id }));
};

export default function Signature() {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let sig_canvas_ref = useRef();
	// let [base_64_img, set_base_64_img] = useState("");
	const submit = useSubmit();

	let back = pipe(filter({ id: "signature" }), head, get("back"))(navigation);

	const onSubmit = () => {
		console.log("onSubmit");
		let data = sig_canvas_ref.current.toDataURL();
		let payload = { base_64_img: JSON.stringify(data) };

		submit(payload, {
			action: `/apply/signature/resource/e/${entity_id}/g/${group_id}`,
			method: "post",
		});
	};

	const onClearSignature = () => {
		sig_canvas_ref.current.clear();
		// set_base_64_img("");
	};

	return (
		<div className="flex flex-col bg-white overflow-y-scroll h-full items-center w-full">
			<div className="flex flex-col w-full">
				<ApplicationProgress />
			</div>
			<div className="flex flex-col px-10 pt-10 border rounded shadow-sm w-[700px] my-[30px]">
				<div className="mx-auto max-w-2xl lg:text-center">
					<div className="flex flex-col w-full items-center">
						<img src={signature_hero_img} className="h-[250px]" />
					</div>
					<p className="mt-2 text-xl font-semibold tracking-tight text-gray-900">
						Save your signature and verify your loan application
					</p>
				</div>
				{/* <div className="flex flex-col w-full items-center">
					{base_64_img !== "" && (
						<div className="flex flex-col w-full items-center">
							<img src={base_64_img} className="h-[250px]" />
						</div>
					)}
				</div> */}
				<div className="flex flex-col justify-center my-10 w-full">
					<div className="flex flex-row w-full ml-[35px]">
						<div className="flex flex-col h-full justify-end items-end -mt-[30px] -mr-[80px]">
							<ArrowRightIcon className="h-6 w-6 text-red-500 mx-auto stroke-2" />
						</div>
						<div className="flex flex-col relative my-0 mx-auto">
							<div className="flex flex-col absolute top-[10px] right-[10px]">
								<div
									className="flex flex-col px-2.5 py-0.5 bg-red-500 rounded-full text-xs text-white cursor-pointer mb-[30px]"
									onClick={onClearSignature}
								>
									clear
								</div>
							</div>
							<SignatureCanvas
								ref={sig_canvas_ref}
								canvasProps={{ width: 500, height: 200, className: "bg-gray-50" }}
							/>
							<div className="flex flex-col w-full items-center">
								<div className="flex flex-col h-[1px] border border-dashed border-gray-400 -mt-[30px] w-[95%]"></div>
							</div>
						</div>
					</div>

					<div className="flex flex-row w-full justify-center pt-10 gap-x-3">
						<Link
							to={back({ entity_id, group_id })}
							className="flex flex-col py-3 px-4 rounded-full text-[#56CF9E] w-1/2 items-center cursor-pointer border-2 border-[#56CF9E]"
						>
							Back
						</Link>
						<div
							className="flex flex-col bg-[#56CF9E] py-3 px-4 rounded-full text-white w-[400px] items-center cursor-pointer"
							onClick={onSubmit}
						>
							Verify loan application
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
