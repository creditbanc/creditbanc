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
