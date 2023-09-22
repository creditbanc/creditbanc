import { useReportStore } from "./new/$";
import {
	test_identity_three,
	test_identity_four,
	test_identity_five,
	test_identity_six,
	test_identity_seven,
	mrm_credit_report,
} from "~/data/lendflow";

export default function PreFills() {
	let set_state = useReportStore((state) => state.set_state);

	const onPreFill = (identity) => {
		set_state(["form"], identity);
	};

	return (
		<div className="absolute top-0 right-[10px] z-[101] space-y-2 py-5">
			<div className="cursor-pointer" onClick={() => onPreFill(test_identity_three)}>
				MRM
			</div>

			<div className="cursor-pointer" onClick={() => onPreFill(test_identity_four)}>
				Meta
			</div>

			<div className="cursor-pointer" onClick={() => onPreFill(test_identity_five)}>
				McDonalds
			</div>

			<div className="cursor-pointer" onClick={() => onPreFill(test_identity_six)}>
				Lkq Auto Parts Of North Texas, Inc.
			</div>

			<div className="cursor-pointer" onClick={() => onPreFill(test_identity_seven)}>
				Nuveen New York Quality Income Municipal Fund Inc
			</div>
		</div>
	);
}
