const cb_logo = "/images/logos/cb_logo_5.png";

export default function ComingSoon() {
	return (
		<>
			<main className="relative isolate min-h-full">
				<img
					src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75"
					alt=""
					className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
				/>
				<div className="mx-auto max-w-7xl px-6 py-32 flex flex-col items-center sm:py-40 lg:px-8">
					<h3 className="mb-5 sm:mb-10  mt-4 text-3xl font-bold tracking-tight text-white sm:text-3xl">
						Coming Soon
					</h3>
					<img src={cb_logo} className="sm:w-[80%]" />

					<div className="mt-10 flex justify-center">
						<a
							href="/"
							className="text-sm font-semibold leading-7 text-white"
						>
							<span aria-hidden="true">&larr;</span> Back to home
						</a>
					</div>
				</div>
			</main>
		</>
	);
}
