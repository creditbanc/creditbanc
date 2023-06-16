import forEach from "lodash/forEach";
import map from "lodash/map";

export const INDUSTRY = [
	{ id: "1", value: 0.359914571205166, title: "Architecture" },
	{ id: "2", value: 0.22, title: "Agriculture" },
	{ id: "3", value: 0.576130715835985, title: "Chemical/Pharmaceutical" },
	// { id: '4', value: 1.0, title: 'Client-Provided QREs (no haircut)' },
	{ id: "5", value: 0.254500494409702, title: "Engineering" },
	{ id: "6", value: 0.57115627552481, title: "General Contractor" },
	{ id: "7", value: 0.284107469502407, title: "Manufacturing" },
	{ id: "8", value: 0.559306664627778, title: "Software" },
	{ id: "9", value: 0.581000075878291, title: "Tool/Die" },
	{ id: "10", value: 0.184681804902921, title: "Winery/Brewery" },
];

export const STATES = [
	{ id: "1", value: 0, title: "Alabama" },
	{ id: "2", value: 0.18, title: "Alaska" },
	{ id: "3", value: 1.138, title: "Arizona" },
	{ id: "4", value: 1.05, title: "Arkansas" },
	{ id: "5", value: 0.884, title: "California" },
	{ id: "6", value: 0.152, title: "Colorado" },
	{ id: "7", value: 0.943, title: "Connecticut" },
	{ id: "8", value: 0.65, title: "Delaware" },
	{ id: "9", value: 0.4, title: "Florida" },
	{ id: "10", value: 0.523, title: "Georgia" },
	{ id: "11", value: 1.0, title: "Hawaii" },
	{ id: "12", value: 0.262, title: "Idaho" },
	{ id: "13", value: 0.325, title: "Illinois" },
	{ id: "14", value: 0.625, title: "Indiana" },
	{ id: "15", value: 0.325, title: "Iowa" },
	{ id: "16", value: 0.28, title: "Kansas" },
	{ id: "17", value: 0.264, title: "Kentucky" },
	{ id: "18", value: 0.4, title: "Louisiana" },
	{ id: "19", value: 0.281, title: "Maine" },
	{ id: "20", value: 0.65, title: "Maryland" },
	{ id: "21", value: 0.442, title: "Massachusetts" },
	{ id: "22", value: 0.19, title: "Michigan" },
	{ id: "23", value: 0.46, title: "Minnesota" },
	{ id: "24", value: 0.1, title: "Mississippi" },
	{ id: "25", value: 0, title: "Missouri" },
	{ id: "26", value: 0, title: "Montana" },
	{ id: "27", value: 0.15, title: "Nebraska" },
	{ id: "28", value: 0, title: "Nevada" },
	{ id: "29", value: 0.469, title: "New Hampshire" },
	{ id: "30", value: 0.5, title: "New Jersey" },
	{ id: "31", value: 0.33, title: "New Mexico" },
	{ id: "32", value: 0.476, title: "New York" },
	{ id: "33", value: 0, title: "North Carolina" },
	{ id: "34", value: 1.15, title: "North Dakota" },
	{ id: "35", value: 0.35, title: "Ohio" },
	{ id: "36", value: 0, title: "Oklahoma" },
	{ id: "37", value: 0, title: "Oregon" },
	{ id: "38", value: 0.6, title: "Pennsylvania" },
	{ id: "39", value: 1.15, title: "Rhode Island" },
	{ id: "40", value: 0.55, title: "South Carolina" },
	{ id: "41", value: 0, title: "South Dakota" },
	{ id: "42", value: 0, title: "Tennessee" },
	{ id: "43", value: 0.261, title: "Texas" },
	{ id: "44", value: 0.65, title: "Utah" },
	{ id: "45", value: 0.27, title: "Vermont" },
	{ id: "46", value: 0.45, title: "Virginia" },
	{ id: "47", value: 0, title: "Washington" },
	{ id: "48", value: 0, title: "West Virginia" },
	{ id: "49", value: 0.29, title: "Wisconsin" },
	{ id: "50", value: 0, title: "Wyoming" },
];

function ro(n) {
	// @ts-ignore
	return (n / 1000).toFixed() * 1000;
}

function mo(n) {
	return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export const calculateTax = (expenses, states, industry) => {
	const listStates = [];
	const valueIndustry = industry.value;
	let totalExpense = 0;

	map(expenses, (item) => (totalExpense += parseInt(item, 10)));
	map(states, (item) => listStates.push(item.value));

	const stateMin = Math.min(...listStates);
	const stateMax = Math.max(...listStates);

	const fedResult = totalExpense * valueIndustry * 0.1;

	const rangeStart = fedResult * stateMin + fedResult;
	const rangeEnd = fedResult * stateMax + fedResult;

	const rangeStartMinus = mo(ro(rangeStart - rangeStart * 0.1));
	const rangeEndMinus = mo(ro(rangeEnd + rangeEnd * 0.1));

	return { rangeStartMinus, rangeEndMinus };
};

let expenses = {
	2019: 50000,
	2020: 50000,
	2021: 50000,
	2022: 50000,
	2023: 50000,
};

let states = [{ id: "1", value: 0.5, title: "Alabama" }];

let industry = INDUSTRY[6];

export const deprecatedCalculateTaxPerYear = (expenses, states, industry) => {
	const listStates = [];
	const valueIndustry = industry.value;

	let result = [];
	let totalFedResult = 0;
	let totalAvg = 0;
	let totalResult = 0;

	map(states, (item) => listStates.push(item.value));
	const stateMin = Math.min(...listStates);
	const stateMax = Math.max(...listStates);
	forEach(expenses, (item, index) => {
		if (item > 0) {
			const fedResult = item * valueIndustry * 0.1;
			let rangeStart = 0;
			let rangeEnd = 0;

			rangeStart = fedResult * stateMin + fedResult;
			rangeEnd = fedResult * stateMax + fedResult;

			const rangeStartMinus = rangeStart - rangeStart * 0.1;
			const rangeEndMinus = rangeEnd + rangeEnd * 0.1;

			totalFedResult += ro(rangeStartMinus);
			totalAvg += ro(rangeStart / listStates.length);
			totalResult += ro(rangeEndMinus);

			result.push({
				year: index,
				fedResult: mo(ro(rangeStartMinus)),
				avg: mo(ro(rangeStart / listStates.length)),
				totalYear: mo(ro(rangeEndMinus)),
			});
		}
	});

	result = result.reverse();
	result.push({
		year: "TOTAL",
		fedResult: mo(totalFedResult),
		avg: mo(totalAvg),
		totalYear: mo(totalResult),
	});

	return {
		finalTaxYear: result,
		finalTax: {
			rangeStartMinus: mo(totalFedResult),
			rangeEndMinus: mo(totalResult),
		},
	};
};

export const calculateTaxPerYear = (expenses, states, industry) => {
	const listStates = [];
	const valueIndustry = industry.value;

	let result = [];
	let totalFedResult = 0;
	let totalAvg = 0;
	let totalResult = 0;

	map(states, (item) => listStates.push(item.value));
	forEach(expenses, (item, index) => {
		if (item > 0) {
			const fedResult = item * valueIndustry * 0.1;
			const fedResultFinal = Math.round(fedResult);
			const totalState = (listStates || []).reduce((acc, stateVal) => {
				return acc + fedResultFinal * stateVal;
			}, 0);
			const avgState = Math.round(totalState / listStates.length);
			const total = fedResultFinal + avgState;

			totalFedResult += fedResultFinal;
			totalAvg += avgState;
			totalResult += total;

			result.push({
				year: index,
				fedResult: mo(fedResultFinal),
				avg: mo(avgState),
				totalYear: mo(total),
			});
		}
	});

	result = result.reverse();
	result.push({
		year: "TOTAL",
		fedResult: mo(totalFedResult),
		avg: mo(totalAvg),
		totalYear: mo(totalResult),
	});

	const rangeStart = totalResult - totalResult * 0.1;
	const rangeEnd = totalResult + totalResult * 0.1;

	return {
		finalTaxYear: result,
		finalTax: {
			rangeStartMinus: mo(Math.round(rangeStart)),
			rangeEndMinus: mo(Math.round(rangeEnd)),
		},
	};
};
