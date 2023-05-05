import { pipe } from "ramda";
import { get } from "shades";

export const test_identity_one = {
	basic_info: {
		first_name: "Tony",
		last_name: "Stark",
		email_address: "starkindustries@gmail.com",
		telephone: "2025550152",
		doing_business_as: "SI",
	},
	business_address: {
		address_line: "20 Hudson Yards",
		address_line2: "",
		city: "New York",
		state: "NY",
		country: "US",
		zip: "10001",
	},
	business_start_date: "2001-05-26",
	business_entity: "business_entity_type_1",
	business_legal_name: "Stark Industries LLC",
	employee_identification_number: "123456789",
	terms_of_service: true,
	requested_products: ["experian_trades"],
};

export const test_identity_two = {
	basic_info: {
		first_name: "daniel",
		last_name: "arzuaga",
		email_address: "1infiniteloop.end@gmail.com",
		telephone: "352-355-8833",
		doing_business_as: "SI",
	},
	business_address: {
		address_line: "12531 NE 18 ST",
		address_line2: "",
		city: "williston",
		state: "fl",
		country: "US",
		zip: "32696",
	},
	business_start_date: "2022-12-05",
	business_entity: "business_entity_type_1",
	business_legal_name: "SUNSOFT INVESTMENTS LLC",
	employee_identification_number: "92-1268463",
	terms_of_service: true,
	requested_products: ["experian_business_match"],
};

export const credit_report_data = {
	bop: {
		blended_prequalification: {
			fico8: [
				{
					ssn: [
						{
							number: "999999990",
							variationIndicator: {
								code: "",
								definition: "Same",
							},
						},
						{
							number: "999997891",
							variationIndicator: {
								code: "*",
								definition: "Different",
							},
						},
						{
							number: "999996789",
							variationIndicator: {
								code: "*",
								definition: "Different",
							},
						},
					],
					addresses: [
						{
							zip: "91502",
							city: "BURBANK",
							state: "CA",
							unitId: "10655 N BIRCH ST",
							countyCode: "123",
							origination: {
								code: "2",
								definition: "Reported via A/R tape",
							},
							dwellingType: {
								code: "S",
								definition: "Single-family dwelling",
							},
							streetPrefix: "10655 N BIRCH ST",
							streetSuffix: "10655 N BIRCH ST",
							zipExtension: "1234",
							censusGeoCode: "4567890",
							homeOwnership: {
								code: "O",
								definition: "Owns home general",
							},
							timesReported: "03",
							lastUpdatedDate: "1998-01-01",
							firstReportedDate: "1995-06-01",
							lastReportingSubcode: "1220855",
						},
						{
							zip: "92708",
							city: "SANTA ANA",
							state: "CA",
							unitId: "1314 SOPHIA LN APT 3",
							origination: {
								code: "1",
								definition:
									"Reported via A/R tape, but different from inquiry",
							},
							dwellingType: {
								code: "A",
								definition: "Apartment complex",
							},
							streetPrefix: "1314 SOPHIA LN APT 3",
							streetSuffix: "1314 SOPHIA LN APT 3",
							zipExtension: "5678",
							homeOwnership: {
								code: "R",
								definition: "Rents",
							},
							timesReported: "01",
							lastUpdatedDate: "1995-02-01",
							firstReportedDate: null,
							lastReportingSubcode: "2390446",
						},
						{
							zip: "90017",
							city: "LOS ANGELES",
							state: "CA",
							unitId: "2600 BOWSER ST #312",
							origination: {
								code: "6",
								definition:
									"Reported via Inquiry, but different from inquiry",
							},
							dwellingType: {
								code: "A",
								definition: "Apartment complex",
							},
							streetPrefix: "2600 BOWSER ST #312",
							streetSuffix: "2600 BOWSER ST #312",
							zipExtension: "9876",
							homeOwnership: {
								code: "R",
								definition: "Rents",
							},
							timesReported: " ",
							lastUpdatedDate: "1993-09-01",
							firstReportedDate: null,
							lastReportingSubcode: "2390446",
						},
					],
					employers: [
						{
							name: "AJAX HARDWARE",
							address: {
								zip: "90019",
								street: "2035 BROADWAY SUITE 300",
								street2: "LOS ANGELES CA",
								zipExtension: null,
							},
							origination: {
								code: "2",
								definition: "Inquiry",
							},
							lastUpdatedDate: "1998-12-01",
							firstReportedDate: null,
						},
						{
							name: "BELL AUTOMOTIVE",
							address: {
								zip: "91503",
								street: "111 MAIN STREET",
								street2: "BURBANK CA",
								zipExtension: null,
							},
							origination: {
								code: "2",
								definition: "Inquiry",
							},
							lastUpdatedDate: "1991-09-01",
							firstReportedDate: "1991-05-01",
						},
					],
					inquiries: [
						{
							kob: {
								code: "DC",
								definition: "",
							},
							date: "1998-12-05",
							type: {
								code: "31",
								definition:
									"Unknown - Credit Extension, Review, Or Collection",
							},
							terms: {
								code: "UNK",
								definition: "Unknown",
							},
							subcode: "2313849",
							amountDefinition: "Unknown",
							subscriberAddress: {
								zip: null,
							},
							subscriberDisplayName: "HEMLOCKS",
						},
						{
							kob: {
								code: "DC",
								definition: "",
							},
							date: "1998-12-03",
							type: {
								code: "07",
								definition: "Revolving Charge Account",
							},
							terms: {
								code: "REV",
								definition: "Revolving",
							},
							amount: 1500,
							subcode: "2390446",
							subscriberAddress: {
								zip: null,
							},
							subscriberDisplayName: "BAY COMPANY",
						},
						{
							kob: {
								code: "BC",
								definition: "",
							},
							date: "1997-10-21",
							type: {
								code: "31",
								definition:
									"Unknown - Credit Extension, Review, Or Collection",
							},
							terms: {
								code: "UNK",
								definition: "Unknown",
							},
							subcode: "2240679",
							amountDefinition: "Unknown",
							subscriberAddress: {
								zip: null,
							},
							subscriberDisplayName: "HILLSIDE BANK",
						},
					],
					riskModel: null,
					statement: [
						{
							dateReported: "2002-03-30",
							statementText:
								"**#HK# ID SECURITY ALERT: FRAUDULENT APPLICATIONS MAY BE SUBMITTED IN MY NAME OR MY IDENTITY MAY HAVE BEEN USED WITHOUT MY CONSENT TO FRAUDULENTLY OBTAIN GOODS OR SERVICES.  DO NOT EXTEND CREDIT WITHOUT FIRST CONTACTING ME PERSONALLY AND VERIFYING ALL APPLICANT INFORMATION.  THIS SECURITY ALERT WILL BE MAINTAINED FOR 90 DAYS BEGINNING 05-01-02.",
						},
					],
					tradelines: [
						{
							kob: {
								code: "YC",
								definition: "YC",
							},
							ecoa: {
								code: "2",
								definition: "Joint Account",
							},
							status: {
								code: "93",
								definition:
									"Account seriously past due date/account assigned to attorney, collection agency, or credit grantor's internal collection department",
							},
							amounts: [
								{
									value: 500,
									qualifierCode: "O",
									qualifierDefinition: "Original",
								},
								{
									qualifierCode: " ",
									qualifierDefinition: "Unknown",
								},
							],
							subcode: "3980999",
							openDate: "1994-09-01",
							evaluation: {
								code: "N",
								definition: "Closer review is required.",
							},
							maxPayment: {
								code: "9",
								definition:
									"Collection, Charge off or Bankruptcy",
							},
							statusDate: "1994-09-01",
							accountType: {
								code: "31",
								definition:
									"Unknown - Credit Extension, Review, Or Collection",
							},
							balanceDate: "1996-04-05",
							derogCounter: 20,
							openOrClosed: {
								code: "O",
								definition: "Open",
							},
							accountNumber: "98E543182136",
							amountPastDue: null,
							balanceAmount: 250,
							monthsHistory: 20,
							termsDuration: {
								code: "UNK",
								definition: "Unknown",
							},
							paymentProfile: "99999999999999999999",
							specialComment: {
								code: "78",
								definition:
									"ACCOUNT INFORMATION DISPUTED BY CONSUMER",
							},
							availableAmount: null,
							lastPaymentDate: null,
							maxDelinquencyDate: null,
							enhancedPaymentData: {
								accountType: {
									code: "31",
									definition: "",
								},
								specialComment: {
									code: "78",
									definition: "",
								},
							},
							firstDelinquencyDate: "1994-09-01",
							monthlyPaymentAmount: null,
							originalCreditorName: "DR. JOHN KILDARE",
							secondDelinquencyDate: null,
							subscriberDisplayName: "CREDIT AND COLLECTION",
							revolvingOrInstallment: {
								code: "",
								definition: "Unknown",
							},
							delinquenciesOver30Days: 0,
							delinquenciesOver60Days: 0,
							delinquenciesOver90Days: 0,
						},
						{
							kob: {
								code: "BC",
								definition: "BC",
							},
							ecoa: {
								code: "2",
								definition: "Joint Account",
							},
							status: {
								code: "11",
								definition:
									"This is an account in good standing",
							},
							amounts: [
								{
									value: 7000,
									qualifierCode: "L",
									qualifierDefinition: "Limit",
								},
								{
									value: 5700,
									qualifierCode: "H",
									qualifierDefinition: "High balance",
								},
							],
							subcode: "1211248",
							openDate: "1996-05-01",
							evaluation: {
								code: "P",
								definition: "No additional review is required.",
							},
							statusDate: "1996-05-01",
							accountType: {
								code: "18",
								definition: "Credit Card, Terms REV",
							},
							balanceDate: "1997-10-01",
							derogCounter: null,
							openOrClosed: {
								code: "C",
								definition: "Closed",
							},
							accountNumber: "405855254820",
							amountPastDue: null,
							balanceAmount: 0,
							monthsHistory: 18,
							termsDuration: {
								code: "REV",
								definition: "Revolving",
							},
							paymentProfile: "B0CCCCCCCCCCCCCCCC",
							specialComment: {
								code: "19",
								definition:
									"ACCOUNT CLOSED AT CONSUMER'S REQUEST",
							},
							availableAmount: null,
							lastPaymentDate: null,
							maxDelinquencyDate: null,
							enhancedPaymentData: {
								accountType: {
									code: "18",
									definition: "",
								},
								specialComment: {
									code: "19",
									definition: "",
								},
							},
							firstDelinquencyDate: null,
							monthlyPaymentAmount: null,
							secondDelinquencyDate: null,
							subscriberDisplayName: "ISLAND SAVINGS",
							revolvingOrInstallment: {
								code: "R",
								definition: "Revolving",
							},
							delinquenciesOver30Days: 0,
							delinquenciesOver60Days: 0,
							delinquenciesOver90Days: 0,
						},
						{
							kob: {
								code: "DC",
								definition: "DC",
							},
							ecoa: {
								code: "3",
								definition: "Authorized User",
							},
							status: {
								code: "11",
								definition:
									"This is an account in good standing",
							},
							amounts: [
								{
									value: 1000,
									qualifierCode: "L",
									qualifierDefinition: "Limit",
								},
								{
									qualifierCode: " ",
									qualifierDefinition: "Unknown",
								},
							],
							subcode: "2313849",
							openDate: "1995-02-01",
							evaluation: {
								code: "P",
								definition: "No additional review is required.",
							},
							statusDate: "1995-02-01",
							accountType: {
								code: "06",
								definition: "Installment Sales Contract",
							},
							balanceDate: "1996-06-10",
							derogCounter: null,
							openOrClosed: {
								code: "O",
								definition: "Open",
							},
							accountNumber: "8285103111261",
							amountPastDue: null,
							balanceAmount: 1000,
							monthsHistory: 17,
							termsDuration: {
								code: "024",
								definition: "",
							},
							paymentProfile: "NNNNNNNNNNNNNNNNN",
							specialComment: {
								code: "",
								definition: "",
							},
							availableAmount: null,
							lastPaymentDate: null,
							maxDelinquencyDate: null,
							enhancedPaymentData: {
								accountType: {
									code: "06",
									definition: "",
								},
								specialComment: {
									code: "",
									definition: "",
								},
							},
							firstDelinquencyDate: null,
							monthlyPaymentAmount: null,
							secondDelinquencyDate: null,
							subscriberDisplayName: "HEMLOCKS",
							revolvingOrInstallment: {
								code: "I",
								definition: "Installment",
							},
							delinquenciesOver30Days: 0,
							delinquenciesOver60Days: 0,
							delinquenciesOver90Days: 0,
						},
						{
							kob: {
								code: "BI",
								definition: "BI",
							},
							ecoa: {
								code: "1",
								definition: "Individual",
							},
							status: {
								code: "71",
								definition: "Account 30 days past due date",
							},
							amounts: [
								{
									value: 22350,
									qualifierCode: "O",
									qualifierDefinition: "Original",
								},
								{
									qualifierCode: " ",
									qualifierDefinition: "Unknown",
								},
							],
							subcode: "1132912",
							openDate: "1993-12-01",
							evaluation: {
								code: "N",
								definition: "Closer review is required.",
							},
							maxPayment: {
								code: "1",
								definition: "30 days delinquent",
							},
							statusDate: "1996-06-01",
							accountType: {
								code: "00",
								definition: "Auto Loan",
							},
							balanceDate: "1996-06-15",
							derogCounter: null,
							openOrClosed: {
								code: "O",
								definition: "Open",
							},
							accountNumber: "23802654388",
							amountPastDue: 465,
							balanceAmount: 11050,
							monthsHistory: 31,
							termsDuration: {
								code: "048",
								definition: "",
							},
							paymentProfile: "1CCCCCCCCCCCCCCCCCCCCCCCC",
							specialComment: {
								code: "",
								definition: "",
							},
							availableAmount: null,
							lastPaymentDate: "1996-05-01",
							maxDelinquencyDate: null,
							monthlyPaymentType: {
								code: "",
								definition: "Estimated",
							},
							enhancedPaymentData: {
								accountType: {
									code: "00",
									definition: "",
								},
								specialComment: {
									code: "",
									definition: "",
								},
							},
							firstDelinquencyDate: "1996-06-01",
							monthlyPaymentAmount: 465,
							secondDelinquencyDate: null,
							subscriberDisplayName: "CENTRAL BANK",
							revolvingOrInstallment: {
								code: "I",
								definition: "Installment",
							},
							delinquenciesOver30Days: 1,
							delinquenciesOver60Days: 0,
							delinquenciesOver90Days: 0,
						},
						{
							kob: {
								code: "BI",
								definition: "BI",
							},
							ecoa: {
								code: "2",
								definition: "Joint Account",
							},
							status: {
								code: "73",
								definition:
									"Account 30 days past due date three times",
							},
							amounts: [
								{
									value: 43225,
									qualifierCode: "O",
									qualifierDefinition: "Original",
								},
								{
									qualifierCode: " ",
									qualifierDefinition: "Unknown",
								},
							],
							subcode: "1119999",
							openDate: "1993-03-01",
							evaluation: {
								code: "N",
								definition: "Closer review is required.",
							},
							maxPayment: {
								code: "1",
								definition: "30 days delinquent",
							},
							statusDate: "1996-12-01",
							accountType: {
								code: "02",
								definition: "Secured Loan",
							},
							balanceDate: "1996-12-17",
							derogCounter: null,
							openOrClosed: {
								code: "O",
								definition: "Open",
							},
							accountNumber: "3562A0197325346R12345",
							amountPastDue: 956,
							balanceAmount: 19330,
							monthsHistory: 39,
							termsDuration: {
								code: "060",
								definition: "",
							},
							paymentProfile: "1CCCCCC1CCCCCCCCCCCCCCCCC",
							specialComment: {
								code: "",
								definition: "",
							},
							availableAmount: null,
							lastPaymentDate: "1996-11-01",
							maxDelinquencyDate: "1994-09-01",
							monthlyPaymentType: {
								code: "",
								definition: "Estimated",
							},
							enhancedPaymentData: {
								accountType: {
									code: "02",
									definition: "",
								},
								specialComment: {
									code: "",
									definition: "",
								},
							},
							firstDelinquencyDate: "1996-12-01",
							monthlyPaymentAmount: 956,
							secondDelinquencyDate: "1996-05-01",
							subscriberDisplayName: "MOUNTAIN BK",
							revolvingOrInstallment: {
								code: "I",
								definition: "Installment",
							},
							delinquenciesOver30Days: 3,
							delinquenciesOver60Days: 0,
							delinquenciesOver90Days: 0,
						},
						{
							kob: {
								code: "DC",
								definition: "DC",
							},
							ecoa: {
								code: "2",
								definition: "Joint Account",
							},
							status: {
								code: "84",
								definition:
									"Account delinquent 180 days past due date",
							},
							amounts: [
								{
									value: 1400,
									qualifierCode: "L",
									qualifierDefinition: "Limit",
								},
								{
									qualifierCode: " ",
									qualifierDefinition: "Unknown",
								},
							],
							subcode: "2390446",
							openDate: "2068-01-01",
							evaluation: {
								code: "N",
								definition: "Closer review is required.",
							},
							maxPayment: {
								code: "7",
								definition:
									"Bankruptcy Chapter 13 Petitioned, or Discharged and Bankruptcy Chapter 13 Reaffirmation of Debt Rescinded",
							},
							statusDate: "1996-05-01",
							accountType: {
								code: "07",
								definition: "Revolving Charge Account",
							},
							balanceDate: "1996-05-31",
							derogCounter: null,
							openOrClosed: {
								code: "C",
								definition: "Closed",
							},
							accountNumber: "525556601",
							amountPastDue: null,
							balanceAmount: 0,
							monthsHistory: 99,
							termsDuration: {
								code: "REV",
								definition: "Revolving",
							},
							paymentProfile: "7654321CCCC00CCCCCCCCCCCC",
							specialComment: {
								code: "13",
								definition:
									"ACCOUNT PREVIOUSLY IN DISPUTE - NOW RESOLVED - REPORTED BY SUBSCRIBER",
							},
							availableAmount: null,
							lastPaymentDate: null,
							maxDelinquencyDate: null,
							enhancedPaymentData: {
								accountType: {
									code: "07",
									definition: "",
								},
								specialComment: {
									code: "13",
									definition: "",
								},
							},
							firstDelinquencyDate: "1996-05-01",
							monthlyPaymentAmount: null,
							secondDelinquencyDate: "1996-04-01",
							subscriberDisplayName: "BAY COMPANY",
							revolvingOrInstallment: {
								code: "R",
								definition: "Revolving",
							},
							delinquenciesOver30Days: 1,
							delinquenciesOver60Days: 1,
							delinquenciesOver90Days: 4,
						},
						{
							kob: {
								code: "BC",
								definition: "BC",
							},
							ecoa: {
								code: "2",
								definition: "Joint Account",
							},
							status: {
								code: "11",
								definition:
									"This is an account in good standing",
							},
							amounts: [
								{
									value: 10000,
									qualifierCode: "L",
									qualifierDefinition: "Limit",
								},
								{
									value: 7108,
									qualifierCode: "H",
									qualifierDefinition: "High balance",
								},
							],
							subcode: "1220855",
							openDate: "1985-02-01",
							evaluation: {
								code: "P",
								definition: "No additional review is required.",
							},
							statusDate: "1985-02-01",
							accountType: {
								code: "18",
								definition: "Credit Card, Terms REV",
							},
							balanceDate: "1998-01-15",
							derogCounter: null,
							openOrClosed: {
								code: "O",
								definition: "Open",
							},
							accountNumber: "525556601",
							amountPastDue: null,
							balanceAmount: 6029,
							monthsHistory: 99,
							termsDuration: {
								code: "REV",
								definition: "Revolving",
							},
							paymentProfile: "CCCCCCCCCCCC00000000CCCC",
							specialComment: {
								code: "",
								definition: "",
							},
							availableAmount: null,
							lastPaymentDate: "1998-01-01",
							maxDelinquencyDate: null,
							monthlyPaymentType: {
								code: "",
								definition: "Estimated",
							},
							enhancedPaymentData: {
								accountType: {
									code: "18",
									definition: "",
								},
								specialComment: {
									code: "",
									definition: "",
								},
							},
							firstDelinquencyDate: null,
							monthlyPaymentAmount: 180,
							secondDelinquencyDate: null,
							subscriberDisplayName: "EMPLOYEES CREDIT UNION",
							revolvingOrInstallment: {
								code: "R",
								definition: "Revolving",
							},
							delinquenciesOver30Days: 0,
							delinquenciesOver60Days: 0,
							delinquenciesOver90Days: 0,
						},
						{
							kob: {
								code: "FM",
								definition: "FM",
							},
							ecoa: {
								code: "2",
								definition: "Joint Account",
							},
							status: {
								code: "11",
								definition:
									"This is an account in good standing",
							},
							amounts: [
								{
									value: 400000,
									qualifierCode: "O",
									qualifierDefinition: "Original",
								},
								{
									qualifierCode: " ",
									qualifierDefinition: "Unknown",
								},
							],
							subcode: "5935250",
							openDate: "1990-05-01",
							evaluation: {
								code: "P",
								definition: "No additional review is required.",
							},
							statusDate: "1990-05-01",
							accountType: {
								code: "08",
								definition: "Real Estate Specific Type Unknown",
							},
							balanceDate: "1998-01-12",
							derogCounter: null,
							openOrClosed: {
								code: "O",
								definition: "Open",
							},
							accountNumber: "24000098500012",
							amountPastDue: null,
							balanceAmount: 234000,
							monthsHistory: 92,
							termsDuration: {
								code: "360",
								definition: "",
							},
							paymentProfile: "CCCCCCCCCCCCCCCCC000CCCC",
							specialComment: {
								code: "",
								definition: "",
							},
							availableAmount: null,
							lastPaymentDate: "1997-12-01",
							maxDelinquencyDate: null,
							monthlyPaymentType: {
								code: "S",
								definition: "Scheduled Term",
							},
							enhancedPaymentData: {
								accountType: {
									code: "08",
									definition: "",
								},
								specialComment: {
									code: "",
									definition: "",
								},
							},
							firstDelinquencyDate: null,
							monthlyPaymentAmount: 3128,
							secondDelinquencyDate: null,
							subscriberDisplayName: "HOME FINANCIAL",
							revolvingOrInstallment: {
								code: "I",
								definition: "Installment",
							},
							delinquenciesOver30Days: 0,
							delinquenciesOver60Days: 0,
							delinquenciesOver90Days: 0,
						},
						{
							kob: {
								code: "BC",
								definition: "BC",
							},
							ecoa: {
								code: "1",
								definition: "Individual",
							},
							status: {
								code: "11",
								definition:
									"This is an account in good standing",
							},
							amounts: [
								{
									value: 10000,
									qualifierCode: "L",
									qualifierDefinition: "Limit",
								},
								{
									value: 9612,
									qualifierCode: "H",
									qualifierDefinition: "High balance",
								},
							],
							subcode: "1299987",
							openDate: "1990-01-01",
							evaluation: {
								code: "P",
								definition: "No additional review is required.",
							},
							statusDate: "1990-01-01",
							accountType: {
								code: "18",
								definition: "Credit Card, Terms REV",
							},
							balanceDate: "1996-06-15",
							derogCounter: null,
							openOrClosed: {
								code: "O",
								definition: "Open",
							},
							accountNumber: "4271008232",
							amountPastDue: null,
							balanceAmount: 8628,
							monthsHistory: 85,
							termsDuration: {
								code: "REV",
								definition: "Revolving",
							},
							paymentProfile: "CCCCCCCCCCCCCCCCC000CCCC",
							specialComment: {
								code: "",
								definition: "",
							},
							availableAmount: null,
							lastPaymentDate: "1996-05-01",
							maxDelinquencyDate: null,
							monthlyPaymentType: {
								code: "",
								definition: "Estimated",
							},
							enhancedPaymentData: {
								accountType: {
									code: "18",
									definition: "",
								},
								specialComment: {
									code: "",
									definition: "",
								},
							},
							firstDelinquencyDate: null,
							monthlyPaymentAmount: 255,
							secondDelinquencyDate: null,
							subscriberDisplayName: "STATE BANK",
							revolvingOrInstallment: {
								code: "R",
								definition: "Revolving",
							},
							delinquenciesOver30Days: 0,
							delinquenciesOver60Days: 0,
							delinquenciesOver90Days: 0,
						},
						{
							kob: {
								code: "N",
								definition: "N",
							},
							ecoa: {
								code: "1",
								definition: "Individual",
							},
							status: {
								code: "12",
								definition: "Account/paid satisfactorily",
							},
							amounts: [
								{
									value: 4000,
									qualifierCode: "L",
									qualifierDefinition: "Limit",
								},
								{
									value: 3612,
									qualifierCode: "H",
									qualifierDefinition: "High balance",
								},
							],
							subcode: "3488520",
							openDate: "1995-03-01",
							evaluation: {
								code: "P",
								definition: "No additional review is required.",
							},
							statusDate: "1997-12-01",
							accountType: {
								code: "18",
								definition: "Credit Card, Terms REV",
							},
							balanceDate: "1997-12-20",
							derogCounter: null,
							openOrClosed: {
								code: "C",
								definition: "Closed",
							},
							accountNumber: "4271008232",
							amountPastDue: null,
							balanceAmount: 0,
							monthsHistory: 34,
							termsDuration: {
								code: "001",
								definition: "One month",
							},
							paymentProfile: "CCCCCCCCCCCCCCCCC000CCCC",
							specialComment: {
								code: "",
								definition: "",
							},
							availableAmount: null,
							lastPaymentDate: null,
							maxDelinquencyDate: null,
							enhancedPaymentData: {
								accountType: {
									code: "18",
									definition: "",
								},
								specialComment: {
									code: "",
									definition: "",
								},
							},
							firstDelinquencyDate: null,
							monthlyPaymentAmount: null,
							secondDelinquencyDate: null,
							subscriberDisplayName: "TRAVEL CHARGE USA",
							revolvingOrInstallment: {
								code: "",
								definition: "Unknown",
							},
							delinquenciesOver30Days: 0,
							delinquenciesOver60Days: 0,
							delinquenciesOver90Days: 0,
						},
					],
					directCheck: null,
					publicRecord: [
						{
							ecoa: {
								code: "2",
								definition: "Joint Account",
							},
							court: {
								code: "3009999",
								name: "U S BANKRUPTCY COURT",
							},
							amount: 100000,
							status: {
								code: "13",
								definition:
									"Bankruptcy Chapter 13-petition filed",
							},
							bankruptcy: {
								type: {
									code: "V",
									definition: "Voluntary",
								},
								assetAmount: "00008500",
								repaymentPercent: null,
								adjustmentPercent: null,
								liabilitiesAmount: "00100000",
							},
							evaluation: {
								code: "N",
								definition: "Negative",
							},
							filingDate: null,
							statusDate: "1993-02-10",
							referenceNumber: "35054539906234561",
						},
					],
					fraudServices: [
						{
							sic: {
								code: "73890300",
								definition: "",
							},
							text: "PHONE ANSWERING SERVICE:/ABC ANSWER-ALL/10655 N BIRCH ST/BURBANK CA 91502/818.555.1212",
							type: {
								code: "01",
								definition: "Inquiry address message",
							},
							textData:
								"PHONE ANSWERING SERVICE:/ABC ANSWER-ALL/10655 N BIRCH ST/BURBANK CA 91502/818.555.1212C2260301960008003019600150C31219651966",
							indicators: [],
							socialDate: "1996-03-01",
							addressDate: "1996-03-01",
							dateOfBirth: null,
							dateOfDeath: null,
							socialCount: 8,
							socialError: {
								code: "0",
								definition:
									"Indicates that no error conditions occur.",
							},
							addressCount: 15,
							addressError: {
								code: "0",
								definition:
									"Indicates that no error conditions occur.",
							},
							ssnPossibleIssuanceYear: {
								last: "1966",
								first: "1965",
							},
						},
						{
							sic: {
								code: "99000000",
								definition: "",
							},
							text: "COMMERCIAL BUSINESS ADDRESS:/J&J INVESTMENTS/2600 BOWSER ST #312/LOS ANGELES CA 90017/213.111.2222",
							type: {
								code: "04",
								definition: "Onfile address message",
							},
							textData:
								"COMMERCIAL BUSINESS ADDRESS:/J&J INVESTMENTS/2600 BOWSER ST #312/LOS ANGELES CA 90017/213.111.2222",
							indicators: [],
							socialDate: null,
							addressDate: null,
							dateOfBirth: null,
							dateOfDeath: null,
							socialCount: null,
							socialError: null,
							addressCount: null,
							addressError: null,
							ssnPossibleIssuanceYear: [],
						},
						{
							sic: {
								code: "",
								definition: "",
							},
							text: "CKPT: INPUT SSN RECORDED AS DECEASED",
							type: {
								code: "02",
								definition: "Retired Social",
							},
							textData:
								"CKPT: INPUT SSN RECORDED AS DECEASEDD1200110195103301996",
							indicators: [],
							socialDate: null,
							addressDate: null,
							dateOfBirth: "1951-01-10",
							dateOfDeath: "1996-03-30",
							socialCount: null,
							socialError: null,
							addressCount: null,
							addressError: null,
							ssnPossibleIssuanceYear: [],
						},
					],
					profileSummary: {
						derogCounter: null,
						paidAccounts: 2,
						pastDueAmount: 1421,
						monthlyPayment: 1865,
						totalInquiries: 3,
						totalTradeItems: 10,
						revolvingBalance: 14657,
						realEstateBalance: 234000,
						realEstatePayment: 3128,
						installmentBalance: 45037,
						nowDelinquentDerog: 3,
						publicRecordsCount: 3,
						wasDelinquentDerog: 0,
						oldestTradeOpenDate: "2068-01-01",
						satisfactoryAccounts: 6,
						monthlyPaymentPartial: {
							code: "",
							definition:
								"All tradelines are included in monthly payment amount.",
						},
						delinquenciesOver30Days: null,
						delinquenciesOver60Days: null,
						delinquenciesOver90Days: null,
						disputedAccountsExcluded: 1,
						realEstatePaymentPartial: {
							code: "",
							definition:
								"All tradelines are included in monthly payment amount.",
						},
						revolvingAvailablePartial: {
							code: "",
							definition:
								"All tradelines are included in monthly payment amount",
						},
						revolvingAvailablePercent: 27,
						inquiriesDuringLast6Months: 0,
					},
					consumerIdentity: [
						{
							fullName: "JONATHAN QUINCY CONSUMER ",
							lastName: "CONSUMER",
							firstName: "JONATHAN",
							middleName: "QUINCY",
							yearOfBirth: 1951,
						},
						{
							fullName: "JACK CONSUMER ",
							lastName: "CONSUMER",
							nameType: {
								code: "N",
								definition: "Nickname",
							},
							firstName: "JACK",
						},
						{
							fullName: "JOHN SMITH ",
							lastName: "SMITH",
							nameType: {
								code: "A",
								definition: "AKA",
							},
							firstName: "JOHN",
						},
						{
							suffix: "JR",
							fullName: "JONATHAN SMITH JONES JR",
							lastName: "JONES",
							nameType: {
								code: "A",
								definition: "AKA",
							},
							firstName: "JONATHAN",
							middleName: "SMITH",
						},
					],
					informationalMessage: null,
					consumerModelAttributes: null,
					consumerAssistanceReferralAddress: null,
				},
			],
		},
	},
};

export const fb_credit_report = {
	data: {
		uuid: "375792fa-0016-4245-bdfc-e62ca3b5b7d8",
		business_legal_name: "Facebook Inc",
		dates: {
			experian_gdn_company_profile: "2023-03-27 08:12:45",
			experian_gdn_extended_report: "2023-03-27 08:12:27",
			experian_trades: "2023-03-24 18:19:49",
			experian_fsr: "2023-03-24 18:19:46",
			experian_commercial_collections: "2023-03-24 18:19:43",
			experian_intelliscore: "2023-03-24 18:19:35",
			dnb_bm_l1: "2023-03-24 18:19:33",
			dnb_fi_l2: "2023-03-24 18:19:33",
			experian_business_match: "2023-03-24 18:19:33",
			dnb_pi_l3: "2023-03-24 18:19:33",
			equifax_business_principal_report: "2023-03-24 18:19:33",
			dnb_dti_l1: "2023-03-24 18:19:33",
		},
		statuses: {
			middesk: "Not yet started",
			dnb: {
				cer_l1: "Not yet started",
				ci_l2: "Not yet started",
				pi_l3: "Success",
				fi_l2: "Success",
				fi_l3: "Not yet started",
				fi_l4: "Not yet started",
				dti_l1: "Success",
				bm_l1: "Success",
			},
			experian: {
				intelliscore: "Success",
				intelliscore_v3: "Not yet started",
				uccs: "Not yet started",
				bankruptcies: "Not yet started",
				judgments: "Not yet started",
				liens: "Not yet started",
				fsr: "Success",
				fsr_v2: "Not yet started",
				commercial_collections: "Success",
				credit_statuses: "Not yet started",
				legal_collections: "Not yet started",
				trades: "Success",
				corporate_registrations: "Not yet started",
				contacts: "Not yet started",
				facts: "Not yet started",
				fraud_shields: "Not yet started",
				gdn: {
					company_profile: "Access token is invalid",
					risk_check: "Not yet started",
					small_report: "Not yet started",
					extended_report: "Access token is invalid",
					canadian_profile_report: "Not yet started",
				},
				business_match: "Success",
				bop: {
					blended_prequalification: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_lending_to_a_sole_prop: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_lending_with_a_pg: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_insurance: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					merchant_cash_advance: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					merchant_acquisition: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_factoring: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					blended_account_review: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_collections: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
				},
			},
			ocrolus_cfa: "Not yet started",
			moneythumb_cfa: "Not yet started",
			moneythumb_transactions: "Not yet started",
			plaid: "Not yet started",
			sentilink: "Not yet started",
			sentilink_ssn_completion: "Not yet started",
			sentilink_dob_completion: "Not yet started",
			ekata: "Not yet started",
			heron: "Not yet started",
			equifax: {
				bpr: "Success",
			},
			scorely: "Not yet started",
			clear: {
				person_search: "Not yet started",
				clear_id_confirm_person: "Not yet started",
				clear_risk_inform_person_search: "Not yet started",
				clear_risk_inform_person_report: "Not yet started",
				clear_id_confirm_business: "Not yet started",
				clear_risk_inform_business_search: "Not yet started",
				clear_risk_inform_business_report: "Not yet started",
				clear_court_search: "Not yet started",
				clear_adverse_media_search: "Not yet started",
				clear_adverse_media_report: "Not yet started",
			},
			enigma: {
				business_match: "Not yet started",
				business_lookup: "Not yet started",
			},
			socure: {
				kyc: "Not yet started",
				fraud: "Not yet started",
			},
			lexis_nexis: {
				kyc: "Not yet started",
				kyc_report: "Not yet started",
				kyb_search: "Not yet started",
				kyb_report: "Not yet started",
				corporate_filing_search: "Not yet started",
				corporate_filing_report: "Not yet started",
				ucc_filing_search: "Not yet started",
				ucc_filing_report: "Not yet started",
				bankruptcy_search: "Not yet started",
				bankruptcy_report: "Not yet started",
				liens_search: "Not yet started",
				liens_report: "Not yet started",
				judgments_search: "Not yet started",
				judgments_report: "Not yet started",
			},
			codat: "Not yet started",
			railz: "Not yet started",
			rutter: "Not yet started",
			mx: "Not yet started",
		},
		commercial_data: {
			middesk: null,
			sentilink: null,
			sentilink_ssn_completion: null,
			sentilink_dob_completion: null,
			experian: {
				intelliscore: {
					businessHeader: {
						bin: "810253165",
						phone: "+16505434800",
						taxId: "201665019",
						address: {
							zip: "94025",
							city: "MENLO PARK",
							state: "CA",
							street: "1601 WILLOW RD",
							zipExtension: "1452",
						},
						dbaNames: [
							"FACEBOOK INC",
							"CTRL-LABS CORP NY",
							"FACEBOOK INC",
							"FACEBOOK GLOBAL HOLDINGS II LLC",
						],
						websiteUrl: "wework.com",
						businessName: "FACEBOOK, INC",
						legalBusinessName: "FACEBOOK, INC.",
						customerDisputeIndicator: false,
					},
					commercialScore: {
						score: 3,
						modelCode: "000224",
						riskClass: {
							code: 5,
							definition: "HIGH RISK",
						},
						modelTitle: "INTELLISCORE PLUS V2",
						customModelCode: "03",
						percentileRanking: 2,
						recommendedCreditLimitAmount: 1392300,
					},
					commercialScoreTrends: [
						{
							score: 9,
							quarter: "DEC-FEB",
						},
						{
							score: 30,
							quarter: "SEP-NOV",
						},
						{
							score: 45,
							quarter: "JUN-AUG",
						},
						{
							score: 55,
							quarter: "MAR-MAY",
						},
					],
					commercialScoreFactors: [
						{
							code: "029",
							definition:
								"AVERAGE BALANCE OF RECENTLY DELINQUENT COMMERCIAL ACCOUNTS",
						},
						{
							code: "050",
							definition:
								"NUMBER OF COMMERCIAL ACCOUNTS WITH HIGH UTILIZATION",
						},
						{
							code: "011",
							definition:
								"NUMBER OF COMMERCIAL COLLECTION ACCOUNTS",
						},
						{
							code: "013",
							definition:
								"AGE OF MOST RECENTLY OPENED COMMERCIAL COLLECTION ACCOUNT",
						},
					],
				},
				intelliscore_v3: null,
				uccs: null,
				bankruptcies: null,
				judgments: null,
				liens: null,
				fsr: {
					fsrScore: {
						score: 4,
						modelCode: "000223",
						riskClass: {
							code: 4,
							definition: "MEDIUM TO HIGH RISK",
						},
						modelTitle: "FINANCIAL STABILITY RISK",
						percentileRanking: 3,
						recommendedCreditLimitAmount: null,
					},
					businessHeader: {
						bin: "810253165",
						phone: "+16505434800",
						taxId: "201665019",
						address: {
							zip: "94025",
							city: "MENLO PARK",
							state: "CA",
							street: "1601 WILLOW RD",
							zipExtension: "1452",
						},
						dbaNames: [
							"FACEBOOK INC",
							"CTRL-LABS CORP NY",
							"FACEBOOK INC",
							"FACEBOOK GLOBAL HOLDINGS II LLC",
						],
						websiteUrl: "wework.com",
						businessName: "FACEBOOK, INC",
						legalBusinessName: "FACEBOOK, INC.",
						customerDisputeIndicator: false,
					},
					fsrScoreTrends: [
						{
							score: 12,
							quarter: "DEC-FEB",
						},
						{
							score: 23,
							quarter: "SEP-NOV",
						},
						{
							score: 22,
							quarter: "JUN-AUG",
						},
						{
							score: 23,
							quarter: "MAR-MAY",
						},
					],
					fsrScoreFactors: [
						{
							code: "001",
							definition:
								"NUMBER OF COMMERCIAL COLLECTION ACCOUNTS",
						},
						{
							code: "005",
							definition:
								"NUMBER OF COMMERCIAL DEROGATORY PUBLIC RECORDS",
						},
						{
							code: "004",
							definition:
								"RISK ASSOCIATED WITH THE COMPANY'S INDUSTRY SECTOR",
						},
						{
							code: "012",
							definition:
								"BALANCE TO HIGH CREDIT RATIO FOR OTHER COMMERCIAL ACCOUNTS",
						},
					],
				},
				fsr_v2: null,
				commercial_collections: {
					businessHeader: {
						bin: "810253165",
						phone: "+16505434800",
						taxId: "201665019",
						address: {
							zip: "94025",
							city: "MENLO PARK",
							state: "CA",
							street: "1601 WILLOW RD",
							zipExtension: "1452",
						},
						dbaNames: [
							"FACEBOOK INC",
							"CTRL-LABS CORP NY",
							"FACEBOOK INC",
							"FACEBOOK GLOBAL HOLDINGS II LLC",
						],
						websiteUrl: "wework.com",
						businessName: "FACEBOOK, INC",
						legalBusinessName: "FACEBOOK, INC.",
						customerDisputeIndicator: false,
					},
					collectionsDetail: [
						{
							amountPaid: 0,
							dateClosed: null,
							accountStatus: "Open Account",
							collectionAgencyInfo: {
								name: "RECEIVABLE MANAGEMENT SERVICES",
								phoneNumber: "+14842424000",
							},
							datePlacedForCollection: "2017-07-01",
							amountPlacedForCollection: 150,
						},
						{
							amountPaid: 0,
							dateClosed: "2019-05-01",
							accountStatus:
								"Partial Payment, Balance Uncollected",
							collectionAgencyInfo: {
								name: "RECEIVABLE MANAGEMENT SERVICES",
								phoneNumber: "+14842424000",
							},
							datePlacedForCollection: "2017-11-01",
							amountPlacedForCollection: 3034,
						},
						{
							amountPaid: 12,
							dateClosed: null,
							accountStatus: "Open Account",
							collectionAgencyInfo: {
								name: "TEKCOLLECT INC",
								phoneNumber: "+18666526500",
							},
							datePlacedForCollection: "2019-08-01",
							amountPlacedForCollection: 475,
						},
						{
							amountPaid: 0,
							dateClosed: null,
							accountStatus: "Open Account",
							collectionAgencyInfo: {
								name: "AMERICAN FINANCIAL MANAGEMENT INC.",
								phoneNumber: "+18472597000",
							},
							datePlacedForCollection: "2022-10-01",
							amountPlacedForCollection: 202,
						},
						{
							amountPaid: 0,
							dateClosed: null,
							accountStatus: "Open Account",
							collectionAgencyInfo: {
								name: "CAINE & WEINER",
								phoneNumber: "+18182511718",
							},
							datePlacedForCollection: "2022-09-01",
							amountPlacedForCollection: 829,
						},
						{
							amountPaid: 0,
							dateClosed: null,
							accountStatus: "Open Account",
							collectionAgencyInfo: {
								name: "CAINE & WEINER",
								phoneNumber: "+18182511718",
							},
							datePlacedForCollection: "2022-10-01",
							amountPlacedForCollection: 207,
						},
						{
							amountPaid: 0,
							dateClosed: null,
							accountStatus: "Open Account",
							collectionAgencyInfo: {
								name: "CAINE & WEINER",
								phoneNumber: "+18182511718",
							},
							datePlacedForCollection: "2022-10-01",
							amountPlacedForCollection: 1036,
						},
						{
							amountPaid: 0,
							dateClosed: null,
							accountStatus: "Open Account",
							collectionAgencyInfo: {
								name: "CAINE & WEINER",
								phoneNumber: "+18182511718",
							},
							datePlacedForCollection: "2022-10-01",
							amountPlacedForCollection: 207,
						},
						{
							amountPaid: 0,
							dateClosed: null,
							accountStatus: "Open Account",
							collectionAgencyInfo: {
								name: "CAINE & WEINER",
								phoneNumber: "+18182511718",
							},
							datePlacedForCollection: "2022-10-01",
							amountPlacedForCollection: 207,
						},
						{
							amountPaid: 0,
							dateClosed: null,
							accountStatus: "Open Account",
							collectionAgencyInfo: {
								name: "CAINE & WEINER",
								phoneNumber: "+18182511718",
							},
							datePlacedForCollection: "2022-10-01",
							amountPlacedForCollection: 1036,
						},
						{
							amountPaid: 0,
							dateClosed: null,
							accountStatus: "Open Account",
							collectionAgencyInfo: {
								name: "CAINE & WEINER",
								phoneNumber: "+18182511718",
							},
							datePlacedForCollection: "2022-10-01",
							amountPlacedForCollection: 1036,
						},
						{
							amountPaid: 0,
							dateClosed: null,
							accountStatus: "Open Account",
							collectionAgencyInfo: {
								name: "CAINE & WEINER",
								phoneNumber: "+18182511718",
							},
							datePlacedForCollection: "2022-10-01",
							amountPlacedForCollection: 207,
						},
					],
					collectionsSummary: {
						collectionCount: 12,
						collectionBalance: 8626,
					},
					collectionsIndicator: true,
				},
				credit_statuses: null,
				legal_collections: null,
				trades: {
					businessHeader: {
						bin: "810253165",
						phone: "+16505434800",
						taxId: "201665019",
						address: {
							zip: "94025",
							city: "MENLO PARK",
							state: "CA",
							street: "1601 WILLOW RD",
							zipExtension: "1452",
						},
						dbaNames: [
							"FACEBOOK INC",
							"CTRL-LABS CORP NY",
							"FACEBOOK INC",
							"FACEBOOK GLOBAL HOLDINGS II LLC",
						],
						websiteUrl: "wework.com",
						businessName: "FACEBOOK, INC",
						legalBusinessName: "FACEBOOK, INC.",
						customerDisputeIndicator: false,
					},
					tradeIndicator: true,
					tradePaymentTotals: {
						tradelines: {
							dbt30: 0,
							dbt60: 0,
							dbt90: 1,
							dbt91Plus: 0,
							currentDbt: null,
							tradelineCount: 50,
							currentPercentage: 99,
							totalAccountBalance: {
								amount: 24218500,
							},
							totalHighCreditAmount: {
								amount: 30044700,
							},
						},
						combinedTradelines: {
							dbt30: 9,
							dbt60: 6,
							dbt90: 14,
							dbt91Plus: 5,
							currentDbt: 20,
							tradelineCount: 25,
							currentPercentage: 66,
							totalAccountBalance: {
								amount: 1832600,
							},
							totalHighCreditAmount: {
								amount: 8216000,
							},
						},
						additionalTradelines: {
							dbt30: 0,
							dbt60: 0,
							dbt90: 0,
							dbt91Plus: 0,
							currentDbt: null,
							tradelineCount: 25,
							currentPercentage: 100,
							totalAccountBalance: {
								amount: 22385900,
							},
							totalHighCreditAmount: {
								amount: 21828700,
							},
						},
						newlyReportedTradelines: {
							dbt30: 0,
							dbt60: 0,
							dbt90: 0,
							dbt91Plus: 0,
							currentDbt: 0,
							tradelineCount: 0,
							currentPercentage: 0,
							totalAccountBalance: {
								amount: 0,
							},
							totalHighCreditAmount: {
								amount: 0,
							},
						},
						continuouslyReportedTradelines: {
							dbt30: 9,
							dbt60: 6,
							dbt90: 14,
							dbt91Plus: 5,
							currentDbt: 20,
							tradelineCount: 25,
							currentPercentage: 66,
							totalAccountBalance: {
								amount: 1832600,
							},
							totalHighCreditAmount: {
								amount: 8216000,
							},
						},
					},
					tradePaymentTrends: {
						monthlyTrends: [
							{
								dbt: 20,
								date: "2023-03-01",
								dbt30: 9,
								dbt60: 6,
								dbt90: 14,
								dbt91Plus: 5,
								currentPercentage: 66,
								totalAccountBalance: {
									amount: 1832600,
								},
							},
							{
								dbt: 20,
								date: "2023-03-01",
								dbt30: 12,
								dbt60: 6,
								dbt90: 14,
								dbt91Plus: 5,
								currentPercentage: 63,
								totalAccountBalance: {
									amount: 2235600,
								},
							},
							{
								dbt: 25,
								date: "2023-02-01",
								dbt30: 14,
								dbt60: 5,
								dbt90: 20,
								dbt91Plus: 5,
								currentPercentage: 56,
								totalAccountBalance: {
									amount: 1710400,
								},
							},
							{
								dbt: 20,
								date: "2023-01-01",
								dbt30: 18,
								dbt60: 9,
								dbt90: 14,
								dbt91Plus: 3,
								currentPercentage: 56,
								totalAccountBalance: {
									amount: 2164500,
								},
							},
							{
								dbt: 24,
								date: "2022-12-01",
								dbt30: 16,
								dbt60: 12,
								dbt90: 19,
								dbt91Plus: 2,
								currentPercentage: 51,
								totalAccountBalance: {
									amount: 1631400,
								},
							},
							{
								dbt: 8,
								date: "2022-11-01",
								dbt30: 19,
								dbt60: 4,
								dbt90: 1,
								dbt91Plus: 2,
								currentPercentage: 74,
								totalAccountBalance: {
									amount: 3011000,
								},
							},
							{
								dbt: 6,
								date: "2022-10-01",
								dbt30: 20,
								dbt60: 1,
								dbt90: 1,
								dbt91Plus: 2,
								currentPercentage: 76,
								totalAccountBalance: {
									amount: 2491800,
								},
							},
						],
						quarterlyTrends: [
							{
								dbt: 15,
								date: "2022-10-01",
								dbt30: 18,
								dbt60: 8,
								dbt90: 9,
								dbt91Plus: 2,
								currentPercentage: 63,
								totalAccountBalance: {
									amount: 2251500,
								},
							},
							{
								dbt: 7,
								date: "2022-07-01",
								dbt30: 17,
								dbt60: 2,
								dbt90: 1,
								dbt91Plus: 3,
								currentPercentage: 77,
								totalAccountBalance: {
									amount: 1503600,
								},
							},
							{
								dbt: 6,
								date: "2022-04-01",
								dbt30: 18,
								dbt60: 1,
								dbt90: 1,
								dbt91Plus: 2,
								currentPercentage: 78,
								totalAccountBalance: {
									amount: 2460400,
								},
							},
							{
								dbt: 22,
								date: "2022-01-01",
								dbt30: 25,
								dbt60: 6,
								dbt90: 0,
								dbt91Plus: 15,
								currentPercentage: 54,
								totalAccountBalance: {
									amount: 2970400,
								},
							},
							{
								dbt: 19,
								date: "2021-10-01",
								dbt30: 15,
								dbt60: 2,
								dbt90: 2,
								dbt91Plus: 14,
								currentPercentage: 67,
								totalAccountBalance: {
									amount: 2441600,
								},
							},
						],
					},
					tradePaymentSummary: {
						currentDbt: 20,
						singleHighCredit: 4423000,
						allTradelineCount: 50,
						highestDbt6Months: 25,
						monthlyAverageDbt: 17,
						allTradelineBalance: 24218500,
						highestDbt5Quarters: 22,
						currentAccountBalance: 1832600,
						currentTradelineCount: 25,
						medianCreditAmountExtended: 32100,
					},
					tradePaymentExperiences: {
						tradeAdditional: [
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "VARIED",
								dbt91Plus: 0,
								dateReported: "2020-10-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "ACCT SVCS",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 32100,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "AUTO RENTL",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2022-06-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "BUREAU",
								dateLastActivity: "2022-06-01",
								recentHighCredit: {
									amount: 18400,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "OTHER",
								dbt91Plus: 0,
								dateReported: "2021-03-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "BUS SERVCS",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 100,
								dateReported: "2022-01-01",
								accountBalance: {
									amount: 10600,
								},
								businessCategory: "BUS SERVCS",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 10600,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 20",
								dbt91Plus: 0,
								dateReported: "2021-12-01",
								accountBalance: {
									amount: 38400,
								},
								businessCategory: "COMMUN EQP",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 38400,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "N10PROX",
								dbt91Plus: 0,
								dateReported: "2022-03-01",
								accountBalance: {
									amount: 97900,
								},
								businessCategory: "ELEC SUPLR",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 108900,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 100,
								terms: "VARIED",
								dbt91Plus: 0,
								dateReported: "2021-09-01",
								accountBalance: {
									amount: 1100,
								},
								businessCategory: "FACTOR",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 1100,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "CONTRCT",
								dbt91Plus: 0,
								dateReported: "2021-11-01",
								accountBalance: {
									amount: 6292100,
								},
								businessCategory: "FINCL SVCS",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 10036000,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "VARIED",
								comments: "CUST 23 YR",
								dbt91Plus: 0,
								dateReported: "2022-09-01",
								accountBalance: {
									amount: 2800,
								},
								businessCategory: "FOOD DISTR",
								dateLastActivity: "2022-09-01",
								recentHighCredit: {
									amount: 7500,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "VARIED",
								dbt91Plus: 0,
								dateReported: "2022-06-01",
								accountBalance: {
									amount: 42200,
								},
								businessCategory: "INDUS MACH",
								dateLastActivity: "2022-05-01",
								recentHighCredit: {
									amount: 50700,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 66,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2021-08-01",
								accountBalance: {
									amount: 5500,
								},
								businessCategory: "INDUS MACH",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 5500,
								},
								currentPercentage: 34,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 24,
								dbt60: 24,
								dbt90: 27,
								terms: "OTHER",
								dbt91Plus: 0,
								dateReported: "2022-08-01",
								accountBalance: {
									amount: 900,
								},
								businessCategory: "INDUS SUPL",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 900,
								},
								currentPercentage: 25,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 100,
								terms: "VARIED",
								dbt91Plus: 0,
								dateReported: "2022-09-01",
								accountBalance: {
									amount: 2900,
								},
								businessCategory: "INDUS SUPL",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 2900,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 2,
								dbt60: 2,
								dbt90: 2,
								terms: "OTHER",
								dbt91Plus: 92,
								dateReported: "2022-08-01",
								accountBalance: {
									amount: 11700,
								},
								businessCategory: "INDUS SUPL",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 50900,
								},
								currentPercentage: 2,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 21,
								dbt60: 23,
								dbt90: 23,
								terms: "OTHER",
								dbt91Plus: 9,
								dateReported: "2022-08-01",
								accountBalance: {
									amount: 14900,
								},
								businessCategory: "INDUS SUPL",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 14900,
								},
								currentPercentage: 24,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2022-12-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "LEASING",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 148500,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "CONTRCT",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 14474700,
								},
								businessCategory: "LEASING",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 9267400,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2020-08-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "MATRL HNDL",
								dateLastActivity: "2019-10-01",
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 100,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2022-10-01",
								accountBalance: {
									amount: 5800,
								},
								businessCategory: "OFFC SUPPL",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 7600,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "ROI",
								dbt91Plus: 0,
								dateReported: "2020-11-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "PERSNLSVCS",
								dateLastActivity: "2012-05-01",
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2022-10-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "RESTR SUPL",
								dateLastActivity: "2020-10-01",
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								comments: "CUST  7 YR",
								dbt91Plus: 0,
								dateReported: "2021-06-01",
								accountBalance: {
									amount: 1384400,
								},
								businessCategory: "SERVICES",
								dateLastActivity: "2021-06-01",
								recentHighCredit: {
									amount: 2026400,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								comments: "CUST < 1 Y",
								dbt91Plus: 0,
								dateReported: "2020-11-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "TRANSPORTN",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "VARIED",
								dbt91Plus: 0,
								dateReported: "2021-06-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "VIDEO",
								dateLastActivity: "2019-05-01",
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
						],
						tradeNewAndContinuous: [
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "VARIED",
								dbt91Plus: 0,
								dateReported: "2022-12-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "AIR TRANS",
								dateLastActivity: "2022-03-01",
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 43,
								dbt90: 0,
								terms: "VARIED",
								dbt91Plus: 0,
								dateReported: "2022-11-01",
								accountBalance: {
									amount: 100400,
								},
								businessCategory: "BUS SERVCS",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 860900,
								},
								currentPercentage: 57,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 74300,
								},
								businessCategory: "CERAMICS",
								dateLastActivity: "2023-02-01",
								recentHighCredit: {
									amount: 363900,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 15,
								dbt60: 1,
								dbt90: 0,
								terms: "VARIED",
								comments: "ACCTCLOSED",
								dbt91Plus: 3,
								dateReported: "2023-02-01",
								accountBalance: {
									amount: 945100,
								},
								businessCategory: "COMMUNICTN",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 4423000,
								},
								currentPercentage: 81,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2022-11-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "COMMUN EQP",
								dateLastActivity: "2020-07-01",
								recentHighCredit: {
									amount: 14500,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "VARIED",
								dbt91Plus: 0,
								dateReported: "2023-01-01",
								accountBalance: {
									amount: 200000,
								},
								businessCategory: "COMMUN SVC",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 225300,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "CONST MACH",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 6,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2023-01-01",
								accountBalance: {
									amount: 31400,
								},
								businessCategory: "DISTRIBUTR",
								dateLastActivity: "2022-12-01",
								recentHighCredit: {
									amount: 723400,
								},
								currentPercentage: 94,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "OTHER",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "ELEC DISTR",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 300,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 1,
								dbt60: 1,
								dbt90: 97,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 2000,
								},
								businessCategory: "ELEC DISTR",
								dateLastActivity: "2022-11-01",
								recentHighCredit: {
									amount: 2000,
								},
								currentPercentage: 1,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 100,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2022-11-01",
								accountBalance: {
									amount: 244100,
								},
								businessCategory: "ELEC EQUIP",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 479700,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "0000000",
								dbt91Plus: 0,
								dateReported: "2023-02-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "ELEC SUPLR",
								dateLastActivity: "2020-02-01",
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "COD",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "EQUIPMENT",
								dateLastActivity: "2021-07-01",
								recentHighCredit: {
									amount: 4600,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								comments: "ACCTCLOSED",
								dbt91Plus: 0,
								dateReported: "2022-11-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "FINCL SVCS",
								dateLastActivity: "2022-09-01",
								recentHighCredit: {
									amount: 21900,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 15",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 25300,
								},
								businessCategory: "FOOD",
								dateLastActivity: "2023-02-01",
								recentHighCredit: {
									amount: 55200,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "OTHER",
								dbt91Plus: 0,
								dateReported: "2023-01-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "GENERAL",
								dateLastActivity: "2018-10-01",
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								comments: "CUST  3 YR",
								dbt91Plus: 0,
								dateReported: "2023-02-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "INDUS SUPL",
								dateLastActivity: "2022-02-01",
								recentHighCredit: {
									amount: 37100,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "VARIED",
								dbt91Plus: 100,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 100,
								},
								businessCategory: "INDUS SUPL",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 13400,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 15",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "NEWSPAPERS",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 100,
								dbt90: 0,
								terms: "2/10N30",
								dbt91Plus: 0,
								dateReported: "2023-02-01",
								accountBalance: {
									amount: 49000,
								},
								businessCategory: "OPTIC SUPL",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 49000,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 9,
								dbt60: 4,
								dbt90: 9,
								terms: "NET 30",
								comments: "CUST 23 YR",
								dbt91Plus: 44,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 146800,
								},
								businessCategory: "PACKAGING",
								dateLastActivity: "2022-12-01",
								recentHighCredit: {
									amount: 454100,
								},
								currentPercentage: 34,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "OTHER",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 7900,
								},
								businessCategory: "PRNTG&PUBL",
								dateLastActivity: "2023-02-01",
								recentHighCredit: {
									amount: 22900,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "VARIED",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "TOYS&GAMES",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 100,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 2400,
								},
								businessCategory: "TRANSPORTN",
								dateLastActivity: "2023-02-01",
								recentHighCredit: {
									amount: 31000,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 44,
								dbt60: 8,
								dbt90: 0,
								terms: "NET 30",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 3800,
								},
								businessCategory: "WHLSE TRAD",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 433800,
								},
								currentPercentage: 48,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
						],
					},
				},
				corporate_registrations: null,
				contacts: null,
				facts: null,
				fraud_shields: null,
				gdn: {
					company_profile: {
						errors: [
							{
								errorMsg: "Access token is invalid",
								errorCode: "4002",
							},
						],
						success: "false",
						requestId: "rrt-044e344394fdd5408-b-wo-17701-9522982-1",
					},
					risk_check: null,
					small_report: null,
					extended_report: {
						errors: [
							{
								errorMsg: "Access token is invalid",
								errorCode: "4002",
							},
						],
						success: "false",
						requestId: "rrt-044e344394fdd5408-b-wo-17701-9522868-1",
					},
					canadian_profile_report: null,
				},
				bop: {
					blended_prequalification: null,
					commercial_lending_to_a_sole_prop: null,
					commercial_lending_with_a_pg: null,
					commercial_insurance: null,
					merchant_cash_advance: null,
					merchant_acquisition: null,
					commercial_factoring: null,
					blended_account_review: null,
					commercial_collections: null,
				},
				business_match: {
					id: 241112,
					service_id: 3,
					response: [
						{
							bin: "810253165",
							phone: "+16505434800",
							address: {
								zip: "94025",
								city: "MENLO PARK",
								state: "CA",
								street: "1601 WILLOW RD",
								zipExtension: "1452",
							},
							businessName: "FACEBOOK, INC",
							uccIndicator: true,
							businessGeocode: {
								msaCode: "7360",
								latitude: 37.482152,
								longitude: -122.150224,
								censusTractCode: "611700",
								censusBlkGrpCode: "4",
								cottageIndicator: false,
								dateLastReported: "2023-03-21",
								latitudeLongitudeLevel: "Roof Top Level",
								congressionalDistrictCode: "15",
							},
							reliabilityCode: 100.3,
							inquiryIndicator: true,
							bankDataIndicator: false,
							keyFactsIndicator: true,
							numberOfTradelines: 110,
							matchingNameAndAddress: null,
							governmentDataIndicator: false,
							executiveSummaryIndicator: true,
							financialStatementIndicator: true,
						},
					],
					created_at: "2023-03-24T18:19:35.000000Z",
					updated_at: "2023-03-24T18:19:35.000000Z",
					business_credit_service: "experian_business_match",
					business_id: 311821,
					request: {
						geo: true,
						zip: "94025",
						city: "California",
						name: "Facebook Inc",
						phone: "+19495673800",
						state: "CA",
						taxId: "201665019",
						street: "1601 willlow road",
						subcode: "0446260",
					},
					status_code: 200,
					deleted_at: null,
				},
			},
			dnb: {
				cer_l1: null,
				fi_l2: {
					blockStatus: [
						{
							reason: null,
							status: "ok",
							blockID: "financialstrengthinsight_L2_v1",
						},
						{
							reason: null,
							status: "ok",
							blockID: "baseinfo_L1_v1",
						},
					],
					organization: {
						duns: "196337864",
						tsrRating: [],
						layOffScore: {
							scoreDate: "2023-02-27",
							classScore: 5,
							probability: 0.94,
							classScoreDescription: "high",
							nationalRiskPercentile: 96,
						},
						primaryName: "Meta Platforms, Inc.",
						dnbAssessment: {
							failureScore: {
								scoreDate: "2023-03-20",
								classScore: 4,
								scoreModel: {
									dnbCode: 19884,
									description: "US Failure Score Model 7.1",
								},
								nationalPercentile: 33,
								scoreOverrideReasons: [],
								classScoreDescription:
									"Moderate to high risk of  severe financial stress, such as a bankruptcy, over the next 12 months.",
							},
							historyRating: {
								dnbCode: 9078,
								description: "Clear",
							},
							standardRating: {
								rating: "5A3",
								scoreDate: "2021-11-03",
								riskSegment: "3",
								ratingReason: [],
								financialStrength: "5A",
								ratingOverrideReasons: [],
							},
							nordicAAARating: [],
							delinquencyScore: {
								scoreDate: "2023-03-13",
								classScore: 2,
								scoreModel: {
									dnbCode: 26183,
									description: "U.S. Delinquency Predictor",
								},
								nationalPercentile: 78,
								scoreOverrideReasons: [],
								classScoreDescription:
									"Moderate risk of severe payment delinquency over next 12 months.",
							},
							financialCondition: {
								dnbCode: 416,
								description: "Good",
							},
							hasSevereNegativeEvents: false,
							creditLimitRecommendation: {
								assessmentDate: null,
								averageRecommendedLimit: [],
								maximumRecommendedLimit: {
									value: 1190000,
									currency: "USD",
								},
							},
							emergingMarketMediationScore: [],
						},
						isHighRiskBusiness: null,
						countryISOAlpha2Code: "US",
						isDeterioratingBusiness: null,
					},
					inquiryDetail: {
						duns: "196337864",
						blockIDs: ["financialstrengthinsight_L2_v1"],
					},
					transactionDetail: {
						inLanguage: "en-US",
						transactionID:
							"rrt-05d10aa25d6a8fd93-c-wo-17469-2656504-114",
						transactionTimestamp: "2023-03-24T18:19:34.308Z",
					},
				},
				fi_l3: null,
				dti_l1: {
					blockStatus: [
						{
							reason: null,
							status: "ok",
							blockID: "dtri_L1_v1",
						},
						{
							reason: null,
							status: "ok",
							blockID: "baseinfo_L1_v1",
						},
					],
					organization: {
						dtri: {
							currentPaydex: {
								threeMonthsDataCoverage: {
									paydexScore: 77,
									paydexAccountsUsedCount: 133,
									paydexSuppliersUsedCount: 57,
								},
								twelveMonthsDataCoverage: {
									paydexScore: 77,
									paydexAccountsUsedCount: 437,
									paydexSuppliersUsedCount: 107,
								},
							},
						},
						duns: "196337864",
						primaryName: "Meta Platforms, Inc.",
						countryISOAlpha2Code: "US",
					},
					inquiryDetail: {
						duns: "196337864",
						blockIDs: ["dtri_L1_v1"],
					},
					transactionDetail: {
						inLanguage: "en-US",
						transactionID:
							"rrt-011ea210de0ee8a06-b-wo-17235-2662218-167",
						transactionTimestamp: "2023-03-24T18:19:34.412Z",
					},
				},
				ci_l2: null,
				pi_l3: {
					blockStatus: [
						{
							reason: null,
							status: "ok",
							blockID: "paymentinsight_L3_v1",
						},
						{
							reason: null,
							status: "ok",
							blockID: "baseinfo_L1_v1",
						},
					],
					organization: {
						duns: "196337864",
						primaryName: "Meta Platforms, Inc.",
						businessTrading: [
							{
								summary: [
									{
										paydexScore: 73,
										dataCoverage: {
											dnbCode: 24186,
											description: "24 Months",
										},
										maximumOwedAmount: 8000000,
										averageOwingAmount: 492367.14,
										totalPastDueAmount: 17686850,
										paymentBehaviorDays: 11,
										maximumPastDueAmount: 7000000,
										slowExperiencesCount: 62.5,
										negativePaymentsCount: 8,
										paymentBehaviorResult: {
											dnbCode: 1239,
											description: "Beyond terms",
										},
										slowExperiencesAmount: 61078425,
										totalExperiencesCount: 275,
										totalExperiencesAmount: 328813450,
										averageHighCreditAmount: 1642186.25,
										badDebtExperiencesCount: null,
										currentExperiencesCount: 147.5,
										maximumHighCreditAmount: 50000000,
										badDebtExperiencesAmount: null,
										currentExperiencesAmount: 267358825,
										favorableExperiencesCount: 125,
										negativeExperiencesAmount: 12000,
										placedForCollectionAmount: 12000,
										slowExperiencesPercentage: 18.58,
										subtotalExperiencesAmount: 328437250,
										favorableExperiencesAmount: 208156700,
										highCreditExperiencesCount: 260,
										slowOrNegativePaymentsCount: 70.5,
										threeMonthsPriorPaydexScore: 71,
										unfavorableExperiencesCount: null,
										badDebtExperiencesPercentage: null,
										satisfactoryExperiencesCount: 147.5,
										totalPastDueExperiencesCount: 68,
										unfavorableExperiencesAmount: null,
										negativeExperiencesPercentage: 0,
										satisfactoryExperiencesAmount: 267358825,
										favorableExperiencesPercentage: 63.31,
										currentManneredExperiencesCount: 125,
										currentManneredExperiencesAmount: 208156700,
										slowAndNegativeExperiencesAmount: 61090425,
										slowOrNegativePaymentsPercentage: 25.64,
										unfavorableExperiencesPercentage: null,
										satisfactoryExperiencesPercentage: 81.31,
										slowExperiencesHighestCreditAmount: 50000000,
										placedForCollectionExperiencesCount: 8,
										currentManneredExperiencesPercentage: 63.31,
										badDebtExperiencesHighestCreditAmount:
											null,
										negativeExperiencesHighestCreditAmount: 5000,
										placedForCollectionHighestCreditAmount: 5000,
										favorableExperiencesHighestCreditAmount: 50000000,
										placedForCollectionExperiencesPercentage: 0,
										unfavorableExperiencesHighestCreditAmount:
											null,
										currentManneredExperiencesHighestCreditAmount: 50000000,
										slowAndNegativeExperiencesHighestCreditAmount: 50000000,
									},
								],
								currency: "USD",
								summaryDate: "2023-03-01",
							},
						],
						businessTradingNorms: [
							{
								industryNorms: {
									normsKey: "US#7375",
									normsDate: "2023-02-28",
									paydexScoreNorms: {
										medianScore: 80,
										lowerQuartileScore: 72,
										upperQuartileScore: 80,
									},
									paymentBehaviourNorms: {
										medianResult: {
											dnbCode: 1232,
										},
										medianDaysQuantity: 0,
										lowerQuartileResult: {
											dnbCode: 1239,
										},
										upperQuartileResult: {
											dnbCode: 1232,
										},
										lowerQuartileDaysQuantity: 12,
										upperQuartileDaysQuantity: 0,
									},
								},
								calculationTimestamp: "2023-02-28",
							},
						],
						countryISOAlpha2Code: "US",
					},
					inquiryDetail: {
						duns: "196337864",
						blockIDs: ["paymentinsight_L3_v1"],
					},
					transactionDetail: {
						inLanguage: "en-US",
						transactionID:
							"rrt-0c925ed1ed2cfe456-a-wo-17008-2679366-497",
						transactionTimestamp: "2023-03-24T18:19:34.360Z",
					},
				},
				fi_l4: null,
				bm_l1: {
					id: 241109,
					service_id: 7,
					response: {
						matchCandidates: [
							{
								organization: {
									duns: "196337864",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "6505434800",
										},
									],
									primaryName: "META PLATFORMS, INC.",
									isStandalone: false,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "94025",
										addressRegion: {
											name: null,
											abbreviatedName: "CA",
										},
										streetAddress: {
											line1: "1601 WILLOW RD",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "MENLO PARK",
										},
										postalCodeExtension: "1452",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: {
										familytreeRolesPlayed: [
											{
												dnbCode: 9141,
												description:
													"Parent/Headquarters",
											},
										],
									},
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [
										{
											fullName: "MARK  ZUCKERBERG",
										},
									],
								},
								displaySequence: 1,
								matchQualityInformation: {
									matchGrade: "AAAAAZZAFFZ",
									confidenceCode: 10,
									nameMatchScore: 100,
									matchDataProfile:
										"0500000000989800000000000098",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "A",
										},
										{
											componentType: "Street Number",
											componentRating: "A",
										},
										{
											componentType: "Street Name",
											componentRating: "A",
										},
										{
											componentType: "City",
											componentRating: "A",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "A",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "F",
										},
										{
											componentType: "Sic",
											componentRating: "Z",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "05",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "00",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "080335188",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "4152721917",
										},
									],
									primaryName: "FACEBOOK, INC.",
									isStandalone: true,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "94025",
										addressRegion: {
											name: null,
											abbreviatedName: "CA",
										},
										streetAddress: {
											line1: "300 CONSTITUTION DR",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "MENLO PARK",
										},
										postalCodeExtension: "1140",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: [],
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [],
								},
								displaySequence: 2,
								matchQualityInformation: {
									matchGrade: "AFFAAZZAFFZ",
									confidenceCode: 7,
									nameMatchScore: 100,
									matchDataProfile:
										"0000000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "A",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "A",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "A",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "F",
										},
										{
											componentType: "Sic",
											componentRating: "Z",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "00",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "080534561",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "8144419280",
										},
									],
									primaryName: "META PLATFORMS, INC.",
									isStandalone: false,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "94025",
										addressRegion: {
											name: null,
											abbreviatedName: "CA",
										},
										streetAddress: {
											line1: "200 JEFFERSON DR",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "MENLO PARK",
										},
										postalCodeExtension: "1131",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: {
										familytreeRolesPlayed: [
											{
												dnbCode: 9140,
												description: "Branch/Division",
											},
										],
									},
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [],
								},
								displaySequence: 3,
								matchQualityInformation: {
									matchGrade: "AFFAAZZAFFZ",
									confidenceCode: 7,
									nameMatchScore: 100,
									matchDataProfile:
										"0500000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "A",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "A",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "A",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "F",
										},
										{
											componentType: "Sic",
											componentRating: "Z",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "05",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "079642127",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "6508237128",
										},
									],
									primaryName: "FACEBOOK",
									isStandalone: true,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "94025",
										addressRegion: {
											name: null,
											abbreviatedName: "CA",
										},
										streetAddress: {
											line1: "1105 HAMILTON CT",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "MENLO PARK",
										},
										postalCodeExtension: "1424",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: [],
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 403,
											description: "Out of business",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [
										{
											fullName: "ASHLEY  MONTGOMERY",
										},
									],
								},
								displaySequence: 4,
								matchQualityInformation: {
									matchGrade: "AFFAAZZAFFZ",
									confidenceCode: 7,
									nameMatchScore: 100,
									matchDataProfile:
										"0000000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "A",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "A",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "A",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "F",
										},
										{
											componentType: "Sic",
											componentRating: "Z",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "00",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "118344448",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "5026095712",
										},
									],
									primaryName: "FACEBOOK, INC.",
									isStandalone: true,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "94560",
										addressRegion: {
											name: null,
											abbreviatedName: "CA",
										},
										streetAddress: {
											line1: "7300 GATEWAY BLVD",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "NEWARK",
										},
										postalCodeExtension: "8002",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: [],
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [],
								},
								displaySequence: 5,
								matchQualityInformation: {
									matchGrade: "AFFFAZZFFFZ",
									confidenceCode: 4,
									nameMatchScore: 100,
									matchDataProfile:
										"0000000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "A",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "F",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "F",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "F",
										},
										{
											componentType: "Sic",
											componentRating: "Z",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "00",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "844613310",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "6507239158",
										},
									],
									primaryName:
										"STANFORD PUBLIC INTEREST LAW FOUNDATION",
									isStandalone: true,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "94305",
										addressRegion: {
											name: null,
											abbreviatedName: "CA",
										},
										streetAddress: {
											line1: "559 NATHAN ABBOTT WAY",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "STANFORD",
										},
										postalCodeExtension: "8602",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: [],
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [
										{
											typeDnBCode: 6863,
											typeDescription:
												"Federal Taxpayer Identification Number (US)",
											registrationNumber: "942536926",
										},
									],
									mostSeniorPrincipals: [
										{
											fullName: "EMILY  FACEBOOK",
										},
									],
								},
								displaySequence: 6,
								matchQualityInformation: {
									matchGrade: "BFFAAZZAFFZ",
									confidenceCode: 4,
									nameMatchScore: 43.2715,
									matchDataProfile:
										"0403030303989800000000000098",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "B",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "A",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "A",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "F",
										},
										{
											componentType: "Sic",
											componentRating: "Z",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "04",
										},
										{
											componentType: "Street Number",
											componentValue: "03",
										},
										{
											componentType: "Street Name",
											componentValue: "03",
										},
										{
											componentType: "City",
											componentValue: "03",
										},
										{
											componentType: "State",
											componentValue: "03",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "00",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "113605035",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "2134195077",
										},
									],
									primaryName: "META PLATFORMS, INC.",
									isStandalone: false,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "90013",
										addressRegion: {
											name: null,
											abbreviatedName: "CA",
										},
										streetAddress: {
											line1: "500 MATEO ST STE 102",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "LOS ANGELES",
										},
										postalCodeExtension: "2222",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: {
										familytreeRolesPlayed: [
											{
												dnbCode: 9140,
												description: "Branch/Division",
											},
										],
									},
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [],
								},
								displaySequence: 7,
								matchQualityInformation: {
									matchGrade: "AFFFAZZFFFZ",
									confidenceCode: 4,
									nameMatchScore: 100,
									matchDataProfile:
										"0500000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "A",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "F",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "F",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "F",
										},
										{
											componentType: "Sic",
											componentRating: "Z",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "05",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "080582771",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "6505434800",
										},
									],
									primaryName: "META PLATFORMS, INC.",
									isStandalone: false,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "94301",
										addressRegion: {
											name: null,
											abbreviatedName: "CA",
										},
										streetAddress: {
											line1: "471 EMERSON ST",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "PALO ALTO",
										},
										postalCodeExtension: "1605",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: {
										familytreeRolesPlayed: [
											{
												dnbCode: 9140,
												description: "Branch/Division",
											},
										],
									},
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [
										{
											fullName: "BRENDAN  FORSYTH",
										},
									],
								},
								displaySequence: 8,
								matchQualityInformation: {
									matchGrade: "AFFFAZZFFFZ",
									confidenceCode: 4,
									nameMatchScore: 100,
									matchDataProfile:
										"0500000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "A",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "F",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "F",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "F",
										},
										{
											componentType: "Sic",
											componentRating: "Z",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "05",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "080587399",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "6505434800",
										},
									],
									primaryName: "META PLATFORMS, INC.",
									isStandalone: false,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "95054",
										addressRegion: {
											name: null,
											abbreviatedName: "CA",
										},
										streetAddress: {
											line1: "3011 LAFAYETTE ST STE 211",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "SANTA CLARA",
										},
										postalCodeExtension: "3438",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: {
										familytreeRolesPlayed: [
											{
												dnbCode: 9140,
												description: "Branch/Division",
											},
										],
									},
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [],
								},
								displaySequence: 9,
								matchQualityInformation: {
									matchGrade: "AFFFAZZFFFZ",
									confidenceCode: 4,
									nameMatchScore: 100,
									matchDataProfile:
										"0500000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "A",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "F",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "F",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "F",
										},
										{
											componentType: "Sic",
											componentRating: "Z",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "05",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "084969985",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "4153079827",
										},
									],
									primaryName: "META PLATFORMS, INC.",
									isStandalone: false,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "94107",
										addressRegion: {
											name: null,
											abbreviatedName: "CA",
										},
										streetAddress: {
											line1: "524 2ND STREET",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "SAN FRANCISCO",
										},
										postalCodeExtension: "3906",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: {
										familytreeRolesPlayed: [
											{
												dnbCode: 9140,
												description: "Branch/Division",
											},
										],
									},
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [
										{
											fullName: "ERIN  WATSON",
										},
									],
								},
								displaySequence: 10,
								matchQualityInformation: {
									matchGrade: "AFFFAZZFFFZ",
									confidenceCode: 4,
									nameMatchScore: 100,
									matchDataProfile:
										"0500000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "A",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "F",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "F",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "F",
										},
										{
											componentType: "Sic",
											componentRating: "Z",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "05",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
						],
					},
					created_at: "2023-03-24T18:19:34.000000Z",
					updated_at: "2023-03-24T18:19:34.000000Z",
					business_credit_service: "dnb_bm_l1",
					business_id: 311821,
					request: {
						duns: "",
						name: "Facebook Inc",
						email: "Jproctor@lendflow.com",
						postalCode: "94025",
						addressRegion: "CA",
						addressLocality: "California",
						telephoneNumber: "+19495673800",
						streetAddressLine1: "1601 willlow road",
						streetAddressLine2: null,
						countryISOAlpha2Code: "US",
					},
					status_code: null,
					deleted_at: null,
				},
			},
			clear: {
				person_search: null,
				clear_id_confirm_person: null,
				clear_risk_inform_person_search: null,
				clear_risk_inform_person_report: null,
				clear_adverse_media_search: null,
				clear_adverse_media_report: null,
				clear_id_confirm_business: null,
				clear_risk_inform_business_search: null,
				clear_risk_inform_business_report: null,
				clear_court_search: null,
			},
			enigma: {
				business_match: null,
				business_lookup: null,
			},
			equifax: {
				bpr: {
					status: "completed",
					consumers: {
						equifaxUSConsumerCreditReport: [
							{
								models: [
									{
										type: "MODEL",
										score: 4,
										modelNumber: "05402",
										modelIDOrScorecard: "0",
										scoreNumberOrMarketMaxIndustryCode: {
											code: "1",
										},
									},
								],
								hitCode: {
									code: "1",
									description: "Hit",
								},
								addresses: [
									{
										zipCode: "94025",
										cityName: "MENLO PARK",
										streetName: "1601 WILLLOW ROAD",
										addressType: "current",
										addressLine1: " 1601 WILLLOW ROAD ",
										sourceOfAddress: {
											code: "D",
											description: "OTH/Sys-Sys",
										},
										dateLastReported: "03242023",
										dateFirstReported: "03002023",
										stateAbbreviation: "CA",
									},
								],
								identifier: "Individual Report 1",
								reportDate: "03242023",
								subjectName: {
									lastName: "CONSUMER",
									firstName: "TEST",
								},
								fileSinceDate: "03242023",
								customerNumber: "325FZ01932",
								ECOAInquiryType: "I",
								lastActivityDate: "03242023",
								consumerReferralCode: "006",
								fraudIDScanAlertCodes: [
									{
										code: "1",
										description:
											"INQUIRY ADDRESS IS LISTED AS A MULTI-DWELLING UNIT",
									},
									{
										code: "7",
										description:
											"UNABLE TO PERFORM SSN VALIDATION DUE TO INSUFFICIENT SSN INPUT",
									},
									{
										code: "8",
										description:
											"UNABLE TO PERFORM TELEPHONE VALIDATION DUE TO INSUFFICIENT TELEPHONE INPUT",
									},
									{
										code: "J",
										description:
											"INQUIRY ADDRESS IS LISTED AS A HOTEL/MOTEL",
									},
								],
								multipleReportIndicator: "F",
								consumerReferralLocation: {
									address: {
										zipCode: "303740241",
										cityName: "ATLANTA",
										primaryAddress: "P O BOX 740241",
										stateAbbreviation: "GA",
									},
									bureauCode: "006",
									bureauName:
										"EQUIFAX INFORMATION SERVICES LLC",
									telephoneNumber: {
										telephoneNumber: "8006851111",
									},
								},
								addressDiscrepancyIndicator: "N",
							},
						],
					},
				},
			},
			scorely: null,
			ekata: null,
			socure: {
				kyc: null,
				fraud: null,
			},
			lexis_nexis: {
				kyc: null,
				kyc_report: null,
				kyb_search: null,
				kyb_report: null,
				corporate_filing_search: null,
				corporate_filing_report: null,
				ucc_filing_search: null,
				ucc_filing_report: null,
				bankruptcy_search: null,
				bankruptcy_report: null,
				liens_search: null,
				liens_report: null,
				judgments_search: null,
				judgments_report: null,
			},
			codat: [],
			railz: [],
			rutter: [],
			moneythumb_cfa: null,
			moneythumb_transactions: null,
			heron: {
				pnl: null,
				pnl_transactions: null,
			},
			document_verifications: [],
		},
		request_data: {
			middesk: null,
			sentilink: null,
			sentilink_ssn_completion: null,
			sentilink_dob_completion: null,
			experian: {
				intelliscore: {
					bin: "810253165",
					subcode: "0446260",
					commercialScore: true,
				},
				intelliscore_v3: null,
				uccs: null,
				bankruptcies: null,
				judgments: null,
				liens: null,
				fsr: {
					bin: "810253165",
					subcode: "0446260",
					fsrScore: true,
				},
				fsr_v2: null,
				commercial_collections: {
					bin: "810253165",
					subcode: "0446260",
					collectionsDetail: true,
					collectionsSummary: true,
				},
				credit_statuses: null,
				legal_collections: null,
				trades: {
					bin: "810253165",
					subcode: "0446260",
					tradePaymentTotals: true,
					tradePaymentTrends: true,
					tradePaymentSummary: true,
					tradePaymentExperiences: true,
				},
				corporate_registrations: null,
				contacts: null,
				facts: null,
				fraud_shields: null,
				gdn: {
					company_profile: {
						gbin: "810253165",
						subcode: "0446260",
						countryCode: "USA",
						applicationReference: "311821",
						legitimateInterestCode: "001",
					},
					risk_check: null,
					small_report: null,
					extended_report: {
						gbin: "810253165",
						subcode: "0446260",
						countryCode: "USA",
						applicationReference: "311821",
						legitimateInterestCode: "001",
					},
					canadian_profile_report: null,
				},
				bop: {
					blended_prequalification: null,
					commercial_lending_to_a_sole_prop: null,
					commercial_lending_with_a_pg: null,
					commercial_insurance: null,
					merchant_cash_advance: null,
					merchant_acquisition: null,
					commercial_factoring: null,
					blended_account_review: null,
					commercial_collections: null,
				},
			},
			dnb: {
				cer_l1: null,
				fi_l2: {
					duns: "196337864",
					name: "Facebook Inc",
					email: "Jproctor@lendflow.com",
					postalCode: "94025",
					addressRegion: "CA",
					addressLocality: "California",
					telephoneNumber: "+19495673800",
					streetAddressLine1: "1601 willlow road",
					streetAddressLine2: null,
					countryISOAlpha2Code: "US",
				},
				fi_l3: null,
				dti_l1: {
					duns: "196337864",
					name: "Facebook Inc",
					email: "Jproctor@lendflow.com",
					postalCode: "94025",
					addressRegion: "CA",
					addressLocality: "California",
					telephoneNumber: "+19495673800",
					streetAddressLine1: "1601 willlow road",
					streetAddressLine2: null,
					countryISOAlpha2Code: "US",
				},
				ci_l2: null,
				pi_l3: {
					duns: "196337864",
					name: "Facebook Inc",
					email: "Jproctor@lendflow.com",
					postalCode: "94025",
					addressRegion: "CA",
					addressLocality: "California",
					telephoneNumber: "+19495673800",
					streetAddressLine1: "1601 willlow road",
					streetAddressLine2: null,
					countryISOAlpha2Code: "US",
				},
				fi_l4: null,
			},
			clear: {
				person_search: null,
				clear_id_confirm_person: null,
				clear_risk_inform_person_search: null,
				clear_risk_inform_person_report: null,
				clear_adverse_media_search: null,
				clear_adverse_media_report: null,
				clear_id_confirm_business: null,
				clear_risk_inform_business_search: null,
				clear_risk_inform_business_report: null,
				clear_court_search: null,
			},
			enigma: {
				business_match: null,
				business_lookup: null,
			},
			equifax: {
				bpr: {
					consumers: {
						name: [
							{
								lastName: "Consumer",
								firstName: "Test",
								identifier: "current",
							},
						],
						addresses: [
							{
								zip: "94025",
								city: "California",
								state: "CA",
								identifier: "current",
								streetName: "1601 willlow road",
								apartmentNumber: null,
							},
						],
						socialNum: [
							{
								number: null,
								identifier: "current",
							},
						],
						phoneNumbers: [
							{
								number: "949-567-3800",
								identifier: "current",
							},
						],
					},
					customerConfiguration: {
						equifaxUSConsumerCreditReport: {
							models: [
								{
									identifier: "05402",
								},
							],
							customerCode: "1717",
							memberNumber: "325FZ01932",
							outputFormat: "T2",
							productCodes: null,
							securityCode: "HT5",
							plainLanguage: "P",
							ECOAInquiryType: "Individual",
							monthsForInquiry: null,
							pdfComboIndicator: "N",
							protocolIndicator: "2",
							rawReportRequired: false,
							riskModelCodeOnly: null,
							fileSelectionLevel: "B",
							fixedInquiryFormat: "72",
							optionalFeatureCode: [],
							codeDescriptionRequired: true,
							multipleReportIndicator: "F",
						},
					},
				},
			},
			scorely: null,
			ekata: null,
			socure: {
				kyc: null,
				fraud: null,
			},
			lexis_nexis: {
				kyc: null,
				kyc_report: null,
				kyb_search: null,
				kyb_report: null,
				corporate_filing_search: null,
				corporate_filing_report: null,
				ucc_filing_search: null,
				ucc_filing_report: null,
				bankruptcy_search: null,
				bankruptcy_report: null,
				liens_search: null,
				liens_report: null,
				judgments_search: null,
				judgments_report: null,
			},
		},
	},
};

export const mrm_credit_report = {
	data: {
		uuid: "88c4cb9e-5e42-4e9e-a87a-f6620f63db06",
		business_legal_name: "MRM Capital holdings",
		dates: {
			dnb_fi_l2: "2023-05-04 21:53:46",
			experian_gdn_risk_check: "2023-05-04 21:53:32",
			experian_gdn_company_profile: "2023-05-04 21:53:26",
			experian_gdn_extended_report: "2023-05-04 21:53:20",
			experian_business_facts: "2023-05-04 21:52:29",
			experian_fsr: "2023-05-04 21:52:07",
			experian_intelliscore: "2023-05-04 21:51:43",
			dnb_dti_l1: "2023-03-29 16:16:24",
			dnb_pi_l3: "2023-03-29 15:52:15",
			experian_trades: "2023-03-29 15:47:51",
			experian_business_match: "2023-03-29 15:47:49",
		},
		statuses: {
			middesk: "Not yet started",
			dnb: {
				cer_l1: "Not yet started",
				ci_l2: "Not yet started",
				pi_l3: "Success",
				fi_l2: "Success",
				fi_l3: "Not yet started",
				fi_l4: "Not yet started",
				dti_l1: "Success",
				bm_l1: "Not yet started",
			},
			experian: {
				intelliscore: "Success",
				intelliscore_v3: "Not yet started",
				uccs: "Not yet started",
				bankruptcies: "Not yet started",
				judgments: "Not yet started",
				liens: "Not yet started",
				fsr: "Success",
				fsr_v2: "Not yet started",
				commercial_collections: "Not yet started",
				credit_statuses: "Not yet started",
				legal_collections: "Not yet started",
				trades: "Success",
				corporate_registrations: "Not yet started",
				contacts: "Not yet started",
				facts: "Success",
				fraud_shields: "Not yet started",
				gdn: {
					company_profile: "Access token is invalid",
					risk_check: "Access token is invalid",
					small_report: "Not yet started",
					extended_report: "Access token is invalid",
					canadian_profile_report: "Not yet started",
				},
				business_match: "Success",
				bop: {
					blended_prequalification: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_lending_to_a_sole_prop: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_lending_with_a_pg: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_insurance: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					merchant_cash_advance: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					merchant_acquisition: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_factoring: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					blended_account_review: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_collections: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					blended_prequalification_pdf_report: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_lending_to_a_sole_prop_pdf_report: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_lending_with_a_pg_pdf_report: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_insurance_pdf_report: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					merchant_cash_advance_pdf_report: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					merchant_acquisition_pdf_report: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_factoring_pdf_report: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					blended_account_review_pdf_report: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_collections_pdf_report: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					blended_prequalification_premier_attributes: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_lending_to_a_sole_prop_premier_attributes: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_lending_with_a_pg_premier_attributes: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_insurance_premier_attributes: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					merchant_cash_advance_premier_attributes: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					merchant_acquisition_premier_attributes: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_factoring_premier_attributes: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					blended_account_review_premier_attributes: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
					commercial_collections_premier_attributes: {
						vantage4: "Not yet started",
						fico8: "Not yet started",
						fico9: "Not yet started",
						fico_v2: "Not yet started",
						fico_advanced2: "Not yet started",
					},
				},
			},
			ocrolus_cfa: "Not yet started",
			moneythumb_cfa: "Not yet started",
			moneythumb_transactions: "Not yet started",
			plaid: "Not yet started",
			sentilink: "Not yet started",
			sentilink_ssn_completion: "Not yet started",
			sentilink_dob_completion: "Not yet started",
			ekata: "Not yet started",
			heron: "Not yet started",
			equifax: {
				bpr: "Not yet started",
			},
			scorely: "Not yet started",
			tax_status: {
				business: {
					verify: "Not yet started",
				},
				individual: {
					verify: "Not yet started",
				},
			},
			clear: {
				person_search: "Not yet started",
				clear_id_confirm_person: "Not yet started",
				clear_risk_inform_person_search: "Not yet started",
				clear_risk_inform_person_report: "Not yet started",
				clear_id_confirm_business: "Not yet started",
				clear_risk_inform_business_search: "Not yet started",
				clear_risk_inform_business_report: "Not yet started",
				clear_court_search: "Not yet started",
				clear_adverse_media_search: "Not yet started",
				clear_adverse_media_report: "Not yet started",
			},
			enigma: {
				business_match: "Not yet started",
				business_lookup: "Not yet started",
			},
			socure: {
				kyc: "Not yet started",
				fraud: "Not yet started",
			},
			lexis_nexis: {
				kyc: "Not yet started",
				kyc_report: "Not yet started",
				kyb_search: "Not yet started",
				kyb_report: "Not yet started",
				corporate_filing_search: "Not yet started",
				corporate_filing_report: "Not yet started",
				ucc_filing_search: "Not yet started",
				ucc_filing_report: "Not yet started",
				bankruptcy_search: "Not yet started",
				bankruptcy_report: "Not yet started",
				liens_search: "Not yet started",
				liens_report: "Not yet started",
				judgments_search: "Not yet started",
				judgments_report: "Not yet started",
			},
			codat: "Not yet started",
			railz: "Not yet started",
			rutter: "Not yet started",
			mx: "Not yet started",
		},
		commercial_data: {
			middesk: null,
			sentilink: null,
			sentilink_ssn_completion: null,
			sentilink_dob_completion: null,
			experian: {
				intelliscore: {
					businessHeader: {
						bin: "408026840",
						phone: "+13214306828",
						taxId: "464612632",
						address: {
							zip: "34787",
							city: "WINTER GARDEN",
							state: "FL",
							street: "9315 TRINANA CIR",
							zipExtension: "0004",
						},
						dbaNames: null,
						websiteUrl: null,
						businessName: "MRM CAPITAL HOLDINGS, INC",
						legalBusinessName: "MRM CAPITAL HOLDINGS, INC",
						customerDisputeIndicator: false,
					},
					commercialScore: {
						score: 72,
						modelCode: "000224",
						riskClass: {
							code: 2,
							definition: "LOW TO MEDIUM RISK",
						},
						modelTitle: "INTELLISCORE PLUS V2",
						customModelCode: "03",
						percentileRanking: 71,
						recommendedCreditLimitAmount: 31700,
					},
					commercialScoreTrends: [
						{
							score: 72,
							quarter: "FEB-APR",
						},
						{
							score: 69,
							quarter: "NOV-JAN",
						},
						{
							score: 66,
							quarter: "AUG-OCT",
						},
						{
							score: 56,
							quarter: "MAY-JUL",
						},
					],
					commercialScoreFactors: [
						{
							code: "045",
							definition: "NUMBER OF GOOD COMMERCIAL ACCOUNTS",
						},
						{
							code: "059",
							definition: "LENGTH OF TIME ON EXPERIAN'S FILE",
						},
						{
							code: "061",
							definition:
								"RATIO OF BALANCE TO HIGH CREDIT FOR COMMERCIAL ACCOUNTS",
						},
						{
							code: "021",
							definition:
								"PCT OF NEW COMMERCIAL ACCTS TO TOTAL NBR OF ACCTS",
						},
					],
				},
				intelliscore_v3: null,
				uccs: null,
				bankruptcies: null,
				judgments: null,
				liens: null,
				fsr: {
					fsrScore: {
						score: 82,
						modelCode: "000223",
						riskClass: {
							code: 1,
							definition: "LOW RISK",
						},
						modelTitle: "FINANCIAL STABILITY RISK",
						percentileRanking: 81,
						recommendedCreditLimitAmount: null,
					},
					businessHeader: {
						bin: "408026840",
						phone: "+13214306828",
						taxId: "464612632",
						address: {
							zip: "34787",
							city: "WINTER GARDEN",
							state: "FL",
							street: "9315 TRINANA CIR",
							zipExtension: "0004",
						},
						dbaNames: null,
						websiteUrl: null,
						businessName: "MRM CAPITAL HOLDINGS, INC",
						legalBusinessName: "MRM CAPITAL HOLDINGS, INC",
						customerDisputeIndicator: false,
					},
					fsrScoreTrends: [
						{
							score: 81,
							quarter: "FEB-APR",
						},
						{
							score: 77,
							quarter: "NOV-JAN",
						},
						{
							score: 70,
							quarter: "AUG-OCT",
						},
						{
							score: 43,
							quarter: "MAY-JUL",
						},
					],
					fsrScoreFactors: [
						{
							code: "004",
							definition:
								"RISK ASSOCIATED WITH THE COMPANY'S INDUSTRY SECTOR",
						},
						{
							code: "009",
							definition: "NUMBER OF ACTIVE COMMERCIAL ACCOUNTS",
						},
						{
							code: "002",
							definition:
								"RISK ASSOCIATED WITH THE BUSINESS TYPE",
						},
						{
							code: "003",
							definition: "EMPLOYEE SIZE OF BUSINESS",
						},
					],
				},
				fsr_v2: null,
				commercial_collections: null,
				credit_statuses: null,
				legal_collections: null,
				trades: {
					businessHeader: {
						bin: "408026840",
						phone: "+13214306828",
						taxId: "464612632",
						address: {
							zip: "34787",
							city: "WINTER GARDEN",
							state: "FL",
							street: "9315 TRINANA CIR",
							zipExtension: "0004",
						},
						dbaNames: null,
						websiteUrl: null,
						businessName: "MRM CAPITAL HOLDINGS, INC",
						legalBusinessName: "MRM CAPITAL HOLDINGS, INC",
						customerDisputeIndicator: false,
					},
					tradeIndicator: true,
					tradePaymentTotals: {
						tradelines: {
							dbt30: 0,
							dbt60: 0,
							dbt90: 0,
							dbt91Plus: 0,
							currentDbt: null,
							tradelineCount: 4,
							currentPercentage: 100,
							totalAccountBalance: {
								amount: 43800,
							},
							totalHighCreditAmount: {
								amount: 96900,
							},
						},
						combinedTradelines: {
							dbt30: 0,
							dbt60: 0,
							dbt90: 0,
							dbt91Plus: 0,
							currentDbt: 0,
							tradelineCount: 2,
							currentPercentage: 100,
							totalAccountBalance: {
								amount: 41100,
							},
							totalHighCreditAmount: {
								amount: 68400,
							},
						},
						additionalTradelines: {
							dbt30: 0,
							dbt60: 0,
							dbt90: 0,
							dbt91Plus: 0,
							currentDbt: null,
							tradelineCount: 2,
							currentPercentage: 100,
							totalAccountBalance: {
								amount: 2700,
							},
							totalHighCreditAmount: {
								amount: 28500,
							},
						},
						newlyReportedTradelines: {
							dbt30: 0,
							dbt60: 0,
							dbt90: 0,
							dbt91Plus: 0,
							currentDbt: 0,
							tradelineCount: 0,
							currentPercentage: 0,
							totalAccountBalance: {
								amount: 0,
							},
							totalHighCreditAmount: {
								amount: 0,
							},
						},
						continuouslyReportedTradelines: {
							dbt30: 0,
							dbt60: 0,
							dbt90: 0,
							dbt91Plus: 0,
							currentDbt: 0,
							tradelineCount: 2,
							currentPercentage: 100,
							totalAccountBalance: {
								amount: 41100,
							},
							totalHighCreditAmount: {
								amount: 68400,
							},
						},
					},
					tradePaymentTrends: {
						monthlyTrends: [
							{
								dbt: 0,
								date: "2023-03-01",
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								dbt91Plus: 0,
								currentPercentage: 100,
								totalAccountBalance: {
									amount: 41100,
								},
							},
							{
								dbt: 0,
								date: "2023-03-01",
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								dbt91Plus: 0,
								currentPercentage: 100,
								totalAccountBalance: {
									amount: 41100,
								},
							},
							{
								dbt: 0,
								date: "2023-02-01",
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								dbt91Plus: 0,
								currentPercentage: 100,
								totalAccountBalance: {
									amount: 41100,
								},
							},
							{
								dbt: 0,
								date: "2023-01-01",
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								dbt91Plus: 0,
								currentPercentage: 100,
								totalAccountBalance: {
									amount: 42700,
								},
							},
							{
								dbt: 0,
								date: "2022-12-01",
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								dbt91Plus: 0,
								currentPercentage: 100,
								totalAccountBalance: {
									amount: 45300,
								},
							},
							{
								dbt: 0,
								date: "2022-11-01",
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								dbt91Plus: 0,
								currentPercentage: 100,
								totalAccountBalance: {
									amount: 45900,
								},
							},
							{
								dbt: 0,
								date: "2022-10-01",
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								dbt91Plus: 0,
								currentPercentage: 100,
								totalAccountBalance: {
									amount: 47600,
								},
							},
						],
						quarterlyTrends: [
							{
								dbt: 0,
								date: "2022-10-01",
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								dbt91Plus: 0,
								currentPercentage: 100,
								totalAccountBalance: {
									amount: 44700,
								},
							},
							{
								dbt: 0,
								date: "2022-07-01",
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								dbt91Plus: 0,
								currentPercentage: 100,
								totalAccountBalance: {
									amount: 49100,
								},
							},
							{
								dbt: 0,
								date: "2022-04-01",
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								dbt91Plus: 0,
								currentPercentage: 100,
								totalAccountBalance: {
									amount: 53900,
								},
							},
							{
								dbt: 0,
								date: "2022-01-01",
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								dbt91Plus: 0,
								currentPercentage: 100,
								totalAccountBalance: {
									amount: 58500,
								},
							},
							{
								dbt: 0,
								date: "2021-10-01",
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								dbt91Plus: 0,
								currentPercentage: 100,
								totalAccountBalance: {
									amount: 63100,
								},
							},
						],
					},
					tradePaymentSummary: {
						currentDbt: 0,
						singleHighCredit: 68400,
						allTradelineCount: 4,
						highestDbt6Months: 0,
						monthlyAverageDbt: 0,
						allTradelineBalance: 43800,
						highestDbt5Quarters: 0,
						currentAccountBalance: 41100,
						currentTradelineCount: 2,
						medianCreditAmountExtended: null,
					},
					tradePaymentExperiences: {
						tradeAdditional: [
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "REVOLVE",
								dbt91Plus: 0,
								dateReported: "2023-03-01",
								accountBalance: {
									amount: 2700,
								},
								businessCategory: "BANK CARD",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 28500,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "NET 30",
								comments: "CUST  3 YR",
								dbt91Plus: 0,
								dateReported: "2021-08-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "PACKAGING",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
						],
						tradeNewAndContinuous: [
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "MONTHLY",
								comments: "CUST 1-5 Y",
								dbt91Plus: 0,
								dateReported: "2023-02-01",
								accountBalance: {
									amount: 0,
								},
								businessCategory: "BUS SERVCS",
								dateLastActivity: "2023-01-01",
								recentHighCredit: {
									amount: 0,
								},
								currentPercentage: 0,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
							{
								dbt30: 0,
								dbt60: 0,
								dbt90: 0,
								terms: "CONTRCT",
								dbt91Plus: 0,
								dateReported: "2023-01-01",
								accountBalance: {
									amount: 41100,
								},
								businessCategory: "FINCL SVCS",
								dateLastActivity: null,
								recentHighCredit: {
									amount: 68400,
								},
								currentPercentage: 100,
								newlyReportedIndicator: false,
								customerDisputeIndicator: false,
							},
						],
					},
				},
				corporate_registrations: null,
				contacts: null,
				facts: {
					sicCodes: [
						{
							code: "6719",
							definition: "HOLDING COMPANIES, NEC",
						},
					],
					naicsCodes: [
						{
							code: "551112",
							definition: "Offices of Other Holding Companies",
						},
					],
					fortune1000: {
						rank: null,
						year: null,
					},
					yearsOnFile: 8,
					businessType: "Corporation",
					employeeSize: 1,
					salesRevenue: 837000,
					salesSizeCode: "B",
					businessHeader: {
						bin: "408026840",
						phone: "+13214306828",
						taxId: "464612632",
						address: {
							zip: "34787",
							city: "WINTER GARDEN",
							state: "FL",
							street: "9315 TRINANA CIR",
							zipExtension: "0004",
						},
						dbaNames: null,
						websiteUrl: null,
						businessName: "MRM CAPITAL HOLDINGS, INC",
						legalBusinessName: "MRM CAPITAL HOLDINGS, INC",
						customerDisputeIndicator: false,
					},
					publicIndicator: false,
					employeeSizeCode: "A",
					nonProfitIndicator: false,
					dateOfIncorporation: "2015-11-12",
					corporateLinkageType: "Stand alone business",
					executiveInformation: [
						{
							title: "CEO",
							lastName: "MATTHEW",
							firstName: "MEEHAN",
							middleName: null,
						},
						{
							title: "VICE PRESIDENT",
							lastName: "DASCOLI",
							firstName: "KRISSY",
							middleName: "M",
						},
					],
					stateOfIncorporation: "FL",
				},
				fraud_shields: null,
				gdn: {
					company_profile: {
						errors: [
							{
								errorMsg: "Access token is invalid",
								errorCode: "4002",
							},
						],
						success: "false",
						requestId:
							"rrt-083b9fc3900f9a7e7-c-wo-17668-27483687-1",
					},
					risk_check: {
						errors: [
							{
								errorMsg: "Access token is invalid",
								errorCode: "4002",
							},
						],
						success: "false",
						requestId:
							"rrt-083b9fc3900f9a7e7-c-wo-17668-27483731-1",
					},
					small_report: null,
					extended_report: {
						errors: [
							{
								errorMsg: "Access token is invalid",
								errorCode: "4002",
							},
						],
						success: "false",
						requestId:
							"rrt-00cf170f009d45570-a-wo-17693-27920109-1",
					},
					canadian_profile_report: null,
				},
				bop: {
					blended_prequalification: null,
					commercial_lending_to_a_sole_prop: null,
					commercial_lending_with_a_pg: null,
					commercial_insurance: null,
					merchant_cash_advance: null,
					merchant_acquisition: null,
					commercial_factoring: null,
					blended_account_review: null,
					commercial_collections: null,
					blended_prequalification_premier_attributes: null,
					commercial_lending_to_a_sole_prop_premier_attributes: null,
					commercial_lending_with_a_pg_premier_attributes: null,
					commercial_insurance_premier_attributes: null,
					merchant_cash_advance_premier_attributes: null,
					merchant_acquisition_premier_attributes: null,
					commercial_factoring_premier_attributes: null,
					blended_account_review_premier_attributes: null,
					commercial_collections_premier_attributes: null,
					pdf_reports: [],
				},
				business_match: {
					id: 242233,
					service_id: 3,
					response: [
						{
							bin: "408026840",
							phone: "+13214306828",
							address: {
								zip: "34787",
								city: "WINTER GARDEN",
								state: "FL",
								street: "9315 TRINANA CIR",
								zipExtension: "0004",
							},
							businessName: "MRM CAPITAL HOLDINGS, INC",
							uccIndicator: true,
							businessGeocode: {
								msaCode: "0000",
								latitude: 28.5226,
								longitude: -81.5995,
								censusTractCode: "017104",
								censusBlkGrpCode: "",
								cottageIndicator: true,
								dateLastReported: "2023-03-16",
								latitudeLongitudeLevel: "Census Tract Level",
								congressionalDistrictCode: "10",
							},
							reliabilityCode: 100,
							inquiryIndicator: true,
							bankDataIndicator: false,
							keyFactsIndicator: true,
							numberOfTradelines: 4,
							matchingNameAndAddress: null,
							governmentDataIndicator: false,
							executiveSummaryIndicator: true,
							financialStatementIndicator: false,
						},
					],
					created_at: "2023-03-29T15:47:51.000000Z",
					updated_at: "2023-03-29T15:47:51.000000Z",
					business_credit_service: "experian_business_match",
					business_id: 313603,
					request: {
						geo: true,
						zip: "34787",
						city: "winter garden",
						name: "MRM Capital holdings",
						phone: "+16463036828",
						state: "FL",
						taxId: "464612632",
						street: "9315 trinana circle",
						subcode: "0446260",
					},
					status_code: 200,
					deleted_at: null,
				},
			},
			dnb: {
				cer_l1: null,
				fi_l2: {
					blockStatus: [
						{
							reason: null,
							status: "ok",
							blockID: "financialstrengthinsight_L2_v1",
						},
						{
							reason: null,
							status: "ok",
							blockID: "baseinfo_L1_v1",
						},
					],
					organization: {
						duns: "017519793",
						tsrRating: [],
						layOffScore: {
							scoreDate: "2023-04-27",
							classScore: 2,
							probability: 0.01,
							classScoreDescription: "moderately low",
							nationalRiskPercentile: 45,
						},
						primaryName: "MRM Capital Holdings, Inc.",
						dnbAssessment: {
							failureScore: {
								scoreDate: "2023-01-08",
								classScore: 2,
								scoreModel: {
									dnbCode: 19884,
									description: "US Failure Score Model 7.1",
								},
								nationalPercentile: 72,
								scoreOverrideReasons: [],
								classScoreDescription:
									"Moderate risk of severe financial stress, such as a bankruptcy, over the next 12 months.",
							},
							historyRating: [],
							standardRating: {
								rating: "DS",
								scoreDate: "2017-01-11",
								riskSegment: null,
								ratingReason: [],
								financialStrength: "DS",
								ratingOverrideReasons: [],
							},
							nordicAAARating: [],
							delinquencyScore: {
								scoreDate: "2022-12-01",
								classScore: 2,
								scoreModel: {
									dnbCode: 26183,
									description: "U.S. Delinquency Predictor",
								},
								nationalPercentile: 90,
								scoreOverrideReasons: [],
								classScoreDescription:
									"Moderate risk of severe payment delinquency over next 12 months.",
							},
							financialCondition: [],
							hasSevereNegativeEvents: false,
							creditLimitRecommendation: {
								assessmentDate: null,
								averageRecommendedLimit: [],
								maximumRecommendedLimit: {
									value: 22500,
									currency: "USD",
								},
							},
							emergingMarketMediationScore: [],
						},
						isHighRiskBusiness: null,
						countryISOAlpha2Code: "US",
						isDeterioratingBusiness: null,
					},
					inquiryDetail: {
						duns: "017519793",
						blockIDs: ["financialstrengthinsight_L2_v1"],
					},
					transactionDetail: {
						inLanguage: "en-US",
						transactionID:
							"rrt-029b49081c63df860-b-wo-17052-9008498-62",
						transactionTimestamp: "2023-05-04T21:53:47.208Z",
					},
				},
				fi_l3: null,
				dti_l1: {
					blockStatus: [
						{
							reason: null,
							status: "ok",
							blockID: "dtri_L1_v1",
						},
						{
							reason: null,
							status: "ok",
							blockID: "baseinfo_L1_v1",
						},
					],
					organization: {
						dtri: {
							currentPaydex: {
								threeMonthsDataCoverage: {
									paydexScore: null,
									paydexAccountsUsedCount: 0,
									paydexSuppliersUsedCount: 0,
								},
								twelveMonthsDataCoverage: {
									paydexScore: 80,
									paydexAccountsUsedCount: 3,
									paydexSuppliersUsedCount: 3,
								},
							},
						},
						duns: "017519793",
						primaryName: "MRM Capital Holdings, Inc.",
						countryISOAlpha2Code: "US",
					},
					inquiryDetail: {
						duns: "017519793",
						blockIDs: ["dtri_L1_v1"],
					},
					transactionDetail: {
						inLanguage: "en-US",
						transactionID:
							"rrt-05b8aae4b99350e99-b-wo-17125-3422819-70",
						transactionTimestamp: "2023-03-29T16:16:25.213Z",
					},
				},
				ci_l2: null,
				pi_l3: {
					blockStatus: [
						{
							reason: null,
							status: "ok",
							blockID: "paymentinsight_L3_v1",
						},
						{
							reason: null,
							status: "ok",
							blockID: "baseinfo_L1_v1",
						},
					],
					organization: {
						duns: "017519793",
						primaryName: "MRM Capital Holdings, Inc.",
						businessTrading: [
							{
								summary: [
									{
										paydexScore: 80,
										dataCoverage: {
											dnbCode: 24186,
											description: "24 Months",
										},
										maximumOwedAmount: 0,
										averageOwingAmount: null,
										totalPastDueAmount: 0,
										paymentBehaviorDays: 0,
										maximumPastDueAmount: 0,
										slowExperiencesCount: null,
										negativePaymentsCount: null,
										paymentBehaviorResult: {
											dnbCode: 1232,
											description: "Prompt",
										},
										slowExperiencesAmount: null,
										totalExperiencesCount: 6,
										totalExperiencesAmount: 63250,
										averageHighCreditAmount: 21000,
										badDebtExperiencesCount: null,
										currentExperiencesCount: 3,
										maximumHighCreditAmount: 55000,
										badDebtExperiencesAmount: null,
										currentExperiencesAmount: 63000,
										favorableExperiencesCount: 3,
										negativeExperiencesAmount: null,
										placedForCollectionAmount: null,
										slowExperiencesPercentage: null,
										subtotalExperiencesAmount: 63000,
										favorableExperiencesAmount: 63000,
										highCreditExperiencesCount: 6,
										slowOrNegativePaymentsCount: null,
										threeMonthsPriorPaydexScore: 80,
										unfavorableExperiencesCount: null,
										badDebtExperiencesPercentage: null,
										satisfactoryExperiencesCount: 3,
										totalPastDueExperiencesCount: null,
										unfavorableExperiencesAmount: null,
										negativeExperiencesPercentage: null,
										satisfactoryExperiencesAmount: 63000,
										favorableExperiencesPercentage: 99.6,
										currentManneredExperiencesCount: 3,
										currentManneredExperiencesAmount: 63000,
										slowAndNegativeExperiencesAmount: null,
										slowOrNegativePaymentsPercentage: null,
										unfavorableExperiencesPercentage: null,
										satisfactoryExperiencesPercentage: 99.6,
										slowExperiencesHighestCreditAmount:
											null,
										placedForCollectionExperiencesCount:
											null,
										currentManneredExperiencesPercentage: 99.6,
										badDebtExperiencesHighestCreditAmount:
											null,
										negativeExperiencesHighestCreditAmount:
											null,
										placedForCollectionHighestCreditAmount:
											null,
										favorableExperiencesHighestCreditAmount: 55000,
										placedForCollectionExperiencesPercentage:
											null,
										unfavorableExperiencesHighestCreditAmount:
											null,
										currentManneredExperiencesHighestCreditAmount: 55000,
										slowAndNegativeExperiencesHighestCreditAmount:
											null,
									},
								],
								currency: "USD",
								summaryDate: "2023-03-01",
							},
						],
						businessTradingNorms: [
							{
								industryNorms: {
									normsKey: "US#6719",
									normsDate: "2023-02-28",
									paydexScoreNorms: {
										medianScore: 80,
										lowerQuartileScore: 79,
										upperQuartileScore: 80,
									},
									paymentBehaviourNorms: {
										medianResult: {
											dnbCode: 1232,
										},
										medianDaysQuantity: 0,
										lowerQuartileResult: {
											dnbCode: 1239,
										},
										upperQuartileResult: {
											dnbCode: 1232,
										},
										lowerQuartileDaysQuantity: 2,
										upperQuartileDaysQuantity: 0,
									},
								},
								calculationTimestamp: "2023-02-28",
							},
						],
						countryISOAlpha2Code: "US",
					},
					inquiryDetail: {
						duns: "017519793",
						blockIDs: ["paymentinsight_L3_v1"],
					},
					transactionDetail: {
						inLanguage: "en-US",
						transactionID:
							"rrt-05d10aa25d6a8fd93-c-wo-17468-3418190-352",
						transactionTimestamp: "2023-03-29T15:52:15.976Z",
					},
				},
				fi_l4: null,
				bm_l1: {
					id: 242237,
					service_id: 7,
					response: {
						matchCandidates: [
							{
								organization: {
									duns: "017519793",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "3214306828",
										},
									],
									primaryName: "MRM CAPITAL HOLDINGS, INC.",
									isStandalone: true,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "34787",
										addressRegion: {
											name: null,
											abbreviatedName: "FL",
										},
										streetAddress: {
											line1: "9315 TRINANA CIR",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "WINTER GARDEN",
										},
										postalCodeExtension: "0004",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: [],
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [
										{
											fullName: "MATTHEW  MEEHAN",
										},
									],
								},
								displaySequence: 1,
								matchQualityInformation: {
									matchGrade: "AAAAAZZAFAA",
									confidenceCode: 10,
									nameMatchScore: 100,
									matchDataProfile:
										"0000000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "A",
										},
										{
											componentType: "Street Number",
											componentRating: "A",
										},
										{
											componentType: "Street Name",
											componentRating: "A",
										},
										{
											componentType: "City",
											componentRating: "A",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "A",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "A",
										},
										{
											componentType: "Sic",
											componentRating: "A",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "00",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "068631263",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "3059745275",
										},
									],
									primaryName: "MRM CAPITAL INC",
									isStandalone: true,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "33179",
										addressRegion: {
											name: null,
											abbreviatedName: "FL",
										},
										streetAddress: {
											line1: "21340 NE 8TH CT",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "MIAMI",
										},
										postalCodeExtension: "1268",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: [],
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 403,
											description: "Out of business",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [
										{
											fullName: "MARISOL  MARRERO",
										},
									],
								},
								displaySequence: 2,
								matchQualityInformation: {
									matchGrade: "AFFFAZZFFAF",
									confidenceCode: 6,
									nameMatchScore: 80,
									matchDataProfile:
										"0000000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "A",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "F",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "F",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "A",
										},
										{
											componentType: "Sic",
											componentRating: "F",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "00",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "016048356",
									telephone: [
										{
											isUnreachable: false,
											telephoneNumber: "8636473311",
										},
									],
									primaryName: "MRM PROPERTY HOLDING LLC",
									isStandalone: true,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "33811",
										addressRegion: {
											name: null,
											abbreviatedName: "FL",
										},
										streetAddress: {
											line1: "3602 DMG DR STE 1",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "LAKELAND",
										},
										postalCodeExtension: "1001",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: [],
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [
										{
											fullName: "BILL  MOORE",
										},
									],
								},
								displaySequence: 3,
								matchQualityInformation: {
									matchGrade: "BFFFAZZFFAA",
									confidenceCode: 4,
									nameMatchScore: 37,
									matchDataProfile:
										"0000000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "B",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "F",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "F",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "A",
										},
										{
											componentType: "Sic",
											componentRating: "A",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "00",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "108526295",
									telephone: [],
									primaryName: "RD HOLDINGS CAPITAL LLC",
									isStandalone: true,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "34744",
										addressRegion: {
											name: null,
											abbreviatedName: "FL",
										},
										streetAddress: {
											line1: "1920 DAS CT",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "KISSIMMEE",
										},
										postalCodeExtension: "6610",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: [],
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [],
								},
								displaySequence: 4,
								matchQualityInformation: {
									matchGrade: "BFFFAZZBFAF",
									confidenceCode: 4,
									nameMatchScore: 37,
									matchDataProfile:
										"0000000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "B",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "F",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "B",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "A",
										},
										{
											componentType: "Sic",
											componentRating: "F",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "00",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "060276522",
									telephone: [],
									primaryName:
										"INNOVATION HOLDING CAPITAL LLC",
									isStandalone: true,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "32113",
										addressRegion: {
											name: null,
											abbreviatedName: "FL",
										},
										streetAddress: {
											line1: "840 W HIGHWAY 329",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "CITRA",
										},
										postalCodeExtension: "4026",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: [],
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [],
								},
								displaySequence: 5,
								matchQualityInformation: {
									matchGrade: "BFFFAZZFBAF",
									confidenceCode: 4,
									nameMatchScore: 37,
									matchDataProfile:
										"0000000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "B",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "F",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "F",
										},
										{
											componentType: "Density",
											componentRating: "B",
										},
										{
											componentType: "Uniqueness",
											componentRating: "A",
										},
										{
											componentType: "Sic",
											componentRating: "F",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "00",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "111327877",
									telephone: [],
									primaryName: "BRIDGE HOLDINGS CAPITAL LLC",
									isStandalone: true,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "32413",
										addressRegion: {
											name: null,
											abbreviatedName: "FL",
										},
										streetAddress: {
											line1: "22520 FRONT BEACH RD",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "PANAMA CITY BEACH",
										},
										postalCodeExtension: "3013",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: [],
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [],
								},
								displaySequence: 6,
								matchQualityInformation: {
									matchGrade: "BFFFAZZFBAF",
									confidenceCode: 4,
									nameMatchScore: 37,
									matchDataProfile:
										"0000000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "B",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "F",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "F",
										},
										{
											componentType: "Density",
											componentRating: "B",
										},
										{
											componentType: "Uniqueness",
											componentRating: "A",
										},
										{
											componentType: "Sic",
											componentRating: "F",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "00",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "113324801",
									telephone: [],
									primaryName:
										"HOLDINGS TRADERS CAPITAL INVESTMENTS L.L.C",
									isStandalone: true,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "33196",
										addressRegion: {
											name: null,
											abbreviatedName: "FL",
										},
										streetAddress: {
											line1: "9630 SW 148TH PL",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "MIAMI",
										},
										postalCodeExtension: "1577",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: [],
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 9074,
											description: "Active",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [],
								},
								displaySequence: 7,
								matchQualityInformation: {
									matchGrade: "BFFFAZZFBAF",
									confidenceCode: 4,
									nameMatchScore: 37,
									matchDataProfile:
										"0000000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "B",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "F",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "F",
										},
										{
											componentType: "Density",
											componentRating: "B",
										},
										{
											componentType: "Uniqueness",
											componentRating: "A",
										},
										{
											componentType: "Sic",
											componentRating: "F",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "00",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
							{
								organization: {
									duns: "619697068",
									telephone: [],
									primaryName:
										"FINANCIAL HOLDINGS CAPITAL MGT",
									isStandalone: true,
									mailingAddress: {
										postalCode: null,
										addressRegion: [],
										streetAddress: [],
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: [],
										postalCodeExtension: null,
									},
									primaryAddress: {
										postalCode: "33626",
										addressRegion: {
											name: null,
											abbreviatedName: "FL",
										},
										streetAddress: {
											line1: "12157 W LINEBAUGH AVE # 429",
											line2: null,
										},
										addressCountry: {
											name: "United States",
											isoAlpha2Code: "US",
										},
										addressLocality: {
											name: "TAMPA",
										},
										postalCodeExtension: "1732",
									},
									websiteAddress: [],
									tradeStyleNames: [],
									corporateLinkage: [],
									dunsControlStatus: {
										operatingStatus: {
											dnbCode: 403,
											description: "Out of business",
										},
										isMailUndeliverable: false,
									},
									registrationNumbers: [],
									mostSeniorPrincipals: [
										{
											fullName: "CAESAR A VERBEL",
										},
									],
								},
								displaySequence: 8,
								matchQualityInformation: {
									matchGrade: "BFFFAZZFFAA",
									confidenceCode: 4,
									nameMatchScore: 37,
									matchDataProfile:
										"0000000000989800000000009998",
									matchGradeComponents: [
										{
											componentType: "Name",
											componentRating: "B",
										},
										{
											componentType: "Street Number",
											componentRating: "F",
										},
										{
											componentType: "Street Name",
											componentRating: "F",
										},
										{
											componentType: "City",
											componentRating: "F",
										},
										{
											componentType: "State",
											componentRating: "A",
										},
										{
											componentType: "PO Box",
											componentRating: "Z",
										},
										{
											componentType: "Phone",
											componentRating: "Z",
										},
										{
											componentType: "Postal Code",
											componentRating: "F",
										},
										{
											componentType: "Density",
											componentRating: "F",
										},
										{
											componentType: "Uniqueness",
											componentRating: "A",
										},
										{
											componentType: "Sic",
											componentRating: "A",
										},
									],
									matchGradeComponentsCount: 11,
									matchDataProfileComponents: [
										{
											componentType: "Name",
											componentValue: "00",
										},
										{
											componentType: "Street Number",
											componentValue: "00",
										},
										{
											componentType: "Street Name",
											componentValue: "00",
										},
										{
											componentType: "City",
											componentValue: "00",
										},
										{
											componentType: "State",
											componentValue: "00",
										},
										{
											componentType: "PO Box",
											componentValue: "98",
										},
										{
											componentType: "Phone",
											componentValue: "98",
										},
										{
											componentType: "Postal Code",
											componentValue: "00",
										},
										{
											componentType: "DUNS",
											componentValue: "00",
										},
										{
											componentType: "SIC",
											componentValue: "00",
										},
										{
											componentType: "Density",
											componentValue: "00",
										},
										{
											componentType: "Uniqueness",
											componentValue: "00",
										},
										{
											componentType: "National ID",
											componentValue: "99",
										},
										{
											componentType: "URL",
											componentValue: "98",
										},
									],
									matchDataProfileComponentsCount: 14,
								},
							},
						],
					},
					created_at: "2023-03-29T15:52:15.000000Z",
					updated_at: "2023-03-29T15:52:15.000000Z",
					business_credit_service: "dnb_bm_l1",
					business_id: 313603,
					request: {
						duns: "",
						name: "MRM Capital holdings",
						email: "matt@mrmcapitalgroup.com",
						postalCode: "34787",
						addressRegion: "FL",
						addressLocality: "winter garden",
						telephoneNumber: "+16463036828",
						streetAddressLine1: "9315 trinana circle",
						streetAddressLine2: null,
						countryISOAlpha2Code: "US",
					},
					status_code: null,
					deleted_at: null,
				},
			},
			tax_status: {
				business: {
					verify: null,
				},
				individual: {
					verify: null,
				},
			},
			clear: {
				person_search: null,
				clear_id_confirm_person: null,
				clear_risk_inform_person_search: null,
				clear_risk_inform_person_report: null,
				clear_adverse_media_search: null,
				clear_adverse_media_report: null,
				clear_id_confirm_business: null,
				clear_risk_inform_business_search: null,
				clear_risk_inform_business_report: null,
				clear_court_search: null,
			},
			enigma: {
				business_match: null,
				business_lookup: null,
			},
			equifax: {
				bpr: null,
			},
			scorely: null,
			ekata: null,
			socure: {
				kyc: null,
				fraud: null,
			},
			lexis_nexis: {
				kyc: null,
				kyc_report: null,
				kyb_search: null,
				kyb_report: null,
				corporate_filing_search: null,
				corporate_filing_report: null,
				ucc_filing_search: null,
				ucc_filing_report: null,
				bankruptcy_search: null,
				bankruptcy_report: null,
				liens_search: null,
				liens_report: null,
				judgments_search: null,
				judgments_report: null,
			},
			codat: [],
			railz: [],
			rutter: [],
			moneythumb_cfa: null,
			moneythumb_transactions: null,
			heron: {
				pnl: null,
				pnl_transactions: null,
			},
			document_verifications: [],
		},
		request_data: {
			middesk: null,
			sentilink: null,
			sentilink_ssn_completion: null,
			sentilink_dob_completion: null,
			experian: {
				intelliscore: {
					bin: "408026840",
					subcode: "0446260",
					commercialScore: true,
				},
				intelliscore_v3: null,
				uccs: null,
				bankruptcies: null,
				judgments: null,
				liens: null,
				fsr: {
					bin: "408026840",
					subcode: "0446260",
					fsrScore: true,
				},
				fsr_v2: null,
				commercial_collections: null,
				credit_statuses: null,
				legal_collections: null,
				trades: {
					bin: "408026840",
					subcode: "0446260",
					tradePaymentTotals: true,
					tradePaymentTrends: true,
					tradePaymentSummary: true,
					tradePaymentExperiences: true,
				},
				corporate_registrations: null,
				contacts: null,
				facts: {
					bin: "408026840",
					subcode: "0446260",
				},
				fraud_shields: null,
				gdn: {
					company_profile: {
						gbin: "408026840",
						subcode: "0446260",
						countryCode: "USA",
						applicationReference: "313603",
						legitimateInterestCode: "001",
					},
					risk_check: {
						gbin: "408026840",
						subcode: "0446260",
						countryCode: "USA",
						applicationReference: "313603",
						legitimateInterestCode: "001",
					},
					small_report: null,
					extended_report: {
						gbin: "408026840",
						subcode: "0446260",
						countryCode: "USA",
						applicationReference: "313603",
						legitimateInterestCode: "001",
					},
					canadian_profile_report: null,
				},
				bop: {
					blended_prequalification: null,
					commercial_lending_to_a_sole_prop: null,
					commercial_lending_with_a_pg: null,
					commercial_insurance: null,
					merchant_cash_advance: null,
					merchant_acquisition: null,
					commercial_factoring: null,
					blended_account_review: null,
					commercial_collections: null,
					blended_prequalification_premier_attributes: null,
					commercial_lending_to_a_sole_prop_premier_attributes: null,
					commercial_lending_with_a_pg_premier_attributes: null,
					commercial_insurance_premier_attributes: null,
					merchant_cash_advance_premier_attributes: null,
					merchant_acquisition_premier_attributes: null,
					commercial_factoring_premier_attributes: null,
					blended_account_review_premier_attributes: null,
					commercial_collections_premier_attributes: null,
				},
			},
			dnb: {
				cer_l1: null,
				fi_l2: {
					duns: "017519793",
					name: "MRM Capital holdings",
					email: "matt@mrmcapitalgroup.com",
					postalCode: "34787",
					addressRegion: "FL",
					addressLocality: "winter garden",
					telephoneNumber: "+16463036828",
					registrationNumber: "464612632",
					streetAddressLine1: "9315 trinana circle",
					streetAddressLine2: null,
					countryISOAlpha2Code: "US",
					registrationNumberType: "6863",
				},
				fi_l3: null,
				dti_l1: {
					duns: "017519793",
					name: "MRM Capital holdings",
					email: "matt@mrmcapitalgroup.com",
					postalCode: "34787",
					addressRegion: "FL",
					addressLocality: "winter garden",
					telephoneNumber: "+16463036828",
					streetAddressLine1: "9315 trinana circle",
					streetAddressLine2: null,
					countryISOAlpha2Code: "US",
				},
				ci_l2: null,
				pi_l3: {
					duns: "017519793",
					name: "MRM Capital holdings",
					email: "matt@mrmcapitalgroup.com",
					postalCode: "34787",
					addressRegion: "FL",
					addressLocality: "winter garden",
					telephoneNumber: "+16463036828",
					streetAddressLine1: "9315 trinana circle",
					streetAddressLine2: null,
					countryISOAlpha2Code: "US",
				},
				fi_l4: null,
			},
			tax_status: {
				business: {
					verify: null,
				},
				individual: {
					verify: null,
				},
			},
			clear: {
				person_search: null,
				clear_id_confirm_person: null,
				clear_risk_inform_person_search: null,
				clear_risk_inform_person_report: null,
				clear_adverse_media_search: null,
				clear_adverse_media_report: null,
				clear_id_confirm_business: null,
				clear_risk_inform_business_search: null,
				clear_risk_inform_business_report: null,
				clear_court_search: null,
			},
			enigma: {
				business_match: null,
				business_lookup: null,
			},
			equifax: {
				bpr: null,
			},
			scorely: null,
			ekata: null,
			socure: {
				kyc: null,
				fraud: null,
			},
			lexis_nexis: {
				kyc: null,
				kyc_report: null,
				kyb_search: null,
				kyb_report: null,
				corporate_filing_search: null,
				corporate_filing_report: null,
				ucc_filing_search: null,
				ucc_filing_report: null,
				bankruptcy_search: null,
				bankruptcy_report: null,
				liens_search: null,
				liens_report: null,
				judgments_search: null,
				judgments_report: null,
			},
		},
	},
};

export const Lendflow = {};
Lendflow.experian = {};

Lendflow.experian.score = pipe(
	get(
		"data",
		"commercial_data",
		"experian",
		"intelliscore",
		"commercialScore",
		"score"
	)
);

Lendflow.experian.risk_class = pipe(
	get(
		"data",
		"commercial_data",
		"experian",
		"intelliscore",
		"commercialScore",
		"riskClass"
	)
);

Lendflow.business = pipe(
	get("data", "commercial_data", "experian", "business_match", "response", 0),
	(business) => ({
		name: pipe(get("businessName"))(business),
		phone: pipe(get("phone"))(business),
		address: pipe(get("address"))(business),
	})
);

Lendflow.experian.trade_payment_totals = pipe(
	get("data", "commercial_data", "experian", "trades", "tradePaymentTotals"),
	(totals) => ({
		trade_lines: pipe(get("tradelines"))(totals),
		combined_trade_lines: pipe(get("combinedTradelines"))(totals),
		additional_trade_lines: pipe(get("additionalTradelines"))(totals),
		newly_reported_trade_lines: pipe(get("newlyReportedTradelines"))(
			totals
		),
		continuously_reported_trade_lines: pipe(
			get("continuouslyReportedTradelines")
		)(totals),
	})
);

Lendflow.experian.trade_summary = pipe(
	get("data", "commercial_data", "experian", "trades", "tradePaymentSummary")
);

Lendflow.experian.trade_lines = pipe(
	get(
		"data",
		"commercial_data",
		"experian",
		"trades",
		"tradePaymentExperiences"
	),
	(trades) => [...trades.tradeAdditional, ...trades.tradeNewAndContinuous]
);

Lendflow.experian.sic_codes = pipe(
	get("data", "commercial_data", "experian", "facts", "sicCodes")
);

Lendflow.experian.years_on_file = pipe(
	get("data", "commercial_data", "experian", "facts", "yearsOnFile")
);

Lendflow.experian.employee_size = pipe(
	get("data", "commercial_data", "experian", "facts", "employeeSize")
);

Lendflow.experian.naics_codes = pipe(
	get("data", "commercial_data", "experian", "facts", "naicsCodes")
);

Lendflow.experian.sales_revenue = pipe(
	get("data", "commercial_data", "experian", "facts", "salesRevenue")
);

Lendflow.experian.factors = pipe(
	get("data", "commercial_data", "experian"),
	(experian) => [
		...experian.intelliscore.commercialScoreFactors,
		...experian.fsr.fsrScoreFactors,
	]
);

Lendflow.dnb = {};

Lendflow.dnb.score = pipe(
	get(
		"data",
		"commercial_data",
		"dnb",
		"pi_l3",
		"organization",
		"businessTrading",
		0,
		"summary",
		0,
		"paydexScore"
	)
);

Lendflow.dnb.delinquency_score = pipe(
	get(
		"data",
		"commercial_data",
		"dnb",
		"fi_l2",
		"organization",
		"dnbAssessment",
		"delinquencyScore",
		"classScoreDescription"
	)
);

Lendflow.dnb.total_balance_high = pipe(
	get(
		"data",
		"commercial_data",
		"dnb",
		"pi_l3",
		"organization",
		"businessTrading",
		0,
		"summary",
		0,
		"totalExperiencesAmount"
	)
);

Lendflow.dnb.duns_number = pipe(
	get("data", "commercial_data", "dnb", "fi_l2", "organization", "duns")
);

// console.log("api_response");
// console.log(Lendflow.dnb.delinquency_score);
