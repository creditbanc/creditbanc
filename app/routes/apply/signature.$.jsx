import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
const signature_hero_img = "/images/sign.jpg";

import {
	ArrowPathIcon,
	ArrowRightIcon,
	CloudArrowUpIcon,
	FingerPrintIcon,
	LockClosedIcon,
} from "@heroicons/react/24/outline";

const features = [
	{
		name: "Push to deploy",
		description:
			"Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.",
		icon: CloudArrowUpIcon,
	},
	{
		name: "SSL certificates",
		description:
			"Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.",
		icon: LockClosedIcon,
	},
	{
		name: "Simple queues",
		description:
			"Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.",
		icon: ArrowPathIcon,
	},
	{
		name: "Advanced security",
		description:
			"Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.",
		icon: FingerPrintIcon,
	},
];

export default function Signature() {
	return (
		<div className="flex flex-col bg-white overflow-y-scroll py-[30px] h-full items-center w-full">
			<div className="flex flex-col px-10 pt-10 border rounded shadow-sm w-[700px]">
				<div className="mx-auto max-w-2xl lg:text-center">
					<div className="flex flex-col w-full items-center">
						<img src={signature_hero_img} className="h-[250px]" />
					</div>
					<p className="mt-2 text-xl font-semibold tracking-tight text-gray-900">
						To finish all you have to do is sign your loan application
					</p>
				</div>
				<div className="flex flex-col justify-center my-10 w-full">
					<div className="flex flex-row w-full ml-[35px]">
						<div className="flex flex-col h-full justify-end items-end -mt-[30px] -mr-[80px]">
							<ArrowRightIcon className="h-6 w-6 text-red-500 mx-auto stroke-2" />
						</div>
						<div className="my-0 mx-auto">
							<SignatureCanvas
								// penColor="green"
								canvasProps={{ width: 500, height: 200, className: "bg-gray-50" }}
							/>
							<div className="flex flex-col w-full items-center">
								<div className="flex flex-col h-[1px] border border-dashed border-gray-400 -mt-[30px] w-[95%]"></div>
							</div>
						</div>
					</div>

					<div className="flex flex-col w-full items-center pt-10">
						<div className="flex flex-col bg-blue-600 py-3 px-4 rounded-full text-white w-[400px] items-center cursor-pointer">
							Confirm and Submit Loan
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
