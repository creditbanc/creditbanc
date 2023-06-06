import { Link, useLocation } from "@remix-run/react";
import copy from "copy-to-clipboard";
import Modal from "./Modal";
import { useModalStore } from "~/hooks/useModal";
import { useEffect, useState } from "react";
const cb_logo = "/images/logos/cb_logo_3.png";
import { LinkIcon } from "@heroicons/react/24/outline";

const ApplicantInviteModal = () => {
	const [shareLink, setShareLink] = useState("");
	const [member_email, set_member_email] = useState("");

	useEffect(() => {
		let link = window.location.href + `?applicant=true&plan_id=builder`;
		setShareLink(link);
	}, []);

	const onCopyLink = () => {
		copy(shareLink);
	};

	return (
		<div className="flex flex-col">
			<div className="w-full  max-w-lg mx-auto">
				<div className="text-center mb-[20px] flex flex-col items-center">
					<div className="w-[20px]">
						<LinkIcon />
					</div>
					<h2 className="mt-2 text-lg font-medium text-gray-900">
						Create an applicant link
					</h2>
					<p className="mt-1 text-sm text-gray-500">
						Send this link to an applicant.
					</p>
				</div>

				{/* <div className="mt-[10px] mb-[15px] flex flex-col relative">
					<div className="text-gray-400 text-sm mb-[10px]">
						Applicant email
					</div>
					<div className="flex flex-col">
						<div
							className="flex flex-col justify-center h-[45px] w-full rounded-md border pl-[10px] border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="Role name"
						>
							<div className="overflow-scroll w-[calc(100%-35px)] scrollbar-none text-gray-400 text-sm flex flex-col justify-center">
								<input
									type="text"
									className="outline-none"
									placeholder="applicant@email.com"
									value={member_email}
									onChange={(e) =>
										set_member_email(e.target.value)
									}
								/>
							</div>
						</div>
					</div>
				</div> */}

				<div className="mt-[20px] flex flex-col relative">
					<div className="text-gray-400 text-sm mb-[10px]">
						Report Link
					</div>
					<div className="flex flex-col">
						<div className=" flex flex-col justify-center h-[45px] w-full rounded-md border pl-[10px] border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
							<div className="overflow-hidden w-[calc(100%-35px)]  text-gray-400 text-sm h-[20px]">
								{shareLink}
							</div>
						</div>

						<button
							className="absolute right-[10px] flex flex-col items-center justify-center h-[45px]"
							type="submit"
							onClick={onCopyLink}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-4 h-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
								/>
							</svg>
						</button>
					</div>
				</div>

				<div className="mt-[25px] flex flex-row justify-between">
					<button
						type="button"
						className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						onClick={onCopyLink}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-3 h-3 mr-[5px]"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
							/>
						</svg>
						Copy link
					</button>

					<button
						type="button"
						className="rounded bg-indigo-600 py-1 px-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						// onClick={onInvite}
					>
						Send invite
					</button>
				</div>
			</div>
		</div>
	);
};

export default function Nav() {
	const set_modal = useModalStore((state) => state.set_modal);

	const create_applicate_link = () => {
		console.log("create_applicate_link");
		let applicant_link =
			window.location.href + `?applicant=true&plan_id=builder`;

		return applicant_link;
	};

	const onCreateApplicantLinkClick = () => {
		console.log("onCreateApplicantLinkClick");
		copy(create_applicate_link());
	};

	useEffect(() => {
		set_modal({
			id: "applicant_share_link",
			is_open: true,
		});
	}, []);

	return (
		<div className="flex flex-col w-full border-b h-[65px] justify-center px-5">
			<Modal id={"applicant_share_link"}>
				<ApplicantInviteModal />
			</Modal>
			<div className="flex flex-row justify-between">
				<div className="flex flex-col justify-center">
					<Link to={"/"}>
						<img
							src={cb_logo}
							className="hidden sm:block h-5 w-auto"
						/>
					</Link>
				</div>
				<div className="flex flex-col sm:-ml-[150px]">
					<div
						type="button"
						className="text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800 flex flex-row items-center justify-center cursor-pointer"
						onClick={onCreateApplicantLinkClick}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-5 h-5 mr-2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
							/>
						</svg>
						<div>Send To Applicant</div>
					</div>
				</div>
				<div></div>
			</div>
		</div>
	);
}
