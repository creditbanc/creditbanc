import { useEffect, useRef, useState } from "react";
import PersonalCreditTabs from "~/components/PersonalCreditTabs";
import CreditNav from "~/components/CreditNav";
import CreditScoreHero from "~/components/CreditScoreHero";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import { credmo3bReportScore } from "~/data/array";
import { pipe } from "ramda";
import { get } from "shades";
import { inspect } from "~/utils/helpers";

export const loader = async ({ request }) => {
	// let has_permission = await validate_action(request);

	let liabilities = pipe(get("CREDIT_RESPONSE", "CREDIT_LIABILITY"))(
		credmo3bReportScore
	);
	console.log("liabilities");
	inspect(liabilities);

	return null;
};

const Heading = () => {
	return (
		<div className="">
			<h3 className="text-lg font-medium leading-6 text-gray-900">
				Accounts
			</h3>
			<p className="mt-2 max-w-4xl text-sm text-gray-500">
				Workcation is a property rental website. Etiam ullamcorper massa
				viverra consequat, consectetur id nulla tempus. Fringilla
				egestas justo massa purus sagittis malesuada.
			</p>
		</div>
	);
};

const Account = () => {
	return (
		<div className="overflow-hidden bg-white border rounded-lg">
			<div className="px-4 py-5">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Amex
				</h3>
				<p className="mt-1 max-w-2xl text-sm text-gray-500">
					342023809482309280
				</p>
			</div>
			<div className="border-t border-gray-200 px-4 py-3">
				<div className="hidden sm:flex sm:flex-row sm:py-2">
					<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0"></div>
					<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
						<div className="w-[100px] sm:w-[120px]">
							<div className="font-bold">Transunion</div>
						</div>
						<div className="w-[100px] sm:w-[120px]">
							<div className="font-bold">Equifax</div>
						</div>
						<div className="w-[100px] sm:w-[120px]">
							<div className="font-bold">Experian</div>
						</div>
					</div>
				</div>
				<div className="divide-y divide-gray-200">
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Account type
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Transunion
								</div>
								<div>Real Estate</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Equifax
								</div>
								<div>Real Estate</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Experian
								</div>
								<div>Real Estate</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Account status
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Transunion
								</div>
								<div>Real Estate</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Equifax
								</div>
								<div>Real Estate</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Experian
								</div>
								<div>Real Estate</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Monthly payment
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Transunion
								</div>
								<div>Real Estate</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Equifax
								</div>
								<div>Real Estate</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Experian
								</div>
								<div>Real Estate</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Date opened
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Transunion
								</div>
								<div>02-01-23</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Equifax
								</div>
								<div>02-01-23</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Experian
								</div>
								<div>02-01-23</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Balance
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Transunion
								</div>
								<div>$100,000</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Equifax
								</div>
								<div>$100,000</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Experian
								</div>
								<div>$100,000</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							No of months (terms)
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Transunion
								</div>
								<div>73 months</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Equifax
								</div>
								<div>73 months</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Experian
								</div>
								<div>73 months</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							High credit
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Transunion
								</div>
								<div>$100,000</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Equifax
								</div>
								<div>$100,000</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Experian
								</div>
								<div>$100,000</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Payment status
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Transunion
								</div>
								<div>As agreed</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Equifax
								</div>
								<div>As agreed</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Experian
								</div>
								<div>As agreed</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Last reported
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Transunion
								</div>
								<div>02-01-23</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Equifax
								</div>
								<div>02-01-23</div>
							</div>
							<div className="w-[100px] sm:w-[120px]">
								<div className=" text-gray-500 text-xs sm:hidden">
									Experian
								</div>
								<div>02-01-23</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center sm:justify-start w-[150px] mb-1 sm:mb-0">
							Payment history
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<div className="w-full flex flex-row justify-between text-xs sm:text-sm">
								<div className="flex flex-col border items-center justify-center flex-grow">
									<div className="flex flex-col items-center justify-center w-full border-b py-1">
										J
									</div>
									<div className="flex flex-col items-center justify-center py-1">
										OK
									</div>
								</div>
								<div className="flex flex-col border items-center justify-center flex-grow">
									<div className="flex flex-col items-center justify-center w-full border-b py-1">
										F
									</div>
									<div className="flex flex-col items-center justify-center py-1">
										OK
									</div>
								</div>
								<div className="flex flex-col border items-center justify-center flex-grow">
									<div className="flex flex-col items-center justify-center w-full border-b py-1">
										M
									</div>
									<div className="flex flex-col items-center justify-center py-1">
										OK
									</div>
								</div>
								<div className="flex flex-col border items-center justify-center flex-grow">
									<div className="flex flex-col items-center justify-center w-full border-b py-1">
										A
									</div>
									<div className="flex flex-col items-center justify-center py-1">
										OK
									</div>
								</div>
								<div className="flex flex-col border items-center justify-center flex-grow">
									<div className="flex flex-col items-center justify-center w-full border-b py-1">
										M
									</div>
									<div className="flex flex-col items-center justify-center py-1">
										OK
									</div>
								</div>
								<div className="flex flex-col border items-center justify-center flex-grow">
									<div className="flex flex-col items-center justify-center w-full border-b py-1">
										J
									</div>
									<div className="flex flex-col items-center justify-center py-1">
										OK
									</div>
								</div>
								<div className="flex flex-col border items-center justify-center flex-grow">
									<div className="flex flex-col items-center justify-center w-full border-b py-1">
										J
									</div>
									<div className="flex flex-col items-center justify-center py-1">
										OK
									</div>
								</div>
								<div className="flex flex-col border items-center justify-center flex-grow">
									<div className="flex flex-col items-center justify-center w-full border-b py-1">
										A
									</div>
									<div className="flex flex-col items-center justify-center py-1">
										OK
									</div>
								</div>
								<div className="flex flex-col border items-center justify-center flex-grow">
									<div className="flex flex-col items-center justify-center w-full border-b py-1">
										S
									</div>
									<div className="flex flex-col items-center justify-center py-1">
										OK
									</div>
								</div>
								<div className="flex flex-col border items-center justify-center flex-grow">
									<div className="flex flex-col items-center justify-center w-full border-b py-1">
										O
									</div>
									<div className="flex flex-col items-center justify-center py-1">
										OK
									</div>
								</div>
								<div className="flex flex-col border items-center justify-center flex-grow">
									<div className="flex flex-col items-center justify-center w-full border-b py-1">
										N
									</div>
									<div className="flex flex-col items-center justify-center py-1">
										OK
									</div>
								</div>
								<div className="flex flex-col border items-center justify-center flex-grow">
									<div className="flex flex-col items-center justify-center w-full border-b py-1">
										D
									</div>
									<div className="flex flex-col items-center justify-center py-1">
										OK
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function BusinessCreditReport() {
	return (
		<div className="flex flex-col w-full">
			<CreditNav />
			<CreditHeroGradient />

			<div className="flex flex-col w-full p-[10px] max-w-5xl mx-auto">
				<CreditScoreHero />

				<div className="mt-3 mb-1">
					<PersonalCreditTabs selected="Accounts" />
				</div>
				<div className="pt-5 pb-2 px-2">
					<Heading />
				</div>
				<div className="my-2">
					<Account />
				</div>
			</div>
		</div>
	);
}
