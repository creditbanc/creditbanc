import { Fragment } from "react";
import { useModalStore } from "~/hooks/useModal";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({ children, id, classes = "" }) {
	const is_open = useModalStore((state) => state.is_open);
	const set_open = useModalStore((state) => state.set_open);
	const modal_id = useModalStore((state) => state.id);

	return (
		<Transition.Root show={is_open && modal_id == id} as={Fragment}>
			<Dialog as="div" className="relative z-[99]" onClose={set_open}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="flex flex-col justify-center fixed inset-0 z-10 overflow-y-auto">
					<div className="flex flex-col items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel
								className={`flex flex-col items-center relative transform overflow-hidden text-left transition-all ${classes}`}
							>
								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
