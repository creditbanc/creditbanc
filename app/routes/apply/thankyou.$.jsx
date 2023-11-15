import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { classNames } from "~/utils/helpers";

const features = [
	{ name: "Origin", description: "Designed by Good Goods, Inc." },
	{ name: "Material", description: "Solid walnut base with rare earth magnets and powder coated steel card cover" },
	{ name: "Dimensions", description: '6.25" x 3.55" x 1.15"' },
	{ name: "Finish", description: "Hand sanded and finished with natural oil" },
	{ name: "Includes", description: "Wood card tray and 3 refill packs" },
	{ name: "Considerations", description: "Made from natural materials. Grain and color vary with each item." },
];

const Featuers = () => {
	return (
		<div className="bg-white">
			<div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
				<div>
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Thank you</h2>
					<p className="mt-4 text-gray-500">
						The walnut wood card tray is precision milled to perfectly fit a stack of Focus cards. The
						powder coated steel divider separates active cards from new ones, or can be used to archive
						important task lists.
					</p>

					<dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
						{features.map((feature) => (
							<div key={feature.name} className="border-t border-gray-200 pt-4">
								<dt className="font-medium text-gray-900">{feature.name}</dt>
								<dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
							</div>
						))}
					</dl>
				</div>
				<div className="flex flex-col w-full h-full rounded overflow-hidden">
					<img src="https://elements-cover-images-0.imgix.net/1cbadc7b-4294-4359-ae21-d0377caada62?auto=compress%2Cformat&w=2740&fit=max&s=f356a28c487df81e449dd1b4534b484a" />
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll pb-10">
			<Featuers />
		</div>
	);
}
