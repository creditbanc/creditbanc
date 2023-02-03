const bg = "/images/tree_on_a_hill.jpg";
import SignIn from "./_auth+/signin";
import { require_user_session } from "~/utils/auth.server";
import { Hero } from "~/components/Hero";

// export const loader = async ({ request }) => {
// 	// await require_user_session(request);
// 	return null;
// };

export default function Index() {
	return (
		<div className="h-full w-full">
			<main>
				<Hero />
			</main>
		</div>
	);
}
