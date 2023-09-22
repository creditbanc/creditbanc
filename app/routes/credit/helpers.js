import { allPass, isEmpty, isNil, pipe } from "ramda";

const isNotEmpty = (value) => !isEmpty(value);
const isNotNil = (value) => !isNil(value);

export const lendflow_validator = {
	business_start_date: pipe(allPass([isNotEmpty, isNotNil])),
	basic_info: {
		first_name: pipe(allPass([isNotEmpty, isNotNil])),
		last_name: pipe(allPass([isNotEmpty, isNotNil])),
		email_address: pipe(allPass([isNotEmpty, isNotNil])),
		telephone: pipe(allPass([isNotEmpty, isNotNil])),
	},
	business_address: {
		address_line: pipe(allPass([isNotEmpty, isNotNil])),
		city: pipe(allPass([isNotEmpty, isNotNil])),
		state: pipe(allPass([isNotEmpty, isNotNil])),
		country: pipe(allPass([isNotEmpty, isNotNil])),
		zip: pipe(allPass([isNotEmpty, isNotNil])),
	},
	business_entity: pipe(allPass([isNotEmpty, isNotNil])),
	business_legal_name: pipe(allPass([isNotEmpty, isNotNil])),
	employee_identification_number: pipe(allPass([isNotEmpty, isNotNil])),
};
