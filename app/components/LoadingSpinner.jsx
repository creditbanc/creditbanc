const cb_logo_3 = "/images/logos/cb_logo_3.png";

export default function Spinner() {
	return (
		<div className="h-full w-full flex flex-col items-center justify-center">
			<div className="w-[200px] flex flex-col">
				<div className="flex flex-col items-center my-5">
					<img src={cb_logo_3} />
				</div>
				<div className="flex flex-row items-center justify-center">
					<div>
						<svg
							className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="green"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="green"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</div>
					<div>Loading...</div>
				</div>
			</div>
		</div>
	);
}
