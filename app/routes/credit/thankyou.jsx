import { Link } from "@remix-run/react";
import CreditNav from "~/components/CreditNav";

export default function ThankYou() {
	return (
		<div className="flex flex-col w-full flex-1">
			<CreditNav />

			<div className="flex flex-col w-full h-full  ">
				<div className="flex flex-row w-full p-10 h-full items-center">
					<div className="flex flex-col w-full space-y-6 items-center -mt-40">
						<div className="flex flex-col items-center space-y-2">
							<div className="text-6xl font-semibold">
								Thank You
							</div>
							{/* <div className="text-xl">
								Your credit report has been sent
							</div> */}
						</div>
						<div className="flex flex-row">
							<Link
								to="/"
								type="button"
								className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Visit Credit Banc
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-[url('https://as1.ftcdn.net/jpg/01/26/29/54/160_F_126295456_9dAECi0krjY8214YM0S8ReO9kGj8Ou6N.jpg')] w-full h-full fixed top-0 left-0 -z-[1] opacity-[.2]" />
		</div>
	);
}
