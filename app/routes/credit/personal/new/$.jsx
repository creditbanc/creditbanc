import CreditNav from "~/components/CreditNav";
import CreditHeroGradient from "~/components/CreditHeroGradient";

const Form = () => {
	return (
		<form className="space-y-8">
			<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
				<div className="border-b border-gray-300 sm:col-span-6">
					<h3 className="text-lg font-medium leading-6 text-gray-900 pb-2">
						Personal information
					</h3>
				</div>

				<div className="sm:col-span-3">
					<label
						htmlFor="first-name"
						className="block text-sm font-medium text-gray-700"
					>
						First name
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="first-name"
							id="first-name"
							autoComplete="given-name"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px]"
						/>
					</div>
				</div>

				<div className="sm:col-span-3">
					<label
						htmlFor="last-name"
						className="block text-sm font-medium text-gray-700"
					>
						Last name
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="last-name"
							id="last-name"
							autoComplete="family-name"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px]"
						/>
					</div>
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="street-address"
						className="block text-sm font-medium text-gray-700"
					>
						Social security number
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="street-address"
							id="street-address"
							autoComplete="street-address"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px]"
						/>
					</div>
				</div>

				<div className="border-b border-gray-300 sm:col-span-6">
					<h3 className="text-lg font-medium leading-6 text-gray-900 pb-2">
						Date of birth
					</h3>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="city"
						className="block text-sm font-medium text-gray-700"
					>
						Month
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="city"
							id="city"
							autoComplete="address-level2"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px]"
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="region"
						className="block text-sm font-medium text-gray-700"
					>
						Day
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="region"
							id="region"
							autoComplete="address-level1"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px]"
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="postal-code"
						className="block text-sm font-medium text-gray-700"
					>
						Year
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="postal-code"
							id="postal-code"
							autoComplete="postal-code"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px]"
						/>
					</div>
				</div>

				<div className="border-b border-gray-300 sm:col-span-6">
					<h3 className="text-lg font-medium leading-6 text-gray-900 pb-2">
						Address
					</h3>
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="street-address"
						className="block text-sm font-medium text-gray-700"
					>
						Street address
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="street-address"
							id="street-address"
							autoComplete="street-address"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px]"
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="city"
						className="block text-sm font-medium text-gray-700"
					>
						City
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="city"
							id="city"
							autoComplete="address-level2"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px]"
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="region"
						className="block text-sm font-medium text-gray-700"
					>
						State / Province
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="region"
							id="region"
							autoComplete="address-level1"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px]"
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="postal-code"
						className="block text-sm font-medium text-gray-700"
					>
						ZIP / Postal code
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="postal-code"
							id="postal-code"
							autoComplete="postal-code"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px]"
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-row w-full justify-end pt-3">
				<button
					type="button"
					className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Next
				</button>
			</div>
		</form>
	);
};

const Heading = () => {
	return (
		<div className="bg-transparent">
			<div className="mx-auto max-w-7xl py-4 pb-6 px-2">
				<div className="text-center">
					<h2 className="text-lg font-semibold text-indigo-600">
						New
					</h2>
					<p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
						Credit report
					</p>
				</div>
			</div>
		</div>
	);
};

export default function NewPersonalCreditReport() {
	return (
		<div className="flex flex-col w-full">
			<CreditNav />
			<CreditHeroGradient />
			<div className="flex flex-col w-full p-[20px] max-w-2xl mx-auto">
				<Heading />
				<Form />
			</div>
		</div>
	);
}
