import { Link } from "@remix-run/react";
const cb_logo = "/images/logos/cb_logo_3.png";
import UserAccountNavMenu from "./UserAccountNavMenu";

export default function Nav({ user_id }) {
	return (
		<div className="flex flex-col w-full  h-[65px] justify-center px-5">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col justify-center">
					<Link to={"/"}>
						<img
							src={cb_logo}
							className="hidden sm:block h-5 w-auto"
						/>
					</Link>
				</div>

				{/* <div className="flex flex-col justify-center">
					<div className="flex flex-row space-x-5">
						<div>Credit</div>
						<div>Cashflow</div>
						<div>Vault</div>
						<div>University</div>
					</div>
				</div> */}

				{user_id && (
					<div className="flex items-center">
						<UserAccountNavMenu />
					</div>
				)}
			</div>
		</div>
	);
}
