import { Link } from "@remix-run/react";
const cb_logo = "/images/logos/cb_logo_3.png";

export default function Nav() {
	return (
		<div className="flex flex-col w-full border-b h-[65px] justify-center px-5">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col justify-center">
					<Link to={"/"}>
						<img
							src={cb_logo}
							className="hidden sm:block h-5 w-auto"
						/>
					</Link>
				</div>
			</div>
		</div>
	);
}
