import { pipe } from "ramda";
import { UsaStates } from "usa-states";
import random from "random-name";
import { sample } from "~/utils/helpers";
import { RandomSSN } from "ssn";
import { get, all } from "shades";
import { is_sandbox } from "~/data/array";
const cities = require("all-the-cities");

export const credit_user = (user) => {
	if (is_sandbox) {
		let first_name = random.first();
		let last_name = random.last();
		let usStates = new UsaStates();
		let statesAbbreviation = usStates.arrayOf("abbreviations");
		let state = sample(statesAbbreviation);
		let randomSSN = new RandomSSN();
		let ssn = randomSSN.value().toString();
		let city = pipe(
			get(all, "name"),
			sample
		)(cities.filter((city) => city.country === "US"));

		let payload = {
			first_name,
			last_name,
			ssn,
			dob: "1980-01-01",
			street: "123 Main St",
			city,
			state,
			zip: "12345",
		};

		return payload;
	}

	if (!is_sandbox) {
		let {
			address,
			firstName: first_name,
			lastName: last_name,
			ssn,
			dob,
		} = user;

		let { street, city, state, zip } = address;

		let payload = {
			street,
			city,
			state,
			zip,
			first_name,
			last_name,
			ssn,
			dob,
		};

		return payload;
	}
};
