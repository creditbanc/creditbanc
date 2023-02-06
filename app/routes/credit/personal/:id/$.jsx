import { useEffect, useRef, useState } from "react";
import { default as accordion_style } from "~/styles/accordion.css";
import CreditScoreDoughnut from "~/components/CreditScoreDoughnut";
import PersonalCreditTabs from "~/components/PersonalCreditTabs";
import CreditNav from "~/components/CreditNav";

export function links() {
	return [{ rel: "stylesheet", href: accordion_style }];
}

export const loader = async ({ request }) => {
	// let has_permission = await validate_action(request);
	// console.log("has_permission", has_permission);

	// return has_permission ? null : redirect("/");
	return null;
};

export default function BusinessCreditReport() {
	return (
		<div className="flex flex-col w-full">
			<CreditNav />

			<div className="flex flex-col w-full p-[10px] md:p-[20px]">
				<main>
					<div className="relative px-6 lg:px-8">
						<div className="mx-auto max-w-3xl pt-[20px]">
							<div>
								<h1 className="text-5xl font-bold tracking-tight text-center">
									Your business credit report...
								</h1>
								<p className="mt-6 text-lg leading-6 text-gray-600 text-center">
									View all three business credit bureaus
								</p>
							</div>
							<div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
								<svg
									className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
									viewBox="0 0 1155 678"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
										fillOpacity=".3"
										d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
									/>
									<defs>
										<linearGradient
											id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
											x1="1155.49"
											x2="-78.208"
											y1=".177"
											y2="474.645"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="#9089FC" />
											<stop
												offset={1}
												stopColor="#FF80B5"
											/>
										</linearGradient>
									</defs>
								</svg>
							</div>
						</div>
					</div>
				</main>

				<div className="flex flex-col items-center -mt-[70px]">
					<div className="flex flex-col w-[80%]  my-[10px] p-[5px] ">
						<CreditScoreDoughnut bureau={"Experian"} />
						<div className="flex flex-row w-full justify-around -mt-[30px] z-[1]">
							<span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-0.5 text-xs font-medium text-gray-800 cursor-pointer">
								Equifax
							</span>

							<span className="inline-flex items-center rounded-full bg-green-100 px-4 py-0.5 text-xs font-medium text-green-800 cursor-pointer">
								<svg
									className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
									fill="currentColor"
									viewBox="0 0 8 8"
								>
									<circle cx={4} cy={4} r={3} />
								</svg>
								Experian
							</span>

							<span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-0.5 text-xs font-medium text-gray-800 cursor-pointer">
								D&B
							</span>
						</div>
					</div>
				</div>

				<PersonalCreditTabs />

				<div className="accordion flex flex-col items-center"></div>
			</div>
		</div>
	);
}
