import { get, all, mod, filter } from "shades";
import {
	pipe,
	map,
	splitWhenever,
	head,
	pick,
	tryCatch,
	always,
	uniqBy,
	flatten,
} from "ramda";
import { inspect, currency } from "~/utils/helpers";
import axios from "axios";
import { mapIndexed } from "~/utils/helpers";

export const is_sandbox = false;

export const appKey = is_sandbox
	? "3F03D20E-5311-43D8-8A76-E4B5D77793BD"
	: "F5C7226A-4F96-43BF-B748-09278FFE0E36";

export const user_url = is_sandbox
	? "https://sandbox.array.io/api/user/v2"
	: "https://array.io/api/user/v2";

export const authenticate_url = is_sandbox
	? "https://sandbox.array.io/api/authenticate/v2"
	: "https://array.io/api/authenticate/v2";

export const report_url = is_sandbox
	? "https://sandbox.array.io/api/report/v2"
	: "https://array.io/api/report/v2";

export const array_script_tag = is_sandbox
	? `https://embed.sandbox.array.io/cms/array-web-component.js?appKey=${appKey}`
	: `https://embed.array.io/cms/array-web-component.js?appKey=${appKey}`;

export const kba_script_tag = is_sandbox
	? `https://embed.sandbox.array.io/cms/array-authentication-kba.js?appKey=${appKey}`
	: `https://embed.array.io/cms/array-authentication-kba.js?appKey=${appKey}`;

export const array_url = is_sandbox
	? "https://sandbox.array.io"
	: "https://array.io";

export const test_identity_one = {
	ssn: "053723148",
	firstName: "MATHEW",
	lastName: "MEEHAN",
	dob: "1981-06-17",
	address: {
		street: "9315 trinana circle",
		city: "Winter garden",
		state: "FL",
		zip: "34787",
	},
};

export const test_identity_two = {
	firstName: "daniel",
	lastName: "arzuaga",
	dob: "1989-09-28",
	ssn: "594794805",
	address: {
		street: "16555 southwest 47th place road",
		city: "ocala",
		state: "fl",
		zip: "34481",
	},
};

export const test_identity_ten = {
	firstName: "ana gloria",
	lastName: "vazquez",
	dob: "1963-06-19",
	ssn: "594794797",
	address: {
		street: "16555 southwest 47th place road",
		city: "ocala",
		state: "fl",
		zip: "34481",
	},
};

export const test_identity_three = {
	firstName: "DONALD",
	lastName: "BLAIR",
	dob: "1939-09-20",
	ssn: "666285344",
	address: {
		street: "3627 W POPLAR ST",
		city: "SAN ANTONIO",
		state: "TX",
		zip: "78228",
	},
};

export const test_identity_four = {
	firstName: "THOMAS",
	lastName: "DEVOS",
	dob: "1957-09-06",
	ssn: "666023511",
	address: {
		street: "1206 BEAR CREEK RD APT 110",
		city: "TUSCALOOSA",
		state: "AL",
		zip: "35405",
	},
};

export const test_identity_five = {
	firstName: "MARIA",
	lastName: "IGLESIAS",
	dob: "1958-12-28",
	ssn: "666824123",
	address: {
		street: "21 PACIFIC ST",
		city: "PITTSFIELD",
		state: "MA",
		zip: "01201",
	},
};

export const credit_report_data = {
	CREDIT_RESPONSE: {
		"@MISMOVersionID": "2.4",
		"@CreditResponseID": "CRRep0001",
		"@CreditReportIdentifier": "1874-3FFFD5AA-7022-454",
		"@CreditReportFirstIssuedDate": "2023-02-08T19:10:09.076Z",
		"@CreditReportMergeTypeIndicator": "ListAndStack",
		"@CreditRatingCodeType": "Equifax",
		_DATA_INFORMATION: {
			DATA_VERSION: [
				{
					"@_Name": "Credmo",
					"@_Number": "1.3",
				},
				{
					"@_Name": "Equifax",
					"@_Number": "5",
				},
				{
					"@_Name": "Experian",
					"@_Number": "7",
				},
				{
					"@_Name": "TransUnion",
					"@_Number": "4",
				},
			],
		},
		CREDIT_BUREAU: null,
		CREDIT_REPOSITORY_INCLUDED: {
			"@_EquifaxIndicator": "Y",
			"@_ExperianIndicator": "Y",
			"@_TransUnionIndicator": "Y",
		},
		CREDIT_FROZEN_STATUS: {
			"@_EquifaxIndicator": "false",
			"@_ExperianIndicator": "false",
			"@_TransUnionIndicator": "false",
		},
		REQUESTING_PARTY: null,
		CREDIT_REQUEST_DATA: {
			"@BorrowerID": "Borrower01",
			CREDIT_REPOSITORY_INCLUDED: {
				"@_EquifaxIndicator": "Y",
				"@_ExperianIndicator": "Y",
				"@_TransUnionIndicator": "Y",
			},
		},
		BORROWER: {
			"@BorrowerID": "Borrower01",
			"@_BirthDate": "1989-09-28",
			"@_FirstName": "DANIEL",
			"@_LastName": "ARZUAGA VAZQUEZ",
			"@_SSN": "XXXXXXXXX",
			"@_UnparsedName": "DANIEL ARZUAGA VAZQUEZ ",
			"@_PrintPositionType": "Borrower",
			_RESIDENCE: [
				{
					"@_StreetAddress": "15176 SW 63RD TE",
					"@_City": "MIAMI",
					"@_State": "FL",
					"@_PostalCode": "331932052",
					"@BorrowerResidencyType": "Current",
				},
				{
					"@_StreetAddress": "511 75TH ST",
					"@_City": "MIAMI BEACH",
					"@_State": "FL",
					"@_PostalCode": "331412376",
					"@BorrowerResidencyType": "Prior",
				},
			],
		},
		CREDIT_LIABILITY: [
			{
				"@CreditLiabilityID": "TRADE001",
				"@BorrowerID": "Borrower01",
				"@CreditFileID": "EA01 TA01 RA01",
				"@CreditTradeReferenceID": "Primary",
				"@_AccountBalanceDate": "2023-01-23",
				"@_AccountClosedDate": "2018-07-31",
				"@_AccountIdentifier": "25265595",
				"@_AccountOpenedDate": "2017-03-09",
				"@_AccountOwnershipType": "JointContractualLiability",
				"@_AccountReportedDate": "2023-01-24",
				"@_AccountStatusDate": "2018-07-01",
				"@_AccountStatusType": "Closed",
				"@_AccountType": "Installment",
				"@_ChargeOffAmount": "28959",
				"@_ChargeOffDate": "2017-03-09",
				"@_ConsumerDisputeIndicator": "N",
				"@_DerogatoryDataIndicator": "Y",
				"@_HighBalanceAmount": "29415",
				"@_LastActivityDate": "2022-12-24",
				"@_MonthsReviewedCount": "71",
				"@_PastDueAmount": "14524",
				"@_TermsMonthsCount": "73",
				"@_TermsDescription": "73M",
				"@_TermsSourceType": "Provided",
				"@_UnpaidBalanceAmount": "14524",
				"@CreditBusinessType": "Finance",
				"@CreditLoanType": "AutoLoan",
				"@CreditLoanTypeCode": "00",
				"@_OriginalBalanceAmount": "29415",
				"@IsMortgageIndicator": "N",
				"@IsClosedIndicator": "Y",
				"@IsCollectionIndicator": "N",
				"@IsChargeoffIndicator": "Y",
				"@DateClosedIndicator": "F",
				"@LastPaymentDate": "2018-08-29",
				"@RawAccountType": "I",
				"@RawIndustryText": "AutoFinancing",
				"@RawIndustryCode": "FA",
				"@TradelineHashComplex": "5c41f97a5f465ac1f315e6f3d6d785bd",
				"@TradelineHashSimple": "547adfa3f0c964a8c4f0aa4d3ff10c12",
				"@ArrayAccountIdentifier": "d9e10e47cff3c18e690d8ccab7a7068e",
				_CREDITOR: {
					"@_Name": "CARMAX AUTO FINANCE",
					"@_StreetAddress": "12800 TUCKAHOE CREEK PKW",
					"@_City": "RICHMOND",
					"@_State": "VA",
					"@_PostalCode": "23238",
					"@_Phone": "8009253612",
					CONTACT_DETAIL: {
						CONTACT_POINT: {
							"@_Type": "Phone",
							"@_Value": "8009253612",
						},
					},
				},
				_CURRENT_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				_HIGHEST_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Date": "2018-06-24",
					"@_Type": "CollectionOrChargeOff",
				},
				_LATE_COUNT: {
					"@_30Days": "02",
					"@_60Days": "01",
					"@_90Days": "01",
				},
				_MOST_RECENT_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Date": "2018-07-31",
					"@_Type": "CollectionOrChargeOff",
				},
				_PAYMENT_PATTERN: {
					"@_Data":
						"9999999999999999999999999999999999999999999999999999999921CC1CCCCCCCCCC",
					"@_StartDate": "2023-01-23",
				},
				CREDIT_COMMENT: [
					{
						"@_SourceType": "Equifax",
						"@_Type": "BureauRemarks",
						"@_Code": "DB",
						_Text: "CHARGED OFF ACCOUNT",
					},
					{
						"@_SourceType": "TransUnion",
						"@_Type": "BureauRemarks",
						"@_Code": "PRL",
						_Text: "PROFIT AND LOSS WRITEOFF",
					},
					{
						"@_SourceType": "Experian",
						"@_Type": "StatusCode",
						"@_Code": "97",
						_Text: "UNPAID BALANCE REPORTED AS A LOSS BY CREDIT GRANTOR",
					},
					{
						"@_SourceType": "Equifax",
						"@_Type": "BureauRemarks",
						"@_Code": "EP",
						_Text: "FIXED RATE",
					},
					{
						"@_SourceType": "Equifax",
						"@_Type": "Other",
						"@_TypeOtherDescripton": "TrendedData",
						_Text: "<CREDIT_LIABILITY_PRIOR_INFORMATIONS>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-04/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11674/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11674/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11678/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11674/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11678/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-04/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11674/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11688/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11674/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATIONS>",
					},
				],
				CREDIT_REPOSITORY: [
					{
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "850FA00369",
					},
					{
						"@_SourceType": "Experian",
					},
					{
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "045WK001",
					},
				],
			},
			{
				"@CreditLiabilityID": "TRADE002",
				"@BorrowerID": "Borrower01",
				"@CreditFileID": "EA01",
				"@CreditTradeReferenceID": "Secondary",
				"@_AccountIdentifier": "25265595",
				"@_AccountOpenedDate": "2017-03-09",
				"@_AccountOwnershipType": "JointContractualLiability",
				"@_AccountReportedDate": "2023-01-24",
				"@_AccountStatusType": "Closed",
				"@_AccountType": "Installment",
				"@_ChargeOffAmount": "28959",
				"@_ChargeOffDate": "2017-03-09",
				"@_ConsumerDisputeIndicator": "N",
				"@_DerogatoryDataIndicator": "Y",
				"@_LastActivityDate": "2022-12-24",
				"@_MonthsReviewedCount": "70",
				"@_PastDueAmount": "14524",
				"@_TermsMonthsCount": "73",
				"@_TermsDescription": "73M",
				"@_TermsSourceType": "Provided",
				"@_UnpaidBalanceAmount": "14524",
				"@CreditBusinessType": "Finance",
				"@CreditLoanType": "Automobile",
				"@CreditLoanTypeCode": "00",
				"@IsMortgageIndicator": "N",
				"@IsClosedIndicator": "Y",
				"@IsCollectionIndicator": "N",
				"@IsChargeoffIndicator": "Y",
				"@LastPaymentDate": "2018-08-01",
				"@RawAccountType": "I",
				"@RawIndustryText": "AutoFinancing",
				"@RawIndustryCode": "FA",
				"@TradelineHashComplex": "5c41f97a5f465ac1f315e6f3d6d785bd",
				"@TradelineHashSimple": "547adfa3f0c964a8c4f0aa4d3ff10c12",
				"@ArrayAccountIdentifier": "d9e10e47cff3c18e690d8ccab7a7068e",
				_CREDITOR: {
					"@_Name": "CARMAX AUTO FINANCE",
					"@_StreetAddress": "225 CHASTAIN MEADOWS COURT",
					"@_City": "KENNESAW",
					"@_State": "GA",
					"@_PostalCode": "30144",
					"@_Phone": "8009253612",
					CONTACT_DETAIL: {
						CONTACT_POINT: {
							"@_Type": "Phone",
							"@_Value": "8009253612",
						},
					},
				},
				_CURRENT_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				_HIGHEST_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Date": "2018-06-24",
					"@_Type": "CollectionOrChargeOff",
				},
				_LATE_COUNT: {
					"@_30Days": "02",
					"@_60Days": "01",
					"@_90Days": "01",
				},
				_PAYMENT_PATTERN: {
					"@_Data":
						"99999999999999999999999999999999999999999999999XXXXXXX321XX1XXXXXXXXXX",
					"@_StartDate": "2022-12-24",
				},
				CREDIT_COMMENT: [
					{
						"@_SourceType": "Equifax",
						"@_Type": "BureauRemarks",
						"@_Code": "DB",
						_Text: "CHARGED OFF ACCOUNT",
					},
					{
						"@_SourceType": "Equifax",
						"@_Type": "Other",
						"@_TypeOtherDescripton": "TrendedData",
						_Text: "<CREDIT_LIABILITY_PRIOR_INFORMATIONS>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-04/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>14524/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11674/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11674/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11678/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11674/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11678/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-04/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11674/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11688/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11819/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>11674/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-03-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATIONS>",
					},
				],
				CREDIT_REPOSITORY: {
					"@_SourceType": "Equifax",
					"@_SubscriberCode": "850FA00369",
				},
			},
			{
				"@CreditLiabilityID": "TRADE003",
				"@BorrowerID": "Borrower01",
				"@CreditFileID": "TA01",
				"@CreditTradeReferenceID": "Secondary",
				"@_AccountClosedDate": "2018-07-31",
				"@_AccountIdentifier": "25265595",
				"@_AccountOpenedDate": "2017-03-09",
				"@_AccountOwnershipType": "JointContractualLiability",
				"@_AccountReportedDate": "2023-01-24",
				"@_AccountStatusType": "Closed",
				"@_AccountType": "Installment",
				"@_ChargeOffDate": "2018-07-31",
				"@_ConsumerDisputeIndicator": "N",
				"@_DerogatoryDataIndicator": "Y",
				"@_HighBalanceAmount": "29415",
				"@_LastActivityDate": "2018-08-29",
				"@_MonthsReviewedCount": "70",
				"@_PastDueAmount": "14524",
				"@_TermsMonthsCount": "73",
				"@_TermsDescription": "73M",
				"@_TermsSourceType": "Provided",
				"@_UnpaidBalanceAmount": "14524",
				"@CreditBusinessType": "Finance",
				"@CreditLoanType": "AutoLoan",
				"@CreditLoanTypeCode": "AU",
				"@_OriginalBalanceAmount": "000029415",
				"@IsMortgageIndicator": "N",
				"@IsClosedIndicator": "Y",
				"@IsCollectionIndicator": "N",
				"@IsChargeoffIndicator": "Y",
				"@DateClosedIndicator": "F",
				"@LastPaymentDate": "2018-08-29",
				"@RawAccountStatus": "C",
				"@RawAccountType": "I",
				"@RawIndustryText": "MiscellaneousFinance/personal",
				"@RawIndustryCode": "FZ",
				"@TradelineHashComplex": "3d24d30baea990bb5b7c2fc547d719ad",
				"@TradelineHashSimple": "faef0fd27d230c78246445a95a755f41",
				"@ArrayAccountIdentifier": "d9e10e47cff3c18e690d8ccab7a7068e",
				"@TUI_Handle": "TR01_-1777782269_-1738925364_73",
				_CREDITOR: {
					"@_Name": "CAF",
					"@_StreetAddress": "225 CHASTAIN MEADOWS COURT",
					"@_City": "KENNESAW",
					"@_State": "GA",
					"@_PostalCode": "30144",
					"@_Phone": "8009253612",
					CONTACT_DETAIL: {
						CONTACT_POINT: {
							"@_Type": "Phone",
							"@_Value": "8009253612",
						},
					},
				},
				_CURRENT_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				_HIGHEST_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Date": "2018-06-01",
					"@_Type": "CollectionOrChargeOff",
				},
				_LATE_COUNT: {
					"@_30Days": "02",
					"@_60Days": "01",
					"@_90Days": "01",
				},
				_MOST_RECENT_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Date": "2018-07-31",
					"@_Type": "CollectionOrChargeOff",
				},
				_PAYMENT_PATTERN: {
					"@_Data":
						"999999999999999999999999999999999999999999999999999999321CC1CCCCCCCCCC",
					"@_StartDate": "2022-12-24",
				},
				CREDIT_COMMENT: [
					{
						"@_SourceType": "TransUnion",
						"@_Type": "BureauRemarks",
						"@_Code": "PRL",
						_Text: "PROFIT AND LOSS WRITEOFF",
					},
					{
						"@_SourceType": "TransUnion",
						"@_Type": "Other",
						"@_TypeOtherDescription": "Handle",
						"@_Code": "TR01_-1777782269_-1738925364_73",
					},
					{
						"@_SourceType": "TransUnion",
						"@_Type": "Other",
						"@_TypeOtherDescripton": "TrendedData",
						_Text: "<CREDIT_LIABILITY_PRIOR_INFORMATIONS>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-04/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000014524/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000011819/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000011674/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000011819/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000011674/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000011819/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000011678/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000011819/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000011674/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000011819/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000011678/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-04/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000011819/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000011674/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000011819/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000011688/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000011819/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000011674/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>000011819/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>000029415/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>000011674/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>000000000/>\n\t\t\t\t\t\t<CreditLiabilityComment2>PRL/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATIONS>",
					},
				],
				CREDIT_REPOSITORY: {
					"@_SourceType": "TransUnion",
					"@_SubscriberCode": "045WK001",
				},
			},
			{
				"@CreditLiabilityID": "TRADE004",
				"@BorrowerID": "Borrower01",
				"@CreditFileID": "RA01",
				"@CreditTradeReferenceID": "Secondary",
				"@_AccountBalanceDate": "2023-01-23",
				"@_AccountIdentifier": "252655XX",
				"@_AccountOpenedDate": "2017-03-09",
				"@_AccountOwnershipType": "JointContractualLiability",
				"@_AccountReportedDate": "2023-01-23",
				"@_AccountStatusDate": "2018-07-01",
				"@_AccountStatusType": "Closed",
				"@_AccountType": "Installment",
				"@_ChargeOffDate": "2018-07-01",
				"@_ConsumerDisputeIndicator": "N",
				"@_DerogatoryDataIndicator": "Y",
				"@_HighBalanceAmount": "29415",
				"@_LastActivityDate": "2018-07-01",
				"@_MonthsReviewedCount": "71",
				"@_TermsMonthsCount": "73",
				"@_TermsDescription": "73 M",
				"@_TermsSourceType": "Provided",
				"@_UnpaidBalanceAmount": "14524",
				"@CreditBusinessType": "Finance",
				"@CreditLoanType": "Automobile",
				"@CreditLoanTypeCode": "00",
				"@_OriginalBalanceAmount": "29415",
				"@IsMortgageIndicator": "N",
				"@IsClosedIndicator": "Y",
				"@IsCollectionIndicator": "N",
				"@IsChargeoffIndicator": "Y",
				"@RawAccountType": "I",
				"@RawIndustryText": "AutomobileFinancingCompany",
				"@RawIndustryCode": "FA",
				"@TradelineHashComplex": "b809a9b3cf18627cbfabc9069ec19eec",
				"@TradelineHashSimple": "2a9bc7235f907627412ef48c9abbc56b",
				"@ArrayAccountIdentifier": "d9e10e47cff3c18e690d8ccab7a7068e",
				_CREDITOR: {
					"@_Name": "CARMAX AUTO FINANCE",
					"@_StreetAddress": "12800 TUCKAHOE CREEK PKW",
					"@_City": "RICHMOND",
					"@_State": "VA",
					"@_PostalCode": "23238",
					"@_Phone": "8009253612",
					CONTACT_DETAIL: {
						CONTACT_POINT: {
							"@_Type": "Phone",
							"@_Value": "8009253612",
						},
					},
				},
				_CURRENT_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				_HIGHEST_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				_LATE_COUNT: {
					"@_30Days": "2",
					"@_60Days": "1",
					"@_90Days": "1",
				},
				_MOST_RECENT_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Date": "2018-07-01",
					"@_Type": "CollectionOrChargeOff",
				},
				_PAYMENT_PATTERN: {
					"@_Data":
						"9999999999999999999999999999999999999999999999999999999321CC1CCCCCCCCCC",
					"@_StartDate": "2023-01-23",
				},
				CREDIT_COMMENT: {
					"@_SourceType": "Experian",
					"@_Type": "StatusCode",
					"@_Code": "97",
					_Text: "UNPAID BALANCE REPORTED AS A LOSS BY CREDIT GRANTOR",
				},
				CREDIT_REPOSITORY: {
					"@_SourceType": "Experian",
				},
			},
			{
				"@CreditLiabilityID": "TRADE005",
				"@BorrowerID": "Borrower01",
				"@CreditFileID": "TA01 RA01 EA01",
				"@CreditTradeReferenceID": "Primary",
				"@_AccountBalanceDate": "2023-02-01",
				"@_AccountIdentifier": "17210711",
				"@_AccountOpenedDate": "2018-10-09",
				"@_AccountOwnershipType": "Individual",
				"@_AccountReportedDate": "2023-02-01",
				"@_AccountStatusDate": "2018-10-01",
				"@_AccountStatusType": "Open",
				"@_AccountType": "Open",
				"@_ConsumerDisputeIndicator": "N",
				"@_DerogatoryDataIndicator": "Y",
				"@_HighBalanceAmount": "300",
				"@_LastActivityDate": "2023-01-29",
				"@_MonthsReviewedCount": "50",
				"@_OriginalCreditorName": "COMCAST CABLE",
				"@_TermsMonthsCount": "1",
				"@_TermsDescription": "1M",
				"@_TermsSourceType": "Provided",
				"@_UnpaidBalanceAmount": "300",
				"@CreditBusinessType": "CollectionServices",
				"@CreditLoanType": "CollectionAttorney",
				"@_OriginalBalanceAmount": "300",
				"@IsMortgageIndicator": "N",
				"@IsClosedIndicator": "N",
				"@IsCollectionIndicator": "Y",
				"@IsChargeoffIndicator": "N",
				"@CollectionDate": "2018-10",
				"@LastPaymentDate": "2023-01-29",
				"@RawAccountStatus": "O",
				"@RawAccountType": "O",
				"@RawIndustryText": "OtherCollectionAgencies",
				"@RawIndustryCode": "YC",
				"@TradelineHashComplex": "80d499261a13497bf580d5d5254ece2d",
				"@TradelineHashSimple": "b67d97a9147e93134173e3444d7327f4",
				"@ArrayAccountIdentifier": "b0661e1144b3bccdc519af63c0ec866a",
				"@TUI_Handle": "TR01_-1750350132_-970824011_89",
				_CREDITOR: {
					"@_Name": "CREDIT MANAGEMENT LP",
					"@_StreetAddress": "6080 TENNYSON PKWY STE 1",
					"@_City": "PLANO",
					"@_State": "TX",
					"@_PostalCode": "75024",
					"@_Phone": "8003777723",
					CONTACT_DETAIL: {
						CONTACT_POINT: {
							"@_Type": "Phone",
							"@_Value": "8003777723",
						},
					},
				},
				_CURRENT_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				_HIGHEST_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				_MOST_RECENT_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Date": "2023-01-29",
					"@_Type": "CollectionOrChargeOff",
				},
				_PAYMENT_PATTERN: {
					"@_Data":
						"99999999999999999999999999999999999999999999999999",
					"@_StartDate": "2023-02-01",
				},
				CREDIT_COMMENT: [
					{
						"@_SourceType": "Experian",
						"@_Type": "StatusCode",
						"@_Code": "93",
						_Text: "ACCOUNT SERIOUSLY PAST DUE DATE/ACCOUNT ASSIGNED TO ATTORNEY, COLLECTION AGENCY, OR CREDIT GRANTOR'S INTERNAL COLLECTION DEPARTMENT",
					},
					{
						"@_SourceType": "TransUnion",
						"@_Type": "Other",
						"@_TypeOtherDescription": "Handle",
						"@_Code": "TR01_-1750350132_-970824011_89",
					},
				],
				CREDIT_REPOSITORY: [
					{
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "0523B001",
					},
					{
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "682YC05551",
					},
					{
						"@_SourceType": "Experian",
					},
				],
			},
			{
				"@CreditLiabilityID": "TRADE006",
				"@BorrowerID": "Borrower01",
				"@CreditFileID": "TA01",
				"@CreditTradeReferenceID": "Secondary",
				"@_AccountIdentifier": "17210711",
				"@_AccountOpenedDate": "2018-10-09",
				"@_AccountOwnershipType": "Individual",
				"@_AccountReportedDate": "2023-01-29",
				"@_AccountStatusType": "Open",
				"@_AccountType": "Open",
				"@_ConsumerDisputeIndicator": "N",
				"@_DerogatoryDataIndicator": "Y",
				"@_HighBalanceAmount": "300",
				"@_LastActivityDate": "2023-01-29",
				"@_OriginalCreditorName": "COMCAST CABLE",
				"@_UnpaidBalanceAmount": "300",
				"@CreditBusinessType": "CollectionServices",
				"@_OriginalBalanceAmount": "000000300",
				"@IsMortgageIndicator": "N",
				"@IsClosedIndicator": "N",
				"@IsCollectionIndicator": "Y",
				"@IsChargeoffIndicator": "N",
				"@CollectionDate": "2018-10",
				"@RawAccountStatus": "O",
				"@RawAccountType": "O",
				"@RawIndustryText": "OtherCollectionAgencies",
				"@RawIndustryCode": "YC",
				"@TradelineHashComplex": "80d499261a13497bf580d5d5254ece2d",
				"@TradelineHashSimple": "b67d97a9147e93134173e3444d7327f4",
				"@ArrayAccountIdentifier": "b0661e1144b3bccdc519af63c0ec866a",
				"@TUI_Handle": "TR01_-1750350132_-970824011_89",
				_CREDITOR: {
					"@_Name": "CREDIT MGMT",
					"@_StreetAddress": "6080 TENNYSON PARKWAY",
					"@_City": "PLANO",
					"@_State": "TX",
					"@_PostalCode": "75024",
					"@_Phone": "8777417302",
					CONTACT_DETAIL: {
						CONTACT_POINT: {
							"@_Type": "Phone",
							"@_Value": "8777417302",
						},
					},
				},
				_CURRENT_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				_HIGHEST_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				_MOST_RECENT_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Date": "2023-01-29",
					"@_Type": "CollectionOrChargeOff",
				},
				CREDIT_COMMENT: [
					{
						"@_SourceType": "TransUnion",
						"@_Type": "BureauRemarks",
						"@_Code": "CLA",
						_Text: "PLACED FOR COLLECTION",
					},
					{
						"@_SourceType": "TransUnion",
						"@_Type": "Other",
						"@_TypeOtherDescription": "Handle",
						"@_Code": "TR01_-1750350132_-970824011_89",
					},
				],
				CREDIT_REPOSITORY: {
					"@_SourceType": "TransUnion",
					"@_SubscriberCode": "0523B001",
				},
			},
			{
				"@CreditLiabilityID": "TRADE007",
				"@BorrowerID": "Borrower01",
				"@CreditFileID": "RA01",
				"@CreditTradeReferenceID": "Secondary",
				"@_AccountBalanceDate": "2023-02-01",
				"@_AccountIdentifier": "172107XX",
				"@_AccountOpenedDate": "2018-10-09",
				"@_AccountOwnershipType": "Individual",
				"@_AccountReportedDate": "2023-02-01",
				"@_AccountStatusDate": "2018-10-01",
				"@_AccountStatusType": "Closed",
				"@_AccountType": "Installment",
				"@_ConsumerDisputeIndicator": "N",
				"@_DerogatoryDataIndicator": "Y",
				"@_HighBalanceAmount": "300",
				"@_LastActivityDate": "2018-10-01",
				"@_MonthsReviewedCount": "50",
				"@_OriginalCreditorName": "COMCAST CABLE",
				"@_TermsMonthsCount": "1",
				"@_TermsDescription": "1 M",
				"@_TermsSourceType": "Provided",
				"@_UnpaidBalanceAmount": "300",
				"@CreditBusinessType": "CollectionServices",
				"@CreditLoanType": "CollectionAttorney",
				"@CreditLoanTypeCode": "48",
				"@_OriginalBalanceAmount": "300",
				"@IsMortgageIndicator": "N",
				"@IsClosedIndicator": "Y",
				"@IsCollectionIndicator": "Y",
				"@IsChargeoffIndicator": "N",
				"@CollectionDate": "2018-10",
				"@RawIndustryText": "OtherCollectionAgencies",
				"@RawIndustryCode": "YC",
				"@TradelineHashComplex": "e4add0ee5b0fba8373f1f1fe7954c477",
				"@TradelineHashSimple": "4e3e7b796ac18a541f423ff0766b13cc",
				"@ArrayAccountIdentifier": "b0661e1144b3bccdc519af63c0ec866a",
				_CREDITOR: {
					"@_Name": "CREDIT MANAGEMENT LP",
					"@_StreetAddress": "6080 TENNYSON PKWY STE 1",
					"@_City": "PLANO",
					"@_State": "TX",
					"@_PostalCode": "75024",
					"@_Phone": "8003777723",
					CONTACT_DETAIL: {
						CONTACT_POINT: {
							"@_Type": "Phone",
							"@_Value": "8003777723",
						},
					},
				},
				_CURRENT_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				_HIGHEST_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				_LATE_COUNT: {
					"@_30Days": "0",
					"@_60Days": "0",
					"@_90Days": "0",
				},
				_MOST_RECENT_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Date": "2018-10-01",
					"@_Type": "CollectionOrChargeOff",
				},
				_PAYMENT_PATTERN: {
					"@_Data":
						"99999999999999999999999999999999999999999999999999",
					"@_StartDate": "2023-02-01",
				},
				CREDIT_COMMENT: {
					"@_SourceType": "Experian",
					"@_Type": "StatusCode",
					"@_Code": "93",
					_Text: "ACCOUNT SERIOUSLY PAST DUE DATE/ACCOUNT ASSIGNED TO ATTORNEY, COLLECTION AGENCY, OR CREDIT GRANTOR'S INTERNAL COLLECTION DEPARTMENT",
				},
				CREDIT_REPOSITORY: {
					"@_SourceType": "Experian",
				},
			},
			{
				"@CreditLiabilityID": "TRADE008",
				"@BorrowerID": "Borrower01",
				"@CreditFileID": "EA01",
				"@CreditTradeReferenceID": "Secondary",
				"@_AccountIdentifier": "17210711",
				"@_AccountOpenedDate": "2018-10-09",
				"@_AccountOwnershipType": "Individual",
				"@_AccountReportedDate": "2023-01-29",
				"@_AccountStatusType": "Open",
				"@_AccountType": "Installment",
				"@_ConsumerDisputeIndicator": "N",
				"@_DerogatoryDataIndicator": "Y",
				"@_HighBalanceAmount": "300",
				"@_LastActivityDate": "2023-01-29",
				"@_OriginalCreditorName": "COMCAST CABLE",
				"@_UnpaidBalanceAmount": "300",
				"@CreditBusinessType": "CollectionServices",
				"@_OriginalBalanceAmount": "000000300",
				"@IsMortgageIndicator": "N",
				"@IsClosedIndicator": "N",
				"@IsCollectionIndicator": "Y",
				"@IsChargeoffIndicator": "N",
				"@CollectionDate": "2018-10",
				"@LastPaymentDate": "2023-01-29",
				"@RawIndustryText": "OtherCollectionServices",
				"@RawIndustryCode": "YC",
				"@TradelineHashComplex": "60336b323e74b6646ac58b6dd4e07a87",
				"@TradelineHashSimple": "cff88cffcf25a21f5f124be0ae5a9242",
				"@ArrayAccountIdentifier": "b0661e1144b3bccdc519af63c0ec866a",
				_CREDITOR: {
					"@_Name": "CREDIT MANAGEMENT",
					"@_StreetAddress": "6080 TENNYSON PARKWAY",
					"@_City": "PLANO",
					"@_State": "TX",
					"@_PostalCode": "75024",
					"@_Phone": "8003777723",
					CONTACT_DETAIL: {
						CONTACT_POINT: {
							"@_Type": "Phone",
							"@_Value": "8003777723",
						},
					},
				},
				_CURRENT_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				_HIGHEST_ADVERSE_RATING: {
					"@_Code": "9",
					"@_Type": "CollectionOrChargeOff",
				},
				CREDIT_REPOSITORY: {
					"@_SourceType": "Equifax",
					"@_SubscriberCode": "682YC05551",
				},
			},
		],
		CREDIT_FILE: [
			{
				"@CreditFileID": "TA01",
				"@BorrowerID": "Borrower01",
				"@CreditScoreID": "SCORE001",
				"@CreditRepositorySourceType": "TransUnion",
				"@_InfileDate": "2023-02-08",
				"@_ResultStatusType": "FileReturned",
				_ALERT_MESSAGE: [
					{
						"@_CategoryType": "FACTAAddressDiscrepancy",
						"@_Type": "Other",
						"@_TypeOtherDescription": "Facta Address",
						"@_Code": "1",
						_Text: "FACTA ADDRESS MISMATCH ALERT, CURRENT ADDRESS INPUT DOES NOT MATCH FILE",
					},
					{
						"@_Type": "TransUnionHighRiskFraudAlert",
						"@_Code": "H01",
						_Text: "Available and clear",
					},
				],
				_BORROWER: {
					"@_UnparsedName": "DANIEL ARZUAGA VAZQUEZ",
					"@_BirthDate": "1989-09-28",
					"@_FirstName": "DANIEL",
					"@_LastName": "ARZUAGA VAZQUEZ",
					"@_SSN": "XXXXXXXXX",
					_ALIAS: {
						"@_UnparsedName": "ARZUAGA,DANIEL",
						"@_FirstName": "DANIEL",
						"@_LastName": "ARZUAGA",
					},
					_RESIDENCE: [
						{
							"@BorrowerResidencyType": "Current",
							"@_StreetAddress": "15176 SW 63RD TE",
							"@_City": "MIAMI",
							"@_State": "FL",
							"@_PostalCode": "331932052",
							"@BorrowerResidencyDurationYears": "15",
							"@BorrowerResidencyDurationMonths": "6",
							"@_DateReported": "2007-08-10",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "511 75TH ST APT 1",
							"@_City": "MIAMI BEACH",
							"@_State": "FL",
							"@_PostalCode": "331412376",
							"@BorrowerResidencyDurationYears": "11",
							"@BorrowerResidencyDurationMonths": "10",
							"@_DateReported": "2011-04-30",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "415 N FRONT ST APT 210",
							"@_City": "COLUMBUS",
							"@_State": "OH",
							"@_PostalCode": "432152271",
							"@BorrowerResidencyDurationYears": "11",
							"@BorrowerResidencyDurationMonths": "10",
							"@_DateReported": "2011-04-02",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "1150 SW 132ND TE",
							"@_City": "OCALA",
							"@_State": "FL",
							"@_PostalCode": "344814076",
							"@BorrowerResidencyDurationYears": "5",
							"@BorrowerResidencyDurationMonths": "11",
							"@_DateReported": "2017-03-31",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "26641 SW 127TH AV",
							"@_City": "HOMESTEAD",
							"@_State": "FL",
							"@_PostalCode": "330327961",
							"@BorrowerResidencyDurationYears": "9",
							"@BorrowerResidencyDurationMonths": "3",
							"@_DateReported": "2013-11-16",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "415 N FRONT ST APT 10",
							"@_City": "COLUMBUS",
							"@_State": "OH",
							"@_PostalCode": "432152270",
							"@BorrowerResidencyDurationYears": "10",
							"@_DateReported": "2013-02-04",
						},
					],
				},
				_VARIATION: {
					"@_Type": "DifferentName",
				},
			},
			{
				"@CreditFileID": "RA01",
				"@BorrowerID": "Borrower01",
				"@CreditScoreID": "SCORE002",
				"@CreditRepositorySourceType": "Experian",
				"@_InfileDate": "2023-02-08",
				"@_ResultStatusType": "FileReturned",
				_BORROWER: {
					"@_BirthDate": "1989",
					"@_FirstName": "VAZQUEZ",
					"@_MiddleName": "DANIEL",
					"@_LastName": "ARZUAGA",
					_ALIAS: [
						{
							"@_FirstName": "DANIEL",
							"@_LastName": "ARZUAGA",
						},
						{
							"@_FirstName": "DANIEL",
							"@_LastName": "AZUREAGA",
						},
						{
							"@_FirstName": "DANIEL",
							"@_LastName": "VAZQUEZ",
						},
					],
					_RESIDENCE: [
						{
							"@BorrowerResidencyType": "Current",
							"@_StreetAddress": "1150 SW 132ND TER",
							"@_City": "OCALA",
							"@_State": "FL",
							"@_PostalCode": "344814076",
							"@_DateReported": "2017-03-08",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "26641 SW 127TH AVE",
							"@_City": "HOMESTEAD",
							"@_State": "FL",
							"@_PostalCode": "330327961",
							"@_DateReported": "2013-05-06",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "415 N FRONT ST",
							"@_City": "COLUMBUS",
							"@_State": "OH",
							"@_PostalCode": "432152270",
							"@_DateReported": "2010-09-16",
						},
					],
					EMPLOYER: {
						"@_Name": "BIZNOBO",
						"@CurrentEmploymentStartDate": "2017-03-08",
						"@EmploymentCurrentIndicator": "Y",
						"@EmploymentReportedDate": "2017-03-08",
					},
					"@_SSN": "XXXXXXXXX",
				},
				_VARIATION: {
					"@_Type": "DifferentName",
				},
			},
			{
				"@CreditFileID": "EA01",
				"@BorrowerID": "Borrower01",
				"@CreditScoreID": "SCORE003",
				"@CreditRepositorySourceType": "Equifax",
				"@_InfileDate": "2023-02-08",
				"@_ResultStatusType": "FileReturned",
				_ALERT_MESSAGE: {
					"@_CategoryType": "FACTAAddressDiscrepancy",
					"@_Type": "Other",
					"@_TypeOtherDescription": "Facta Address",
					"@_Code": "Y",
					_Text: "- A SUBSTANTIAL DIFFERENCE IN ADDRESS OCCURRED",
				},
				_BORROWER: {
					"@_UnparsedName": "DANIEL ARZUAGA",
					"@_BirthDate": "1989-09-28",
					"@_FirstName": "DANIEL",
					"@_LastName": "ARZUAGA",
					"@_SSN": "XXXXXXXXX",
					_ALIAS: [
						{
							"@_UnparsedName": "DANIEL A VASQUEZ",
							"@_FirstName": "DANIEL A",
							"@_LastName": "VASQUEZ",
						},
						{
							"@_UnparsedName": "DANIEL ARZUAGA VAZQUEZ",
							"@_FirstName": "DANIEL",
							"@_LastName": "ARZUAGA VAZQUEZ",
						},
					],
					_RESIDENCE: [
						{
							"@BorrowerResidencyType": "Current",
							"@_StreetAddress": "1150 SW 132ND TER",
							"@_City": "OCALA",
							"@_State": "FL",
							"@_PostalCode": "34481",
							"@BorrowerResidencyDurationYears": "5",
							"@BorrowerResidencyDurationMonths": "10",
							"@_DateReported": "2023-01-26",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "26641 SW 127TH AVE",
							"@_City": "HOMESTEAD",
							"@_State": "FL",
							"@_PostalCode": "33032",
							"@BorrowerResidencyDurationYears": "9",
							"@BorrowerResidencyDurationMonths": "3",
							"@_DateReported": "2023-01-06",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "2100 SW 150TH CT",
							"@_City": "OCALA",
							"@_State": "FL",
							"@_PostalCode": "34481",
							"@BorrowerResidencyDurationYears": "4",
							"@BorrowerResidencyDurationMonths": "7",
							"@_DateReported": "2020-04-21",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "15176 SW 63RD TER",
							"@_City": "MIAMI",
							"@_State": "FL",
							"@_PostalCode": "33193",
							"@BorrowerResidencyDurationYears": "5",
							"@BorrowerResidencyDurationMonths": "7",
							"@_DateReported": "2017-10-09",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "510 SE 5TH AVE APT 171",
							"@_City": "FORT LAUDERDALE",
							"@_State": "FL",
							"@_PostalCode": "33301",
							"@BorrowerResidencyDurationYears": "6",
							"@_DateReported": "2023-01-30",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "511 75TH ST APT 1",
							"@_City": "MIAMI BEACH",
							"@_State": "FL",
							"@_PostalCode": "33141",
							"@BorrowerResidencyDurationYears": "11",
							"@BorrowerResidencyDurationMonths": "9",
							"@_DateReported": "2013-11-05",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "415 N FRONT ST",
							"@_City": "COLUMBUS",
							"@_State": "OH",
							"@_PostalCode": "43215",
							"@BorrowerResidencyDurationYears": "11",
							"@BorrowerResidencyDurationMonths": "10",
							"@_DateReported": "2017-10-31",
						},
						{
							"@BorrowerResidencyType": "Prior",
							"@_StreetAddress": "1774 DIVIDEND DR",
							"@_City": "COLUMBUS",
							"@_State": "OH",
							"@_PostalCode": "43228",
							"@BorrowerResidencyDurationYears": "12",
							"@BorrowerResidencyDurationMonths": "6",
							"@_DateReported": "2011-03-27",
						},
					],
				},
				_VARIATION: {
					"@_Type": "DifferentName",
				},
			},
		],
		CREDIT_SCORE: [
			{
				"@CreditScoreID": "SCORE001",
				"@BorrowerID": "Borrower01",
				"@CreditFileID": "TA01",
				"@_Date": "2023-02-08",
				"@CreditReportIdentifier": "1874-3FFFD5AA-7022-454",
				"@RiskBasedPricingPercent": "8",
				"@RiskBasedPricingMin": "526",
				"@RiskBasedPricingMax": "532",
				"@_ModelNameType": "Other",
				"@_ModelNameTypeOtherDescription": "TransUnionVantageScore3.0",
				"@_Value": "529",
				"@CreditRepositorySourceType": "TransUnion",
				_FACTOR: [
					{
						"@_Code": "97",
						"@_Text": "You have too few credit accounts",
					},
					{
						"@_Code": "8",
						"@_Text":
							"You have either very few loans or too many loans with recent delinquencies",
					},
					{
						"@_Code": "21",
						"@_Text": "No open accounts in your credit file",
					},
					{
						"@_Code": "95",
						"@_Text":
							"You have too many collection agency accounts that are unpaid",
					},
				],
			},
			{
				"@CreditScoreID": "SCORE002",
				"@BorrowerID": "Borrower01",
				"@CreditFileID": "RA01",
				"@_Date": "2023-02-08",
				"@CreditReportIdentifier": "1874-3FFFD5AA-7022-454",
				"@RiskBasedPricingPercent": "12",
				"@RiskBasedPricingMin": "525",
				"@RiskBasedPricingMax": "529",
				"@_ModelNameType": "Other",
				"@_ModelNameTypeOtherDescription": "ExperianVantageScore3.0",
				"@_Value": "529",
				"@CreditRepositorySourceType": "Experian",
				_FACTOR: [
					{
						"@_Code": "95",
						"@_Text":
							"You have too many collection agency accounts that are unpaid",
					},
					{
						"@_Code": "21",
						"@_Text": "No open accounts in your credit file",
					},
					{
						"@_Code": "8",
						"@_Text":
							"You have either very few loans or too many loans with recent delinquencies",
					},
					{
						"@_Code": "97",
						"@_Text": "You have too few credit accounts",
					},
				],
			},
			{
				"@CreditScoreID": "SCORE003",
				"@BorrowerID": "Borrower01",
				"@CreditFileID": "EA01",
				"@_Date": "2023-02-08",
				"@CreditReportIdentifier": "1874-3FFFD5AA-7022-454",
				"@RiskBasedPricingPercent": "8",
				"@RiskBasedPricingMin": "526",
				"@RiskBasedPricingMax": "532",
				"@_ModelNameType": "Other",
				"@_ModelNameTypeOtherDescription": "EquifaxVantageScore3.0",
				"@_Value": "529",
				"@CreditRepositorySourceType": "Equifax",
				_FACTOR: [
					{
						"@_Code": "97",
						"@_Text": "You have too few credit accounts",
					},
					{
						"@_Code": "8",
						"@_Text":
							"You have either very few loans or too many loans with recent delinquencies",
					},
					{
						"@_Code": "21",
						"@_Text": "No open accounts in your credit file",
					},
					{
						"@_Code": "95",
						"@_Text":
							"You have too many collection agency accounts that are unpaid",
					},
				],
			},
		],
		CREDIT_SUMMARY: [
			{
				"@BorrowerID": "Borrower01",
				"@_Name": "Attributes",
				_DATA_SET: [
					{
						"@_Name": "Number of tradelines",
						"@_ID": "AP001",
						"@_Value": "2",
					},
					{
						"@_Name": "Average age of open tradelines",
						"@_ID": "AP002",
						"@_Value": "52",
					},
					{
						"@_Name":
							"Average age of open tradelines; exclude auth user and joint ecoa",
						"@_ID": "AP003",
						"@_Value": "52",
					},
					{
						"@_Name": "Number of hard inquiries",
						"@_ID": "AP004",
						"@_Value": "0",
					},
					{
						"@_Name": "Number of payments",
						"@_ID": "AP005",
						"@_Value": "15",
					},
					{
						"@_Name": "Revolving utilization on open credit cards",
						"@_ID": "AP006",
						"@_Value": "N/A",
					},
					{
						"@_Name": "Total occurrences of minor delinqs",
						"@_ID": "AP007",
						"@_Value": "4",
					},
					{
						"@_Name": "Total number of major derogatory tradelines",
						"@_ID": "AP008",
						"@_Value": "2",
					},
					{
						"@_Name":
							"Total number of major derogatory tradelines calculated by TU",
						"@_ID": "AP008_RAW",
						"@_Value": "",
					},
					{
						"@_Name": "AT01S:Number of trades",
						"@_ID": "AT01S",
						"@_Value": "2",
					},
					{
						"@_Name": "AT02S:Number of open trades",
						"@_ID": "AT02S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"AT06S:Number of trades opened in past 6 months",
						"@_ID": "AT06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AT09S:Number of trades opened in past 24 months",
						"@_ID": "AT09S",
						"@_Value": "0",
					},
					{
						"@_Name": "AT20S:Months since oldest trade opened",
						"@_ID": "AT20S",
						"@_Value": "71",
					},
					{
						"@_Name":
							"AT28A:Total credit line of open trades verified in past 12 months",
						"@_ID": "AT28A",
						"@_Value": "300",
					},
					{
						"@_Name":
							"AT28B:Total credit line of open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT28B",
						"@_Value": "300",
					},
					{
						"@_Name":
							"AT33A:Total balance of open trades verified in past 12 months",
						"@_ID": "AT33A",
						"@_Value": "300",
					},
					{
						"@_Name":
							"AT33B:Total balance of open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT33B",
						"@_Value": "300",
					},
					{
						"@_Name":
							"AT34A:Utilization for open trades verified in past 12 months",
						"@_ID": "AT34A",
						"@_Value": "100",
					},
					{
						"@_Name":
							"AT34B:Utilization for open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT34B",
						"@_Value": "100",
					},
					{
						"@_Name": "AT36S:Months since most recent delinquency",
						"@_ID": "AT36S",
						"@_Value": "57",
					},
					{
						"@_Name":
							"AT57S:Total past due amount of open trades verified in past 12 months",
						"@_ID": "AT57S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AT103S:Percentage of satisfactory open trades to all open trades",
						"@_ID": "AT103S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AT104S:Percentage of all trades opened in past 24 months to all trades",
						"@_ID": "AT104S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"ATAP01:Total scheduled monthly payment for all trades verified in past 12 months",
						"@_ID": "ATAP01",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AU28S:Total credit line of open auto trades verified in past 12 months",
						"@_ID": "AU28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AU33S:Total balance of open auto trades verified in past 12 months",
						"@_ID": "AU33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AU34S:Utilization for open auto trades verified in past 12 months",
						"@_ID": "AU34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"AU57S:Total past due amount of open auto trades verified in past 12 months",
						"@_ID": "AU57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "BC02S:Number of open credit card trades",
						"@_ID": "BC02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC06S:Number of credit card trades opened in past 6 months",
						"@_ID": "BC06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC102S:Average credit line of open credit card trades verified in past 12 months",
						"@_ID": "BC102S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC12S:Number of open credit card trades verified in past 12 months",
						"@_ID": "BC12S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC20S:Months since oldest credit card trade opened",
						"@_ID": "BC20S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC28S:Total credit line of open credit card trades verified in past 12 months",
						"@_ID": "BC28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC30S:Percentage of open credit card trades > 50% of credit line verified in past 12 months",
						"@_ID": "BC30S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC31S:Percentage of open credit card trades > 75% of credit line verified in past 12 months",
						"@_ID": "BC31S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC33S:Total balance of open credit card trades verified in past 12 months",
						"@_ID": "BC33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC34S:Utilization for open credit card trades verified in past 12 months",
						"@_ID": "BC34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC57S:Total past due amount of open credit card trades verified in past 12 months",
						"@_ID": "BC57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"CO04S:Months since most recent charged-off trade was first reported",
						"@_ID": "CO04S",
						"@_Value": "71",
					},
					{
						"@_Name":
							"FC04S:Months since most recent foreclosure trade was first reported",
						"@_ID": "FC04S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"G020S:Number of trades with maximum delinquency of 30 days past due in past 24 months",
						"@_ID": "G020S",
						"@_Value": "0",
					},
					{
						"@_Name": "G051S:Percentage of trades ever delinquent",
						"@_ID": "G051S",
						"@_Value": "100",
					},
					{
						"@_Name": "G093S:Number of public records",
						"@_ID": "G093S",
						"@_Value": "0",
					},
					{
						"@_Name": "G094S:Number of public record bankruptcies",
						"@_ID": "G094S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G095S:Months since most recent public record",
						"@_ID": "G095S",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"G103S:Months since most recent credit inquiry",
						"@_ID": "G103S",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"G202A:Total open to buy of open trades verified in past 12 months (excl installs and morts)",
						"@_ID": "G202A",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"G215B:Number of non-medical third party collections with balance > $0",
						"@_ID": "G215B",
						"@_Value": "1",
					},
					{
						"@_Name":
							"G217S:Total past due amount of all trades verified in past 12 months",
						"@_ID": "G217S",
						"@_Value": "14524",
					},
					{
						"@_Name":
							"G218B:Number of trades verified in the past 12 months that are currently 30+ DPD",
						"@_ID": "G218B",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G224A:Number of 90 days past due or worse items ever (excluding medical colls)",
						"@_ID": "G224A",
						"@_Value": "2",
					},
					{
						"@_Name":
							"G238S:Number of credit inquiries in past 12 months (excl coll inqs)",
						"@_ID": "G238S",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"G244S:Number of inquiries (includes duplicates) in past 12 months",
						"@_ID": "G244S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G250A:Number of 30 DPD or worse items ever (excluding medical colls)",
						"@_ID": "G250A",
						"@_Value": "2",
					},
					{
						"@_Name":
							"G250B:Number of 30 DPD or worse items in the past 12 months (excluding medical colls)",
						"@_ID": "G250B",
						"@_Value": "2",
					},
					{
						"@_Name":
							"G250C:Number of 30 DPD or worse items in the past 24 months (excluding medical colls)",
						"@_ID": "G250C",
						"@_Value": "2",
					},
					{
						"@_Name":
							"G251A:Number of 60 DPD or worse items ever (excluding medical colls)",
						"@_ID": "G251A",
						"@_Value": "2",
					},
					{
						"@_Name":
							"G302S:Worst rating on revolving trades in past 12 months",
						"@_ID": "G302S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"G304S:Worst rating on installment trades in past 12 months",
						"@_ID": "G304S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"G310S:Worst rating on all trades in past 12 months",
						"@_ID": "G310S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"GB311:Indicates if bankruptcies have been filed",
						"@_ID": "GB311",
						"@_Value": "0",
					},
					{
						"@_Name":
							"HI57S:Total past due amount of open home equity loan trades verified in past 12 months",
						"@_ID": "HI57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"HR57S:Total past due amount of open HELOC trades verified in past 12 months",
						"@_ID": "HR57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "IN02S:Number of open installment trades",
						"@_ID": "IN02S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"IN06S:Number of installment trades opened in past 6 months",
						"@_ID": "IN06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"IN28S:Total credit line of open installment trades verified in past 12 months",
						"@_ID": "IN28S",
						"@_Value": "300",
					},
					{
						"@_Name":
							"IN33S:Total balance of open installment trades verified in past 12 months",
						"@_ID": "IN33S",
						"@_Value": "300",
					},
					{
						"@_Name":
							"IN34S:Utilization for open installment trades verified in past 12 months",
						"@_ID": "IN34S",
						"@_Value": "100",
					},
					{
						"@_Name":
							"IN36S:Months since most recent installment delinquency",
						"@_ID": "IN36S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"IN57S:Total past due amount of open installment trades verified in past 12 months",
						"@_ID": "IN57S",
						"@_Value": "0",
					},
					{
						"@_Name": "MT02S:Number of open mortgage trades",
						"@_ID": "MT02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT06S:Number of mortgage trades opened in past 6 months",
						"@_ID": "MT06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT28S:Total credit line of open mortgage trades verified in past 12 months",
						"@_ID": "MT28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT33S:Total balance of open mortgage trades verified in past 12 months",
						"@_ID": "MT33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT34S:Utilization for open mortgage trades verified in past 12 months",
						"@_ID": "MT34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"MT36S:Months since most recent mortgage delinquency",
						"@_ID": "MT36S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"MT57S:Total past due amount of open mortgage trades verified in past 12 months",
						"@_ID": "MT57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "RE02S:Number of open revolving trades",
						"@_ID": "RE02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE06S:Number of revolving trades opened in past 6 months",
						"@_ID": "RE06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE12S:Number of open revolving trades verified in past 12 months",
						"@_ID": "RE12S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE20S:Months since oldest revolving trade opened",
						"@_ID": "RE20S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE21S:Months since most recent revolving trade opened",
						"@_ID": "RE21S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE28S:Total credit line of open revolving trades verified in past 12 months",
						"@_ID": "RE28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE30S:Percentage of open revolving trades > 50% of credit line verified in past 12 months",
						"@_ID": "RE30S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE31S:Percentage of open revolving trades > 75% of credit line verified in past 12 months",
						"@_ID": "RE31S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE33S:Total balance of open revolving trades verified in past 12 months",
						"@_ID": "RE33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE34S:Utilization for open revolving trades verified in past 12 months",
						"@_ID": "RE34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE34T:Utilization for all bureau open revolving trades verified in past 12 months",
						"@_ID": "RE34T",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE36S:Months since most recent revolving delinquency",
						"@_ID": "RE36S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE57S:Total past due amount of open revolving trades verified in past 12 months",
						"@_ID": "RE57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE102S:Average credit line of open revolving trades verified in past 12 months",
						"@_ID": "RE102S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RP04S:Months since most recent repossession trade was first reported",
						"@_ID": "RP04S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"S004S:Average number of months trades have been on file",
						"@_ID": "S004S",
						"@_Value": "34",
					},
					{
						"@_Name":
							"S043S:Number of open trades > 50% of credit line verified in 12 mons (excl installs and morts)",
						"@_ID": "S043S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"S061S:Months since most recent 60 or more days past due",
						"@_ID": "S061S",
						"@_Value": "57",
					},
					{
						"@_Name":
							"S062S:Months since most recent 90 or more days past due",
						"@_ID": "S062S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "S068A:Number of third party collections",
						"@_ID": "S068A",
						"@_Value": "1",
					},
					{
						"@_Name":
							"S114S:Number of deduped inquiries in past 6 months (excl auto and mortgage inquiries)",
						"@_ID": "S114S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"S204A:Total balance of non-medical third party collections verified in past 12 months",
						"@_ID": "S204A",
						"@_Value": "300",
					},
					{
						"@_Name":
							"S207A:Months since most recent tradeline bankruptcy",
						"@_ID": "S207A",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"S207S:Months since most recent public record bankruptcy",
						"@_ID": "S207S",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"S209A:Months since most recent non-medical third party collection",
						"@_ID": "S209A",
						"@_Value": "52",
					},
					{
						"@_Name":
							"ST28S:Total credit line of open student loan trades verified in past 12 months",
						"@_ID": "ST28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"ST33S:Total balance of open student loan trades verified in past 12 months",
						"@_ID": "ST33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"ST34S:Utilization for open student loan trades verified in past 12 months",
						"@_ID": "ST34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"ST57S:Total past due amount of open student loan trades verified in past 12 months",
						"@_ID": "ST57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT014:Total Scheduled Monthly Payment",
						"@_ID": "PT014",
						"@_Value": "0",
					},
					{
						"@_Name": "PT016:Utilization on revolving trades",
						"@_ID": "PT016",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"PT017:Total balance on open revolving trades",
						"@_ID": "PT017",
						"@_Value": "0",
					},
					{
						"@_Name": "PT019:Total Mortgage Monthly Payment",
						"@_ID": "PT019",
						"@_Value": "-5",
					},
					{
						"@_Name": "PT020:Total balance on open Mortgages",
						"@_ID": "PT020",
						"@_Value": "-5",
					},
					{
						"@_Name": "PT021:Total Monthly Automobile Payment",
						"@_ID": "PT021",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT022:Date of oldest trade",
						"@_ID": "PT022",
						"@_Value": "032017",
					},
					{
						"@_Name": "PT023:Months since infile created at bureau",
						"@_ID": "PT023",
						"@_Value": "150",
					},
					{
						"@_Name":
							"PT027:Total occurrances of delinquencies in past 12 months",
						"@_ID": "PT027",
						"@_Value": "0",
					},
					{
						"@_Name": "PT038:Number of Inquiries in past 6 months",
						"@_ID": "PT038",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT054:Total Credit Limit/High Credit on open tradelines",
						"@_ID": "PT054",
						"@_Value": "300",
					},
					{
						"@_Name": "PT056:Total balance on all tradelines",
						"@_ID": "PT056",
						"@_Value": "14824",
					},
					{
						"@_Name":
							"PT063:Number of currently delinquent tradelines",
						"@_ID": "PT063",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT064:Number of currently delinquent revolving tradelines",
						"@_ID": "PT064",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT065:Number of currently delinquent installment tradelines",
						"@_ID": "PT065",
						"@_Value": "0",
					},
					{
						"@_Name": "PT068:Average balance on open tradelines",
						"@_ID": "PT068",
						"@_Value": "300",
					},
					{
						"@_Name":
							"PT069:Number of Chargeoffs in past 12 months",
						"@_ID": "PT069",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT071:Total occurrances of delinquencies in the past 2 years",
						"@_ID": "PT071",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT072:Total occurrances of delinquencies in the past 30 days",
						"@_ID": "PT072",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT073:Total occurrances of delinquencies in the past 60 days",
						"@_ID": "PT073",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT074:Total occurrances of delinquencies in the past 7 years",
						"@_ID": "PT074",
						"@_Value": "3",
					},
					{
						"@_Name": "PT076:Date of oldest trade",
						"@_ID": "PT076",
						"@_Value": "032017",
					},
					{
						"@_Name":
							"PT079:Number of months since oldest installment tradeline opened",
						"@_ID": "PT079",
						"@_Value": "71",
					},
					{
						"@_Name":
							"PT080:Number of months since oldest revolving tradeline opened",
						"@_ID": "PT080",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT082:Number of months since most recent tradeline opened",
						"@_ID": "PT082",
						"@_Value": "52",
					},
					{
						"@_Name": "PT083:Number of mortgage trades",
						"@_ID": "PT083",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT088:Number of months since 90+ late or worse derogatory",
						"@_ID": "PT088",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT089:Number of tradelines reported in past 2 months and currently 120 days past due",
						"@_ID": "PT089",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT090:Number of tradelines currently 30 days past due",
						"@_ID": "PT090",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT091:Number of tradelines 90+ days past due in past 24 months",
						"@_ID": "PT091",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT092:Number of tradelines opened in past 12 months",
						"@_ID": "PT092",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT093:Percentage of tradelines never delinquent",
						"@_ID": "PT093",
						"@_Value": "50",
					},
					{
						"@_Name":
							"PT094:Number of tradelines ever 120 days past due",
						"@_ID": "PT094",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT095:Number of months since oldest bank installment tradeline",
						"@_ID": "PT095",
						"@_Value": "71",
					},
					{
						"@_Name":
							"PT103:Total credit limit/high credit on open installment tradelines",
						"@_ID": "PT103",
						"@_Value": "300",
					},
					{
						"@_Name":
							"PT104:Number of currently satisfactory tradelines",
						"@_ID": "PT104",
						"@_Value": "0",
					},
					{
						"@_Name": "PT105:Number of revolving tradelines",
						"@_ID": "PT105",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT110:Number of revolving tradelines opened in past 7 years",
						"@_ID": "PT110",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT111:Total credit limit/high credit on open revolving tradelines",
						"@_ID": "PT111",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT112:Total available credit on open bankcard tradelines verified in the last 6 mons",
						"@_ID": "PT112",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT115:Percent of bankcard tradelines gt 75% of credit limit",
						"@_ID": "PT115",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT118:Total credit limit/high credit on open bankcard tradelines",
						"@_ID": "PT118",
						"@_Value": "-5",
					},
					{
						"@_Name": "PT119:Number of bankcard tradelines",
						"@_ID": "PT119",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT120:Number of months since most recent bankcard tradeline opened",
						"@_ID": "PT120",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT121:Number of bankcard tradelines opened in the past 6 months",
						"@_ID": "PT121",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT122:Number of bankcard tradelines never delinquent",
						"@_ID": "PT122",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT125:Number of months since most recent bankcard delinquency",
						"@_ID": "PT125",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT126:Percent utilization on bankcard tradelines",
						"@_ID": "PT126",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT129:Number of Public Records with amount gt 100",
						"@_ID": "PT129",
						"@_Value": "-4",
					},
					{
						"@_Name": "PT130:Number of Tax Liens",
						"@_ID": "PT130",
						"@_Value": "0",
					},
					{
						"@_Name": "PT132:Total amount on Collections",
						"@_ID": "PT132",
						"@_Value": "300",
					},
					{
						"@_Name": "PT133:Number of repossessions",
						"@_ID": "PT133",
						"@_Value": "0",
					},
					{
						"@_Name": "PT134:Number of foreclosures",
						"@_ID": "PT134",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT136:Number of Collections/Chargeoffs in past 24 months; excluding medical",
						"@_ID": "PT136",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT137:Total amount on Collections in past 36 months; excluding medical",
						"@_ID": "PT137",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT138:Number of tradelines active within the past 6 months",
						"@_ID": "PT138",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT139:Number of mortgage tradelines opened in past 6 months",
						"@_ID": "PT139",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT140:Number of open installment tradelines opened within the past 24 months",
						"@_ID": "PT140",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT141:Total occurrances of 30 days late within the past 12 months on Mortgage trades",
						"@_ID": "PT141",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT142:Number of mortgages passed due 30 days or more in the last 6 months",
						"@_ID": "PT142",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT143:Total occurrances of 30 days late within the past 12 months",
						"@_ID": "PT143",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT144:Number of collections with amount gt 500",
						"@_ID": "PT144",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT145:Total balance on unsecured credit card tradelines",
						"@_ID": "PT145",
						"@_Value": "-5",
					},
					{
						"@_Name": "PT146:Total balance on unsecured tradelines",
						"@_ID": "PT146",
						"@_Value": "300",
					},
					{
						"@_Name":
							"PT147:Total amount on Tax Liens filed within the past 36 months",
						"@_ID": "PT147",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT148:Total amount on Judgements filed within the past 36 months",
						"@_ID": "PT148",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT149:Number of Public Records filed in past 24 months",
						"@_ID": "PT149",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT150:Number of non-federal Student Loan tradelines",
						"@_ID": "PT150",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT151:Number of repossessed auto loan tradelines",
						"@_ID": "PT151",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT153:Percent utilization on installment tradelines",
						"@_ID": "PT153",
						"@_Value": "50",
					},
					{
						"@_Name":
							"PT154:Number of revolving tradelines with balance gt 0",
						"@_ID": "PT154",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT155:Number of installment tradelines opened in past 12 months",
						"@_ID": "PT155",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT157:Number of revolving tradelines opened in past 12 months",
						"@_ID": "PT157",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT158:Number of revolving tradelines opened in past 24 months",
						"@_ID": "PT158",
						"@_Value": "-5",
					},
					{
						"@_Name": "PT159:Number of credit union tradelines",
						"@_ID": "PT159",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT160:Percent utilization on all open tradelines",
						"@_ID": "PT160",
						"@_Value": "100",
					},
					{
						"@_Name":
							"PT162:Maximum balance on revolving tradelines",
						"@_ID": "PT162",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT163:Number months since more recent installment tradeline opened",
						"@_ID": "PT163",
						"@_Value": "52",
					},
					{
						"@_Name":
							"PT165:Number of auto tradelines 30 days past due in past 6 months",
						"@_ID": "PT165",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT166:Number of auto tradelines opened in past 6 months",
						"@_ID": "PT166",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT167:Number of retail tradelines opened in past 6 months",
						"@_ID": "PT167",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT168:Number of student loans opened in past 12 months",
						"@_ID": "PT168",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT174:Total amount on Collections; excluding medical",
						"@_ID": "PT174",
						"@_Value": "300",
					},
					{
						"@_Name": "PT175:Total amount on Tax Liens",
						"@_ID": "PT175",
						"@_Value": "-4",
					},
					{
						"@_Name": "PT176:Total amount on Judgements",
						"@_ID": "PT176",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT177:Total credit limit on open credit card trades",
						"@_ID": "PT177",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT178:Total credit limit on open retail trades",
						"@_ID": "PT178",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT179:Total balance on open credit card trades",
						"@_ID": "PT179",
						"@_Value": "0",
					},
					{
						"@_Name": "PT180:Total balance on open retail trades",
						"@_ID": "PT180",
						"@_Value": "0",
					},
					{
						"@_Name": "PT181:Age of oldest trade in months",
						"@_ID": "PT181",
						"@_Value": "71",
					},
					{
						"@_Name":
							"PT182:Total number of open credit card trades",
						"@_ID": "PT182",
						"@_Value": "0",
					},
					{
						"@_Name": "PT183:Total number of open retail trades",
						"@_ID": "PT183",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT184:Total number of trades ever delinquent",
						"@_ID": "PT184",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT185:Total number of tradelines delinquent in the last 6 months",
						"@_ID": "PT185",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT186:Total number of installment tradelines 60 days late or worse in the last 6 months",
						"@_ID": "PT186",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT187:Total balances on currently delinquent tradelines",
						"@_ID": "PT187",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT188:Worst current status on any open tradeline",
						"@_ID": "PT188",
						"@_Value": "9",
					},
					{
						"@_Name":
							"PT189:Worst status in the past 12 months on any mortgage tradeline",
						"@_ID": "PT189",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT190:Total number of closed credit card trades",
						"@_ID": "PT190",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT191:Total number of closed installment trades",
						"@_ID": "PT191",
						"@_Value": "1",
					},
					{
						"@_Name": "PT192:Percent of revolving credit available",
						"@_ID": "PT192",
						"@_Value": "999",
					},
					{
						"@_Name":
							"PT193:Number of loans or credit cards applied for in past 24 months",
						"@_ID": "PT193",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT194:Number of Installment tradelines not delinquent within the last 24 months",
						"@_ID": "PT194",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT195:Max credit limit on open bank credit cards",
						"@_ID": "PT195",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT196:Number of collections with amount gt 0",
						"@_ID": "PT196",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT197:Total Number of delinquent credit card and retail trades in last 6 months",
						"@_ID": "PT197",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT198:Total number of open credit card tradelines with utilization gt 90%",
						"@_ID": "PT198",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT199:Total number of open retail tradelines with utilization gt 90%",
						"@_ID": "PT199",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT200:Number of closed trades; no exclusions",
						"@_ID": "PT200",
						"@_Value": "1",
					},
					{
						"@_Name": "PT201:Number of open trades; no exclusions",
						"@_ID": "PT201",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT202:Total balance on all trades; no exclusions",
						"@_ID": "PT202",
						"@_Value": "14824",
					},
					{
						"@_Name": "Deceased Indicator",
						"@_ID": "AP009",
						"@_Value": "N",
					},
					{
						"@_Name": "Public Record Info",
						"@_ID": "AP010",
						"@_Value": "",
					},
				],
			},
			{
				"@BorrowerID": "Borrower01",
				"@_Name": "TransUnion Credit Summary",
				_DATA_SET: [
					{
						"@_Name": "Number of Public Records",
						"@_Value": "NA ",
					},
					{
						"@_Name": "Number of Collections",
						"@_Value": "000",
					},
					{
						"@_Name": "Number of Negative Trades",
						"@_Value": "001",
					},
					{
						"@_Name": "Trades with any Historical Negative",
						"@_Value": "001",
					},
					{
						"@_Name": "Occurrences of Historical Negatives",
						"@_Value": "012",
					},
					{
						"@_Name": "Number of Inquiries",
						"@_Value": "NA ",
					},
					{
						"@_Name": "Number of Trades",
						"@_Value": "001",
					},
					{
						"@_Name": "Number of Open Trades",
						"@_Value": "NA ",
					},
					{
						"@_Name": "Number of Revolving Trades",
						"@_Value": "NA ",
					},
					{
						"@_Name": "Number of Open Revolving Trades",
						"@_Value": "NA ",
					},
					{
						"@_Name": "Number of Installment Trades",
						"@_Value": "001",
					},
					{
						"@_Name": "Number of Installment Trades",
						"@_Value": "NA ",
					},
					{
						"@_Name": "Number of Mortgage Trades",
						"@_Value": "NA ",
					},
					{
						"@_Name": "Number of Open Mortgage Trades",
						"@_Value": "NA ",
					},
					{
						"@_Name": "Number of Other Trade Accounts",
						"@_Value": "NA ",
					},
					{
						"@_Name": "Number of Other Trade Accounts",
						"@_Value": "NA ",
					},
				],
			},
		],
		CREDIT_SUMMARY_XPN: {
			"@BorrowerID": "Borrower01",
			"@_Name": "Attributes",
			_DATA_SET: [
				{
					"@_Name": "Number of tradelines",
					"@_ID": "AP001",
					"@_Value": "2",
				},
				{
					"@_Name": "Average age of open tradelines",
					"@_ID": "AP002",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"Average age of open tradelines; exclude auth user and joint ecoa",
					"@_ID": "AP003",
					"@_Value": "N/A",
				},
				{
					"@_Name": "Number of hard inquiries",
					"@_ID": "AP004",
					"@_Value": "0",
				},
				{
					"@_Name": "Number of payments",
					"@_ID": "AP005",
					"@_Value": "16",
				},
				{
					"@_Name": "Revolving utilization on open credit cards",
					"@_ID": "AP006",
					"@_Value": "N/A",
				},
				{
					"@_Name": "Total occurrences of minor delinqs",
					"@_ID": "AP007",
					"@_Value": "4",
				},
				{
					"@_Name": "Total number of major derogatory tradelines",
					"@_ID": "AP008",
					"@_Value": "2",
				},
				{
					"@_Name":
						"Total number of major derogatory tradelines calculated by TU",
					"@_ID": "AP008_RAW",
					"@_Value": "",
				},
				{
					"@_Name": "AT01S:Number of trades",
					"@_ID": "AT01S",
					"@_Value": "2",
				},
				{
					"@_Name": "AT02S:Number of open trades",
					"@_ID": "AT02S",
					"@_Value": "0",
				},
				{
					"@_Name": "AT06S:Number of trades opened in past 6 months",
					"@_ID": "AT06S",
					"@_Value": "0",
				},
				{
					"@_Name": "AT09S:Number of trades opened in past 24 months",
					"@_ID": "AT09S",
					"@_Value": "0",
				},
				{
					"@_Name": "AT20S:Months since oldest trade opened",
					"@_ID": "AT20S",
					"@_Value": "71",
				},
				{
					"@_Name":
						"AT28A:Total credit line of open trades verified in past 12 months",
					"@_ID": "AT28A",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AT28B:Total credit line of open trades verified in past 12 months (excl mort and home equity)",
					"@_ID": "AT28B",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AT33A:Total balance of open trades verified in past 12 months",
					"@_ID": "AT33A",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AT33B:Total balance of open trades verified in past 12 months (excl mort and home equity)",
					"@_ID": "AT33B",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AT34A:Utilization for open trades verified in past 12 months",
					"@_ID": "AT34A",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"AT34B:Utilization for open trades verified in past 12 months (excl mort and home equity)",
					"@_ID": "AT34B",
					"@_Value": "N/A",
				},
				{
					"@_Name": "AT36S:Months since most recent delinquency",
					"@_ID": "AT36S",
					"@_Value": "56",
				},
				{
					"@_Name":
						"AT57S:Total past due amount of open trades verified in past 12 months",
					"@_ID": "AT57S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"AT103S:Percentage of satisfactory open trades to all open trades",
					"@_ID": "AT103S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AT104S:Percentage of all trades opened in past 24 months to all trades",
					"@_ID": "AT104S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"ATAP01:Total scheduled monthly payment for all trades verified in past 12 months",
					"@_ID": "ATAP01",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AU28S:Total credit line of open auto trades verified in past 12 months",
					"@_ID": "AU28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AU33S:Total balance of open auto trades verified in past 12 months",
					"@_ID": "AU33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AU34S:Utilization for open auto trades verified in past 12 months",
					"@_ID": "AU34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"AU57S:Total past due amount of open auto trades verified in past 12 months",
					"@_ID": "AU57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "BC02S:Number of open credit card trades",
					"@_ID": "BC02S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC06S:Number of credit card trades opened in past 6 months",
					"@_ID": "BC06S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC102S:Average credit line of open credit card trades verified in past 12 months",
					"@_ID": "BC102S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC12S:Number of open credit card trades verified in past 12 months",
					"@_ID": "BC12S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC20S:Months since oldest credit card trade opened",
					"@_ID": "BC20S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC28S:Total credit line of open credit card trades verified in past 12 months",
					"@_ID": "BC28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC30S:Percentage of open credit card trades > 50% of credit line verified in past 12 months",
					"@_ID": "BC30S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC31S:Percentage of open credit card trades > 75% of credit line verified in past 12 months",
					"@_ID": "BC31S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC33S:Total balance of open credit card trades verified in past 12 months",
					"@_ID": "BC33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC34S:Utilization for open credit card trades verified in past 12 months",
					"@_ID": "BC34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC57S:Total past due amount of open credit card trades verified in past 12 months",
					"@_ID": "BC57S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"CO04S:Months since most recent charged-off trade was first reported",
					"@_ID": "CO04S",
					"@_Value": "55",
				},
				{
					"@_Name":
						"FC04S:Months since most recent foreclosure trade was first reported",
					"@_ID": "FC04S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"G020S:Number of trades with maximum delinquency of 30 days past due in past 24 months",
					"@_ID": "G020S",
					"@_Value": "0",
				},
				{
					"@_Name": "G051S:Percentage of trades ever delinquent",
					"@_ID": "G051S",
					"@_Value": "100",
				},
				{
					"@_Name": "G093S:Number of public records",
					"@_ID": "G093S",
					"@_Value": "0",
				},
				{
					"@_Name": "G094S:Number of public record bankruptcies",
					"@_ID": "G094S",
					"@_Value": "0",
				},
				{
					"@_Name": "G095S:Months since most recent public record",
					"@_ID": "G095S",
					"@_Value": "-4",
				},
				{
					"@_Name": "G103S:Months since most recent credit inquiry",
					"@_ID": "G103S",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"G202A:Total open to buy of open trades verified in past 12 months (excl installs and morts)",
					"@_ID": "G202A",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"G215B:Number of non-medical third party collections with balance > $0",
					"@_ID": "G215B",
					"@_Value": "1",
				},
				{
					"@_Name":
						"G217S:Total past due amount of all trades verified in past 12 months",
					"@_ID": "G217S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"G218B:Number of trades verified in the past 12 months that are currently 30+ DPD",
					"@_ID": "G218B",
					"@_Value": "0",
				},
				{
					"@_Name":
						"G224A:Number of 90 days past due or worse items ever (excluding medical colls)",
					"@_ID": "G224A",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G238S:Number of credit inquiries in past 12 months (excl coll inqs)",
					"@_ID": "G238S",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"G244S:Number of inquiries (includes duplicates) in past 12 months",
					"@_ID": "G244S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"G250A:Number of 30 DPD or worse items ever (excluding medical colls)",
					"@_ID": "G250A",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G250B:Number of 30 DPD or worse items in the past 12 months (excluding medical colls)",
					"@_ID": "G250B",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G250C:Number of 30 DPD or worse items in the past 24 months (excluding medical colls)",
					"@_ID": "G250C",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G251A:Number of 60 DPD or worse items ever (excluding medical colls)",
					"@_ID": "G251A",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G302S:Worst rating on revolving trades in past 12 months",
					"@_ID": "G302S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"G304S:Worst rating on installment trades in past 12 months",
					"@_ID": "G304S",
					"@_Value": "9",
				},
				{
					"@_Name":
						"G310S:Worst rating on all trades in past 12 months",
					"@_ID": "G310S",
					"@_Value": "9",
				},
				{
					"@_Name": "GB311:Indicates if bankruptcies have been filed",
					"@_ID": "GB311",
					"@_Value": "0",
				},
				{
					"@_Name":
						"HI57S:Total past due amount of open home equity loan trades verified in past 12 months",
					"@_ID": "HI57S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"HR57S:Total past due amount of open HELOC trades verified in past 12 months",
					"@_ID": "HR57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "IN02S:Number of open installment trades",
					"@_ID": "IN02S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"IN06S:Number of installment trades opened in past 6 months",
					"@_ID": "IN06S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"IN28S:Total credit line of open installment trades verified in past 12 months",
					"@_ID": "IN28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"IN33S:Total balance of open installment trades verified in past 12 months",
					"@_ID": "IN33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"IN34S:Utilization for open installment trades verified in past 12 months",
					"@_ID": "IN34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"IN36S:Months since most recent installment delinquency",
					"@_ID": "IN36S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"IN57S:Total past due amount of open installment trades verified in past 12 months",
					"@_ID": "IN57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "MT02S:Number of open mortgage trades",
					"@_ID": "MT02S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"MT06S:Number of mortgage trades opened in past 6 months",
					"@_ID": "MT06S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"MT28S:Total credit line of open mortgage trades verified in past 12 months",
					"@_ID": "MT28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"MT33S:Total balance of open mortgage trades verified in past 12 months",
					"@_ID": "MT33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"MT34S:Utilization for open mortgage trades verified in past 12 months",
					"@_ID": "MT34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"MT36S:Months since most recent mortgage delinquency",
					"@_ID": "MT36S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"MT57S:Total past due amount of open mortgage trades verified in past 12 months",
					"@_ID": "MT57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "RE02S:Number of open revolving trades",
					"@_ID": "RE02S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE06S:Number of revolving trades opened in past 6 months",
					"@_ID": "RE06S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE12S:Number of open revolving trades verified in past 12 months",
					"@_ID": "RE12S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE20S:Months since oldest revolving trade opened",
					"@_ID": "RE20S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE21S:Months since most recent revolving trade opened",
					"@_ID": "RE21S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE28S:Total credit line of open revolving trades verified in past 12 months",
					"@_ID": "RE28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE30S:Percentage of open revolving trades > 50% of credit line verified in past 12 months",
					"@_ID": "RE30S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE31S:Percentage of open revolving trades > 75% of credit line verified in past 12 months",
					"@_ID": "RE31S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE33S:Total balance of open revolving trades verified in past 12 months",
					"@_ID": "RE33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE34S:Utilization for open revolving trades verified in past 12 months",
					"@_ID": "RE34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE34T:Utilization for all bureau open revolving trades verified in past 12 months",
					"@_ID": "RE34T",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE36S:Months since most recent revolving delinquency",
					"@_ID": "RE36S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE57S:Total past due amount of open revolving trades verified in past 12 months",
					"@_ID": "RE57S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE102S:Average credit line of open revolving trades verified in past 12 months",
					"@_ID": "RE102S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RP04S:Months since most recent repossession trade was first reported",
					"@_ID": "RP04S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"S004S:Average number of months trades have been on file",
					"@_ID": "S004S",
					"@_Value": "62",
				},
				{
					"@_Name":
						"S043S:Number of open trades > 50% of credit line verified in 12 mons (excl installs and morts)",
					"@_ID": "S043S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"S061S:Months since most recent 60 or more days past due",
					"@_ID": "S061S",
					"@_Value": "56",
				},
				{
					"@_Name":
						"S062S:Months since most recent 90 or more days past due",
					"@_ID": "S062S",
					"@_Value": "56",
				},
				{
					"@_Name": "S068A:Number of third party collections",
					"@_ID": "S068A",
					"@_Value": "1",
				},
				{
					"@_Name":
						"S114S:Number of deduped inquiries in past 6 months (excl auto and mortgage inquiries)",
					"@_ID": "S114S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"S204A:Total balance of non-medical third party collections verified in past 12 months",
					"@_ID": "S204A",
					"@_Value": "300",
				},
				{
					"@_Name":
						"S207A:Months since most recent tradeline bankruptcy",
					"@_ID": "S207A",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"S207S:Months since most recent public record bankruptcy",
					"@_ID": "S207S",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"S209A:Months since most recent non-medical third party collection",
					"@_ID": "S209A",
					"@_Value": "52",
				},
				{
					"@_Name":
						"ST28S:Total credit line of open student loan trades verified in past 12 months",
					"@_ID": "ST28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"ST33S:Total balance of open student loan trades verified in past 12 months",
					"@_ID": "ST33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"ST34S:Utilization for open student loan trades verified in past 12 months",
					"@_ID": "ST34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"ST57S:Total past due amount of open student loan trades verified in past 12 months",
					"@_ID": "ST57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "PT014:Total Scheduled Monthly Payment",
					"@_ID": "PT014",
					"@_Value": "0",
				},
				{
					"@_Name": "PT016:Utilization on revolving trades",
					"@_ID": "PT016",
					"@_Value": "N/A",
				},
				{
					"@_Name": "PT017:Total balance on open revolving trades",
					"@_ID": "PT017",
					"@_Value": "0",
				},
				{
					"@_Name": "PT019:Total Mortgage Monthly Payment",
					"@_ID": "PT019",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT020:Total balance on open Mortgages",
					"@_ID": "PT020",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT021:Total Monthly Automobile Payment",
					"@_ID": "PT021",
					"@_Value": "N/A",
				},
				{
					"@_Name": "PT022:Date of oldest trade",
					"@_ID": "PT022",
					"@_Value": "032017",
				},
				{
					"@_Name": "PT023:Months since infile created at bureau",
					"@_ID": "PT023",
					"@_Value": "150",
				},
				{
					"@_Name":
						"PT027:Total occurrances of delinquencies in past 12 months",
					"@_ID": "PT027",
					"@_Value": "0",
				},
				{
					"@_Name": "PT038:Number of Inquiries in past 6 months",
					"@_ID": "PT038",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT054:Total Credit Limit/High Credit on open tradelines",
					"@_ID": "PT054",
					"@_Value": "0",
				},
				{
					"@_Name": "PT056:Total balance on all tradelines",
					"@_ID": "PT056",
					"@_Value": "14824",
				},
				{
					"@_Name": "PT063:Number of currently delinquent tradelines",
					"@_ID": "PT063",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT064:Number of currently delinquent revolving tradelines",
					"@_ID": "PT064",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT065:Number of currently delinquent installment tradelines",
					"@_ID": "PT065",
					"@_Value": "0",
				},
				{
					"@_Name": "PT068:Average balance on open tradelines",
					"@_ID": "PT068",
					"@_Value": "N/A",
				},
				{
					"@_Name": "PT069:Number of Chargeoffs in past 12 months",
					"@_ID": "PT069",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT071:Total occurrances of delinquencies in the past 2 years",
					"@_ID": "PT071",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT072:Total occurrances of delinquencies in the past 30 days",
					"@_ID": "PT072",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT073:Total occurrances of delinquencies in the past 60 days",
					"@_ID": "PT073",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT074:Total occurrances of delinquencies in the past 7 years",
					"@_ID": "PT074",
					"@_Value": "3",
				},
				{
					"@_Name": "PT076:Date of oldest trade",
					"@_ID": "PT076",
					"@_Value": "032017",
				},
				{
					"@_Name":
						"PT079:Number of months since oldest installment tradeline opened",
					"@_ID": "PT079",
					"@_Value": "71",
				},
				{
					"@_Name":
						"PT080:Number of months since oldest revolving tradeline opened",
					"@_ID": "PT080",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT082:Number of months since most recent tradeline opened",
					"@_ID": "PT082",
					"@_Value": "52",
				},
				{
					"@_Name": "PT083:Number of mortgage trades",
					"@_ID": "PT083",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT088:Number of months since 90+ late or worse derogatory",
					"@_ID": "PT088",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT089:Number of tradelines reported in past 2 months and currently 120 days past due",
					"@_ID": "PT089",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT090:Number of tradelines currently 30 days past due",
					"@_ID": "PT090",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT091:Number of tradelines 90+ days past due in past 24 months",
					"@_ID": "PT091",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT092:Number of tradelines opened in past 12 months",
					"@_ID": "PT092",
					"@_Value": "0",
				},
				{
					"@_Name": "PT093:Percentage of tradelines never delinquent",
					"@_ID": "PT093",
					"@_Value": "50",
				},
				{
					"@_Name":
						"PT094:Number of tradelines ever 120 days past due",
					"@_ID": "PT094",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT095:Number of months since oldest bank installment tradeline",
					"@_ID": "PT095",
					"@_Value": "71",
				},
				{
					"@_Name":
						"PT103:Total credit limit/high credit on open installment tradelines",
					"@_ID": "PT103",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT104:Number of currently satisfactory tradelines",
					"@_ID": "PT104",
					"@_Value": "0",
				},
				{
					"@_Name": "PT105:Number of revolving tradelines",
					"@_ID": "PT105",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT110:Number of revolving tradelines opened in past 7 years",
					"@_ID": "PT110",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT111:Total credit limit/high credit on open revolving tradelines",
					"@_ID": "PT111",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT112:Total available credit on open bankcard tradelines verified in the last 6 mons",
					"@_ID": "PT112",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT115:Percent of bankcard tradelines gt 75% of credit limit",
					"@_ID": "PT115",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT118:Total credit limit/high credit on open bankcard tradelines",
					"@_ID": "PT118",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT119:Number of bankcard tradelines",
					"@_ID": "PT119",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT120:Number of months since most recent bankcard tradeline opened",
					"@_ID": "PT120",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT121:Number of bankcard tradelines opened in the past 6 months",
					"@_ID": "PT121",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT122:Number of bankcard tradelines never delinquent",
					"@_ID": "PT122",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT125:Number of months since most recent bankcard delinquency",
					"@_ID": "PT125",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT126:Percent utilization on bankcard tradelines",
					"@_ID": "PT126",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT129:Number of Public Records with amount gt 100",
					"@_ID": "PT129",
					"@_Value": "-4",
				},
				{
					"@_Name": "PT130:Number of Tax Liens",
					"@_ID": "PT130",
					"@_Value": "0",
				},
				{
					"@_Name": "PT132:Total amount on Collections",
					"@_ID": "PT132",
					"@_Value": "300",
				},
				{
					"@_Name": "PT133:Number of repossessions",
					"@_ID": "PT133",
					"@_Value": "0",
				},
				{
					"@_Name": "PT134:Number of foreclosures",
					"@_ID": "PT134",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT136:Number of Collections/Chargeoffs in past 24 months; excluding medical",
					"@_ID": "PT136",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT137:Total amount on Collections in past 36 months; excluding medical",
					"@_ID": "PT137",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT138:Number of tradelines active within the past 6 months",
					"@_ID": "PT138",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT139:Number of mortgage tradelines opened in past 6 months",
					"@_ID": "PT139",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT140:Number of open installment tradelines opened within the past 24 months",
					"@_ID": "PT140",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT141:Total occurrances of 30 days late within the past 12 months on Mortgage trades",
					"@_ID": "PT141",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT142:Number of mortgages passed due 30 days or more in the last 6 months",
					"@_ID": "PT142",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT143:Total occurrances of 30 days late within the past 12 months",
					"@_ID": "PT143",
					"@_Value": "0",
				},
				{
					"@_Name": "PT144:Number of collections with amount gt 500",
					"@_ID": "PT144",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT145:Total balance on unsecured credit card tradelines",
					"@_ID": "PT145",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT146:Total balance on unsecured tradelines",
					"@_ID": "PT146",
					"@_Value": "300",
				},
				{
					"@_Name":
						"PT147:Total amount on Tax Liens filed within the past 36 months",
					"@_ID": "PT147",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT148:Total amount on Judgements filed within the past 36 months",
					"@_ID": "PT148",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT149:Number of Public Records filed in past 24 months",
					"@_ID": "PT149",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT150:Number of non-federal Student Loan tradelines",
					"@_ID": "PT150",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT151:Number of repossessed auto loan tradelines",
					"@_ID": "PT151",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT153:Percent utilization on installment tradelines",
					"@_ID": "PT153",
					"@_Value": "50",
				},
				{
					"@_Name":
						"PT154:Number of revolving tradelines with balance gt 0",
					"@_ID": "PT154",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT155:Number of installment tradelines opened in past 12 months",
					"@_ID": "PT155",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT157:Number of revolving tradelines opened in past 12 months",
					"@_ID": "PT157",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT158:Number of revolving tradelines opened in past 24 months",
					"@_ID": "PT158",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT159:Number of credit union tradelines",
					"@_ID": "PT159",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT160:Percent utilization on all open tradelines",
					"@_ID": "PT160",
					"@_Value": "N/A",
				},
				{
					"@_Name": "PT162:Maximum balance on revolving tradelines",
					"@_ID": "PT162",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT163:Number months since more recent installment tradeline opened",
					"@_ID": "PT163",
					"@_Value": "52",
				},
				{
					"@_Name":
						"PT165:Number of auto tradelines 30 days past due in past 6 months",
					"@_ID": "PT165",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT166:Number of auto tradelines opened in past 6 months",
					"@_ID": "PT166",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT167:Number of retail tradelines opened in past 6 months",
					"@_ID": "PT167",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT168:Number of student loans opened in past 12 months",
					"@_ID": "PT168",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT174:Total amount on Collections; excluding medical",
					"@_ID": "PT174",
					"@_Value": "300",
				},
				{
					"@_Name": "PT175:Total amount on Tax Liens",
					"@_ID": "PT175",
					"@_Value": "-4",
				},
				{
					"@_Name": "PT176:Total amount on Judgements",
					"@_ID": "PT176",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT177:Total credit limit on open credit card trades",
					"@_ID": "PT177",
					"@_Value": "0",
				},
				{
					"@_Name": "PT178:Total credit limit on open retail trades",
					"@_ID": "PT178",
					"@_Value": "0",
				},
				{
					"@_Name": "PT179:Total balance on open credit card trades",
					"@_ID": "PT179",
					"@_Value": "0",
				},
				{
					"@_Name": "PT180:Total balance on open retail trades",
					"@_ID": "PT180",
					"@_Value": "0",
				},
				{
					"@_Name": "PT181:Age of oldest trade in months",
					"@_ID": "PT181",
					"@_Value": "71",
				},
				{
					"@_Name": "PT182:Total number of open credit card trades",
					"@_ID": "PT182",
					"@_Value": "0",
				},
				{
					"@_Name": "PT183:Total number of open retail trades",
					"@_ID": "PT183",
					"@_Value": "0",
				},
				{
					"@_Name": "PT184:Total number of trades ever delinquent",
					"@_ID": "PT184",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT185:Total number of tradelines delinquent in the last 6 months",
					"@_ID": "PT185",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT186:Total number of installment tradelines 60 days late or worse in the last 6 months",
					"@_ID": "PT186",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT187:Total balances on currently delinquent tradelines",
					"@_ID": "PT187",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT188:Worst current status on any open tradeline",
					"@_ID": "PT188",
					"@_Value": "9",
				},
				{
					"@_Name":
						"PT189:Worst status in the past 12 months on any mortgage tradeline",
					"@_ID": "PT189",
					"@_Value": "0",
				},
				{
					"@_Name": "PT190:Total number of closed credit card trades",
					"@_ID": "PT190",
					"@_Value": "0",
				},
				{
					"@_Name": "PT191:Total number of closed installment trades",
					"@_ID": "PT191",
					"@_Value": "2",
				},
				{
					"@_Name": "PT192:Percent of revolving credit available",
					"@_ID": "PT192",
					"@_Value": "999",
				},
				{
					"@_Name":
						"PT193:Number of loans or credit cards applied for in past 24 months",
					"@_ID": "PT193",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT194:Number of Installment tradelines not delinquent within the last 24 months",
					"@_ID": "PT194",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT195:Max credit limit on open bank credit cards",
					"@_ID": "PT195",
					"@_Value": "0",
				},
				{
					"@_Name": "PT196:Number of collections with amount gt 0",
					"@_ID": "PT196",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT197:Total Number of delinquent credit card and retail trades in last 6 months",
					"@_ID": "PT197",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT198:Total number of open credit card tradelines with utilization gt 90%",
					"@_ID": "PT198",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT199:Total number of open retail tradelines with utilization gt 90%",
					"@_ID": "PT199",
					"@_Value": "0",
				},
				{
					"@_Name": "PT200:Number of closed trades; no exclusions",
					"@_ID": "PT200",
					"@_Value": "2",
				},
				{
					"@_Name": "PT201:Number of open trades; no exclusions",
					"@_ID": "PT201",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT202:Total balance on all trades; no exclusions",
					"@_ID": "PT202",
					"@_Value": "14824",
				},
				{
					"@_Name": "Deceased Indicator",
					"@_ID": "AP009",
					"@_Value": "N",
				},
				{
					"@_Name": "Public Record Info",
					"@_ID": "AP010",
					"@_Value": "",
				},
			],
		},
		CREDIT_SUMMARY_TUI: {
			"@BorrowerID": "Borrower01",
			"@_Name": "Attributes",
			_DATA_SET: [
				{
					"@_Name": "Number of tradelines",
					"@_ID": "AP001",
					"@_Value": "2",
				},
				{
					"@_Name": "Average age of open tradelines",
					"@_ID": "AP002",
					"@_Value": "52",
				},
				{
					"@_Name":
						"Average age of open tradelines; exclude auth user and joint ecoa",
					"@_ID": "AP003",
					"@_Value": "52",
				},
				{
					"@_Name": "Number of hard inquiries",
					"@_ID": "AP004",
					"@_Value": "0",
				},
				{
					"@_Name": "Number of payments",
					"@_ID": "AP005",
					"@_Value": "16",
				},
				{
					"@_Name": "Revolving utilization on open credit cards",
					"@_ID": "AP006",
					"@_Value": "N/A",
				},
				{
					"@_Name": "Total occurrences of minor delinqs",
					"@_ID": "AP007",
					"@_Value": "4",
				},
				{
					"@_Name": "Total number of major derogatory tradelines",
					"@_ID": "AP008",
					"@_Value": "2",
				},
				{
					"@_Name":
						"Total number of major derogatory tradelines calculated by TU",
					"@_ID": "AP008_RAW",
					"@_Value": "",
				},
				{
					"@_Name": "AT01S:Number of trades",
					"@_ID": "AT01S",
					"@_Value": "2",
				},
				{
					"@_Name": "AT02S:Number of open trades",
					"@_ID": "AT02S",
					"@_Value": "1",
				},
				{
					"@_Name": "AT06S:Number of trades opened in past 6 months",
					"@_ID": "AT06S",
					"@_Value": "0",
				},
				{
					"@_Name": "AT09S:Number of trades opened in past 24 months",
					"@_ID": "AT09S",
					"@_Value": "0",
				},
				{
					"@_Name": "AT20S:Months since oldest trade opened",
					"@_ID": "AT20S",
					"@_Value": "71",
				},
				{
					"@_Name":
						"AT28A:Total credit line of open trades verified in past 12 months",
					"@_ID": "AT28A",
					"@_Value": "300",
				},
				{
					"@_Name":
						"AT28B:Total credit line of open trades verified in past 12 months (excl mort and home equity)",
					"@_ID": "AT28B",
					"@_Value": "300",
				},
				{
					"@_Name":
						"AT33A:Total balance of open trades verified in past 12 months",
					"@_ID": "AT33A",
					"@_Value": "300",
				},
				{
					"@_Name":
						"AT33B:Total balance of open trades verified in past 12 months (excl mort and home equity)",
					"@_ID": "AT33B",
					"@_Value": "300",
				},
				{
					"@_Name":
						"AT34A:Utilization for open trades verified in past 12 months",
					"@_ID": "AT34A",
					"@_Value": "100",
				},
				{
					"@_Name":
						"AT34B:Utilization for open trades verified in past 12 months (excl mort and home equity)",
					"@_ID": "AT34B",
					"@_Value": "100",
				},
				{
					"@_Name": "AT36S:Months since most recent delinquency",
					"@_ID": "AT36S",
					"@_Value": "56",
				},
				{
					"@_Name":
						"AT57S:Total past due amount of open trades verified in past 12 months",
					"@_ID": "AT57S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AT103S:Percentage of satisfactory open trades to all open trades",
					"@_ID": "AT103S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AT104S:Percentage of all trades opened in past 24 months to all trades",
					"@_ID": "AT104S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"ATAP01:Total scheduled monthly payment for all trades verified in past 12 months",
					"@_ID": "ATAP01",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AU28S:Total credit line of open auto trades verified in past 12 months",
					"@_ID": "AU28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AU33S:Total balance of open auto trades verified in past 12 months",
					"@_ID": "AU33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AU34S:Utilization for open auto trades verified in past 12 months",
					"@_ID": "AU34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"AU57S:Total past due amount of open auto trades verified in past 12 months",
					"@_ID": "AU57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "BC02S:Number of open credit card trades",
					"@_ID": "BC02S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC06S:Number of credit card trades opened in past 6 months",
					"@_ID": "BC06S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC102S:Average credit line of open credit card trades verified in past 12 months",
					"@_ID": "BC102S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC12S:Number of open credit card trades verified in past 12 months",
					"@_ID": "BC12S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC20S:Months since oldest credit card trade opened",
					"@_ID": "BC20S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC28S:Total credit line of open credit card trades verified in past 12 months",
					"@_ID": "BC28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC30S:Percentage of open credit card trades > 50% of credit line verified in past 12 months",
					"@_ID": "BC30S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC31S:Percentage of open credit card trades > 75% of credit line verified in past 12 months",
					"@_ID": "BC31S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC33S:Total balance of open credit card trades verified in past 12 months",
					"@_ID": "BC33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC34S:Utilization for open credit card trades verified in past 12 months",
					"@_ID": "BC34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC57S:Total past due amount of open credit card trades verified in past 12 months",
					"@_ID": "BC57S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"CO04S:Months since most recent charged-off trade was first reported",
					"@_ID": "CO04S",
					"@_Value": "55",
				},
				{
					"@_Name":
						"FC04S:Months since most recent foreclosure trade was first reported",
					"@_ID": "FC04S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"G020S:Number of trades with maximum delinquency of 30 days past due in past 24 months",
					"@_ID": "G020S",
					"@_Value": "0",
				},
				{
					"@_Name": "G051S:Percentage of trades ever delinquent",
					"@_ID": "G051S",
					"@_Value": "100",
				},
				{
					"@_Name": "G093S:Number of public records",
					"@_ID": "G093S",
					"@_Value": "0",
				},
				{
					"@_Name": "G094S:Number of public record bankruptcies",
					"@_ID": "G094S",
					"@_Value": "0",
				},
				{
					"@_Name": "G095S:Months since most recent public record",
					"@_ID": "G095S",
					"@_Value": "-4",
				},
				{
					"@_Name": "G103S:Months since most recent credit inquiry",
					"@_ID": "G103S",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"G202A:Total open to buy of open trades verified in past 12 months (excl installs and morts)",
					"@_ID": "G202A",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"G215B:Number of non-medical third party collections with balance > $0",
					"@_ID": "G215B",
					"@_Value": "1",
				},
				{
					"@_Name":
						"G217S:Total past due amount of all trades verified in past 12 months",
					"@_ID": "G217S",
					"@_Value": "14524",
				},
				{
					"@_Name":
						"G218B:Number of trades verified in the past 12 months that are currently 30+ DPD",
					"@_ID": "G218B",
					"@_Value": "0",
				},
				{
					"@_Name":
						"G224A:Number of 90 days past due or worse items ever (excluding medical colls)",
					"@_ID": "G224A",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G238S:Number of credit inquiries in past 12 months (excl coll inqs)",
					"@_ID": "G238S",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"G244S:Number of inquiries (includes duplicates) in past 12 months",
					"@_ID": "G244S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"G250A:Number of 30 DPD or worse items ever (excluding medical colls)",
					"@_ID": "G250A",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G250B:Number of 30 DPD or worse items in the past 12 months (excluding medical colls)",
					"@_ID": "G250B",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G250C:Number of 30 DPD or worse items in the past 24 months (excluding medical colls)",
					"@_ID": "G250C",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G251A:Number of 60 DPD or worse items ever (excluding medical colls)",
					"@_ID": "G251A",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G302S:Worst rating on revolving trades in past 12 months",
					"@_ID": "G302S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"G304S:Worst rating on installment trades in past 12 months",
					"@_ID": "G304S",
					"@_Value": "9",
				},
				{
					"@_Name":
						"G310S:Worst rating on all trades in past 12 months",
					"@_ID": "G310S",
					"@_Value": "9",
				},
				{
					"@_Name": "GB311:Indicates if bankruptcies have been filed",
					"@_ID": "GB311",
					"@_Value": "0",
				},
				{
					"@_Name":
						"HI57S:Total past due amount of open home equity loan trades verified in past 12 months",
					"@_ID": "HI57S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"HR57S:Total past due amount of open HELOC trades verified in past 12 months",
					"@_ID": "HR57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "IN02S:Number of open installment trades",
					"@_ID": "IN02S",
					"@_Value": "1",
				},
				{
					"@_Name":
						"IN06S:Number of installment trades opened in past 6 months",
					"@_ID": "IN06S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"IN28S:Total credit line of open installment trades verified in past 12 months",
					"@_ID": "IN28S",
					"@_Value": "300",
				},
				{
					"@_Name":
						"IN33S:Total balance of open installment trades verified in past 12 months",
					"@_ID": "IN33S",
					"@_Value": "300",
				},
				{
					"@_Name":
						"IN34S:Utilization for open installment trades verified in past 12 months",
					"@_ID": "IN34S",
					"@_Value": "100",
				},
				{
					"@_Name":
						"IN36S:Months since most recent installment delinquency",
					"@_ID": "IN36S",
					"@_Value": "1",
				},
				{
					"@_Name":
						"IN57S:Total past due amount of open installment trades verified in past 12 months",
					"@_ID": "IN57S",
					"@_Value": "0",
				},
				{
					"@_Name": "MT02S:Number of open mortgage trades",
					"@_ID": "MT02S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"MT06S:Number of mortgage trades opened in past 6 months",
					"@_ID": "MT06S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"MT28S:Total credit line of open mortgage trades verified in past 12 months",
					"@_ID": "MT28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"MT33S:Total balance of open mortgage trades verified in past 12 months",
					"@_ID": "MT33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"MT34S:Utilization for open mortgage trades verified in past 12 months",
					"@_ID": "MT34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"MT36S:Months since most recent mortgage delinquency",
					"@_ID": "MT36S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"MT57S:Total past due amount of open mortgage trades verified in past 12 months",
					"@_ID": "MT57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "RE02S:Number of open revolving trades",
					"@_ID": "RE02S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE06S:Number of revolving trades opened in past 6 months",
					"@_ID": "RE06S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE12S:Number of open revolving trades verified in past 12 months",
					"@_ID": "RE12S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE20S:Months since oldest revolving trade opened",
					"@_ID": "RE20S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE21S:Months since most recent revolving trade opened",
					"@_ID": "RE21S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE28S:Total credit line of open revolving trades verified in past 12 months",
					"@_ID": "RE28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE30S:Percentage of open revolving trades > 50% of credit line verified in past 12 months",
					"@_ID": "RE30S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE31S:Percentage of open revolving trades > 75% of credit line verified in past 12 months",
					"@_ID": "RE31S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE33S:Total balance of open revolving trades verified in past 12 months",
					"@_ID": "RE33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE34S:Utilization for open revolving trades verified in past 12 months",
					"@_ID": "RE34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE34T:Utilization for all bureau open revolving trades verified in past 12 months",
					"@_ID": "RE34T",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE36S:Months since most recent revolving delinquency",
					"@_ID": "RE36S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE57S:Total past due amount of open revolving trades verified in past 12 months",
					"@_ID": "RE57S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE102S:Average credit line of open revolving trades verified in past 12 months",
					"@_ID": "RE102S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RP04S:Months since most recent repossession trade was first reported",
					"@_ID": "RP04S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"S004S:Average number of months trades have been on file",
					"@_ID": "S004S",
					"@_Value": "34",
				},
				{
					"@_Name":
						"S043S:Number of open trades > 50% of credit line verified in 12 mons (excl installs and morts)",
					"@_ID": "S043S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"S061S:Months since most recent 60 or more days past due",
					"@_ID": "S061S",
					"@_Value": "56",
				},
				{
					"@_Name":
						"S062S:Months since most recent 90 or more days past due",
					"@_ID": "S062S",
					"@_Value": "56",
				},
				{
					"@_Name": "S068A:Number of third party collections",
					"@_ID": "S068A",
					"@_Value": "1",
				},
				{
					"@_Name":
						"S114S:Number of deduped inquiries in past 6 months (excl auto and mortgage inquiries)",
					"@_ID": "S114S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"S204A:Total balance of non-medical third party collections verified in past 12 months",
					"@_ID": "S204A",
					"@_Value": "300",
				},
				{
					"@_Name":
						"S207A:Months since most recent tradeline bankruptcy",
					"@_ID": "S207A",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"S207S:Months since most recent public record bankruptcy",
					"@_ID": "S207S",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"S209A:Months since most recent non-medical third party collection",
					"@_ID": "S209A",
					"@_Value": "52",
				},
				{
					"@_Name":
						"ST28S:Total credit line of open student loan trades verified in past 12 months",
					"@_ID": "ST28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"ST33S:Total balance of open student loan trades verified in past 12 months",
					"@_ID": "ST33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"ST34S:Utilization for open student loan trades verified in past 12 months",
					"@_ID": "ST34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"ST57S:Total past due amount of open student loan trades verified in past 12 months",
					"@_ID": "ST57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "PT014:Total Scheduled Monthly Payment",
					"@_ID": "PT014",
					"@_Value": "0",
				},
				{
					"@_Name": "PT016:Utilization on revolving trades",
					"@_ID": "PT016",
					"@_Value": "N/A",
				},
				{
					"@_Name": "PT017:Total balance on open revolving trades",
					"@_ID": "PT017",
					"@_Value": "0",
				},
				{
					"@_Name": "PT019:Total Mortgage Monthly Payment",
					"@_ID": "PT019",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT020:Total balance on open Mortgages",
					"@_ID": "PT020",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT021:Total Monthly Automobile Payment",
					"@_ID": "PT021",
					"@_Value": "N/A",
				},
				{
					"@_Name": "PT022:Date of oldest trade",
					"@_ID": "PT022",
					"@_Value": "032017",
				},
				{
					"@_Name": "PT023:Months since infile created at bureau",
					"@_ID": "PT023",
					"@_Value": "150",
				},
				{
					"@_Name":
						"PT027:Total occurrances of delinquencies in past 12 months",
					"@_ID": "PT027",
					"@_Value": "0",
				},
				{
					"@_Name": "PT038:Number of Inquiries in past 6 months",
					"@_ID": "PT038",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT054:Total Credit Limit/High Credit on open tradelines",
					"@_ID": "PT054",
					"@_Value": "300",
				},
				{
					"@_Name": "PT056:Total balance on all tradelines",
					"@_ID": "PT056",
					"@_Value": "14824",
				},
				{
					"@_Name": "PT063:Number of currently delinquent tradelines",
					"@_ID": "PT063",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT064:Number of currently delinquent revolving tradelines",
					"@_ID": "PT064",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT065:Number of currently delinquent installment tradelines",
					"@_ID": "PT065",
					"@_Value": "0",
				},
				{
					"@_Name": "PT068:Average balance on open tradelines",
					"@_ID": "PT068",
					"@_Value": "300",
				},
				{
					"@_Name": "PT069:Number of Chargeoffs in past 12 months",
					"@_ID": "PT069",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT071:Total occurrances of delinquencies in the past 2 years",
					"@_ID": "PT071",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT072:Total occurrances of delinquencies in the past 30 days",
					"@_ID": "PT072",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT073:Total occurrances of delinquencies in the past 60 days",
					"@_ID": "PT073",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT074:Total occurrances of delinquencies in the past 7 years",
					"@_ID": "PT074",
					"@_Value": "3",
				},
				{
					"@_Name": "PT076:Date of oldest trade",
					"@_ID": "PT076",
					"@_Value": "032017",
				},
				{
					"@_Name":
						"PT079:Number of months since oldest installment tradeline opened",
					"@_ID": "PT079",
					"@_Value": "71",
				},
				{
					"@_Name":
						"PT080:Number of months since oldest revolving tradeline opened",
					"@_ID": "PT080",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT082:Number of months since most recent tradeline opened",
					"@_ID": "PT082",
					"@_Value": "52",
				},
				{
					"@_Name": "PT083:Number of mortgage trades",
					"@_ID": "PT083",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT088:Number of months since 90+ late or worse derogatory",
					"@_ID": "PT088",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT089:Number of tradelines reported in past 2 months and currently 120 days past due",
					"@_ID": "PT089",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT090:Number of tradelines currently 30 days past due",
					"@_ID": "PT090",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT091:Number of tradelines 90+ days past due in past 24 months",
					"@_ID": "PT091",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT092:Number of tradelines opened in past 12 months",
					"@_ID": "PT092",
					"@_Value": "0",
				},
				{
					"@_Name": "PT093:Percentage of tradelines never delinquent",
					"@_ID": "PT093",
					"@_Value": "50",
				},
				{
					"@_Name":
						"PT094:Number of tradelines ever 120 days past due",
					"@_ID": "PT094",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT095:Number of months since oldest bank installment tradeline",
					"@_ID": "PT095",
					"@_Value": "71",
				},
				{
					"@_Name":
						"PT103:Total credit limit/high credit on open installment tradelines",
					"@_ID": "PT103",
					"@_Value": "300",
				},
				{
					"@_Name":
						"PT104:Number of currently satisfactory tradelines",
					"@_ID": "PT104",
					"@_Value": "0",
				},
				{
					"@_Name": "PT105:Number of revolving tradelines",
					"@_ID": "PT105",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT110:Number of revolving tradelines opened in past 7 years",
					"@_ID": "PT110",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT111:Total credit limit/high credit on open revolving tradelines",
					"@_ID": "PT111",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT112:Total available credit on open bankcard tradelines verified in the last 6 mons",
					"@_ID": "PT112",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT115:Percent of bankcard tradelines gt 75% of credit limit",
					"@_ID": "PT115",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT118:Total credit limit/high credit on open bankcard tradelines",
					"@_ID": "PT118",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT119:Number of bankcard tradelines",
					"@_ID": "PT119",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT120:Number of months since most recent bankcard tradeline opened",
					"@_ID": "PT120",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT121:Number of bankcard tradelines opened in the past 6 months",
					"@_ID": "PT121",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT122:Number of bankcard tradelines never delinquent",
					"@_ID": "PT122",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT125:Number of months since most recent bankcard delinquency",
					"@_ID": "PT125",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT126:Percent utilization on bankcard tradelines",
					"@_ID": "PT126",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT129:Number of Public Records with amount gt 100",
					"@_ID": "PT129",
					"@_Value": "-4",
				},
				{
					"@_Name": "PT130:Number of Tax Liens",
					"@_ID": "PT130",
					"@_Value": "0",
				},
				{
					"@_Name": "PT132:Total amount on Collections",
					"@_ID": "PT132",
					"@_Value": "300",
				},
				{
					"@_Name": "PT133:Number of repossessions",
					"@_ID": "PT133",
					"@_Value": "0",
				},
				{
					"@_Name": "PT134:Number of foreclosures",
					"@_ID": "PT134",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT136:Number of Collections/Chargeoffs in past 24 months; excluding medical",
					"@_ID": "PT136",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT137:Total amount on Collections in past 36 months; excluding medical",
					"@_ID": "PT137",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT138:Number of tradelines active within the past 6 months",
					"@_ID": "PT138",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT139:Number of mortgage tradelines opened in past 6 months",
					"@_ID": "PT139",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT140:Number of open installment tradelines opened within the past 24 months",
					"@_ID": "PT140",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT141:Total occurrances of 30 days late within the past 12 months on Mortgage trades",
					"@_ID": "PT141",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT142:Number of mortgages passed due 30 days or more in the last 6 months",
					"@_ID": "PT142",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT143:Total occurrances of 30 days late within the past 12 months",
					"@_ID": "PT143",
					"@_Value": "0",
				},
				{
					"@_Name": "PT144:Number of collections with amount gt 500",
					"@_ID": "PT144",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT145:Total balance on unsecured credit card tradelines",
					"@_ID": "PT145",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT146:Total balance on unsecured tradelines",
					"@_ID": "PT146",
					"@_Value": "14824",
				},
				{
					"@_Name":
						"PT147:Total amount on Tax Liens filed within the past 36 months",
					"@_ID": "PT147",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT148:Total amount on Judgements filed within the past 36 months",
					"@_ID": "PT148",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT149:Number of Public Records filed in past 24 months",
					"@_ID": "PT149",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT150:Number of non-federal Student Loan tradelines",
					"@_ID": "PT150",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT151:Number of repossessed auto loan tradelines",
					"@_ID": "PT151",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT153:Percent utilization on installment tradelines",
					"@_ID": "PT153",
					"@_Value": "50",
				},
				{
					"@_Name":
						"PT154:Number of revolving tradelines with balance gt 0",
					"@_ID": "PT154",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT155:Number of installment tradelines opened in past 12 months",
					"@_ID": "PT155",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT157:Number of revolving tradelines opened in past 12 months",
					"@_ID": "PT157",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT158:Number of revolving tradelines opened in past 24 months",
					"@_ID": "PT158",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT159:Number of credit union tradelines",
					"@_ID": "PT159",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT160:Percent utilization on all open tradelines",
					"@_ID": "PT160",
					"@_Value": "100",
				},
				{
					"@_Name": "PT162:Maximum balance on revolving tradelines",
					"@_ID": "PT162",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT163:Number months since more recent installment tradeline opened",
					"@_ID": "PT163",
					"@_Value": "52",
				},
				{
					"@_Name":
						"PT165:Number of auto tradelines 30 days past due in past 6 months",
					"@_ID": "PT165",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT166:Number of auto tradelines opened in past 6 months",
					"@_ID": "PT166",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT167:Number of retail tradelines opened in past 6 months",
					"@_ID": "PT167",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT168:Number of student loans opened in past 12 months",
					"@_ID": "PT168",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT174:Total amount on Collections; excluding medical",
					"@_ID": "PT174",
					"@_Value": "300",
				},
				{
					"@_Name": "PT175:Total amount on Tax Liens",
					"@_ID": "PT175",
					"@_Value": "-4",
				},
				{
					"@_Name": "PT176:Total amount on Judgements",
					"@_ID": "PT176",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT177:Total credit limit on open credit card trades",
					"@_ID": "PT177",
					"@_Value": "0",
				},
				{
					"@_Name": "PT178:Total credit limit on open retail trades",
					"@_ID": "PT178",
					"@_Value": "0",
				},
				{
					"@_Name": "PT179:Total balance on open credit card trades",
					"@_ID": "PT179",
					"@_Value": "0",
				},
				{
					"@_Name": "PT180:Total balance on open retail trades",
					"@_ID": "PT180",
					"@_Value": "0",
				},
				{
					"@_Name": "PT181:Age of oldest trade in months",
					"@_ID": "PT181",
					"@_Value": "71",
				},
				{
					"@_Name": "PT182:Total number of open credit card trades",
					"@_ID": "PT182",
					"@_Value": "0",
				},
				{
					"@_Name": "PT183:Total number of open retail trades",
					"@_ID": "PT183",
					"@_Value": "0",
				},
				{
					"@_Name": "PT184:Total number of trades ever delinquent",
					"@_ID": "PT184",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT185:Total number of tradelines delinquent in the last 6 months",
					"@_ID": "PT185",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT186:Total number of installment tradelines 60 days late or worse in the last 6 months",
					"@_ID": "PT186",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT187:Total balances on currently delinquent tradelines",
					"@_ID": "PT187",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT188:Worst current status on any open tradeline",
					"@_ID": "PT188",
					"@_Value": "9",
				},
				{
					"@_Name":
						"PT189:Worst status in the past 12 months on any mortgage tradeline",
					"@_ID": "PT189",
					"@_Value": "0",
				},
				{
					"@_Name": "PT190:Total number of closed credit card trades",
					"@_ID": "PT190",
					"@_Value": "0",
				},
				{
					"@_Name": "PT191:Total number of closed installment trades",
					"@_ID": "PT191",
					"@_Value": "1",
				},
				{
					"@_Name": "PT192:Percent of revolving credit available",
					"@_ID": "PT192",
					"@_Value": "999",
				},
				{
					"@_Name":
						"PT193:Number of loans or credit cards applied for in past 24 months",
					"@_ID": "PT193",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT194:Number of Installment tradelines not delinquent within the last 24 months",
					"@_ID": "PT194",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT195:Max credit limit on open bank credit cards",
					"@_ID": "PT195",
					"@_Value": "0",
				},
				{
					"@_Name": "PT196:Number of collections with amount gt 0",
					"@_ID": "PT196",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT197:Total Number of delinquent credit card and retail trades in last 6 months",
					"@_ID": "PT197",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT198:Total number of open credit card tradelines with utilization gt 90%",
					"@_ID": "PT198",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT199:Total number of open retail tradelines with utilization gt 90%",
					"@_ID": "PT199",
					"@_Value": "1",
				},
				{
					"@_Name": "PT200:Number of closed trades; no exclusions",
					"@_ID": "PT200",
					"@_Value": "1",
				},
				{
					"@_Name": "PT201:Number of open trades; no exclusions",
					"@_ID": "PT201",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT202:Total balance on all trades; no exclusions",
					"@_ID": "PT202",
					"@_Value": "14824",
				},
				{
					"@_Name": "Deceased Indicator",
					"@_ID": "AP009",
					"@_Value": "N",
				},
				{
					"@_Name": "Public Record Info",
					"@_ID": "AP010",
					"@_Value": "",
				},
			],
		},
		CREDIT_SUMMARY_EFX: {
			"@BorrowerID": "Borrower01",
			"@_Name": "Attributes",
			_DATA_SET: [
				{
					"@_Name": "Number of tradelines",
					"@_ID": "AP001",
					"@_Value": "2",
				},
				{
					"@_Name": "Average age of open tradelines",
					"@_ID": "AP002",
					"@_Value": "52",
				},
				{
					"@_Name":
						"Average age of open tradelines; exclude auth user and joint ecoa",
					"@_ID": "AP003",
					"@_Value": "52",
				},
				{
					"@_Name": "Number of hard inquiries",
					"@_ID": "AP004",
					"@_Value": "0",
				},
				{
					"@_Name": "Number of payments",
					"@_ID": "AP005",
					"@_Value": "4",
				},
				{
					"@_Name": "Revolving utilization on open credit cards",
					"@_ID": "AP006",
					"@_Value": "N/A",
				},
				{
					"@_Name": "Total occurrences of minor delinqs",
					"@_ID": "AP007",
					"@_Value": "4",
				},
				{
					"@_Name": "Total number of major derogatory tradelines",
					"@_ID": "AP008",
					"@_Value": "2",
				},
				{
					"@_Name":
						"Total number of major derogatory tradelines calculated by TU",
					"@_ID": "AP008_RAW",
					"@_Value": "",
				},
				{
					"@_Name": "AT01S:Number of trades",
					"@_ID": "AT01S",
					"@_Value": "2",
				},
				{
					"@_Name": "AT02S:Number of open trades",
					"@_ID": "AT02S",
					"@_Value": "1",
				},
				{
					"@_Name": "AT06S:Number of trades opened in past 6 months",
					"@_ID": "AT06S",
					"@_Value": "0",
				},
				{
					"@_Name": "AT09S:Number of trades opened in past 24 months",
					"@_ID": "AT09S",
					"@_Value": "0",
				},
				{
					"@_Name": "AT20S:Months since oldest trade opened",
					"@_ID": "AT20S",
					"@_Value": "71",
				},
				{
					"@_Name":
						"AT28A:Total credit line of open trades verified in past 12 months",
					"@_ID": "AT28A",
					"@_Value": "300",
				},
				{
					"@_Name":
						"AT28B:Total credit line of open trades verified in past 12 months (excl mort and home equity)",
					"@_ID": "AT28B",
					"@_Value": "300",
				},
				{
					"@_Name":
						"AT33A:Total balance of open trades verified in past 12 months",
					"@_ID": "AT33A",
					"@_Value": "300",
				},
				{
					"@_Name":
						"AT33B:Total balance of open trades verified in past 12 months (excl mort and home equity)",
					"@_ID": "AT33B",
					"@_Value": "300",
				},
				{
					"@_Name":
						"AT34A:Utilization for open trades verified in past 12 months",
					"@_ID": "AT34A",
					"@_Value": "100",
				},
				{
					"@_Name":
						"AT34B:Utilization for open trades verified in past 12 months (excl mort and home equity)",
					"@_ID": "AT34B",
					"@_Value": "100",
				},
				{
					"@_Name": "AT36S:Months since most recent delinquency",
					"@_ID": "AT36S",
					"@_Value": "56",
				},
				{
					"@_Name":
						"AT57S:Total past due amount of open trades verified in past 12 months",
					"@_ID": "AT57S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AT103S:Percentage of satisfactory open trades to all open trades",
					"@_ID": "AT103S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AT104S:Percentage of all trades opened in past 24 months to all trades",
					"@_ID": "AT104S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"ATAP01:Total scheduled monthly payment for all trades verified in past 12 months",
					"@_ID": "ATAP01",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AU28S:Total credit line of open auto trades verified in past 12 months",
					"@_ID": "AU28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AU33S:Total balance of open auto trades verified in past 12 months",
					"@_ID": "AU33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"AU34S:Utilization for open auto trades verified in past 12 months",
					"@_ID": "AU34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"AU57S:Total past due amount of open auto trades verified in past 12 months",
					"@_ID": "AU57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "BC02S:Number of open credit card trades",
					"@_ID": "BC02S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC06S:Number of credit card trades opened in past 6 months",
					"@_ID": "BC06S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC102S:Average credit line of open credit card trades verified in past 12 months",
					"@_ID": "BC102S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC12S:Number of open credit card trades verified in past 12 months",
					"@_ID": "BC12S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC20S:Months since oldest credit card trade opened",
					"@_ID": "BC20S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC28S:Total credit line of open credit card trades verified in past 12 months",
					"@_ID": "BC28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC30S:Percentage of open credit card trades > 50% of credit line verified in past 12 months",
					"@_ID": "BC30S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC31S:Percentage of open credit card trades > 75% of credit line verified in past 12 months",
					"@_ID": "BC31S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC33S:Total balance of open credit card trades verified in past 12 months",
					"@_ID": "BC33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"BC34S:Utilization for open credit card trades verified in past 12 months",
					"@_ID": "BC34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"BC57S:Total past due amount of open credit card trades verified in past 12 months",
					"@_ID": "BC57S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"CO04S:Months since most recent charged-off trade was first reported",
					"@_ID": "CO04S",
					"@_Value": "71",
				},
				{
					"@_Name":
						"FC04S:Months since most recent foreclosure trade was first reported",
					"@_ID": "FC04S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"G020S:Number of trades with maximum delinquency of 30 days past due in past 24 months",
					"@_ID": "G020S",
					"@_Value": "0",
				},
				{
					"@_Name": "G051S:Percentage of trades ever delinquent",
					"@_ID": "G051S",
					"@_Value": "100",
				},
				{
					"@_Name": "G093S:Number of public records",
					"@_ID": "G093S",
					"@_Value": "0",
				},
				{
					"@_Name": "G094S:Number of public record bankruptcies",
					"@_ID": "G094S",
					"@_Value": "0",
				},
				{
					"@_Name": "G095S:Months since most recent public record",
					"@_ID": "G095S",
					"@_Value": "-4",
				},
				{
					"@_Name": "G103S:Months since most recent credit inquiry",
					"@_ID": "G103S",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"G202A:Total open to buy of open trades verified in past 12 months (excl installs and morts)",
					"@_ID": "G202A",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"G215B:Number of non-medical third party collections with balance > $0",
					"@_ID": "G215B",
					"@_Value": "1",
				},
				{
					"@_Name":
						"G217S:Total past due amount of all trades verified in past 12 months",
					"@_ID": "G217S",
					"@_Value": "14524",
				},
				{
					"@_Name":
						"G218B:Number of trades verified in the past 12 months that are currently 30+ DPD",
					"@_ID": "G218B",
					"@_Value": "0",
				},
				{
					"@_Name":
						"G224A:Number of 90 days past due or worse items ever (excluding medical colls)",
					"@_ID": "G224A",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G238S:Number of credit inquiries in past 12 months (excl coll inqs)",
					"@_ID": "G238S",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"G244S:Number of inquiries (includes duplicates) in past 12 months",
					"@_ID": "G244S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"G250A:Number of 30 DPD or worse items ever (excluding medical colls)",
					"@_ID": "G250A",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G250B:Number of 30 DPD or worse items in the past 12 months (excluding medical colls)",
					"@_ID": "G250B",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G250C:Number of 30 DPD or worse items in the past 24 months (excluding medical colls)",
					"@_ID": "G250C",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G251A:Number of 60 DPD or worse items ever (excluding medical colls)",
					"@_ID": "G251A",
					"@_Value": "2",
				},
				{
					"@_Name":
						"G302S:Worst rating on revolving trades in past 12 months",
					"@_ID": "G302S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"G304S:Worst rating on installment trades in past 12 months",
					"@_ID": "G304S",
					"@_Value": "9",
				},
				{
					"@_Name":
						"G310S:Worst rating on all trades in past 12 months",
					"@_ID": "G310S",
					"@_Value": "9",
				},
				{
					"@_Name": "GB311:Indicates if bankruptcies have been filed",
					"@_ID": "GB311",
					"@_Value": "0",
				},
				{
					"@_Name":
						"HI57S:Total past due amount of open home equity loan trades verified in past 12 months",
					"@_ID": "HI57S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"HR57S:Total past due amount of open HELOC trades verified in past 12 months",
					"@_ID": "HR57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "IN02S:Number of open installment trades",
					"@_ID": "IN02S",
					"@_Value": "1",
				},
				{
					"@_Name":
						"IN06S:Number of installment trades opened in past 6 months",
					"@_ID": "IN06S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"IN28S:Total credit line of open installment trades verified in past 12 months",
					"@_ID": "IN28S",
					"@_Value": "300",
				},
				{
					"@_Name":
						"IN33S:Total balance of open installment trades verified in past 12 months",
					"@_ID": "IN33S",
					"@_Value": "300",
				},
				{
					"@_Name":
						"IN34S:Utilization for open installment trades verified in past 12 months",
					"@_ID": "IN34S",
					"@_Value": "100",
				},
				{
					"@_Name":
						"IN36S:Months since most recent installment delinquency",
					"@_ID": "IN36S",
					"@_Value": "1",
				},
				{
					"@_Name":
						"IN57S:Total past due amount of open installment trades verified in past 12 months",
					"@_ID": "IN57S",
					"@_Value": "0",
				},
				{
					"@_Name": "MT02S:Number of open mortgage trades",
					"@_ID": "MT02S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"MT06S:Number of mortgage trades opened in past 6 months",
					"@_ID": "MT06S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"MT28S:Total credit line of open mortgage trades verified in past 12 months",
					"@_ID": "MT28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"MT33S:Total balance of open mortgage trades verified in past 12 months",
					"@_ID": "MT33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"MT34S:Utilization for open mortgage trades verified in past 12 months",
					"@_ID": "MT34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"MT36S:Months since most recent mortgage delinquency",
					"@_ID": "MT36S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"MT57S:Total past due amount of open mortgage trades verified in past 12 months",
					"@_ID": "MT57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "RE02S:Number of open revolving trades",
					"@_ID": "RE02S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE06S:Number of revolving trades opened in past 6 months",
					"@_ID": "RE06S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE12S:Number of open revolving trades verified in past 12 months",
					"@_ID": "RE12S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE20S:Months since oldest revolving trade opened",
					"@_ID": "RE20S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE21S:Months since most recent revolving trade opened",
					"@_ID": "RE21S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE28S:Total credit line of open revolving trades verified in past 12 months",
					"@_ID": "RE28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE30S:Percentage of open revolving trades > 50% of credit line verified in past 12 months",
					"@_ID": "RE30S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE31S:Percentage of open revolving trades > 75% of credit line verified in past 12 months",
					"@_ID": "RE31S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE33S:Total balance of open revolving trades verified in past 12 months",
					"@_ID": "RE33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"RE34S:Utilization for open revolving trades verified in past 12 months",
					"@_ID": "RE34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE34T:Utilization for all bureau open revolving trades verified in past 12 months",
					"@_ID": "RE34T",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE36S:Months since most recent revolving delinquency",
					"@_ID": "RE36S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE57S:Total past due amount of open revolving trades verified in past 12 months",
					"@_ID": "RE57S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RE102S:Average credit line of open revolving trades verified in past 12 months",
					"@_ID": "RE102S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"RP04S:Months since most recent repossession trade was first reported",
					"@_ID": "RP04S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"S004S:Average number of months trades have been on file",
					"@_ID": "S004S",
					"@_Value": "62",
				},
				{
					"@_Name":
						"S043S:Number of open trades > 50% of credit line verified in 12 mons (excl installs and morts)",
					"@_ID": "S043S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"S061S:Months since most recent 60 or more days past due",
					"@_ID": "S061S",
					"@_Value": "56",
				},
				{
					"@_Name":
						"S062S:Months since most recent 90 or more days past due",
					"@_ID": "S062S",
					"@_Value": "56",
				},
				{
					"@_Name": "S068A:Number of third party collections",
					"@_ID": "S068A",
					"@_Value": "1",
				},
				{
					"@_Name":
						"S114S:Number of deduped inquiries in past 6 months (excl auto and mortgage inquiries)",
					"@_ID": "S114S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"S204A:Total balance of non-medical third party collections verified in past 12 months",
					"@_ID": "S204A",
					"@_Value": "300",
				},
				{
					"@_Name":
						"S207A:Months since most recent tradeline bankruptcy",
					"@_ID": "S207A",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"S207S:Months since most recent public record bankruptcy",
					"@_ID": "S207S",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"S209A:Months since most recent non-medical third party collection",
					"@_ID": "S209A",
					"@_Value": "52",
				},
				{
					"@_Name":
						"ST28S:Total credit line of open student loan trades verified in past 12 months",
					"@_ID": "ST28S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"ST33S:Total balance of open student loan trades verified in past 12 months",
					"@_ID": "ST33S",
					"@_Value": "0",
				},
				{
					"@_Name":
						"ST34S:Utilization for open student loan trades verified in past 12 months",
					"@_ID": "ST34S",
					"@_Value": "N/A",
				},
				{
					"@_Name":
						"ST57S:Total past due amount of open student loan trades verified in past 12 months",
					"@_ID": "ST57S",
					"@_Value": "N/A",
				},
				{
					"@_Name": "PT014:Total Scheduled Monthly Payment",
					"@_ID": "PT014",
					"@_Value": "0",
				},
				{
					"@_Name": "PT016:Utilization on revolving trades",
					"@_ID": "PT016",
					"@_Value": "N/A",
				},
				{
					"@_Name": "PT017:Total balance on open revolving trades",
					"@_ID": "PT017",
					"@_Value": "0",
				},
				{
					"@_Name": "PT019:Total Mortgage Monthly Payment",
					"@_ID": "PT019",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT020:Total balance on open Mortgages",
					"@_ID": "PT020",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT021:Total Monthly Automobile Payment",
					"@_ID": "PT021",
					"@_Value": "N/A",
				},
				{
					"@_Name": "PT022:Date of oldest trade",
					"@_ID": "PT022",
					"@_Value": "032017",
				},
				{
					"@_Name": "PT023:Months since infile created at bureau",
					"@_ID": "PT023",
					"@_Value": "150",
				},
				{
					"@_Name":
						"PT027:Total occurrances of delinquencies in past 12 months",
					"@_ID": "PT027",
					"@_Value": "0",
				},
				{
					"@_Name": "PT038:Number of Inquiries in past 6 months",
					"@_ID": "PT038",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT054:Total Credit Limit/High Credit on open tradelines",
					"@_ID": "PT054",
					"@_Value": "300",
				},
				{
					"@_Name": "PT056:Total balance on all tradelines",
					"@_ID": "PT056",
					"@_Value": "14824",
				},
				{
					"@_Name": "PT063:Number of currently delinquent tradelines",
					"@_ID": "PT063",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT064:Number of currently delinquent revolving tradelines",
					"@_ID": "PT064",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT065:Number of currently delinquent installment tradelines",
					"@_ID": "PT065",
					"@_Value": "0",
				},
				{
					"@_Name": "PT068:Average balance on open tradelines",
					"@_ID": "PT068",
					"@_Value": "300",
				},
				{
					"@_Name": "PT069:Number of Chargeoffs in past 12 months",
					"@_ID": "PT069",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT071:Total occurrances of delinquencies in the past 2 years",
					"@_ID": "PT071",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT072:Total occurrances of delinquencies in the past 30 days",
					"@_ID": "PT072",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT073:Total occurrances of delinquencies in the past 60 days",
					"@_ID": "PT073",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT074:Total occurrances of delinquencies in the past 7 years",
					"@_ID": "PT074",
					"@_Value": "3",
				},
				{
					"@_Name": "PT076:Date of oldest trade",
					"@_ID": "PT076",
					"@_Value": "032017",
				},
				{
					"@_Name":
						"PT079:Number of months since oldest installment tradeline opened",
					"@_ID": "PT079",
					"@_Value": "71",
				},
				{
					"@_Name":
						"PT080:Number of months since oldest revolving tradeline opened",
					"@_ID": "PT080",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT082:Number of months since most recent tradeline opened",
					"@_ID": "PT082",
					"@_Value": "52",
				},
				{
					"@_Name": "PT083:Number of mortgage trades",
					"@_ID": "PT083",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT088:Number of months since 90+ late or worse derogatory",
					"@_ID": "PT088",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT089:Number of tradelines reported in past 2 months and currently 120 days past due",
					"@_ID": "PT089",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT090:Number of tradelines currently 30 days past due",
					"@_ID": "PT090",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT091:Number of tradelines 90+ days past due in past 24 months",
					"@_ID": "PT091",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT092:Number of tradelines opened in past 12 months",
					"@_ID": "PT092",
					"@_Value": "0",
				},
				{
					"@_Name": "PT093:Percentage of tradelines never delinquent",
					"@_ID": "PT093",
					"@_Value": "50",
				},
				{
					"@_Name":
						"PT094:Number of tradelines ever 120 days past due",
					"@_ID": "PT094",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT095:Number of months since oldest bank installment tradeline",
					"@_ID": "PT095",
					"@_Value": "71",
				},
				{
					"@_Name":
						"PT103:Total credit limit/high credit on open installment tradelines",
					"@_ID": "PT103",
					"@_Value": "300",
				},
				{
					"@_Name":
						"PT104:Number of currently satisfactory tradelines",
					"@_ID": "PT104",
					"@_Value": "0",
				},
				{
					"@_Name": "PT105:Number of revolving tradelines",
					"@_ID": "PT105",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT110:Number of revolving tradelines opened in past 7 years",
					"@_ID": "PT110",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT111:Total credit limit/high credit on open revolving tradelines",
					"@_ID": "PT111",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT112:Total available credit on open bankcard tradelines verified in the last 6 mons",
					"@_ID": "PT112",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT115:Percent of bankcard tradelines gt 75% of credit limit",
					"@_ID": "PT115",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT118:Total credit limit/high credit on open bankcard tradelines",
					"@_ID": "PT118",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT119:Number of bankcard tradelines",
					"@_ID": "PT119",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT120:Number of months since most recent bankcard tradeline opened",
					"@_ID": "PT120",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT121:Number of bankcard tradelines opened in the past 6 months",
					"@_ID": "PT121",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT122:Number of bankcard tradelines never delinquent",
					"@_ID": "PT122",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT125:Number of months since most recent bankcard delinquency",
					"@_ID": "PT125",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT126:Percent utilization on bankcard tradelines",
					"@_ID": "PT126",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT129:Number of Public Records with amount gt 100",
					"@_ID": "PT129",
					"@_Value": "-4",
				},
				{
					"@_Name": "PT130:Number of Tax Liens",
					"@_ID": "PT130",
					"@_Value": "0",
				},
				{
					"@_Name": "PT132:Total amount on Collections",
					"@_ID": "PT132",
					"@_Value": "300",
				},
				{
					"@_Name": "PT133:Number of repossessions",
					"@_ID": "PT133",
					"@_Value": "0",
				},
				{
					"@_Name": "PT134:Number of foreclosures",
					"@_ID": "PT134",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT136:Number of Collections/Chargeoffs in past 24 months; excluding medical",
					"@_ID": "PT136",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT137:Total amount on Collections in past 36 months; excluding medical",
					"@_ID": "PT137",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT138:Number of tradelines active within the past 6 months",
					"@_ID": "PT138",
					"@_Value": "2",
				},
				{
					"@_Name":
						"PT139:Number of mortgage tradelines opened in past 6 months",
					"@_ID": "PT139",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT140:Number of open installment tradelines opened within the past 24 months",
					"@_ID": "PT140",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT141:Total occurrances of 30 days late within the past 12 months on Mortgage trades",
					"@_ID": "PT141",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT142:Number of mortgages passed due 30 days or more in the last 6 months",
					"@_ID": "PT142",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT143:Total occurrances of 30 days late within the past 12 months",
					"@_ID": "PT143",
					"@_Value": "0",
				},
				{
					"@_Name": "PT144:Number of collections with amount gt 500",
					"@_ID": "PT144",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT145:Total balance on unsecured credit card tradelines",
					"@_ID": "PT145",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT146:Total balance on unsecured tradelines",
					"@_ID": "PT146",
					"@_Value": "300",
				},
				{
					"@_Name":
						"PT147:Total amount on Tax Liens filed within the past 36 months",
					"@_ID": "PT147",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT148:Total amount on Judgements filed within the past 36 months",
					"@_ID": "PT148",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT149:Number of Public Records filed in past 24 months",
					"@_ID": "PT149",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT150:Number of non-federal Student Loan tradelines",
					"@_ID": "PT150",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT151:Number of repossessed auto loan tradelines",
					"@_ID": "PT151",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT153:Percent utilization on installment tradelines",
					"@_ID": "PT153",
					"@_Value": "100",
				},
				{
					"@_Name":
						"PT154:Number of revolving tradelines with balance gt 0",
					"@_ID": "PT154",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT155:Number of installment tradelines opened in past 12 months",
					"@_ID": "PT155",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT157:Number of revolving tradelines opened in past 12 months",
					"@_ID": "PT157",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT158:Number of revolving tradelines opened in past 24 months",
					"@_ID": "PT158",
					"@_Value": "-5",
				},
				{
					"@_Name": "PT159:Number of credit union tradelines",
					"@_ID": "PT159",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT160:Percent utilization on all open tradelines",
					"@_ID": "PT160",
					"@_Value": "100",
				},
				{
					"@_Name": "PT162:Maximum balance on revolving tradelines",
					"@_ID": "PT162",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT163:Number months since more recent installment tradeline opened",
					"@_ID": "PT163",
					"@_Value": "52",
				},
				{
					"@_Name":
						"PT165:Number of auto tradelines 30 days past due in past 6 months",
					"@_ID": "PT165",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT166:Number of auto tradelines opened in past 6 months",
					"@_ID": "PT166",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT167:Number of retail tradelines opened in past 6 months",
					"@_ID": "PT167",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT168:Number of student loans opened in past 12 months",
					"@_ID": "PT168",
					"@_Value": "-5",
				},
				{
					"@_Name":
						"PT174:Total amount on Collections; excluding medical",
					"@_ID": "PT174",
					"@_Value": "300",
				},
				{
					"@_Name": "PT175:Total amount on Tax Liens",
					"@_ID": "PT175",
					"@_Value": "-4",
				},
				{
					"@_Name": "PT176:Total amount on Judgements",
					"@_ID": "PT176",
					"@_Value": "-4",
				},
				{
					"@_Name":
						"PT177:Total credit limit on open credit card trades",
					"@_ID": "PT177",
					"@_Value": "0",
				},
				{
					"@_Name": "PT178:Total credit limit on open retail trades",
					"@_ID": "PT178",
					"@_Value": "0",
				},
				{
					"@_Name": "PT179:Total balance on open credit card trades",
					"@_ID": "PT179",
					"@_Value": "0",
				},
				{
					"@_Name": "PT180:Total balance on open retail trades",
					"@_ID": "PT180",
					"@_Value": "0",
				},
				{
					"@_Name": "PT181:Age of oldest trade in months",
					"@_ID": "PT181",
					"@_Value": "71",
				},
				{
					"@_Name": "PT182:Total number of open credit card trades",
					"@_ID": "PT182",
					"@_Value": "0",
				},
				{
					"@_Name": "PT183:Total number of open retail trades",
					"@_ID": "PT183",
					"@_Value": "0",
				},
				{
					"@_Name": "PT184:Total number of trades ever delinquent",
					"@_ID": "PT184",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT185:Total number of tradelines delinquent in the last 6 months",
					"@_ID": "PT185",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT186:Total number of installment tradelines 60 days late or worse in the last 6 months",
					"@_ID": "PT186",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT187:Total balances on currently delinquent tradelines",
					"@_ID": "PT187",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT188:Worst current status on any open tradeline",
					"@_ID": "PT188",
					"@_Value": "9",
				},
				{
					"@_Name":
						"PT189:Worst status in the past 12 months on any mortgage tradeline",
					"@_ID": "PT189",
					"@_Value": "0",
				},
				{
					"@_Name": "PT190:Total number of closed credit card trades",
					"@_ID": "PT190",
					"@_Value": "0",
				},
				{
					"@_Name": "PT191:Total number of closed installment trades",
					"@_ID": "PT191",
					"@_Value": "1",
				},
				{
					"@_Name": "PT192:Percent of revolving credit available",
					"@_ID": "PT192",
					"@_Value": "999",
				},
				{
					"@_Name":
						"PT193:Number of loans or credit cards applied for in past 24 months",
					"@_ID": "PT193",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT194:Number of Installment tradelines not delinquent within the last 24 months",
					"@_ID": "PT194",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT195:Max credit limit on open bank credit cards",
					"@_ID": "PT195",
					"@_Value": "0",
				},
				{
					"@_Name": "PT196:Number of collections with amount gt 0",
					"@_ID": "PT196",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT197:Total Number of delinquent credit card and retail trades in last 6 months",
					"@_ID": "PT197",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT198:Total number of open credit card tradelines with utilization gt 90%",
					"@_ID": "PT198",
					"@_Value": "0",
				},
				{
					"@_Name":
						"PT199:Total number of open retail tradelines with utilization gt 90%",
					"@_ID": "PT199",
					"@_Value": "1",
				},
				{
					"@_Name": "PT200:Number of closed trades; no exclusions",
					"@_ID": "PT200",
					"@_Value": "1",
				},
				{
					"@_Name": "PT201:Number of open trades; no exclusions",
					"@_ID": "PT201",
					"@_Value": "1",
				},
				{
					"@_Name":
						"PT202:Total balance on all trades; no exclusions",
					"@_ID": "PT202",
					"@_Value": "14824",
				},
				{
					"@_Name": "Deceased Indicator",
					"@_ID": "AP009",
					"@_Value": "N",
				},
				{
					"@_Name": "Public Record Info",
					"@_ID": "AP010",
					"@_Value": "",
				},
			],
		},
	},
};

export const credit_report_data_two = {
	id: "64793e7e16d035ba6f30b26b",
	created_at: "2023-06-02T00:57:34.679Z",
	updated_at: "2023-06-02T00:57:38.828Z",
	resource_id: "64793e8216d035ba6f30b26c",
	first_name: "ana gloria",
	last_name: "vazquez",
	ssn: "594794797",
	dob: "1963-06-19",
	street: "16555 southwest 47th place road",
	city: "ocala",
	state: "fl",
	zip: "34481",
	trade_lines: null,
	type: "personal_credit_report",
	entity_id: "64793de516d035ba6f30b262",
	data: {
		CREDIT_RESPONSE: {
			"@MISMOVersionID": "2.4",
			"@CreditResponseID": "CRRep0001",
			"@CreditReportIdentifier": "1874-94C4561D-9B4A-4C6",
			"@CreditReportFirstIssuedDate": "2023-06-02T00:57:30.243Z",
			"@CreditReportMergeTypeIndicator": "ListAndStack",
			"@CreditRatingCodeType": "Equifax",
			_DATA_INFORMATION: {
				DATA_VERSION: [
					{
						"@_Name": "Credmo",
						"@_Number": "1.3",
					},
					{
						"@_Name": "Equifax",
						"@_Number": "5",
					},
					{
						"@_Name": "Experian",
						"@_Number": "7",
					},
					{
						"@_Name": "TransUnion",
						"@_Number": "4",
					},
				],
			},
			CREDIT_BUREAU: null,
			CREDIT_REPOSITORY_INCLUDED: {
				"@_EquifaxIndicator": "Y",
				"@_ExperianIndicator": "Y",
				"@_TransUnionIndicator": "Y",
			},
			CREDIT_FROZEN_STATUS: {
				"@_EquifaxIndicator": "false",
				"@_ExperianIndicator": "false",
				"@_TransUnionIndicator": "false",
			},
			REQUESTING_PARTY: null,
			CREDIT_REQUEST_DATA: {
				"@BorrowerID": "Borrower01",
				CREDIT_REPOSITORY_INCLUDED: {
					"@_EquifaxIndicator": "Y",
					"@_ExperianIndicator": "Y",
					"@_TransUnionIndicator": "Y",
				},
			},
			BORROWER: {
				"@BorrowerID": "Borrower01",
				"@_BirthDate": "1963-06-19",
				"@_FirstName": "ANA",
				"@_MiddleName": "GLORIA",
				"@_LastName": "VAZQUEZ",
				"@_SSN": "XXXXXXXXX",
				"@_UnparsedName": "ANA GLORIA VAZQUEZ ",
				"@_PrintPositionType": "Borrower",
				_RESIDENCE: [
					{
						"@_StreetAddress": "16555 SW 47TH PLACE RD",
						"@_City": "OCALA",
						"@_State": "FL",
						"@_PostalCode": "34481",
						"@BorrowerResidencyType": "Current",
					},
					{
						"@_StreetAddress": "1150 SW 132ND TE",
						"@_City": "OCALA",
						"@_State": "FL",
						"@_PostalCode": "34481",
						"@BorrowerResidencyType": "Prior",
					},
				],
			},
			CREDIT_LIABILITY: [
				{
					"@CreditLiabilityID": "TRADE001",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01 TA01 RA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2023-04-30",
					"@_AccountClosedDate": "2018-06-30",
					"@_AccountIdentifier": "110000003290355",
					"@_AccountOpenedDate": "2014-12-27",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-04-30",
					"@_AccountStatusDate": "2018-07-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ChargeOffAmount": "12620",
					"@_ChargeOffDate": "2014-12-27",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "36147",
					"@_LastActivityDate": "2023-03-30",
					"@_MonthsReviewedCount": "98",
					"@_PastDueAmount": "13709",
					"@_TermsMonthsCount": "72",
					"@_TermsDescription": "72M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "13709",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "AutoLoan",
					"@CreditLoanTypeCode": "00",
					"@_OriginalBalanceAmount": "36147",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "Y",
					"@DateClosedIndicator": "F",
					"@LastPaymentDate": "2018-08-28",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutoFinancing",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "343650b431d3652e16a43f97e3305e68",
					"@TradelineHashSimple": "877fbaf295babf893ce697dcbdce89f0",
					"@ArrayAccountIdentifier":
						"dae79ee7747d71dc97e7a7d618b563ed",
					_CREDITOR: {
						"@_Name": "SETOYOTA FIN DBA OF WO",
						"@_StreetAddress": "PO BOX 91614",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "36691",
						"@_Phone": "BYMAILONLY",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "BYMAILONLY",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2018-01-28",
						"@_Type": "CollectionOrChargeOff",
					},
					_LATE_COUNT: {
						"@_30Days": "2",
						"@_60Days": "2",
						"@_90Days": "00",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2018-07-01",
						"@_Type": "CollectionOrChargeOff",
					},
					_PAYMENT_PATTERN: {
						"@_Data":
							"9999999999999999999999999999999999999999999999999999999999928CC91CCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2023-04-30",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "Equifax",
							"@_Type": "BureauRemarks",
							"@_Code": "DB",
							_Text: "CHARGED OFF ACCOUNT",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "PRL",
							_Text: "PROFIT AND LOSS WRITEOFF",
						},
						{
							"@_SourceType": "Experian",
							"@_Type": "StatusCode",
							"@_Code": "97",
							_Text: "UNPAID BALANCE REPORTED AS A LOSS BY CREDIT GRANTOR",
						},
						{
							"@_SourceType": "Equifax",
							"@_Type": "BureauRemarks",
							"@_Code": "EP",
							_Text: "FIXED RATE",
						},
						{
							"@_SourceType": "Equifax",
							"@_Type": "Other",
							"@_TypeOtherDescripton": "TrendedData",
							_Text: "<CREDIT_LIABILITY_PRIOR_INFORMATIONS>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13709/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13709/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13684/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13684/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13657/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13657/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13633/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13633/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13607/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13607/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13581/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13581/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13555/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13555/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13529/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13529/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13503/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13503/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13477/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13477/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13450/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13450/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-04/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13425/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13425/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13398/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13398/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13373/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13373/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13346/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13346/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13322/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13322/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13296/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13296/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13269/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13269/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13244/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13244/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13217/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13217/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13192/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13192/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13139/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13139/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATIONS>",
						},
					],
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "Equifax",
							"@_SubscriberCode": "402FA13866",
						},
						{
							"@_SourceType": "Experian",
						},
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "02729006",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE002",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountIdentifier": "110000003290355",
					"@_AccountOpenedDate": "2014-12-27",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-04-30",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ChargeOffAmount": "12620",
					"@_ChargeOffDate": "2014-12-27",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_LastActivityDate": "2023-03-30",
					"@_MonthsReviewedCount": "98",
					"@_PastDueAmount": "13709",
					"@_TermsMonthsCount": "72",
					"@_TermsDescription": "72M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "13709",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "Automobile",
					"@CreditLoanTypeCode": "00",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "Y",
					"@LastPaymentDate": "2018-08-01",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutoFinancing",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "343650b431d3652e16a43f97e3305e68",
					"@TradelineHashSimple": "877fbaf295babf893ce697dcbdce89f0",
					"@ArrayAccountIdentifier":
						"dae79ee7747d71dc97e7a7d618b563ed",
					_CREDITOR: {
						"@_Name": "SETF/WOFC",
						"@_StreetAddress": "P.O. BOX 991817",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "366911817",
						"@_Phone": "8005332650",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8005332650",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2018-01-28",
						"@_Type": "CollectionOrChargeOff",
					},
					_LATE_COUNT: {
						"@_30Days": "01",
						"@_60Days": "01",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data":
							"99999999999999999999X999999999999999999999X999XXXXXXXXXXXXX8XX21XXXXXXXXXXXXXXXXX",
						"@_StartDate": "2023-03-30",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "Equifax",
							"@_Type": "BureauRemarks",
							"@_Code": "DB",
							_Text: "CHARGED OFF ACCOUNT",
						},
						{
							"@_SourceType": "Equifax",
							"@_Type": "Other",
							"@_TypeOtherDescripton": "TrendedData",
							_Text: "<CREDIT_LIABILITY_PRIOR_INFORMATIONS>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13709/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13709/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13684/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13684/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13657/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13657/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13633/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13633/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13607/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13607/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13581/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13581/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13555/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13555/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13529/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13529/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13503/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13503/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13477/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13477/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13450/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13450/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-04/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13425/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13425/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13398/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13398/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13373/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13373/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13346/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13346/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13322/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13322/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13296/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13296/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13269/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13269/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13244/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13244/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13217/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13217/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13192/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13192/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>13139/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>13139/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-08-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>HX/>\n\t\t\t\t\t\t<CreditLiabilityComment2>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment3>EP/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>00/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATIONS>",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "402FA13866",
					},
				},
				{
					"@CreditLiabilityID": "TRADE003",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2018-06-30",
					"@_AccountIdentifier": "110000003290355",
					"@_AccountOpenedDate": "2014-12-27",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-04-30",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ChargeOffDate": "2018-06-30",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "36147",
					"@_LastActivityDate": "2018-08-28",
					"@_PastDueAmount": "13709",
					"@_TermsMonthsCount": "72",
					"@_TermsDescription": "72M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "13709",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "AutoLoan",
					"@CreditLoanTypeCode": "AU",
					"@_OriginalBalanceAmount": "000036147",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "Y",
					"@DateClosedIndicator": "F",
					"@LastPaymentDate": "2018-08-28",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "91ea34f7d22e52038122afc2bce1453b",
					"@TradelineHashSimple": "fa8bde95fc518a64f49143b52130c8a1",
					"@ArrayAccountIdentifier":
						"dae79ee7747d71dc97e7a7d618b563ed",
					"@TUI_Handle": "TR01_2054229117_803586362_73",
					_CREDITOR: {
						"@_Name": "SETF/WOFC",
						"@_StreetAddress": "PO BOX 91614",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "36691",
						"@_Phone": "8005532650",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8005532650",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2018-06-30",
						"@_Type": "CollectionOrChargeOff",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "PRL",
							_Text: "PROFIT AND LOSS WRITEOFF",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_2054229117_803586362_73",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "02729006",
					},
				},
				{
					"@CreditLiabilityID": "TRADE004",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2023-04-30",
					"@_AccountIdentifier": "110000XXXXXXXXX",
					"@_AccountOpenedDate": "2014-12-27",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-04-30",
					"@_AccountStatusDate": "2018-07-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ChargeOffDate": "2018-07-01",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "36147",
					"@_LastActivityDate": "2018-07-01",
					"@_MonthsReviewedCount": "84",
					"@_TermsMonthsCount": "72",
					"@_TermsDescription": "72 M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "13709",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "Automobile",
					"@CreditLoanTypeCode": "00",
					"@_OriginalBalanceAmount": "36147",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "Y",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutomobileFinancingCompany",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "3fe526495a00da30041aa1b2fd8d9171",
					"@TradelineHashSimple": "f17400625295e6741bafe52029861504",
					"@ArrayAccountIdentifier":
						"dae79ee7747d71dc97e7a7d618b563ed",
					_CREDITOR: {
						"@_Name": "SETOYOTA FIN DBA OF WO",
						"@_StreetAddress": "PO BOX 91614",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "36691",
						"@_Phone": "BYMAILONLY",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "BYMAILONLY",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_LATE_COUNT: {
						"@_30Days": "2",
						"@_60Days": "2",
						"@_90Days": "0",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2018-07-01",
						"@_Type": "CollectionOrChargeOff",
					},
					_PAYMENT_PATTERN: {
						"@_Data":
							"9999999999999999999999999999999999999999999999999999999999821CC21CCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2023-04-30",
					},
					CREDIT_COMMENT: {
						"@_SourceType": "Experian",
						"@_Type": "StatusCode",
						"@_Code": "97",
						_Text: "UNPAID BALANCE REPORTED AS A LOSS BY CREDIT GRANTOR",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE005",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01 EA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountIdentifier": "1547194",
					"@_AccountOpenedDate": "2022-11-16",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-03",
					"@_AccountStatusType": "Open",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "12600",
					"@_LastActivityDate": "2023-04-01",
					"@_MonthlyPaymentAmount": "280",
					"@_MonthsReviewedCount": "6",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "48",
					"@_TermsDescription": "48M$280",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "11025",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "RA",
					"@_OriginalBalanceAmount": "12600",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "N",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@LastPaymentDate": "2023-03-29",
					"@RawAccountStatus": "O",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "7c25254eb4cbb87aacd6d7bd686ddce0",
					"@TradelineHashSimple": "1e2e2f8390acfd448ed4c2c6659d0144",
					"@ArrayAccountIdentifier":
						"dc767a9000cdb322f147d1d858199c36",
					"@TUI_Handle": "TR01_2105062917_1255992483_73",
					_CREDITOR: {
						"@_Name": "OKINUS, INC",
						"@_StreetAddress": "PO BOX 691",
						"@_City": "PELHAM",
						"@_State": "GA",
						"@_PostalCode": "31779",
						"@_Phone": "8004721334",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8004721334",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCC",
						"@_StartDate": "2023-04-03",
					},
					CREDIT_COMMENT: {
						"@_SourceType": "TransUnion",
						"@_Type": "Other",
						"@_TypeOtherDescription": "Handle",
						"@_Code": "TR01_2105062917_1255992483_73",
					},
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "02FJT001",
						},
						{
							"@_SourceType": "Equifax",
							"@_SubscriberCode": "023FP00029",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE006",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountIdentifier": "1547194",
					"@_AccountOpenedDate": "2022-11-16",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-03",
					"@_AccountStatusType": "Open",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "12600",
					"@_LastActivityDate": "2023-03-29",
					"@_MonthlyPaymentAmount": "280",
					"@_MonthsReviewedCount": "6",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "48",
					"@_TermsDescription": "48M$280",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "11025",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "RA",
					"@_OriginalBalanceAmount": "000012600",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "N",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@LastPaymentDate": "2023-03-29",
					"@RawAccountStatus": "O",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "7c25254eb4cbb87aacd6d7bd686ddce0",
					"@TradelineHashSimple": "1e2e2f8390acfd448ed4c2c6659d0144",
					"@ArrayAccountIdentifier":
						"dc767a9000cdb322f147d1d858199c36",
					"@TUI_Handle": "TR01_2105062917_1255992483_73",
					_CREDITOR: {
						"@_Name": "OKNSINC",
						"@_StreetAddress": "PO BOX 691",
						"@_City": "PELHAM",
						"@_State": "GA",
						"@_PostalCode": "31779",
						"@_Phone": "8004721334",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8004721334",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CXCCCC",
						"@_StartDate": "2023-04-03",
					},
					CREDIT_COMMENT: {
						"@_SourceType": "TransUnion",
						"@_Type": "Other",
						"@_TypeOtherDescription": "Handle",
						"@_Code": "TR01_2105062917_1255992483_73",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "02FJT001",
					},
				},
				{
					"@CreditLiabilityID": "TRADE007",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountIdentifier": "1547194",
					"@_AccountOpenedDate": "2022-11-16",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-04-30",
					"@_AccountStatusType": "Open",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "12600",
					"@_HighCreditAmount": "12600",
					"@_LastActivityDate": "2023-04-01",
					"@_MonthlyPaymentAmount": "280",
					"@_MonthsReviewedCount": "5",
					"@_TermsMonthsCount": "48",
					"@_TermsDescription": "48M$280",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "11025",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "29",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "N",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@LastPaymentDate": "2023-03-01",
					"@RawAccountType": "I",
					"@RawIndustryText": "PersonalLoansCompanies",
					"@RawIndustryCode": "FP",
					"@TradelineHashComplex": "f770879544f4c92e0ee9cad29f2dbd5c",
					"@TradelineHashSimple": "75a2fcc6543ffd92d04f94f9d1147500",
					"@ArrayAccountIdentifier":
						"dc767a9000cdb322f147d1d858199c36",
					_CREDITOR: {
						"@_Name": "OKINUS, INC",
						"@_StreetAddress": "147 W RAILROAD ST S",
						"@_City": "PELHAM",
						"@_State": "GA",
						"@_PostalCode": "31779",
						"@_Phone": "2292944575",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "2292944575",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCC",
						"@_StartDate": "2023-03-30",
					},
					CREDIT_COMMENT: {
						"@_SourceType": "Equifax",
						"@_Type": "Other",
						"@_TypeOtherDescripton": "TrendedData",
						_Text: "<CREDIT_LIABILITY_PRIOR_INFORMATIONS>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11025/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>12600/>\n\t\t\t\t\t\t<CreditLiabilityActualPaymentAmount>561/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>280/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2023-03-01/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>29/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11025/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>12600/>\n\t\t\t\t\t\t<CreditLiabilityActualPaymentAmount>561/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>280/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2023-03-01/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>29/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11550/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>12600/>\n\t\t\t\t\t\t<CreditLiabilityActualPaymentAmount>280/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>280/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2023-02-01/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>29/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>11812/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>12600/>\n\t\t\t\t\t\t<CreditLiabilityActualPaymentAmount>280/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>280/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2023-01-01/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>29/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>12075/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>12600/>\n\t\t\t\t\t\t<CreditLiabilityActualPaymentAmount>280/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>280/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2022-12-01/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>29/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>12337/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>12600/>\n\t\t\t\t\t\t<CreditLiabilityActualPaymentAmount>400/>\n\t\t\t\t\t\t<CreditLiabilityMonthlyPaymentAmount>280/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2022-11-01/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>29/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATIONS>",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "023FP00029",
					},
				},
				{
					"@CreditLiabilityID": "TRADE008",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01 RA01 EA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2023-05-26",
					"@_AccountIdentifier": "19034734",
					"@_AccountOpenedDate": "2019-10-07",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-26",
					"@_AccountStatusDate": "2019-10-01",
					"@_AccountStatusType": "Open",
					"@_AccountType": "Open",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "3960",
					"@_LastActivityDate": "2023-05-26",
					"@_MonthsReviewedCount": "40",
					"@_OriginalCreditorName": "BRIDGECREST ACCEPTANCE CORPORA",
					"@_PastDueAmount": "6764",
					"@_TermsMonthsCount": "1",
					"@_TermsDescription": "1M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "6778",
					"@CreditBusinessType": "CollectionServices",
					"@CreditLoanType": "CollectionAttorney",
					"@_OriginalBalanceAmount": "3960",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "N",
					"@IsCollectionIndicator": "Y",
					"@IsChargeoffIndicator": "N",
					"@CollectionDate": "2019-10",
					"@RawAccountStatus": "O",
					"@RawAccountType": "O",
					"@RawIndustryText": "CollectionServices",
					"@RawIndustryCode": "Y",
					"@TradelineHashComplex": "768211907dfa388509a6c20f1aa20078",
					"@TradelineHashSimple": "b168256e5a1ef733f0fa3084274edec3",
					"@ArrayAccountIdentifier":
						"a2ade3c3647cdbbbf9bda5b09984edc1",
					"@TUI_Handle": "TR01_-30634801_1176152603_89",
					_CREDITOR: {
						"@_Name": "PERSOLVE LEGAL GROUP",
						"@_StreetAddress": "9301 CORBIN AVE STE 1600",
						"@_City": "NORTHRIDGE",
						"@_State": "CA",
						"@_PostalCode": "91324",
						"@_Phone": "8185343100",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8185343100",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2023-05-26",
						"@_Type": "CollectionOrChargeOff",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "999999999999999X999999999999999999999999",
						"@_StartDate": "2023-05-26",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "Experian",
							"@_Type": "StatusCode",
							"@_Code": "93",
							_Text: "ACCOUNT SERIOUSLY PAST DUE DATE/ACCOUNT ASSIGNED TO ATTORNEY, COLLECTION AGENCY, OR CREDIT GRANTOR'S INTERNAL COLLECTION DEPARTMENT",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_-30634801_1176152603_89",
						},
					],
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "02CQF001",
						},
						{
							"@_SourceType": "Equifax",
							"@_SubscriberCode": "180FY00143",
						},
						{
							"@_SourceType": "Experian",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE009",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountIdentifier": "19034734",
					"@_AccountOpenedDate": "2019-10-07",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-26",
					"@_AccountStatusType": "Open",
					"@_AccountType": "Open",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "3960",
					"@_LastActivityDate": "2023-05-26",
					"@_OriginalCreditorName": "BRIDGECREST ACCEPTANCE CORPORA",
					"@_UnpaidBalanceAmount": "6778",
					"@CreditBusinessType": "CollectionServices",
					"@_OriginalBalanceAmount": "000003960",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "N",
					"@IsCollectionIndicator": "Y",
					"@IsChargeoffIndicator": "N",
					"@CollectionDate": "2019-10",
					"@RawAccountStatus": "O",
					"@RawAccountType": "O",
					"@RawIndustryText": "CollectionServices",
					"@RawIndustryCode": "Y",
					"@TradelineHashComplex": "768211907dfa388509a6c20f1aa20078",
					"@TradelineHashSimple": "b168256e5a1ef733f0fa3084274edec3",
					"@ArrayAccountIdentifier":
						"a2ade3c3647cdbbbf9bda5b09984edc1",
					"@TUI_Handle": "TR01_-30634801_1176152603_89",
					_CREDITOR: {
						"@_Name": "PERSOLVE LEG",
						"@_StreetAddress": "9301 CORBIN AVE",
						"@_City": "NORTHRIDGE",
						"@_State": "CA",
						"@_PostalCode": "91324",
						"@_Phone": "8185343100",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8185343100",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2023-05-26",
						"@_Type": "CollectionOrChargeOff",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLA",
							_Text: "PLACED FOR COLLECTION",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_-30634801_1176152603_89",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "02CQF001",
					},
				},
				{
					"@CreditLiabilityID": "TRADE010",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2023-05-26",
					"@_AccountIdentifier": "190347XX",
					"@_AccountOpenedDate": "2019-10-07",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-26",
					"@_AccountStatusDate": "2019-10-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "3960",
					"@_LastActivityDate": "2019-10-01",
					"@_MonthsReviewedCount": "40",
					"@_OriginalCreditorName": "BRIDGECREST ACCEPTANCE C",
					"@_TermsMonthsCount": "1",
					"@_TermsDescription": "1 M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "6778",
					"@CreditBusinessType": "CollectionServices",
					"@CreditLoanType": "CollectionAttorney",
					"@CreditLoanTypeCode": "48",
					"@_OriginalBalanceAmount": "3960",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "Y",
					"@IsChargeoffIndicator": "N",
					"@CollectionDate": "2019-10",
					"@RawIndustryText": "OtherCollectionAgencies",
					"@RawIndustryCode": "YC",
					"@TradelineHashComplex": "06cd592ab6373e049c92bbefa3def344",
					"@TradelineHashSimple": "fdde98a58da622d194f3b3325099be32",
					"@ArrayAccountIdentifier":
						"a2ade3c3647cdbbbf9bda5b09984edc1",
					_CREDITOR: {
						"@_Name": "PERSOLVE LEGAL GROUP",
						"@_StreetAddress": "9301 CORBIN AVE STE 1600",
						"@_City": "NORTHRIDGE",
						"@_State": "CA",
						"@_PostalCode": "91324",
						"@_Phone": "8185343100",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8185343100",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2019-10-01",
						"@_Type": "CollectionOrChargeOff",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "999999999999999X999999999999999999999999",
						"@_StartDate": "2023-05-26",
					},
					CREDIT_COMMENT: {
						"@_SourceType": "Experian",
						"@_Type": "StatusCode",
						"@_Code": "93",
						_Text: "ACCOUNT SERIOUSLY PAST DUE DATE/ACCOUNT ASSIGNED TO ATTORNEY, COLLECTION AGENCY, OR CREDIT GRANTOR'S INTERNAL COLLECTION DEPARTMENT",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE011",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountIdentifier": "19034734",
					"@_AccountOpenedDate": "2019-10-07",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-19",
					"@_AccountStatusType": "Open",
					"@_AccountType": "Open",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "3960",
					"@_HighCreditAmount": "3960",
					"@_LastActivityDate": "2019-10-07",
					"@_MonthsReviewedCount": "15",
					"@_OriginalCreditorName": "BRIDGECREST ACCEPTANCE CORPORA",
					"@_PastDueAmount": "6764",
					"@_UnpaidBalanceAmount": "6764",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "FactoringCompanyAccount",
					"@CreditLoanTypeCode": "0C",
					"@_OriginalBalanceAmount": "3960",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "N",
					"@IsCollectionIndicator": "Y",
					"@IsChargeoffIndicator": "N",
					"@CollectionDate": "2019-10",
					"@RawAccountType": "O",
					"@RawIndustryText": "DebtBuyer",
					"@RawIndustryCode": "FY",
					"@TradelineHashComplex": "9a8c88cf451491fad3afc418eae37e6d",
					"@TradelineHashSimple": "70c735529c934cc0391369ed5bc1c53a",
					"@ArrayAccountIdentifier":
						"a2ade3c3647cdbbbf9bda5b09984edc1",
					_CREDITOR: {
						"@_Name": "PERSOLVE,LLC",
						"@_StreetAddress": "28470 AVENUE STANDFORD",
						"@_City": "VALENCIA",
						"@_State": "CA",
						"@_PostalCode": "91355",
						"@_Phone": "6617053600",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "6617053600",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "Equifax",
							"@_Type": "BureauRemarks",
							"@_Code": "CZ",
							_Text: "COLLECTION ACCOUNT",
						},
						{
							"@_SourceType": "Equifax",
							"@_Type": "Other",
							"@_TypeOtherDescripton": "TrendedData",
							_Text: "<CREDIT_LIABILITY_PRIOR_INFORMATIONS>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>6706/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>6706/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>6649/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>6649/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>6591/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>6591/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>6533/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>6533/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>6461/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>6461/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>6404/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>6404/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>6331/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>6331/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>6274/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>6274/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>6216/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>6216/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>6144/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>6144/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>6086/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>6086/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-04/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>6029/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>6029/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>5957/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>5957/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>5885/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>5885/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>5827/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>5827/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>5712/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>5712/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>5654/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>5654/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>5582/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>5582/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>5524/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>5524/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>5467/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>5467/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>5395/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>5395/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>5337/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>3960/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>5337/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>0C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATIONS>",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "180FY00143",
					},
				},
				{
					"@CreditLiabilityID": "TRADE012",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01 RA01 TA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2023-05-08",
					"@_AccountClosedDate": "2018-06-07",
					"@_AccountIdentifier": "4465424504899594",
					"@_AccountOpenedDate": "2013-08-14",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-08",
					"@_AccountStatusDate": "2018-11-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Revolving",
					"@_ChargeOffAmount": "1434",
					"@_ChargeOffDate": "2013-08-14",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_CreditLimitAmount": "1000",
					"@_HighBalanceAmount": "1434",
					"@_LastActivityDate": "2023-04-08",
					"@_MonthlyPaymentAmount": "0",
					"@_MonthsReviewedCount": "99",
					"@_PastDueAmount": "1434",
					"@_UnpaidBalanceAmount": "1434",
					"@CreditBusinessType": "Banking",
					"@CreditLoanType": "CreditCard",
					"@CreditLoanTypeCode": "18",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "Y",
					"@DateClosedIndicator": "F",
					"@LastPaymentDate": "2018-02-15",
					"@RawAccountType": "R",
					"@RawIndustryText": "AllBanks",
					"@RawIndustryCode": "BB",
					"@TradelineHashComplex": "f08adebaf0c1ca6c88a775f756e40c58",
					"@TradelineHashSimple": "06a9d43b4947471919c1b5bc393640c4",
					"@ArrayAccountIdentifier":
						"b804068c933408db72d3d0c69c116aa3",
					_CREDITOR: {
						"@_Name": "WELLS FARGO CARD SER",
						"@_StreetAddress": "PO BOX 14517",
						"@_City": "DES MOINES",
						"@_State": "IA",
						"@_PostalCode": "50306",
						"@_Phone": "8006424720",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8006424720",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2018-09-08",
						"@_Type": "CollectionOrChargeOff",
					},
					_LATE_COUNT: {
						"@_30Days": "02",
						"@_60Days": "01",
						"@_90Days": "04",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2018-11-01",
						"@_Type": "CollectionOrChargeOff",
					},
					_PAYMENT_PATTERN: {
						"@_Data":
							"99999999999999999999999999999999999999999999999999999994944921C11CCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2023-05-08",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "Equifax",
							"@_Type": "BureauRemarks",
							"@_Code": "DB",
							_Text: "CHARGED OFF ACCOUNT",
						},
						{
							"@_SourceType": "Experian",
							"@_Type": "StatusCode",
							"@_Code": "97",
							_Text: "UNPAID BALANCE REPORTED AS A LOSS BY CREDIT GRANTOR",
						},
						{
							"@_SourceType": "Experian",
							"@_Type": "BureauRemarks",
							"@_Code": "18",
							_Text: "ACCOUNT CLOSED AT CREDIT GRANTOR'S REQUEST",
						},
						{
							"@_SourceType": "Equifax",
							"@_Type": "Other",
							"@_TypeOtherDescripton": "TrendedData",
							_Text: "<CREDIT_LIABILITY_PRIOR_INFORMATIONS>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-04/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATIONS>",
						},
					],
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "Equifax",
							"@_SubscriberCode": "162BB10365",
						},
						{
							"@_SourceType": "Experian",
						},
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "0908N664",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE013",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountIdentifier": "4465424504899594",
					"@_AccountOpenedDate": "2013-08-14",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-08",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Revolving",
					"@_ChargeOffAmount": "1434",
					"@_ChargeOffDate": "2013-08-14",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_CreditLimitAmount": "1000",
					"@_LastActivityDate": "2023-04-08",
					"@_MonthsReviewedCount": "99",
					"@_PastDueAmount": "1434",
					"@_UnpaidBalanceAmount": "1434",
					"@CreditBusinessType": "Banking",
					"@CreditLoanType": "CreditCard",
					"@CreditLoanTypeCode": "18",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "Y",
					"@LastPaymentDate": "2018-02-01",
					"@RawAccountType": "R",
					"@RawIndustryText": "AllBanks",
					"@RawIndustryCode": "BB",
					"@TradelineHashComplex": "f08adebaf0c1ca6c88a775f756e40c58",
					"@TradelineHashSimple": "06a9d43b4947471919c1b5bc393640c4",
					"@ArrayAccountIdentifier":
						"b804068c933408db72d3d0c69c116aa3",
					_CREDITOR: {
						"@_Name": "WELLS FARGO CARD SER",
						"@_StreetAddress": "CREDIT BUREAU DISPUTE RESOLUT",
						"@_City": "DES MOINES",
						"@_State": "IA",
						"@_PostalCode": "50306",
						"@_Phone": "8006424720",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8006424720",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2018-09-08",
						"@_Type": "CollectionOrChargeOff",
					},
					_LATE_COUNT: {
						"@_30Days": "02",
						"@_60Days": "01",
						"@_90Days": "04",
					},
					_PAYMENT_PATTERN: {
						"@_Data":
							"99999999999999999999999999999999999999999999999XXXXXXXX444321XX1XXXXXXXXXXXXXXXXX",
						"@_StartDate": "2023-04-08",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "Equifax",
							"@_Type": "BureauRemarks",
							"@_Code": "DB",
							_Text: "CHARGED OFF ACCOUNT",
						},
						{
							"@_SourceType": "Equifax",
							"@_Type": "Other",
							"@_TypeOtherDescripton": "TrendedData",
							_Text: "<CREDIT_LIABILITY_PRIOR_INFORMATIONS>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-04/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-02/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-08/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-06/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2021-05/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityCreditLimitAmount>1000/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>1434/>\n\t\t\t\t\t\t<CreditLiabilityLastPaymentDate>2018-02-01/>\n\t\t\t\t\t\t<CreditLiabilityComment1>DB/>\n\t\t\t\t\t\t<CreditLiabilityComment2>CW/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>18/>\n\t\t\t\t\t\t<CreditLiabilityAccountOwnershipType>C/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATIONS>",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "162BB10365",
					},
				},
				{
					"@CreditLiabilityID": "TRADE014",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2023-05-08",
					"@_AccountIdentifier": "446542XXXX",
					"@_AccountOpenedDate": "2013-08-14",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-08",
					"@_AccountStatusDate": "2018-11-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Revolving",
					"@_ChargeOffDate": "2018-11-01",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_CreditLimitAmount": "1000",
					"@_LastActivityDate": "2018-11-01",
					"@_MonthsReviewedCount": "84",
					"@_UnpaidBalanceAmount": "1434",
					"@CreditBusinessType": "Banking",
					"@CreditLoanType": "CreditCard",
					"@CreditLoanTypeCode": "18",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "Y",
					"@RawAccountType": "R",
					"@RawIndustryText": "BankCreditCards",
					"@RawIndustryCode": "BC",
					"@TradelineHashComplex": "4898cb7bcceffcfc1be3b40df48314d7",
					"@TradelineHashSimple": "6d99728ca8ad5478893bf509d4751bc6",
					"@ArrayAccountIdentifier":
						"b804068c933408db72d3d0c69c116aa3",
					_CREDITOR: {
						"@_Name": "WF CRD SVC",
						"@_StreetAddress": "PO BOX 14517",
						"@_City": "DES MOINES",
						"@_State": "IA",
						"@_PostalCode": "50306",
						"@_Phone": "8006424720",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8006424720",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_LATE_COUNT: {
						"@_30Days": "2",
						"@_60Days": "1",
						"@_90Days": "4",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2018-11-01",
						"@_Type": "CollectionOrChargeOff",
					},
					_PAYMENT_PATTERN: {
						"@_Data":
							"9999999999999999999999999999999999999999999999999999999444321CC1CCCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2023-05-08",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "Experian",
							"@_Type": "StatusCode",
							"@_Code": "97",
							_Text: "UNPAID BALANCE REPORTED AS A LOSS BY CREDIT GRANTOR",
						},
						{
							"@_SourceType": "Experian",
							"@_Type": "BureauRemarks",
							"@_Code": "18",
							_Text: "ACCOUNT CLOSED AT CREDIT GRANTOR'S REQUEST",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE015",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2018-06-07",
					"@_AccountIdentifier": "4465424504899594",
					"@_AccountOpenedDate": "2013-08-14",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-08",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Revolving",
					"@_ChargeOffDate": "2018-06-07",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_CreditLimitAmount": "1000",
					"@_HighBalanceAmount": "1434",
					"@_HighCreditAmount": "1434",
					"@_LastActivityDate": "2018-02-15",
					"@_PastDueAmount": "1434",
					"@_UnpaidBalanceAmount": "1434",
					"@CreditBusinessType": "Banking",
					"@CreditLoanType": "CreditCard",
					"@CreditLoanTypeCode": "CC",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "Y",
					"@DateClosedIndicator": "F",
					"@LastPaymentDate": "2018-02-15",
					"@RawAccountStatus": "C",
					"@RawAccountType": "R",
					"@RawIndustryText": "BanksAndS&l",
					"@RawIndustryCode": "B",
					"@TradelineHashComplex": "a9ff0169ec7f8c1792e0baf7b53ce7cd",
					"@TradelineHashSimple": "b76b9032e25e5a2d08bf0e42911e302d",
					"@ArrayAccountIdentifier":
						"b804068c933408db72d3d0c69c116aa3",
					"@TUI_Handle": "TR01_-1447311878_-1768053833_82",
					_CREDITOR: {
						"@_Name": "WELLS FARGO",
						"@_StreetAddress": "PO BOX 14517",
						"@_City": "DES MOINES",
						"@_State": "IA",
						"@_PostalCode": "50306",
						"@_Phone": "8004624720",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8004624720",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2018-06-07",
						"@_Type": "CollectionOrChargeOff",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CBG",
							_Text: "ACCOUNT CLOSED BY CREDIT GRANTOR",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_-1447311878_-1768053833_82",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "0908N664",
					},
				},
				{
					"@CreditLiabilityID": "TRADE016",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01 RA01 EA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2023-04-30",
					"@_AccountClosedDate": "2022-04-30",
					"@_AccountIdentifier": "42578875600001",
					"@_AccountOpenedDate": "2019-08-06",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-04-30",
					"@_AccountStatusDate": "2022-04-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Open",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "599",
					"@_HighCreditAmount": "599",
					"@_LastActivityDate": "2022-04-30",
					"@_MonthlyPaymentAmount": "0",
					"@_MonthsReviewedCount": "13",
					"@_PastDueAmount": "599",
					"@_TermsMonthsCount": "1",
					"@_TermsDescription": "1M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "599",
					"@CreditBusinessType": "UtilitiesAndFuel",
					"@CreditLoanType": "Telecommunication/Cellular",
					"@CreditLoanTypeCode": "CU",
					"@_OriginalBalanceAmount": "599",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "Y",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "F",
					"@CollectionDate": "2022-04",
					"@RawAccountStatus": "C",
					"@RawAccountType": "O",
					"@RawIndustryText": "UtilitiesAndFuel",
					"@RawIndustryCode": "U",
					"@TradelineHashComplex": "b392d1df0bb0f677d3a08e78c5808c69",
					"@TradelineHashSimple": "6b7d5f60f4690626e28a416b7bd0ed67",
					"@ArrayAccountIdentifier":
						"f195e67f6677c78e234a724ca629f8a9",
					"@TUI_Handle": "TR01_-1904053575_689963484_79",
					_CREDITOR: {
						"@_Name": "VERIZON WIRELESS/SOU",
						"@_StreetAddress": "PO BOX 650051",
						"@_City": "DALLAS",
						"@_State": "TX",
						"@_PostalCode": "75265",
						"@_Phone": "INSTALLMEN",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "INSTALLMEN",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2022-04-30",
						"@_Type": "CollectionOrChargeOff",
					},
					_PAYMENT_PATTERN: {
						"@_Data":
							"9999999999999XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
						"@_StartDate": "2023-04-30",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "Experian",
							"@_Type": "StatusCode",
							"@_Code": "93",
							_Text: "ACCOUNT SERIOUSLY PAST DUE DATE/ACCOUNT ASSIGNED TO ATTORNEY, COLLECTION AGENCY, OR CREDIT GRANTOR'S INTERNAL COLLECTION DEPARTMENT",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_-1904053575_689963484_79",
						},
					],
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "01R2W002",
						},
						{
							"@_SourceType": "Equifax",
							"@_SubscriberCode": "401UT01469",
						},
						{
							"@_SourceType": "Experian",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE017",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2022-04-30",
					"@_AccountIdentifier": "42578875600001",
					"@_AccountOpenedDate": "2019-08-06",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-04-30",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Open",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "599",
					"@_HighCreditAmount": "599",
					"@_LastActivityDate": "2022-04-30",
					"@_PastDueAmount": "599",
					"@_UnpaidBalanceAmount": "599",
					"@CreditBusinessType": "UtilitiesAndFuel",
					"@CreditLoanType": "Telecommunication/Cellular",
					"@CreditLoanTypeCode": "CU",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "Y",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "F",
					"@CollectionDate": "2022-04",
					"@RawAccountStatus": "C",
					"@RawAccountType": "O",
					"@RawIndustryText": "UtilitiesAndFuel",
					"@RawIndustryCode": "U",
					"@TradelineHashComplex": "b392d1df0bb0f677d3a08e78c5808c69",
					"@TradelineHashSimple": "6b7d5f60f4690626e28a416b7bd0ed67",
					"@ArrayAccountIdentifier":
						"f195e67f6677c78e234a724ca629f8a9",
					"@TUI_Handle": "TR01_-1904053575_689963484_79",
					_CREDITOR: {
						"@_Name": "VERIZON",
						"@_StreetAddress": "NATIONAL RECOVERY OPERATIONS",
						"@_City": "MINNEAPOLIS",
						"@_State": "MN",
						"@_PostalCode": "55426",
						"@_Phone": "8008521922",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8008521922",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2022-04-30",
						"@_Type": "CollectionOrChargeOff",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLA",
							_Text: "PLACED FOR COLLECTION",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_-1904053575_689963484_79",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "01R2W002",
					},
				},
				{
					"@CreditLiabilityID": "TRADE018",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2023-04-30",
					"@_AccountIdentifier": "425788XXXXXXXX",
					"@_AccountOpenedDate": "2019-08-06",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-04-30",
					"@_AccountStatusDate": "2022-04-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "599",
					"@_HighCreditAmount": "599",
					"@_LastActivityDate": "2022-04-01",
					"@_MonthsReviewedCount": "13",
					"@_TermsMonthsCount": "1",
					"@_TermsDescription": "1 M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "599",
					"@CreditBusinessType": "UtilitiesAndFuel",
					"@CreditLoanType": "MobilePhone",
					"@CreditLoanTypeCode": "4D",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "Y",
					"@IsChargeoffIndicator": "N",
					"@CollectionDate": "2022-04",
					"@RawAccountType": "I",
					"@RawIndustryText": "WirelessTelephoneServiceProviders",
					"@RawIndustryCode": "UW",
					"@TradelineHashComplex": "397175c1844453ddbe2343b1adbbcd0f",
					"@TradelineHashSimple": "ce29a2eccaabf9e2a6f19a9adc0f989d",
					"@ArrayAccountIdentifier":
						"f195e67f6677c78e234a724ca629f8a9",
					_CREDITOR: {
						"@_Name": "VERIZON WIRELESS",
						"@_StreetAddress": "PO BOX 650051",
						"@_City": "DALLAS",
						"@_State": "TX",
						"@_PostalCode": "75265",
						"@_Phone": "INSTALLMEN",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "INSTALLMEN",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2022-04-01",
						"@_Type": "CollectionOrChargeOff",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "9999999999999",
						"@_StartDate": "2023-04-30",
					},
					CREDIT_COMMENT: {
						"@_SourceType": "Experian",
						"@_Type": "StatusCode",
						"@_Code": "93",
						_Text: "ACCOUNT SERIOUSLY PAST DUE DATE/ACCOUNT ASSIGNED TO ATTORNEY, COLLECTION AGENCY, OR CREDIT GRANTOR'S INTERNAL COLLECTION DEPARTMENT",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE019",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountIdentifier": "42578875600001",
					"@_AccountOpenedDate": "2019-08-06",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-04-30",
					"@_AccountStatusType": "Open",
					"@_AccountType": "Open",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "599",
					"@_HighCreditAmount": "599",
					"@_LastActivityDate": "2019-07-28",
					"@_MonthsReviewedCount": "1",
					"@_PastDueAmount": "599",
					"@_UnpaidBalanceAmount": "599",
					"@CreditBusinessType": "UtilitiesAndFuel",
					"@CreditLoanType": "MobilePhone",
					"@CreditLoanTypeCode": "4D",
					"@_OriginalBalanceAmount": "599",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "N",
					"@IsCollectionIndicator": "Y",
					"@IsChargeoffIndicator": "N",
					"@CollectionDate": "2019-08",
					"@RawAccountType": "O",
					"@RawIndustryText": "TelephoneCompanies",
					"@RawIndustryCode": "UT",
					"@TradelineHashComplex": "30c1bb7473bca7435cbadffbfa22bd8f",
					"@TradelineHashSimple": "5fd558e2b7bb4a56b451b4f3ff9e7878",
					"@ArrayAccountIdentifier":
						"f195e67f6677c78e234a724ca629f8a9",
					_CREDITOR: {
						"@_Name": "VERIZON WIRELESS/SOU",
						"@_StreetAddress": "P.O. BOX 26055",
						"@_City": "MINNEAPOLIS",
						"@_State": "MN",
						"@_PostalCode": "55426",
						"@_Phone": "8008521922",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8008521922",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data":
							"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
						"@_StartDate": "2023-03-30",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "Equifax",
							"@_Type": "BureauRemarks",
							"@_Code": "CZ",
							_Text: "COLLECTION ACCOUNT",
						},
						{
							"@_SourceType": "Equifax",
							"@_Type": "Other",
							"@_TypeOtherDescripton": "TrendedData",
							_Text: "<CREDIT_LIABILITY_PRIOR_INFORMATIONS>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-03/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>4D/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2023-01/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>4D/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-12/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>4D/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-11/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>4D/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-10/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>4D/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-09/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>4D/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-07/>\n\t\t\t\t\t\t<CreditLiabilityUnpaidBalanceAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityPastDueAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityComment1>CZ/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>4D/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-05/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>4D/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t<CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t\t<CreditLiabilityAccountReportedDate>2022-03/>\n\t\t\t\t\t\t<CreditLiabilityHighCreditAmount>599/>\n\t\t\t\t\t\t<CreditLiabilityAccountType>4D/>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_DETAIL>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATION>\n\t\t\t\t\t</CREDIT_LIABILITY_PRIOR_INFORMATIONS>",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "401UT01469",
					},
				},
				{
					"@CreditLiabilityID": "TRADE020",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountIdentifier": "5178057620776232",
					"@_AccountOpenedDate": "2017-10-25",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-04-18",
					"@_AccountStatusType": "Open",
					"@_AccountType": "Open",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "260",
					"@_LastActivityDate": "2023-04-18",
					"@_MonthlyPaymentAmount": "260",
					"@_OriginalCreditorName": "CAPITAL ONE BANK USA N A",
					"@_TermsDescription": "M$260",
					"@_TermsSourceType": "Calculated",
					"@_UnpaidBalanceAmount": "260",
					"@CreditBusinessType": "CollectionServices",
					"@_OriginalBalanceAmount": "000000260",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "N",
					"@IsCollectionIndicator": "Y",
					"@IsChargeoffIndicator": "N",
					"@CollectionDate": "2017-10",
					"@RawAccountStatus": "O",
					"@RawAccountType": "O",
					"@RawIndustryText": "CollectionServices",
					"@RawIndustryCode": "Y",
					"@TradelineHashComplex": "09369056b6faf79fd16f3c0c3608d6c8",
					"@TradelineHashSimple": "769161f70848506a412ce1f0e9118b35",
					"@ArrayAccountIdentifier":
						"29f99dc35525262fd3ccd2d13f066560",
					"@TUI_Handle": "TR01_914457434_519499383_89",
					_CREDITOR: {
						"@_Name": "PORTFOLIO RC",
						"@_StreetAddress": "120 CORPORATE BLVD STE 100",
						"@_City": "NORFOLK",
						"@_State": "VA",
						"@_PostalCode": "23502",
						"@_Phone": "8446753407",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8446753407",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2023-04-18",
						"@_Type": "CollectionOrChargeOff",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLA",
							_Text: "PLACED FOR COLLECTION",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_914457434_519499383_89",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "01KSE003",
					},
				},
				{
					"@CreditLiabilityID": "TRADE021",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01 RA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2023-05-28",
					"@_AccountIdentifier": "148933748",
					"@_AccountOpenedDate": "2023-01-23",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-28",
					"@_AccountStatusDate": "2023-01-01",
					"@_AccountStatusType": "Open",
					"@_AccountType": "Open",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "156",
					"@_LastActivityDate": "2023-05-28",
					"@_MonthsReviewedCount": "3",
					"@_OriginalCreditorName": "COMCAST XFINITY",
					"@_TermsMonthsCount": "1",
					"@_TermsDescription": "1M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "156",
					"@CreditBusinessType": "CollectionServices",
					"@CreditLoanType": "CollectionAttorney",
					"@_OriginalBalanceAmount": "156",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "N",
					"@IsCollectionIndicator": "Y",
					"@IsChargeoffIndicator": "N",
					"@CollectionDate": "2023-01",
					"@RawAccountStatus": "O",
					"@RawAccountType": "O",
					"@RawIndustryText": "CollectionServices",
					"@RawIndustryCode": "Y",
					"@TradelineHashComplex": "d8393b162b9ecd1ea7568366eced2605",
					"@TradelineHashSimple": "87e858dfea4193190809ead8c51e5357",
					"@ArrayAccountIdentifier":
						"cd0e381f42d1db23504415af39ed162b",
					"@TUI_Handle": "TR01_1902002359_832990074_89",
					_CREDITOR: {
						"@_Name": "I.C. SYSTEM, INC",
						"@_StreetAddress": "PO BOX 64378",
						"@_City": "SAINT PAUL",
						"@_State": "MN",
						"@_PostalCode": "55164",
						"@_Phone": "8887350516",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8887350516",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2023-05-28",
						"@_Type": "CollectionOrChargeOff",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "999",
						"@_StartDate": "2023-05-28",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "Experian",
							"@_Type": "StatusCode",
							"@_Code": "93",
							_Text: "ACCOUNT SERIOUSLY PAST DUE DATE/ACCOUNT ASSIGNED TO ATTORNEY, COLLECTION AGENCY, OR CREDIT GRANTOR'S INTERNAL COLLECTION DEPARTMENT",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_1902002359_832990074_89",
						},
					],
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "02834001",
						},
						{
							"@_SourceType": "Experian",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE022",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountIdentifier": "148933748",
					"@_AccountOpenedDate": "2023-01-23",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-28",
					"@_AccountStatusType": "Open",
					"@_AccountType": "Open",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "156",
					"@_LastActivityDate": "2023-05-28",
					"@_OriginalCreditorName": "COMCAST XFINITY",
					"@_UnpaidBalanceAmount": "156",
					"@CreditBusinessType": "CollectionServices",
					"@_OriginalBalanceAmount": "000000156",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "N",
					"@IsCollectionIndicator": "Y",
					"@IsChargeoffIndicator": "N",
					"@CollectionDate": "2023-01",
					"@RawAccountStatus": "O",
					"@RawAccountType": "O",
					"@RawIndustryText": "CollectionServices",
					"@RawIndustryCode": "Y",
					"@TradelineHashComplex": "d8393b162b9ecd1ea7568366eced2605",
					"@TradelineHashSimple": "87e858dfea4193190809ead8c51e5357",
					"@ArrayAccountIdentifier":
						"cd0e381f42d1db23504415af39ed162b",
					"@TUI_Handle": "TR01_1902002359_832990074_89",
					_CREDITOR: {
						"@_Name": "I C SYSTEM",
						"@_StreetAddress": "PO BOX 64378",
						"@_City": "SAINT PAUL",
						"@_State": "MN",
						"@_PostalCode": "55164",
						"@_Phone": "8887350516",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8887350516",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2023-05-28",
						"@_Type": "CollectionOrChargeOff",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLA",
							_Text: "PLACED FOR COLLECTION",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_1902002359_832990074_89",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "02834001",
					},
				},
				{
					"@CreditLiabilityID": "TRADE023",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2023-05-28",
					"@_AccountIdentifier": "148933XXX",
					"@_AccountOpenedDate": "2023-01-23",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2023-05-28",
					"@_AccountStatusDate": "2023-01-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "156",
					"@_LastActivityDate": "2023-01-01",
					"@_MonthsReviewedCount": "3",
					"@_OriginalCreditorName": "COMCAST XFINITY",
					"@_TermsMonthsCount": "1",
					"@_TermsDescription": "1 M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "156",
					"@CreditBusinessType": "CollectionServices",
					"@CreditLoanType": "CollectionAttorney",
					"@CreditLoanTypeCode": "48",
					"@_OriginalBalanceAmount": "156",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "Y",
					"@IsChargeoffIndicator": "N",
					"@CollectionDate": "2023-01",
					"@RawIndustryText": "OtherCollectionAgencies",
					"@RawIndustryCode": "YC",
					"@TradelineHashComplex": "296361d4b0d1ec3a5879a963ce59ed5d",
					"@TradelineHashSimple": "96e3f72e37436becfa8a646f8d052000",
					"@ArrayAccountIdentifier":
						"cd0e381f42d1db23504415af39ed162b",
					_CREDITOR: {
						"@_Name": "I.C. SYSTEM, INC",
						"@_StreetAddress": "PO BOX 64378",
						"@_City": "SAINT PAUL",
						"@_State": "MN",
						"@_PostalCode": "55164",
						"@_Phone": "8887350516",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8887350516",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Type": "CollectionOrChargeOff",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "9",
						"@_Date": "2023-01-01",
						"@_Type": "CollectionOrChargeOff",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "999",
						"@_StartDate": "2023-05-28",
					},
					CREDIT_COMMENT: {
						"@_SourceType": "Experian",
						"@_Type": "StatusCode",
						"@_Code": "93",
						_Text: "ACCOUNT SERIOUSLY PAST DUE DATE/ACCOUNT ASSIGNED TO ATTORNEY, COLLECTION AGENCY, OR CREDIT GRANTOR'S INTERNAL COLLECTION DEPARTMENT",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE024",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01 RA01 EA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2016-11-30",
					"@_AccountClosedDate": "2016-11-30",
					"@_AccountIdentifier": "R05967XXXXXXXXXXXXXXXXXX",
					"@_AccountOpenedDate": "2014-12-13",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountPaidDate": "2016-11-01",
					"@_AccountReportedDate": "2016-11-30",
					"@_AccountStatusDate": "2016-11-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "5771",
					"@_LastActivityDate": "2016-11-30",
					"@_MonthlyPaymentAmount": "0",
					"@_MonthsReviewedCount": "24",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "34",
					"@_TermsDescription": "34M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "RA",
					"@_OriginalBalanceAmount": "5771",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2016-11-30",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "aa65dcd79449d0fa17e47d804153586e",
					"@TradelineHashSimple": "2a0cc5d2f1cdb561c73ff4ed3d7dd128",
					"@ArrayAccountIdentifier":
						"534991ba13556dfee0966284beb2c101",
					"@TUI_Handle": "TR01_1249673639_1207135243_73",
					_CREDITOR: {
						"@_Name": "ACCEPTANCE NOW",
						"@_StreetAddress": "5501 HEADQUARTERS DR",
						"@_City": "PLANO",
						"@_State": "TX",
						"@_PostalCode": "75024",
						"@_Phone": "8886722411",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8886722411",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2016-11-30",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_1249673639_1207135243_73",
						},
					],
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "02E4W001",
						},
						{
							"@_SourceType": "Equifax",
							"@_SubscriberCode": "242HZ00053",
						},
						{
							"@_SourceType": "Experian",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE025",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2016-11-30",
					"@_AccountIdentifier": "0001092R0596701795",
					"@_AccountOpenedDate": "2014-12-13",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountReportedDate": "2016-11-30",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "5771",
					"@_LastActivityDate": "2016-11-30",
					"@_MonthsReviewedCount": "23",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "34",
					"@_TermsDescription": "34M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "RA",
					"@_OriginalBalanceAmount": "000005771",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2016-11-30",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "add9d0992e2d0c144c4a061d46ac99b9",
					"@TradelineHashSimple": "fc214f6b60806a81de848c6edee46413",
					"@ArrayAccountIdentifier":
						"5620318dfc1b972206ef6aa7b881d709",
					"@TUI_Handle": "TR01_1249673639_1207135243_73",
					_CREDITOR: {
						"@_Name": "ACEPTANCENOW",
						"@_StreetAddress": "5501 HEADQUARTERS DRIVE",
						"@_City": "PLANO",
						"@_State": "TX",
						"@_PostalCode": "75024",
						"@_Phone": "8002752696",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8002752696",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2016-10-30",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_1249673639_1207135243_73",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "02E4W001",
					},
				},
				{
					"@CreditLiabilityID": "TRADE026",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2016-11-30",
					"@_AccountIdentifier": "R05967XXXXXXXXXXXXXXXXXX",
					"@_AccountOpenedDate": "2014-12-13",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountReportedDate": "2016-11-30",
					"@_AccountStatusDate": "2016-11-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "5771",
					"@_LastActivityDate": "2016-11-01",
					"@_MonthsReviewedCount": "24",
					"@_TermsMonthsCount": "34",
					"@_TermsDescription": "34 M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "",
					"@CreditBusinessType": "HomeFurnishing",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "29",
					"@_OriginalBalanceAmount": "5771",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@RawAccountType": "I",
					"@RawIndustryText": "FurnitureRentals",
					"@RawIndustryCode": "HR",
					"@TradelineHashComplex": "8c50c558fe82b06953f0100567a75422",
					"@TradelineHashSimple": "c4d7310da0d0561f5d06529b4be29ccf",
					"@ArrayAccountIdentifier":
						"534991ba13556dfee0966284beb2c101",
					_CREDITOR: {
						"@_Name": "ACCEPTANCE NOW",
						"@_StreetAddress": "5501 HEADQUARTERS DR",
						"@_City": "PLANO",
						"@_State": "TX",
						"@_PostalCode": "75024",
						"@_Phone": "8886722411",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8886722411",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2016-11-30",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE027",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2016-11-01",
					"@_AccountIdentifier": "670001092R0596701795",
					"@_AccountOpenedDate": "2014-12-13",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountPaidDate": "2016-11-01",
					"@_AccountReportedDate": "2016-11-30",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "5771",
					"@_HighCreditAmount": "5771",
					"@_LastActivityDate": "2016-11-01",
					"@_MonthsReviewedCount": "19",
					"@_TermsMonthsCount": "34",
					"@_TermsDescription": "34M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "HomeFurnishing",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "29",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@LastPaymentDate": "2016-11-01",
					"@RawAccountType": "I",
					"@RawIndustryText": "HomeFurnishingsMiscellaneous",
					"@RawIndustryCode": "HZ",
					"@TradelineHashComplex": "21d50c18974faad306dc5a7fc79a1efe",
					"@TradelineHashSimple": "b2e20d986ec8255ede77eb4b942d42f3",
					"@ArrayAccountIdentifier":
						"a50e7fe4d74cbcf8ca0788e0f1083236",
					_CREDITOR: {
						"@_Name": "ACCEPTANCE NOW",
						"@_StreetAddress": "5501 HEADQUARTERS DRIVE",
						"@_City": "PLANO",
						"@_State": "TX",
						"@_PostalCode": "75024",
						"@_Phone": "8002752696",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8002752696",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "242HZ00053",
					},
				},
				{
					"@CreditLiabilityID": "TRADE028",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01 RA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2015-02-28",
					"@_AccountClosedDate": "2015-02-28",
					"@_AccountIdentifier": "R05665XXXXXXXXXXXXXXXXXX",
					"@_AccountOpenedDate": "2013-04-29",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2015-02-28",
					"@_AccountStatusDate": "2015-02-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "4499",
					"@_LastActivityDate": "2015-02-28",
					"@_MonthlyPaymentAmount": "0",
					"@_MonthsReviewedCount": "23",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "36",
					"@_TermsDescription": "36M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "RA",
					"@_OriginalBalanceAmount": "4499",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2015-02-28",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "321aa98ec4ba93ab248a54e72822c23d",
					"@TradelineHashSimple": "e6d4b858e4e0a342af92029cbf810b2b",
					"@ArrayAccountIdentifier":
						"fd52b47a8af5380465af524c976e64e1",
					"@TUI_Handle": "TR01_-1955577015_1207135243_73",
					_CREDITOR: {
						"@_Name": "ACCEPTANCE NOW",
						"@_StreetAddress": "5501 HEADQUARTERS DR",
						"@_City": "PLANO",
						"@_State": "TX",
						"@_PostalCode": "75024",
						"@_Phone": "8886722411",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8886722411",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2015-02-28",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_-1955577015_1207135243_73",
						},
					],
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "02E4W001",
						},
						{
							"@_SourceType": "Experian",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE029",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2015-02-28",
					"@_AccountIdentifier": "0000386R0566500217",
					"@_AccountOpenedDate": "2013-04-29",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2015-02-28",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "4499",
					"@_LastActivityDate": "2015-02-28",
					"@_MonthsReviewedCount": "22",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "36",
					"@_TermsDescription": "36M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "RA",
					"@_OriginalBalanceAmount": "000004499",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2015-02-28",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "242cb997e4a610b1ee52929bcfbd270c",
					"@TradelineHashSimple": "3c4afa40d6e9ec7000c7d0a102138ce6",
					"@ArrayAccountIdentifier":
						"5a7c3871aff517106cb77eb654c46b25",
					"@TUI_Handle": "TR01_-1955577015_1207135243_73",
					_CREDITOR: {
						"@_Name": "ACEPTANCENOW",
						"@_StreetAddress": "5501 HEADQUARTERS DRIVE",
						"@_City": "PLANO",
						"@_State": "TX",
						"@_PostalCode": "75024",
						"@_Phone": "8002752696",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8002752696",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2015-01-28",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_-1955577015_1207135243_73",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "02E4W001",
					},
				},
				{
					"@CreditLiabilityID": "TRADE030",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2015-02-28",
					"@_AccountIdentifier": "R05665XXXXXXXXXXXXXXXXXX",
					"@_AccountOpenedDate": "2013-04-29",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2015-02-28",
					"@_AccountStatusDate": "2015-02-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "4499",
					"@_LastActivityDate": "2015-02-01",
					"@_MonthsReviewedCount": "23",
					"@_TermsMonthsCount": "36",
					"@_TermsDescription": "36 M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "",
					"@CreditBusinessType": "HomeFurnishing",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "29",
					"@_OriginalBalanceAmount": "4499",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@RawAccountType": "I",
					"@RawIndustryText": "FurnitureRentals",
					"@RawIndustryCode": "HR",
					"@TradelineHashComplex": "57a330e6e96e0dabf19827e2f08cda3f",
					"@TradelineHashSimple": "dd66bb1206dadc1c1670a276555b455b",
					"@ArrayAccountIdentifier":
						"fd52b47a8af5380465af524c976e64e1",
					_CREDITOR: {
						"@_Name": "ACCEPTANCE NOW",
						"@_StreetAddress": "5501 HEADQUARTERS DR",
						"@_City": "PLANO",
						"@_State": "TX",
						"@_PostalCode": "75024",
						"@_Phone": "8886722411",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8886722411",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2015-02-28",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE031",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01 RA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2015-02-28",
					"@_AccountClosedDate": "2015-02-27",
					"@_AccountIdentifier": "R05967XXXXXXXXXXXXXXXXXX",
					"@_AccountOpenedDate": "2013-08-17",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountReportedDate": "2015-02-28",
					"@_AccountStatusDate": "2015-02-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "4301",
					"@_LastActivityDate": "2015-02-27",
					"@_MonthlyPaymentAmount": "0",
					"@_MonthsReviewedCount": "19",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "29",
					"@_TermsDescription": "29M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "RA",
					"@_OriginalBalanceAmount": "4301",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2015-02-27",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "19ecd6e9914908349a4c6edb5995cd36",
					"@TradelineHashSimple": "2a0cc5d2f1cdb561c73ff4ed3d7dd128",
					"@ArrayAccountIdentifier":
						"8c7d6e302ffc3a910947f2d4e5c46df4",
					"@TUI_Handle": "TR01_1249643596_1207135243_73",
					_CREDITOR: {
						"@_Name": "ACCEPTANCE NOW",
						"@_StreetAddress": "5501 HEADQUARTERS DR",
						"@_City": "PLANO",
						"@_State": "TX",
						"@_PostalCode": "75024",
						"@_Phone": "8886722411",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8886722411",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2015-02-28",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_1249643596_1207135243_73",
						},
					],
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "02E4W001",
						},
						{
							"@_SourceType": "Experian",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE032",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2015-02-27",
					"@_AccountIdentifier": "0001092R0596700711",
					"@_AccountOpenedDate": "2013-08-17",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountReportedDate": "2015-02-27",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "4301",
					"@_LastActivityDate": "2015-02-27",
					"@_MonthsReviewedCount": "18",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "29",
					"@_TermsDescription": "29M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "RA",
					"@_OriginalBalanceAmount": "000004301",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2015-02-27",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "50052f625134b52fac9f0b10818ee4f0",
					"@TradelineHashSimple": "fc214f6b60806a81de848c6edee46413",
					"@ArrayAccountIdentifier":
						"bbcd6bc6df7ea4f37c7d195def08ccce",
					"@TUI_Handle": "TR01_1249643596_1207135243_73",
					_CREDITOR: {
						"@_Name": "ACEPTANCENOW",
						"@_StreetAddress": "5501 HEADQUARTERS DRIVE",
						"@_City": "PLANO",
						"@_State": "TX",
						"@_PostalCode": "75024",
						"@_Phone": "8002752696",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8002752696",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2015-01-27",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_1249643596_1207135243_73",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "02E4W001",
					},
				},
				{
					"@CreditLiabilityID": "TRADE033",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2015-02-28",
					"@_AccountIdentifier": "R05967XXXXXXXXXXXXXXXXXX",
					"@_AccountOpenedDate": "2013-08-17",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountReportedDate": "2015-02-28",
					"@_AccountStatusDate": "2015-02-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "4301",
					"@_LastActivityDate": "2015-02-01",
					"@_MonthsReviewedCount": "19",
					"@_TermsMonthsCount": "29",
					"@_TermsDescription": "29 M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "",
					"@CreditBusinessType": "HomeFurnishing",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "29",
					"@_OriginalBalanceAmount": "4301",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@RawAccountType": "I",
					"@RawIndustryText": "FurnitureRentals",
					"@RawIndustryCode": "HR",
					"@TradelineHashComplex": "3618cdf60b6c4c6736b1ef0b67688b1f",
					"@TradelineHashSimple": "c4d7310da0d0561f5d06529b4be29ccf",
					"@ArrayAccountIdentifier":
						"8c7d6e302ffc3a910947f2d4e5c46df4",
					_CREDITOR: {
						"@_Name": "ACCEPTANCE NOW",
						"@_StreetAddress": "5501 HEADQUARTERS DR",
						"@_City": "PLANO",
						"@_State": "TX",
						"@_PostalCode": "75024",
						"@_Phone": "8886722411",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8886722411",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2015-02-28",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE034",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2021-01-31",
					"@_AccountIdentifier": "R06019XXXXXXXXXXXXXXXXXX",
					"@_AccountOpenedDate": "2020-06-12",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2021-01-31",
					"@_AccountStatusDate": "2021-01-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "Y",
					"@_HighBalanceAmount": "4599",
					"@_LastActivityDate": "2021-01-01",
					"@_MonthsReviewedCount": "8",
					"@_TermsMonthsCount": "20",
					"@_TermsDescription": "20 M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "",
					"@CreditBusinessType": "HomeFurnishing",
					"@CreditLoanType": "RentalAgreement",
					"@CreditLoanTypeCode": "29",
					"@_OriginalBalanceAmount": "4599",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@RawAccountType": "I",
					"@RawIndustryText": "FurnitureRentals",
					"@RawIndustryCode": "HR",
					"@TradelineHashComplex": "bbb3763e799a6082fe12d2aea79e8f53",
					"@TradelineHashSimple": "a1a7219a35c30a9f323243a06db726f8",
					"@ArrayAccountIdentifier":
						"24fa342a6bb47faeef13feb10b56d287",
					_CREDITOR: {
						"@_Name": "ACCEPTANCE NOW",
						"@_StreetAddress": "5501 HEADQUARTERS DR",
						"@_City": "PLANO",
						"@_State": "TX",
						"@_PostalCode": "75024",
						"@_Phone": "8886722411",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8886722411",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_HIGHEST_ADVERSE_RATING: {
						"@_Code": "2",
						"@_Type": "Late30Days",
					},
					_LATE_COUNT: {
						"@_30Days": "1",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_MOST_RECENT_ADVERSE_RATING: {
						"@_Code": "2",
						"@_Type": "Late30Days",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCC1CCC",
						"@_StartDate": "2021-01-31",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE035",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountClosedDate": "2003-11-01",
					"@_AccountIdentifier": "76566208",
					"@_AccountOpenedDate": "2001-11-28",
					"@_AccountOwnershipType": "Individual",
					"@_AccountPaidDate": "2004-12-01",
					"@_AccountReportedDate": "2014-09-30",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "12465",
					"@_HighCreditAmount": "12465",
					"@_LastActivityDate": "2004-12-01",
					"@_MonthlyPaymentAmount": "0",
					"@_MonthsReviewedCount": "99",
					"@_TermsMonthsCount": "66",
					"@_TermsDescription": "66M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "Automobile",
					"@CreditLoanTypeCode": "00",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@LastPaymentDate": "2004-12-01",
					"@RawAccountType": "I",
					"@RawIndustryText": "CreditUnions",
					"@RawIndustryCode": "FC",
					"@TradelineHashComplex": "4559a895f9f7f4ce049ab6bd74966143",
					"@TradelineHashSimple": "0aa17c5306b88d8b62b48b52400b1d52",
					"@ArrayAccountIdentifier":
						"71544909c080e5ffe7b4e70e0ab1ee42",
					_CREDITOR: {
						"@_Name": "BRIGHTSTAR CREDIT UN",
						"@_StreetAddress": "1879 N STATE ROAD 7",
						"@_City": "LAUDERHILL",
						"@_State": "FL",
						"@_PostalCode": "333135009",
						"@_Phone": "9544862735",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "9544862735",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "403FC00035",
					},
				},
				{
					"@CreditLiabilityID": "TRADE036",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01 RA01 EA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2015-01-31",
					"@_AccountClosedDate": "2015-01-12",
					"@_AccountIdentifier": "30000133021861000",
					"@_AccountOpenedDate": "2014-07-12",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountPaidDate": "2015-01-01",
					"@_AccountReportedDate": "2015-01-31",
					"@_AccountStatusDate": "2015-01-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "22025",
					"@_LastActivityDate": "2015-01-12",
					"@_MonthlyPaymentAmount": "0",
					"@_MonthsReviewedCount": "7",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "75",
					"@_TermsDescription": "75M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "AutoLoan",
					"@CreditLoanTypeCode": "AU",
					"@_OriginalBalanceAmount": "22025",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2015-01-12",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "6f4a86bb286f723b799cac31afad11c2",
					"@TradelineHashSimple": "06d5683dad30853768526b52293b8f6b",
					"@ArrayAccountIdentifier":
						"d6599601a262325aca147e1655e2b498",
					"@TUI_Handle": "TR01_-1355950450_1205645693_73",
					_CREDITOR: {
						"@_Name": "CHRYSLER CAPITAL",
						"@_StreetAddress": "PO BOX 961275",
						"@_City": "FORT WORTH",
						"@_State": "TX",
						"@_PostalCode": "76161",
						"@_Phone": "8004237712",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8004237712",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCC",
						"@_StartDate": "2015-01-31",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_-1355950450_1205645693_73",
						},
					],
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "02E3D001",
						},
						{
							"@_SourceType": "Equifax",
							"@_SubscriberCode": "242FA00022",
						},
						{
							"@_SourceType": "Experian",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE037",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2015-01-12",
					"@_AccountIdentifier": "30000133021861000",
					"@_AccountOpenedDate": "2014-07-12",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountReportedDate": "2015-01-12",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "22025",
					"@_LastActivityDate": "2015-01-12",
					"@_MonthsReviewedCount": "5",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "75",
					"@_TermsDescription": "75M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "AutoLoan",
					"@CreditLoanTypeCode": "AU",
					"@_OriginalBalanceAmount": "000022025",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2015-01-12",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "6f4a86bb286f723b799cac31afad11c2",
					"@TradelineHashSimple": "06d5683dad30853768526b52293b8f6b",
					"@ArrayAccountIdentifier":
						"d6599601a262325aca147e1655e2b498",
					"@TUI_Handle": "TR01_-1355950450_1205645693_73",
					_CREDITOR: {
						"@_Name": "CHRYSLERCAP",
						"@_StreetAddress": "PO BOX 961211",
						"@_City": "FORT WORTH",
						"@_State": "TX",
						"@_PostalCode": "76161",
						"@_Phone": "8555635635",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8555635635",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCC",
						"@_StartDate": "2014-12-12",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_-1355950450_1205645693_73",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "02E3D001",
					},
				},
				{
					"@CreditLiabilityID": "TRADE038",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2015-01-31",
					"@_AccountIdentifier": "300001XXXXXXXXXXX",
					"@_AccountOpenedDate": "2014-07-12",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountReportedDate": "2015-01-31",
					"@_AccountStatusDate": "2015-01-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "22025",
					"@_LastActivityDate": "2015-01-01",
					"@_MonthsReviewedCount": "7",
					"@_TermsMonthsCount": "75",
					"@_TermsDescription": "75 M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "Automobile",
					"@CreditLoanTypeCode": "00",
					"@_OriginalBalanceAmount": "22025",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutomobileFinancingCompany",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "5901d04d5b957ebec9a54350c3527688",
					"@TradelineHashSimple": "10e6f40428a4f1e998107b9bafb3a6f3",
					"@ArrayAccountIdentifier":
						"d6599601a262325aca147e1655e2b498",
					_CREDITOR: {
						"@_Name": "CHRYSLER CAPITAL",
						"@_StreetAddress": "PO BOX 961275",
						"@_City": "FORT WORTH",
						"@_State": "TX",
						"@_PostalCode": "76161",
						"@_Phone": "8004237712",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8004237712",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCC",
						"@_StartDate": "2015-01-31",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE039",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2015-01-01",
					"@_AccountIdentifier": "30000133021861000",
					"@_AccountOpenedDate": "2014-07-12",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountPaidDate": "2015-01-01",
					"@_AccountReportedDate": "2015-01-31",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "22025",
					"@_HighCreditAmount": "22025",
					"@_LastActivityDate": "2015-01-01",
					"@_MonthsReviewedCount": "5",
					"@_TermsMonthsCount": "75",
					"@_TermsDescription": "75M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "Automobile",
					"@CreditLoanTypeCode": "00",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@LastPaymentDate": "2015-01-01",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutoFinancing",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "a5bbcb1f5014ab9524e8103e51d88cb3",
					"@TradelineHashSimple": "3227673b0fbfb28a11979d385f546979",
					"@ArrayAccountIdentifier":
						"d6599601a262325aca147e1655e2b498",
					_CREDITOR: {
						"@_Name": "CHRYSLER CAPITAL",
						"@_StreetAddress": "PO BOX 961275",
						"@_City": "FT WORTH",
						"@_State": "TX",
						"@_PostalCode": "76161",
						"@_Phone": "8004237712",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8004237712",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "242FA00022",
					},
				},
				{
					"@CreditLiabilityID": "TRADE040",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountClosedDate": "2006-12-01",
					"@_AccountIdentifier": "5256500309261609",
					"@_AccountOpenedDate": "2005-11-01",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2014-02-15",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Revolving",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_CreditLimitAmount": "4000",
					"@_HighBalanceAmount": "0",
					"@_HighCreditAmount": "0",
					"@_LastActivityDate": "2005-11-01",
					"@_MonthlyPaymentAmount": "0",
					"@_MonthsReviewedCount": "99",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Banking",
					"@CreditLoanType": "CreditCard",
					"@CreditLoanTypeCode": "18",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@RawAccountType": "R",
					"@RawIndustryText": "AllBanks",
					"@RawIndustryCode": "BB",
					"@TradelineHashComplex": "bfa8139e05fa3127b050637029a07073",
					"@TradelineHashSimple": "90e7505e52772b636250b44c7c0b5ec4",
					"@ArrayAccountIdentifier":
						"6ae9b59dffaa7e7d7c3bff9aa4144520",
					_CREDITOR: {
						"@_Name": "CITIBANK CBNA",
						"@_StreetAddress": "PO BOX 6497",
						"@_City": "SIOUX FALLS",
						"@_State": "SD",
						"@_PostalCode": "57117",
						"@_Phone": "MAIL ONLY",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": " MAIL ONLY",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					CREDIT_COMMENT: {
						"@_SourceType": "Equifax",
						"@_Type": "BureauRemarks",
						"@_Code": "CW",
						_Text: "ACCOUNT CLOSED BY CREDIT GRANTOR",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "485BB00747",
					},
				},
				{
					"@CreditLiabilityID": "TRADE041",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01 RA01 EA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2016-08-31",
					"@_AccountClosedDate": "2016-08-18",
					"@_AccountIdentifier": "110000003291698",
					"@_AccountOpenedDate": "2014-12-31",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountPaidDate": "2016-08-01",
					"@_AccountReportedDate": "2016-08-31",
					"@_AccountStatusDate": "2016-08-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "29542",
					"@_LastActivityDate": "2016-08-18",
					"@_MonthlyPaymentAmount": "0",
					"@_MonthsReviewedCount": "20",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "75",
					"@_TermsDescription": "75M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "AutoLoan",
					"@CreditLoanTypeCode": "AU",
					"@_OriginalBalanceAmount": "29542",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2016-08-18",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "112234d516b22490cd8ffb8675421262",
					"@TradelineHashSimple": "fa8bde95fc518a64f49143b52130c8a1",
					"@ArrayAccountIdentifier":
						"835f3e8a6241adb2cfbdcf5da6e5c15a",
					"@TUI_Handle": "TR01_2054261918_803586362_73",
					_CREDITOR: {
						"@_Name": "SETOYOTA FIN DBA OF WO",
						"@_StreetAddress": "PO BOX 91614",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "36691",
						"@_Phone": "BYMAILONLY",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "BYMAILONLY",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2016-08-31",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_2054261918_803586362_73",
						},
					],
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "02729006",
						},
						{
							"@_SourceType": "Equifax",
							"@_SubscriberCode": "402FA13866",
						},
						{
							"@_SourceType": "Experian",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE042",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2016-08-18",
					"@_AccountIdentifier": "110000003291698",
					"@_AccountOpenedDate": "2014-12-31",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountReportedDate": "2016-08-18",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "29542",
					"@_LastActivityDate": "2016-08-18",
					"@_MonthsReviewedCount": "19",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "75",
					"@_TermsDescription": "75M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "AutoLoan",
					"@CreditLoanTypeCode": "AU",
					"@_OriginalBalanceAmount": "000029542",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2016-08-18",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "112234d516b22490cd8ffb8675421262",
					"@TradelineHashSimple": "fa8bde95fc518a64f49143b52130c8a1",
					"@ArrayAccountIdentifier":
						"835f3e8a6241adb2cfbdcf5da6e5c15a",
					"@TUI_Handle": "TR01_2054261918_803586362_73",
					_CREDITOR: {
						"@_Name": "SETF/WOFC",
						"@_StreetAddress": "PO BOX 91614",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "36691",
						"@_Phone": "8005532650",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8005532650",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2016-07-18",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_2054261918_803586362_73",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "02729006",
					},
				},
				{
					"@CreditLiabilityID": "TRADE043",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2016-08-31",
					"@_AccountIdentifier": "110000XXXXXXXXX",
					"@_AccountOpenedDate": "2014-12-31",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountReportedDate": "2016-08-31",
					"@_AccountStatusDate": "2016-08-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "29542",
					"@_LastActivityDate": "2016-08-01",
					"@_MonthsReviewedCount": "20",
					"@_TermsMonthsCount": "75",
					"@_TermsDescription": "75 M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "Automobile",
					"@CreditLoanTypeCode": "00",
					"@_OriginalBalanceAmount": "29542",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutomobileFinancingCompany",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "063fb34ffd1d7c035564d59ea789d651",
					"@TradelineHashSimple": "f17400625295e6741bafe52029861504",
					"@ArrayAccountIdentifier":
						"835f3e8a6241adb2cfbdcf5da6e5c15a",
					_CREDITOR: {
						"@_Name": "SETOYOTA FIN DBA OF WO",
						"@_StreetAddress": "PO BOX 91614",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "36691",
						"@_Phone": "BYMAILONLY",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "BYMAILONLY",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2016-08-31",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE044",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2016-08-01",
					"@_AccountIdentifier": "110000003291698",
					"@_AccountOpenedDate": "2014-12-31",
					"@_AccountOwnershipType": "JointContractualLiability",
					"@_AccountPaidDate": "2016-08-01",
					"@_AccountReportedDate": "2016-08-31",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "29542",
					"@_HighCreditAmount": "29542",
					"@_LastActivityDate": "2016-08-01",
					"@_MonthsReviewedCount": "19",
					"@_TermsMonthsCount": "75",
					"@_TermsDescription": "75M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "Automobile",
					"@CreditLoanTypeCode": "00",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@LastPaymentDate": "2016-08-01",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutoFinancing",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "68bbf54573bc1603aedfeeb03670cf1b",
					"@TradelineHashSimple": "877fbaf295babf893ce697dcbdce89f0",
					"@ArrayAccountIdentifier":
						"835f3e8a6241adb2cfbdcf5da6e5c15a",
					_CREDITOR: {
						"@_Name": "SETF/WOFC",
						"@_StreetAddress": "P.O. BOX 991817",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "366911817",
						"@_Phone": "8005332650",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8005332650",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "402FA13866",
					},
				},
				{
					"@CreditLiabilityID": "TRADE045",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01 TA01 EA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2015-01-31",
					"@_AccountClosedDate": "2015-01-08",
					"@_AccountIdentifier": "110000XXXXXXXXX",
					"@_AccountOpenedDate": "2013-11-28",
					"@_AccountOwnershipType": "Individual",
					"@_AccountPaidDate": "2014-12-01",
					"@_AccountReportedDate": "2015-01-31",
					"@_AccountStatusDate": "2015-01-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "27297",
					"@_LastActivityDate": "2015-01-01",
					"@_MonthlyPaymentAmount": "0",
					"@_MonthsReviewedCount": "14",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "60",
					"@_TermsDescription": "60M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "AutoLoan",
					"@CreditLoanTypeCode": "00",
					"@_OriginalBalanceAmount": "27297",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2014-12-29",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutomobileFinancingCompany",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "80df4716ed7dffad7dec9f1faaddb765",
					"@TradelineHashSimple": "f17400625295e6741bafe52029861504",
					"@ArrayAccountIdentifier":
						"6eee43eace8423aef345a3e36a08a3ce",
					_CREDITOR: {
						"@_Name": "SETOYOTA FIN DBA OF WO",
						"@_StreetAddress": "PO BOX 91614",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "36691",
						"@_Phone": "BYMAILONLY",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "BYMAILONLY",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCC",
						"@_StartDate": "2015-01-31",
					},
					CREDIT_COMMENT: {
						"@_SourceType": "TransUnion",
						"@_Type": "BureauRemarks",
						"@_Code": "CLO",
						_Text: "CLOSED",
					},
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "Experian",
						},
						{
							"@_SourceType": "Equifax",
							"@_SubscriberCode": "402FA13866",
						},
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "02729006",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE046",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2015-01-31",
					"@_AccountIdentifier": "110000XXXXXXXXX",
					"@_AccountOpenedDate": "2013-11-28",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2015-01-31",
					"@_AccountStatusDate": "2015-01-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "27297",
					"@_LastActivityDate": "2015-01-01",
					"@_MonthsReviewedCount": "14",
					"@_TermsMonthsCount": "60",
					"@_TermsDescription": "60 M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "Automobile",
					"@CreditLoanTypeCode": "00",
					"@_OriginalBalanceAmount": "27297",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutomobileFinancingCompany",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "80df4716ed7dffad7dec9f1faaddb765",
					"@TradelineHashSimple": "f17400625295e6741bafe52029861504",
					"@ArrayAccountIdentifier":
						"6eee43eace8423aef345a3e36a08a3ce",
					_CREDITOR: {
						"@_Name": "SETOYOTA FIN DBA OF WO",
						"@_StreetAddress": "PO BOX 91614",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "36691",
						"@_Phone": "BYMAILONLY",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "BYMAILONLY",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCC",
						"@_StartDate": "2015-01-31",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE047",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2015-01-08",
					"@_AccountIdentifier": "110000003093704",
					"@_AccountOpenedDate": "2013-11-28",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2015-01-08",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "27297",
					"@_LastActivityDate": "2014-12-29",
					"@_MonthsReviewedCount": "13",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "60",
					"@_TermsDescription": "60M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "AutoLoan",
					"@CreditLoanTypeCode": "AU",
					"@_OriginalBalanceAmount": "000027297",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2014-12-29",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "d623008404800b76521fea568e4e7a43",
					"@TradelineHashSimple": "fa8bde95fc518a64f49143b52130c8a1",
					"@ArrayAccountIdentifier":
						"6eee43eace8423aef345a3e36a08a3ce",
					"@TUI_Handle": "TR01_1997063876_803586362_73",
					_CREDITOR: {
						"@_Name": "SETF/WOFC",
						"@_StreetAddress": "PO BOX 91614",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "36691",
						"@_Phone": "8005532650",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8005532650",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCC",
						"@_StartDate": "2014-12-08",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_1997063876_803586362_73",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "02729006",
					},
				},
				{
					"@CreditLiabilityID": "TRADE048",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2015-01-01",
					"@_AccountIdentifier": "110000003093704",
					"@_AccountOpenedDate": "2013-11-28",
					"@_AccountOwnershipType": "Individual",
					"@_AccountPaidDate": "2014-12-01",
					"@_AccountReportedDate": "2015-01-31",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "27297",
					"@_HighCreditAmount": "27297",
					"@_LastActivityDate": "2014-12-01",
					"@_MonthsReviewedCount": "13",
					"@_TermsMonthsCount": "60",
					"@_TermsDescription": "60M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "Automobile",
					"@CreditLoanTypeCode": "00",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@LastPaymentDate": "2014-12-01",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutoFinancing",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "19475691d734a015f1376819624343b9",
					"@TradelineHashSimple": "877fbaf295babf893ce697dcbdce89f0",
					"@ArrayAccountIdentifier":
						"6eee43eace8423aef345a3e36a08a3ce",
					_CREDITOR: {
						"@_Name": "SETF/WOFC",
						"@_StreetAddress": "P.O. BOX 991817",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "366911817",
						"@_Phone": "8005332650",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8005332650",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "402FA13866",
					},
				},
				{
					"@CreditLiabilityID": "TRADE049",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01 TA01 EA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2013-12-31",
					"@_AccountClosedDate": "2013-12-13",
					"@_AccountIdentifier": "110000XXXXXXXXX",
					"@_AccountOpenedDate": "2013-04-05",
					"@_AccountOwnershipType": "Individual",
					"@_AccountPaidDate": "2013-11-01",
					"@_AccountReportedDate": "2013-12-31",
					"@_AccountStatusDate": "2013-12-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "25818",
					"@_LastActivityDate": "2013-12-01",
					"@_MonthlyPaymentAmount": "0",
					"@_MonthsReviewedCount": "9",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "75",
					"@_TermsDescription": "75M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "AutoLoan",
					"@CreditLoanTypeCode": "00",
					"@_OriginalBalanceAmount": "25818",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2013-11-19",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutomobileFinancingCompany",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "cd669cdb710b0a8f981336cc7e5ad110",
					"@TradelineHashSimple": "f17400625295e6741bafe52029861504",
					"@ArrayAccountIdentifier":
						"730ef9e9d9cd39e2b4568b16b6df5c96",
					_CREDITOR: {
						"@_Name": "SETOYOTA FIN DBA OF WO",
						"@_StreetAddress": "PO BOX 91614",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "36691",
						"@_Phone": "BYMAILONLY",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "BYMAILONLY",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCC",
						"@_StartDate": "2013-12-31",
					},
					CREDIT_COMMENT: {
						"@_SourceType": "TransUnion",
						"@_Type": "BureauRemarks",
						"@_Code": "CLO",
						_Text: "CLOSED",
					},
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "Experian",
						},
						{
							"@_SourceType": "Equifax",
							"@_SubscriberCode": "402FA13866",
						},
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "02729006",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE050",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2013-12-31",
					"@_AccountIdentifier": "110000XXXXXXXXX",
					"@_AccountOpenedDate": "2013-04-05",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2013-12-31",
					"@_AccountStatusDate": "2013-12-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "25818",
					"@_LastActivityDate": "2013-12-01",
					"@_MonthsReviewedCount": "9",
					"@_TermsMonthsCount": "75",
					"@_TermsDescription": "75 M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "Automobile",
					"@CreditLoanTypeCode": "00",
					"@_OriginalBalanceAmount": "25818",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutomobileFinancingCompany",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "cd669cdb710b0a8f981336cc7e5ad110",
					"@TradelineHashSimple": "f17400625295e6741bafe52029861504",
					"@ArrayAccountIdentifier":
						"730ef9e9d9cd39e2b4568b16b6df5c96",
					_CREDITOR: {
						"@_Name": "SETOYOTA FIN DBA OF WO",
						"@_StreetAddress": "PO BOX 91614",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "36691",
						"@_Phone": "BYMAILONLY",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "BYMAILONLY",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCC",
						"@_StartDate": "2013-12-31",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditLiabilityID": "TRADE051",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2013-12-13",
					"@_AccountIdentifier": "110000002721754",
					"@_AccountOpenedDate": "2013-04-05",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2013-12-13",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "25818",
					"@_LastActivityDate": "2013-11-19",
					"@_MonthsReviewedCount": "8",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "75",
					"@_TermsDescription": "75M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "AutoLoan",
					"@CreditLoanTypeCode": "AU",
					"@_OriginalBalanceAmount": "000025818",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2013-11-19",
					"@RawAccountStatus": "C",
					"@RawAccountType": "I",
					"@RawIndustryText": "Finance/personal",
					"@RawIndustryCode": "F",
					"@TradelineHashComplex": "d6f8d36d567c1b101b15cdc5488c4916",
					"@TradelineHashSimple": "fa8bde95fc518a64f49143b52130c8a1",
					"@ArrayAccountIdentifier":
						"730ef9e9d9cd39e2b4568b16b6df5c96",
					"@TUI_Handle": "TR01_1303440178_803586362_73",
					_CREDITOR: {
						"@_Name": "SETF/WOFC",
						"@_StreetAddress": "PO BOX 91614",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "36691",
						"@_Phone": "8005532650",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8005532650",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCC",
						"@_StartDate": "2013-11-13",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_1303440178_803586362_73",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "02729006",
					},
				},
				{
					"@CreditLiabilityID": "TRADE052",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2013-12-01",
					"@_AccountIdentifier": "110000002721754",
					"@_AccountOpenedDate": "2013-04-05",
					"@_AccountOwnershipType": "Individual",
					"@_AccountPaidDate": "2013-11-01",
					"@_AccountReportedDate": "2013-12-31",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Installment",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "25818",
					"@_HighCreditAmount": "25818",
					"@_LastActivityDate": "2013-11-01",
					"@_MonthsReviewedCount": "8",
					"@_TermsMonthsCount": "75",
					"@_TermsDescription": "75M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "Automobile",
					"@CreditLoanTypeCode": "00",
					"@IsMortgageIndicator": "N",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@LastPaymentDate": "2013-11-01",
					"@RawAccountType": "I",
					"@RawIndustryText": "AutoFinancing",
					"@RawIndustryCode": "FA",
					"@TradelineHashComplex": "864b2e4d741369c3a14ffcceb82b31b7",
					"@TradelineHashSimple": "877fbaf295babf893ce697dcbdce89f0",
					"@ArrayAccountIdentifier":
						"730ef9e9d9cd39e2b4568b16b6df5c96",
					_CREDITOR: {
						"@_Name": "SETF/WOFC",
						"@_StreetAddress": "P.O. BOX 991817",
						"@_City": "MOBILE",
						"@_State": "AL",
						"@_PostalCode": "366911817",
						"@_Phone": "8005332650",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8005332650",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "402FA13866",
					},
				},
				{
					"@CreditLiabilityID": "TRADE053",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01 TA01 RA01",
					"@CreditTradeReferenceID": "Primary",
					"@_AccountBalanceDate": "2016-11-29",
					"@_AccountClosedDate": "2016-11-29",
					"@_AccountIdentifier": "9360297572547",
					"@_AccountOpenedDate": "2013-04-04",
					"@_AccountOwnershipType": "Individual",
					"@_AccountPaidDate": "2016-11-01",
					"@_AccountReportedDate": "2016-12-07",
					"@_AccountStatusDate": "2016-11-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Mortgage",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "127645",
					"@_HighCreditAmount": "127645",
					"@_LastActivityDate": "2016-11-29",
					"@_MonthlyPaymentAmount": "0",
					"@_MonthsReviewedCount": "41",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "360",
					"@_TermsDescription": "360M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "FHARealEstateMortgage",
					"@CreditLoanTypeCode": "19",
					"@_OriginalBalanceAmount": "127645",
					"@IsMortgageIndicator": "Y",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2016-11-29",
					"@RawAccountType": "M",
					"@RawIndustryText": "MortgageCompanies",
					"@RawIndustryCode": "FM",
					"@TradelineHashComplex": "ad25f40d63a69e29309e9b92344769dd",
					"@TradelineHashSimple": "e04dba6afd808718cdef5bc2b10e74f2",
					"@ArrayAccountIdentifier":
						"4cc89714fd91a60e81e3a2da057f0b2a",
					_CREDITOR: {
						"@_Name": "WELLS FARGO HM MORTGAG",
						"@_StreetAddress": "8480 STAGECOACH CIR",
						"@_City": "FREDERICK",
						"@_State": "MD",
						"@_PostalCode": "21701",
						"@_Phone": "8002883212",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8002883212",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
						"@_StartDate": "2016-11-29",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "Equifax",
							"@_Type": "BureauRemarks",
							"@_Code": "EP",
							_Text: "FIXED RATE",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
					],
					CREDIT_REPOSITORY: [
						{
							"@_SourceType": "Equifax",
							"@_SubscriberCode": "404FM01890",
						},
						{
							"@_SourceType": "Experian",
						},
						{
							"@_SourceType": "TransUnion",
							"@_SubscriberCode": "082TE004",
						},
					],
				},
				{
					"@CreditLiabilityID": "TRADE054",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2016-11-01",
					"@_AccountIdentifier": "9360297572547",
					"@_AccountOpenedDate": "2013-04-04",
					"@_AccountOwnershipType": "Individual",
					"@_AccountPaidDate": "2016-11-01",
					"@_AccountReportedDate": "2016-12-07",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Mortgage",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "127645",
					"@_HighCreditAmount": "127645",
					"@_LastActivityDate": "2016-11-01",
					"@_MonthsReviewedCount": "40",
					"@_TermsMonthsCount": "360",
					"@_TermsDescription": "360M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "FHARealEstateMortgage",
					"@CreditLoanTypeCode": "19",
					"@IsMortgageIndicator": "Y",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@LastPaymentDate": "2016-11-01",
					"@RawAccountType": "M",
					"@RawIndustryText": "MortgageCompanies",
					"@RawIndustryCode": "FM",
					"@TradelineHashComplex": "ad25f40d63a69e29309e9b92344769dd",
					"@TradelineHashSimple": "e04dba6afd808718cdef5bc2b10e74f2",
					"@ArrayAccountIdentifier":
						"4cc89714fd91a60e81e3a2da057f0b2a",
					_CREDITOR: {
						"@_Name": "WELLS FARGO HOME MOR",
						"@_StreetAddress": "PO BOX 10335",
						"@_City": "DES MOINES",
						"@_State": "IA",
						"@_PostalCode": "503060335",
						"@_Phone": "8002883212",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8002883212",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					CREDIT_COMMENT: {
						"@_SourceType": "Equifax",
						"@_Type": "BureauRemarks",
						"@_Code": "EP",
						_Text: "FIXED RATE",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "404FM01890",
					},
				},
				{
					"@CreditLiabilityID": "TRADE055",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountClosedDate": "2016-11-29",
					"@_AccountIdentifier": "9360297572547",
					"@_AccountOpenedDate": "2013-04-04",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2016-11-29",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Mortgage",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "127645",
					"@_LastActivityDate": "2016-11-29",
					"@_MonthsReviewedCount": "39",
					"@_PastDueAmount": "0",
					"@_TermsMonthsCount": "360",
					"@_TermsDescription": "360M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "0",
					"@CreditBusinessType": "Banking",
					"@CreditLoanType": "FHARealEstateMortgage",
					"@CreditLoanTypeCode": "FR",
					"@_OriginalBalanceAmount": "000127645",
					"@IsMortgageIndicator": "Y",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@DateClosedIndicator": "C",
					"@LastPaymentDate": "2016-11-29",
					"@RawAccountStatus": "C",
					"@RawAccountType": "M",
					"@RawIndustryText": "BanksAndS&l",
					"@RawIndustryCode": "B",
					"@TradelineHashComplex": "9a2664875e227ca1407d9aa53eb0d7de",
					"@TradelineHashSimple": "5c25b61ac5ef55f83205256088d796ee",
					"@ArrayAccountIdentifier":
						"4cc89714fd91a60e81e3a2da057f0b2a",
					"@TUI_Handle": "TR01_-1424350300_1722252601_77",
					_CREDITOR: {
						"@_Name": "WFHM",
						"@_StreetAddress": "PO BOX 10335",
						"@_City": "DES MOINES",
						"@_State": "IA",
						"@_PostalCode": "50306",
						"@_Phone": "8004161472",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8004161472",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "00",
						"@_60Days": "00",
						"@_90Days": "00",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCCCCCCCXCCCCCCCCCCCCCC",
						"@_StartDate": "2016-10-29",
					},
					CREDIT_COMMENT: [
						{
							"@_SourceType": "TransUnion",
							"@_Type": "BureauRemarks",
							"@_Code": "CLO",
							_Text: "CLOSED",
						},
						{
							"@_SourceType": "TransUnion",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Handle",
							"@_Code": "TR01_-1424350300_1722252601_77",
						},
					],
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "082TE004",
					},
				},
				{
					"@CreditLiabilityID": "TRADE056",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@CreditTradeReferenceID": "Secondary",
					"@_AccountBalanceDate": "2016-11-29",
					"@_AccountIdentifier": "936029XXXXXXX",
					"@_AccountOpenedDate": "2013-04-04",
					"@_AccountOwnershipType": "Individual",
					"@_AccountReportedDate": "2016-11-29",
					"@_AccountStatusDate": "2016-11-01",
					"@_AccountStatusType": "Closed",
					"@_AccountType": "Mortgage",
					"@_ConsumerDisputeIndicator": "N",
					"@_DerogatoryDataIndicator": "N",
					"@_HighBalanceAmount": "127645",
					"@_LastActivityDate": "2016-11-01",
					"@_MonthsReviewedCount": "41",
					"@_TermsMonthsCount": "360",
					"@_TermsDescription": "360M",
					"@_TermsSourceType": "Provided",
					"@_UnpaidBalanceAmount": "",
					"@CreditBusinessType": "Finance",
					"@CreditLoanType": "FHARealEstateMortgage",
					"@CreditLoanTypeCode": "19",
					"@_OriginalBalanceAmount": "127645",
					"@IsMortgageIndicator": "Y",
					"@IsClosedIndicator": "Y",
					"@IsCollectionIndicator": "N",
					"@IsChargeoffIndicator": "N",
					"@RawAccountType": "M",
					"@RawIndustryText": "MortgageCompanies",
					"@RawIndustryCode": "FM",
					"@TradelineHashComplex": "26f10064c73bae720c2b722b44ce4d8a",
					"@TradelineHashSimple": "b71f27f4a74c9f70142de1350e87a5a6",
					"@ArrayAccountIdentifier":
						"4cc89714fd91a60e81e3a2da057f0b2a",
					_CREDITOR: {
						"@_Name": "WELLS FARGO HM MORTGAG",
						"@_StreetAddress": "8480 STAGECOACH CIR",
						"@_City": "FREDERICK",
						"@_State": "MD",
						"@_PostalCode": "21701",
						"@_Phone": "8002883212",
						CONTACT_DETAIL: {
							CONTACT_POINT: {
								"@_Type": "Phone",
								"@_Value": "8002883212",
							},
						},
					},
					_CURRENT_RATING: {
						"@_Code": "1",
						"@_Type": "AsAgreed",
					},
					_LATE_COUNT: {
						"@_30Days": "0",
						"@_60Days": "0",
						"@_90Days": "0",
					},
					_PAYMENT_PATTERN: {
						"@_Data": "CCCCCCCCCCCCCCCCCCCCCCCCCCXCCCCCCCCCCCCCC",
						"@_StartDate": "2016-11-29",
					},
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
			],
			CREDIT_INQUIRY: [
				{
					"@CreditInquiryID": "INQUIRY001",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@_Name": "CBNA/THD",
					"@_StreetAddress": "541 SID MARTIN RD",
					"@_City": "GRAY",
					"@_State": "TN",
					"@_PostalCode": "37615",
					"@_Phone": "8006770232",
					"@_Date": "2022-08-30",
					"@CreditBusinessType": "Banking",
					"@RawIndustryText": "BankCreditCards",
					"@RawIndustryCode": "BC",
					"@_PurposeType": "HARD",
					"@InquiryHashComplex": "b21484cce05e8d854f53e386d2b4e6a1",
					"@InquiryHashSimple": "c49e7edbba9eb6257d056a1d1641d094",
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditInquiryID": "INQUIRY002",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@_Name": "CBNA/THD",
					"@_StreetAddress": "541 SID MARTIN RD",
					"@_City": "GRAY",
					"@_State": "TN",
					"@_PostalCode": "37615",
					"@_Phone": "8006770232",
					"@_Date": "2022-04-29",
					"@CreditBusinessType": "Banking",
					"@RawIndustryText": "BankCreditCards",
					"@RawIndustryCode": "BC",
					"@_PurposeType": "HARD",
					"@InquiryHashComplex": "60efd726738e978d97f9b32d641e0fde",
					"@InquiryHashSimple": "520e2765bfd00514d85fbedc9fc8bc5a",
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditInquiryID": "INQUIRY003",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@_Name": "GREENSKY INSTALLMENT",
					"@_StreetAddress": "5565 GLENRIDGE CONNECTOR",
					"@_City": "ATLANTA",
					"@_State": "GA",
					"@_PostalCode": "30342",
					"@_Phone": "4048324080",
					"@_Date": "2022-04-27",
					"@CreditBusinessType": "Finance",
					"@RawIndustryText": "FinanceCompanies;Non-specific",
					"@RawIndustryCode": "FZ",
					"@_PurposeType": "HARD",
					"@InquiryHashComplex": "ed514ed30ab41ea64d0047f1c9cef2df",
					"@InquiryHashSimple": "51d53ee467dfa05f09e9a2add07389c5",
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditInquiryID": "INQUIRY004",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@_Name": "SYNCB/LOWES",
					"@_StreetAddress": "PO BOX 71727",
					"@_City": "PHILADELPHIA",
					"@_State": "PA",
					"@_PostalCode": "19176",
					"@_Phone": "8004441408",
					"@_Date": "2022-04-22",
					"@CreditBusinessType": "OilAndNationalCreditCards",
					"@RawIndustryText": "AffinityCreditCard",
					"@RawIndustryCode": "NC",
					"@_PurposeType": "HARD",
					"@InquiryHashComplex": "a16f3b086c5a96e78004b9f90a4cf0b8",
					"@InquiryHashSimple": "a7d75c5e06bc764c0f1e07d4d843195a",
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "02120170",
					},
				},
				{
					"@CreditInquiryID": "INQUIRY005",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@_Name": "SYNCB/LOWES",
					"@_StreetAddress": "PO BOX 965005",
					"@_City": "ORLANDO",
					"@_State": "FL",
					"@_PostalCode": "32896",
					"@_Phone": "8004441408",
					"@_Date": "2022-04-22",
					"@CreditBusinessType": "Finance",
					"@RawIndustryText": "SalesFinancingCompany",
					"@RawIndustryCode": "FF",
					"@_PurposeType": "HARD",
					"@InquiryHashComplex": "0f6d060d2b50d09f5f0d6e7e6d935b24",
					"@InquiryHashSimple": "4f6d635eff8769e37901f36ebc9ec05c",
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditInquiryID": "INQUIRY006",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@_Name": "SYNCB/AMAZON",
					"@_StreetAddress": "PO BOX 669834",
					"@_City": "DALLAS",
					"@_State": "TX",
					"@_PostalCode": "75266",
					"@_Phone": "8555974891",
					"@_Date": "2022-03-31",
					"@CreditBusinessType": "Banking",
					"@RawIndustryText": "CreditCards",
					"@RawIndustryCode": "BC",
					"@_PurposeType": "HARD",
					"@InquiryHashComplex": "5df6f17605cb45a1842ebd8749a2f7ad",
					"@InquiryHashSimple": "06fe26bae6a05d87f1bdf5cc7cc4573b",
					CREDIT_REPOSITORY: {
						"@_SourceType": "TransUnion",
						"@_SubscriberCode": "05371284",
					},
				},
				{
					"@CreditInquiryID": "INQUIRY007",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@_Name": "SYNCB/AMAZON PLCC",
					"@_StreetAddress": "PO BOX 965015",
					"@_City": "ORLANDO",
					"@_State": "FL",
					"@_PostalCode": "32896",
					"@_Phone": "8666348379",
					"@_Date": "2022-03-31",
					"@CreditBusinessType": "Banking",
					"@RawIndustryText": "BankCreditCards",
					"@RawIndustryCode": "BC",
					"@_PurposeType": "HARD",
					"@InquiryHashComplex": "06d8177d3b9186edd7cb660a8d314366",
					"@InquiryHashSimple": "b5165f3f030882651ba6e86164e5b824",
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditInquiryID": "INQUIRY008",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@_Name": "JPMCB CARD",
					"@_StreetAddress": "PO BOX 15077",
					"@_City": "WILMINGTON",
					"@_State": "DE",
					"@_PostalCode": "19850",
					"@_Phone": "8004539719",
					"@_Date": "2022-03-07",
					"@CreditBusinessType": "Banking",
					"@RawIndustryText": "BankCreditCards",
					"@RawIndustryCode": "BC",
					"@_PurposeType": "HARD",
					"@InquiryHashComplex": "8e5f79d4d0305b80b719b404ab105657",
					"@InquiryHashSimple": "8ea4e801ff3958d8b4ab752004ab1ea1",
					CREDIT_REPOSITORY: {
						"@_SourceType": "Experian",
					},
				},
				{
					"@CreditInquiryID": "INQUIRY009",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@_Name": "TRACSUPLY/CBNA",
					"@_Date": "2021-11-07",
					"@CreditBusinessType": "FarmAndGardenSupplies",
					"@RawIndustryText": "Farm&GardenSupplyMiscellaneous",
					"@RawIndustryCode": "TZ",
					"@_PurposeType": "HARD",
					"@InquiryHashComplex": "bf3b2ff9a0cc29d10c93ab5070e8a59a",
					"@InquiryHashSimple": "a9c6fe19806e419785903a1c1239c7c8",
					CREDIT_REPOSITORY: {
						"@_SourceType": "Equifax",
						"@_SubscriberCode": "155TZ00025",
					},
				},
			],
			CREDIT_FILE: [
				{
					"@CreditFileID": "TA01",
					"@BorrowerID": "Borrower01",
					"@CreditScoreID": "SCORE001",
					"@CreditRepositorySourceType": "TransUnion",
					"@_InfileDate": "2023-06-01",
					"@_ResultStatusType": "FileReturned",
					_ALERT_MESSAGE: [
						{
							"@_Type": "TransUnionHighRiskFraudAlert",
							"@_Code": "3006",
							_Text: "Input SSN Associated with Multiple Consumers",
						},
						{
							"@_Type": "TransUnionHighRiskFraudAlert",
							"@_Code": "5504",
							_Text: "Input SSN issued 1999-1999; state: FL; (est. Age obtained: 35 to 36)",
						},
						{
							"@_CategoryType": "FACTARiskScoreValue",
							"@_Type": "Other",
							"@_TypeOtherDescription": "Facta Fifth Reason Code",
							"@_Code": "I",
							_Text: "THE NUMBER OF INQUIRIES HAS ADVERSELY AFFECTED THE CREDIT SCORE",
						},
					],
					_BORROWER: {
						"@_UnparsedName": "ANA GLORIA VAZQUEZ",
						"@_BirthDate": "1963-06-19",
						"@_FirstName": "ANA",
						"@_MiddleName": "GLORIA",
						"@_LastName": "VAZQUEZ",
						"@_SSN": "XXXXXXXXX",
						_ALIAS: [
							{
								"@_UnparsedName": "VAZQUEZ,ANADELIA,D",
								"@_FirstName": "ANADELIA",
								"@_MiddleName": "D",
								"@_LastName": "VAZQUEZ",
							},
							{
								"@_UnparsedName": "VAZQUEZSECADES,ANA,G",
								"@_FirstName": "ANA",
								"@_MiddleName": "G",
								"@_LastName": "VAZQUEZSECADES",
							},
							{
								"@_UnparsedName": "VASQUEZ,ANA",
								"@_FirstName": "ANA",
								"@_LastName": "VASQUEZ",
							},
						],
						_RESIDENCE: [
							{
								"@BorrowerResidencyType": "Current",
								"@_StreetAddress": "16555 SW 47TH PLACE RD",
								"@_City": "OCALA",
								"@_State": "FL",
								"@_PostalCode": "34481",
								"@BorrowerResidencyDurationYears": "3",
								"@BorrowerResidencyDurationMonths": "5",
								"@_DateReported": "2020-01-08",
							},
							{
								"@BorrowerResidencyType": "Prior",
								"@_StreetAddress": "1150 SW 132ND TE",
								"@_City": "OCALA",
								"@_State": "FL",
								"@_PostalCode": "34481",
								"@BorrowerResidencyDurationYears": "6",
								"@BorrowerResidencyDurationMonths": "4",
								"@_DateReported": "2017-02-05",
							},
							{
								"@BorrowerResidencyType": "Prior",
								"@_StreetAddress": "26641 SW 127TH AV",
								"@_City": "HOMESTEAD",
								"@_State": "FL",
								"@_PostalCode": "33032",
							},
						],
						EMPLOYER: [
							{
								"@_Name": "ODYSEY HOME HEALTH",
								"@EmploymentCurrentIndicator": "Y",
								"@EmploymentPositionDescription": "NURSE",
								"@EmploymentReportedDate": "2011-05-05",
							},
							{
								"@_Name": "GENTLE HEALTH",
								"@EmploymentCurrentIndicator": "N",
								"@EmploymentReportedDate": "2004-12-01",
							},
						],
					},
					_VARIATION: {
						"@_Type": "DifferentName",
					},
				},
				{
					"@CreditFileID": "RA01",
					"@BorrowerID": "Borrower01",
					"@CreditScoreID": "SCORE002",
					"@CreditRepositorySourceType": "Experian",
					"@_InfileDate": "2023-06-01",
					"@_ResultStatusType": "FileReturned",
					_BORROWER: {
						"@_BirthDate": "1963",
						"@_FirstName": "ANA",
						"@_MiddleName": "G",
						"@_LastName": "VAZQUEZ",
						_ALIAS: [
							{
								"@_FirstName": "SECADES",
								"@_MiddleName": "ANA",
								"@_LastName": "VAZQUEZ",
							},
							{
								"@_FirstName": "ANA",
								"@_MiddleName": "V",
								"@_LastName": "SECADES",
							},
							{
								"@_FirstName": "ANA",
								"@_MiddleName": "V",
								"@_LastName": "ZEGADEZ",
							},
							{
								"@_FirstName": "ANA",
								"@_LastName": "GLORIA",
							},
							{
								"@_FirstName": "ANA",
								"@_MiddleName": "A",
								"@_LastName": "VAZQUEZ",
							},
						],
						_RESIDENCE: [
							{
								"@BorrowerResidencyType": "Current",
								"@_StreetAddress": "16555 SW 47TH PLACE RD",
								"@_City": "OCALA",
								"@_State": "FL",
								"@_PostalCode": "344814989",
								"@_DateReported": "2020-01-09",
							},
							{
								"@BorrowerResidencyType": "Prior",
								"@_StreetAddress": "1150 SW 132ND TER",
								"@_City": "OCALA",
								"@_State": "FL",
								"@_PostalCode": "344814076",
								"@_DateReported": "2017-02-06",
							},
							{
								"@BorrowerResidencyType": "Prior",
								"@_StreetAddress": "26641 SW 127TH AVE",
								"@_City": "HOMESTEAD",
								"@_State": "FL",
								"@_PostalCode": "330327961",
								"@_DateReported": "2013-05-06",
							},
						],
						EMPLOYER: [
							{
								"@_Name": "SSEASON HOSPIT",
								"@CurrentEmploymentStartDate": "2014-08-06",
								"@EmploymentCurrentIndicator": "Y",
								"@EmploymentReportedDate": "2014-08-06",
							},
							{
								"@_Name": "SEASONS HOSPICE",
								"@PreviousEmploymentStartDate": "2013-08-09",
								"@EmploymentCurrentIndicator": "N",
								"@EmploymentReportedDate": "2013-08-09",
							},
						],
						"@_SSN": "XXXXXXXXX",
					},
					_VARIATION: {
						"@_Type": "DifferentName",
					},
				},
				{
					"@CreditFileID": "EA01",
					"@BorrowerID": "Borrower01",
					"@CreditScoreID": "SCORE003",
					"@CreditRepositorySourceType": "Equifax",
					"@_InfileDate": "2023-06-01",
					"@_ResultStatusType": "FileReturned",
					_ALERT_MESSAGE: {
						"@_CategoryType": "FACTARiskScoreValue",
						"@_Type": "Other",
						"@_TypeOtherDescription": "Facta Fifth Reason Code",
						_Text: "THE NUMBER OF INQUIRIES HAS ADVERSELY AFFECTED THE CREDIT SCORE",
					},
					_BORROWER: {
						"@_UnparsedName": "ANA G VAZQUEZ",
						"@_BirthDate": "1963-06-19",
						"@_FirstName": "ANA",
						"@_MiddleName": "G",
						"@_LastName": "VAZQUEZ",
						"@_SSN": "XXXXXXXXX",
						_ALIAS: [
							{
								"@_UnparsedName": "ANA V SECADES",
								"@_FirstName": "ANA",
								"@_MiddleName": "V",
								"@_LastName": "SECADES",
							},
							{
								"@_UnparsedName": "ANA G VAZQUEZ SECADES",
								"@_FirstName": "ANA",
								"@_MiddleName": "G",
								"@_LastName": "VAZQUEZ SECADES",
							},
						],
						_RESIDENCE: [
							{
								"@BorrowerResidencyType": "Current",
								"@_StreetAddress": "12531 NE 18TH ST",
								"@_City": "WILLISTON",
								"@_State": "FL",
								"@_PostalCode": "32696",
								"@BorrowerResidencyDurationYears": "1",
								"@BorrowerResidencyDurationMonths": "1",
								"@_DateReported": "2023-05-15",
							},
							{
								"@BorrowerResidencyType": "Prior",
								"@_StreetAddress": "16555 SW 47TH PLACE RD",
								"@_City": "OCALA",
								"@_State": "FL",
								"@_PostalCode": "34481",
								"@BorrowerResidencyDurationYears": "3",
								"@BorrowerResidencyDurationMonths": "5",
								"@_DateReported": "2023-04-15",
							},
							{
								"@BorrowerResidencyType": "Prior",
								"@_StreetAddress": "12025 SW 103RD LN",
								"@_City": "DUNNELLON",
								"@_State": "FL",
								"@_PostalCode": "34432",
								"@BorrowerResidencyDurationYears": "3",
								"@BorrowerResidencyDurationMonths": "7",
								"@_DateReported": "2021-10-08",
							},
							{
								"@BorrowerResidencyType": "Prior",
								"@_StreetAddress": "1150 SW 132ND TER",
								"@_City": "OCALA",
								"@_State": "FL",
								"@_PostalCode": "34481",
								"@BorrowerResidencyDurationYears": "6",
								"@BorrowerResidencyDurationMonths": "4",
								"@_DateReported": "2023-05-12",
							},
							{
								"@BorrowerResidencyType": "Prior",
								"@_StreetAddress": "26641 SW 127TH AVE",
								"@_City": "HOMESTEAD",
								"@_State": "FL",
								"@_PostalCode": "33032",
								"@BorrowerResidencyDurationYears": "10",
								"@_DateReported": "2021-09-08",
							},
							{
								"@BorrowerResidencyType": "Prior",
								"@_StreetAddress": "25040 SW 125TH CT",
								"@_City": "HOMESTEAD",
								"@_State": "FL",
								"@_PostalCode": "33032",
								"@BorrowerResidencyDurationYears": "12",
								"@BorrowerResidencyDurationMonths": "5",
								"@_DateReported": "2017-04-21",
							},
						],
						EMPLOYER: {
							"@_Name": "SSEASON HOSPIT",
							"@EmploymentCurrentIndicator": "Y",
							"@EmploymentPositionDescription": "MANAGER",
						},
					},
					_VARIATION: {
						"@_Type": "DifferentName",
					},
				},
			],
			CREDIT_SCORE: [
				{
					"@CreditScoreID": "SCORE001",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "TA01",
					"@_Date": "2023-06-01",
					"@CreditReportIdentifier": "1874-94C4561D-9B4A-4C6",
					"@_FACTAInquiriesIndicator": "Y",
					"@RiskBasedPricingPercent": "13",
					"@RiskBasedPricingMin": "560",
					"@RiskBasedPricingMax": "565",
					"@_ModelNameType": "Other",
					"@_ModelNameTypeOtherDescription":
						"TransUnionVantageScore3.0",
					"@_Value": "564",
					"@CreditRepositorySourceType": "TransUnion",
					_FACTOR: [
						{
							"@_Code": "12",
							"@_Text":
								"The date that you opened your oldest account is too recent",
						},
						{
							"@_Code": "4",
							"@_Text":
								"The balances on your accounts are too high compared to loan amounts",
						},
						{
							"@_Code": "61",
							"@_Text":
								"No open real estate accounts in your credit file",
						},
						{
							"@_Code": "71",
							"@_Text":
								"You have either very few installment loans or too many with delinquencies",
						},
						{
							"@_Code": "I",
							"@_Text": "Inquiries did impact the credit score",
						},
					],
				},
				{
					"@CreditScoreID": "SCORE002",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "RA01",
					"@_Date": "2023-06-01",
					"@CreditReportIdentifier": "1874-94C4561D-9B4A-4C6",
					"@RiskBasedPricingPercent": "13",
					"@RiskBasedPricingMin": "530",
					"@RiskBasedPricingMax": "537",
					"@_ModelNameType": "Other",
					"@_ModelNameTypeOtherDescription":
						"ExperianVantageScore3.0",
					"@_Value": "533",
					"@CreditRepositorySourceType": "Experian",
					_FACTOR: [
						{
							"@_Code": "84",
							"@_Text":
								"The number of inquiries was also a factor, but effect was not significant",
						},
						{
							"@_Code": "61",
							"@_Text":
								"No open real estate accounts in your credit file",
						},
						{
							"@_Code": "7",
							"@_Text":
								"You have too many delinquent or derogatory accounts",
						},
						{
							"@_Code": "12",
							"@_Text":
								"The date that you opened your oldest account is too recent",
						},
						{
							"@_Code": "21",
							"@_Text": "No open accounts in your credit file",
						},
					],
				},
				{
					"@CreditScoreID": "SCORE003",
					"@BorrowerID": "Borrower01",
					"@CreditFileID": "EA01",
					"@_Date": "2023-06-01",
					"@CreditReportIdentifier": "1874-94C4561D-9B4A-4C6",
					"@_FACTAInquiriesIndicator": "Y",
					"@RiskBasedPricingPercent": "16",
					"@RiskBasedPricingMin": "579",
					"@RiskBasedPricingMax": "583",
					"@_ModelNameType": "Other",
					"@_ModelNameTypeOtherDescription": "EquifaxVantageScore3.0",
					"@_Value": "580",
					"@CreditRepositorySourceType": "Equifax",
					_FACTOR: [
						{
							"@_Code": "4",
							"@_Text":
								"The balances on your accounts are too high compared to loan amounts",
						},
						{
							"@_Code": "7",
							"@_Text":
								"You have too many delinquent or derogatory accounts",
						},
						{
							"@_Code": "12",
							"@_Text":
								"The date that you opened your oldest account is too recent",
						},
						{
							"@_Code": "61",
							"@_Text":
								"No open real estate accounts in your credit file",
						},
						{
							"@_Code": "Y",
							"@_Text":
								"Number of inquiries adversely affected the score but not significantly",
						},
					],
				},
			],
			CREDIT_SUMMARY: {
				"@BorrowerID": "Borrower01",
				"@_Name": "Attributes",
				_DATA_SET: [
					{
						"@_Name": "Number of tradelines",
						"@_ID": "AP001",
						"@_Value": "18",
					},
					{
						"@_Name": "Average age of open tradelines",
						"@_ID": "AP002",
						"@_Value": "30",
					},
					{
						"@_Name":
							"Average age of open tradelines; exclude auth user and joint ecoa",
						"@_ID": "AP003",
						"@_Value": "30",
					},
					{
						"@_Name": "Number of hard inquiries",
						"@_ID": "AP004",
						"@_Value": "9",
					},
					{
						"@_Name": "Number of payments",
						"@_ID": "AP005",
						"@_Value": "221",
					},
					{
						"@_Name": "Revolving utilization on open credit cards",
						"@_ID": "AP006",
						"@_Value": "N/A",
					},
					{
						"@_Name": "Total occurrences of minor delinqs",
						"@_ID": "AP007",
						"@_Value": "13",
					},
					{
						"@_Name": "Total number of major derogatory tradelines",
						"@_ID": "AP008",
						"@_Value": "6",
					},
					{
						"@_Name":
							"Total number of major derogatory tradelines calculated by TU",
						"@_ID": "AP008_RAW",
						"@_Value": "6",
					},
					{
						"@_Name":
							"Average age in months of all open revolving accounts",
						"@_ID": "AP011",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"Average age in months of all open installment accounts",
						"@_ID": "AP012",
						"@_Value": "30",
					},
					{
						"@_Name":
							"Average age in months of all other open accounts (non-revolving non-installment)",
						"@_ID": "AP013",
						"@_Value": "N/A",
					},
					{
						"@_Name": "AT01S:Number of trades",
						"@_ID": "AT01S",
						"@_Value": "18",
					},
					{
						"@_Name": "AT02S:Number of open trades",
						"@_ID": "AT02S",
						"@_Value": "4",
					},
					{
						"@_Name":
							"AT06S:Number of trades opened in past 6 months",
						"@_ID": "AT06S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"AT09S:Number of trades opened in past 24 months",
						"@_ID": "AT09S",
						"@_Value": "2",
					},
					{
						"@_Name": "AT20S:Months since oldest trade opened",
						"@_ID": "AT20S",
						"@_Value": "259",
					},
					{
						"@_Name":
							"AT28A:Total credit line of open trades verified in past 12 months",
						"@_ID": "AT28A",
						"@_Value": "16976",
					},
					{
						"@_Name":
							"AT28B:Total credit line of open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT28B",
						"@_Value": "16976",
					},
					{
						"@_Name":
							"AT33A:Total balance of open trades verified in past 12 months",
						"@_ID": "AT33A",
						"@_Value": "18219",
					},
					{
						"@_Name":
							"AT33B:Total balance of open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT33B",
						"@_Value": "18219",
					},
					{
						"@_Name":
							"AT34A:Utilization for open trades verified in past 12 months",
						"@_ID": "AT34A",
						"@_Value": "107",
					},
					{
						"@_Name":
							"AT34B:Utilization for open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT34B",
						"@_Value": "107",
					},
					{
						"@_Name": "AT36S:Months since most recent delinquency",
						"@_ID": "AT36S",
						"@_Value": "33",
					},
					{
						"@_Name":
							"AT57S:Total past due amount of open trades verified in past 12 months",
						"@_ID": "AT57S",
						"@_Value": "6764",
					},
					{
						"@_Name":
							"AT103S:Percentage of satisfactory open trades to all open trades",
						"@_ID": "AT103S",
						"@_Value": "25",
					},
					{
						"@_Name":
							"AT104S:Percentage of all trades opened in past 24 months to all trades",
						"@_ID": "AT104S",
						"@_Value": "11",
					},
					{
						"@_Name":
							"ATAP01:Total scheduled monthly payment for all trades verified in past 12 months",
						"@_ID": "ATAP01",
						"@_Value": "540",
					},
					{
						"@_Name":
							"AU28S:Total credit line of open auto trades verified in past 12 months",
						"@_ID": "AU28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AU33S:Total balance of open auto trades verified in past 12 months",
						"@_ID": "AU33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AU34S:Utilization for open auto trades verified in past 12 months",
						"@_ID": "AU34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"AU57S:Total past due amount of open auto trades verified in past 12 months",
						"@_ID": "AU57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "BC02S:Number of open credit card trades",
						"@_ID": "BC02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC06S:Number of credit card trades opened in past 6 months",
						"@_ID": "BC06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC102S:Average credit line of open credit card trades verified in past 12 months",
						"@_ID": "BC102S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC12S:Number of open credit card trades verified in past 12 months",
						"@_ID": "BC12S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC20S:Months since oldest credit card trade opened",
						"@_ID": "BC20S",
						"@_Value": "211",
					},
					{
						"@_Name":
							"BC28S:Total credit line of open credit card trades verified in past 12 months",
						"@_ID": "BC28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC30S:Percentage of open credit card trades > 50% of credit line verified in past 12 months",
						"@_ID": "BC30S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC31S:Percentage of open credit card trades > 75% of credit line verified in past 12 months",
						"@_ID": "BC31S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC33S:Total balance of open credit card trades verified in past 12 months",
						"@_ID": "BC33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC34S:Utilization for open credit card trades verified in past 12 months",
						"@_ID": "BC34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC57S:Total past due amount of open credit card trades verified in past 12 months",
						"@_ID": "BC57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"CO04S:Months since most recent charged-off trade was first reported",
						"@_ID": "CO04S",
						"@_Value": "102",
					},
					{
						"@_Name":
							"FC04S:Months since most recent foreclosure trade was first reported",
						"@_ID": "FC04S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"G020S:Number of trades with maximum delinquency of 30 days past due in past 24 months",
						"@_ID": "G020S",
						"@_Value": "0",
					},
					{
						"@_Name": "G051S:Percentage of trades ever delinquent",
						"@_ID": "G051S",
						"@_Value": "39",
					},
					{
						"@_Name": "G093S:Number of public records",
						"@_ID": "G093S",
						"@_Value": "0",
					},
					{
						"@_Name": "G094S:Number of public record bankruptcies",
						"@_ID": "G094S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G095S:Months since most recent public record",
						"@_ID": "G095S",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"G103S:Months since most recent credit inquiry",
						"@_ID": "G103S",
						"@_Value": "10",
					},
					{
						"@_Name":
							"G202A:Total open to buy of open trades verified in past 12 months (excl installs and morts)",
						"@_ID": "G202A",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"G215B:Number of non-medical third party collections with balance > $0",
						"@_ID": "G215B",
						"@_Value": "4",
					},
					{
						"@_Name":
							"G217S:Total past due amount of all trades verified in past 12 months",
						"@_ID": "G217S",
						"@_Value": "22506",
					},
					{
						"@_Name":
							"G218B:Number of trades verified in the past 12 months that are currently 30+ DPD",
						"@_ID": "G218B",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G224A:Number of 90 days past due or worse items ever (excluding medical colls)",
						"@_ID": "G224A",
						"@_Value": "6",
					},
					{
						"@_Name":
							"G238S:Number of credit inquiries in past 12 months (excl coll inqs)",
						"@_ID": "G238S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"G244S:Number of inquiries (includes duplicates) in past 12 months",
						"@_ID": "G244S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"G250A:Number of 30 DPD or worse items ever (excluding medical colls)",
						"@_ID": "G250A",
						"@_Value": "7",
					},
					{
						"@_Name":
							"G250B:Number of 30 DPD or worse items in the past 12 months (excluding medical colls)",
						"@_ID": "G250B",
						"@_Value": "6",
					},
					{
						"@_Name":
							"G250C:Number of 30 DPD or worse items in the past 24 months (excluding medical colls)",
						"@_ID": "G250C",
						"@_Value": "6",
					},
					{
						"@_Name":
							"G251A:Number of 60 DPD or worse items ever (excluding medical colls)",
						"@_ID": "G251A",
						"@_Value": "6",
					},
					{
						"@_Name":
							"G302S:Worst rating on revolving trades in past 12 months",
						"@_ID": "G302S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"G304S:Worst rating on installment trades in past 12 months",
						"@_ID": "G304S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"G310S:Worst rating on all trades in past 12 months",
						"@_ID": "G310S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"GB311:Indicates if bankruptcies have been filed",
						"@_ID": "GB311",
						"@_Value": "0",
					},
					{
						"@_Name":
							"HI57S:Total past due amount of open home equity loan trades verified in past 12 months",
						"@_ID": "HI57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"HR57S:Total past due amount of open HELOC trades verified in past 12 months",
						"@_ID": "HR57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "IN02S:Number of open installment trades",
						"@_ID": "IN02S",
						"@_Value": "4",
					},
					{
						"@_Name":
							"IN06S:Number of installment trades opened in past 6 months",
						"@_ID": "IN06S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"IN28S:Total credit line of open installment trades verified in past 12 months",
						"@_ID": "IN28S",
						"@_Value": "16976",
					},
					{
						"@_Name":
							"IN33S:Total balance of open installment trades verified in past 12 months",
						"@_ID": "IN33S",
						"@_Value": "18219",
					},
					{
						"@_Name":
							"IN34S:Utilization for open installment trades verified in past 12 months",
						"@_ID": "IN34S",
						"@_Value": "107",
					},
					{
						"@_Name":
							"IN36S:Months since most recent installment delinquency",
						"@_ID": "IN36S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"IN57S:Total past due amount of open installment trades verified in past 12 months",
						"@_ID": "IN57S",
						"@_Value": "6764",
					},
					{
						"@_Name": "MT02S:Number of open mortgage trades",
						"@_ID": "MT02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT06S:Number of mortgage trades opened in past 6 months",
						"@_ID": "MT06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT28S:Total credit line of open mortgage trades verified in past 12 months",
						"@_ID": "MT28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT33S:Total balance of open mortgage trades verified in past 12 months",
						"@_ID": "MT33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT34S:Utilization for open mortgage trades verified in past 12 months",
						"@_ID": "MT34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"MT36S:Months since most recent mortgage delinquency",
						"@_ID": "MT36S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"MT57S:Total past due amount of open mortgage trades verified in past 12 months",
						"@_ID": "MT57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "RE02S:Number of open revolving trades",
						"@_ID": "RE02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE06S:Number of revolving trades opened in past 6 months",
						"@_ID": "RE06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE12S:Number of open revolving trades verified in past 12 months",
						"@_ID": "RE12S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE20S:Months since oldest revolving trade opened",
						"@_ID": "RE20S",
						"@_Value": "211",
					},
					{
						"@_Name":
							"RE21S:Months since most recent revolving trade opened",
						"@_ID": "RE21S",
						"@_Value": "118",
					},
					{
						"@_Name":
							"RE28S:Total credit line of open revolving trades verified in past 12 months",
						"@_ID": "RE28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE30S:Percentage of open revolving trades > 50% of credit line verified in past 12 months",
						"@_ID": "RE30S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE31S:Percentage of open revolving trades > 75% of credit line verified in past 12 months",
						"@_ID": "RE31S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE33S:Total balance of open revolving trades verified in past 12 months",
						"@_ID": "RE33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE34S:Utilization for open revolving trades verified in past 12 months",
						"@_ID": "RE34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE34T:Utilization for all bureau open revolving trades verified in past 12 months",
						"@_ID": "RE34T",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE36S:Months since most recent revolving delinquency",
						"@_ID": "RE36S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"RE57S:Total past due amount of open revolving trades verified in past 12 months",
						"@_ID": "RE57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE102S:Average credit line of open revolving trades verified in past 12 months",
						"@_ID": "RE102S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RP04S:Months since most recent repossession trade was first reported",
						"@_ID": "RP04S",
						"@_Value": "3",
					},
					{
						"@_Name":
							"S004S:Average number of months trades have been on file",
						"@_ID": "S004S",
						"@_Value": "27",
					},
					{
						"@_Name":
							"S043S:Number of open trades > 50% of credit line verified in 12 mons (excl installs and morts)",
						"@_ID": "S043S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"S061S:Months since most recent 60 or more days past due",
						"@_ID": "S061S",
						"@_Value": "56",
					},
					{
						"@_Name":
							"S062S:Months since most recent 90 or more days past due",
						"@_ID": "S062S",
						"@_Value": "56",
					},
					{
						"@_Name": "S068A:Number of third party collections",
						"@_ID": "S068A",
						"@_Value": "3",
					},
					{
						"@_Name":
							"S114S:Number of deduped inquiries in past 6 months (excl auto and mortgage inquiries)",
						"@_ID": "S114S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"S204A:Total balance of non-medical third party collections verified in past 12 months",
						"@_ID": "S204A",
						"@_Value": "7793",
					},
					{
						"@_Name":
							"S207A:Months since most recent tradeline bankruptcy",
						"@_ID": "S207A",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"S207S:Months since most recent public record bankruptcy",
						"@_ID": "S207S",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"S209A:Months since most recent non-medical third party collection",
						"@_ID": "S209A",
						"@_Value": "5",
					},
					{
						"@_Name":
							"ST28S:Total credit line of open student loan trades verified in past 12 months",
						"@_ID": "ST28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"ST33S:Total balance of open student loan trades verified in past 12 months",
						"@_ID": "ST33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"ST34S:Utilization for open student loan trades verified in past 12 months",
						"@_ID": "ST34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"ST57S:Total past due amount of open student loan trades verified in past 12 months",
						"@_ID": "ST57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT014:Total Scheduled Monthly Payment",
						"@_ID": "PT014",
						"@_Value": "540",
					},
					{
						"@_Name": "PT016:Utilization on revolving trades",
						"@_ID": "PT016",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"PT017:Total balance on open revolving trades",
						"@_ID": "PT017",
						"@_Value": "0",
					},
					{
						"@_Name": "PT019:Total Mortgage Monthly Payment",
						"@_ID": "PT019",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT020:Total balance on open Mortgages",
						"@_ID": "PT020",
						"@_Value": "0",
					},
					{
						"@_Name": "PT021:Total Monthly Automobile Payment",
						"@_ID": "PT021",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT022:Date of oldest trade",
						"@_ID": "PT022",
						"@_Value": "112001",
					},
					{
						"@_Name": "PT023:Months since infile created at bureau",
						"@_ID": "PT023",
						"@_Value": "288",
					},
					{
						"@_Name":
							"PT027:Total occurrances of delinquencies in past 12 months",
						"@_ID": "PT027",
						"@_Value": "0",
					},
					{
						"@_Name": "PT038:Number of Inquiries in past 6 months",
						"@_ID": "PT038",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT054:Total Credit Limit/High Credit on open tradelines",
						"@_ID": "PT054",
						"@_Value": "16976",
					},
					{
						"@_Name": "PT056:Total balance on all tradelines",
						"@_ID": "PT056",
						"@_Value": "33961",
					},
					{
						"@_Name":
							"PT063:Number of currently delinquent tradelines",
						"@_ID": "PT063",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT064:Number of currently delinquent revolving tradelines",
						"@_ID": "PT064",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT065:Number of currently delinquent installment tradelines",
						"@_ID": "PT065",
						"@_Value": "0",
					},
					{
						"@_Name": "PT068:Average balance on open tradelines",
						"@_ID": "PT068",
						"@_Value": "4555",
					},
					{
						"@_Name":
							"PT069:Number of Chargeoffs in past 12 months",
						"@_ID": "PT069",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT071:Total occurrances of delinquencies in the past 2 years",
						"@_ID": "PT071",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT072:Total occurrances of delinquencies in the past 30 days",
						"@_ID": "PT072",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT073:Total occurrances of delinquencies in the past 60 days",
						"@_ID": "PT073",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT074:Total occurrances of delinquencies in the past 7 years",
						"@_ID": "PT074",
						"@_Value": "7",
					},
					{
						"@_Name": "PT076:Date of oldest trade",
						"@_ID": "PT076",
						"@_Value": "112001",
					},
					{
						"@_Name":
							"PT079:Number of months since oldest installment tradeline opened",
						"@_ID": "PT079",
						"@_Value": "259",
					},
					{
						"@_Name":
							"PT080:Number of months since oldest revolving tradeline opened",
						"@_ID": "PT080",
						"@_Value": "211",
					},
					{
						"@_Name":
							"PT082:Number of months since most recent tradeline opened",
						"@_ID": "PT082",
						"@_Value": "5",
					},
					{
						"@_Name": "PT083:Number of mortgage trades",
						"@_ID": "PT083",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT088:Number of months since 90+ late or worse derogatory",
						"@_ID": "PT088",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT089:Number of tradelines reported in past 2 months and currently 120 days past due",
						"@_ID": "PT089",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT090:Number of tradelines currently 30 days past due",
						"@_ID": "PT090",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT091:Number of tradelines 90+ days past due in past 24 months",
						"@_ID": "PT091",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT092:Number of tradelines opened in past 12 months",
						"@_ID": "PT092",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT093:Percentage of tradelines never delinquent",
						"@_ID": "PT093",
						"@_Value": "83",
					},
					{
						"@_Name":
							"PT094:Number of tradelines ever 120 days past due",
						"@_ID": "PT094",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT095:Number of months since oldest bank installment tradeline",
						"@_ID": "PT095",
						"@_Value": "259",
					},
					{
						"@_Name":
							"PT103:Total credit limit/high credit on open installment tradelines",
						"@_ID": "PT103",
						"@_Value": "16976",
					},
					{
						"@_Name":
							"PT104:Number of currently satisfactory tradelines",
						"@_ID": "PT104",
						"@_Value": "12",
					},
					{
						"@_Name": "PT105:Number of revolving tradelines",
						"@_ID": "PT105",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT110:Number of revolving tradelines opened in past 7 years",
						"@_ID": "PT110",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT111:Total credit limit/high credit on open revolving tradelines",
						"@_ID": "PT111",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT112:Total available credit on open bankcard tradelines verified in the last 6 mons",
						"@_ID": "PT112",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"PT115:Percent of bankcard tradelines gt 75% of credit limit",
						"@_ID": "PT115",
						"@_Value": "50",
					},
					{
						"@_Name":
							"PT118:Total credit limit/high credit on open bankcard tradelines",
						"@_ID": "PT118",
						"@_Value": "0",
					},
					{
						"@_Name": "PT119:Number of bankcard tradelines",
						"@_ID": "PT119",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT120:Number of months since most recent bankcard tradeline opened",
						"@_ID": "PT120",
						"@_Value": "118",
					},
					{
						"@_Name":
							"PT121:Number of bankcard tradelines opened in the past 6 months",
						"@_ID": "PT121",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT122:Number of bankcard tradelines never delinquent",
						"@_ID": "PT122",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT125:Number of months since most recent bankcard delinquency",
						"@_ID": "PT125",
						"@_Value": "56",
					},
					{
						"@_Name":
							"PT126:Percent utilization on bankcard tradelines",
						"@_ID": "PT126",
						"@_Value": "29",
					},
					{
						"@_Name":
							"PT129:Number of Public Records with amount gt 100",
						"@_ID": "PT129",
						"@_Value": "-4",
					},
					{
						"@_Name": "PT130:Number of Tax Liens",
						"@_ID": "PT130",
						"@_Value": "0",
					},
					{
						"@_Name": "PT132:Total amount on Collections",
						"@_ID": "PT132",
						"@_Value": "7793",
					},
					{
						"@_Name": "PT133:Number of repossessions",
						"@_ID": "PT133",
						"@_Value": "1",
					},
					{
						"@_Name": "PT134:Number of foreclosures",
						"@_ID": "PT134",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT136:Number of Collections/Chargeoffs in past 24 months; excluding medical",
						"@_ID": "PT136",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT137:Total amount on Collections in past 36 months; excluding medical",
						"@_ID": "PT137",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT138:Number of tradelines active within the past 6 months",
						"@_ID": "PT138",
						"@_Value": "6",
					},
					{
						"@_Name":
							"PT139:Number of mortgage tradelines opened in past 6 months",
						"@_ID": "PT139",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT140:Number of open installment tradelines opened within the past 24 months",
						"@_ID": "PT140",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT141:Total occurrances of 30 days late within the past 12 months on Mortgage trades",
						"@_ID": "PT141",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT142:Number of mortgages passed due 30 days or more in the last 6 months",
						"@_ID": "PT142",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT143:Total occurrances of 30 days late within the past 12 months",
						"@_ID": "PT143",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT144:Number of collections with amount gt 500",
						"@_ID": "PT144",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT145:Total balance on unsecured credit card tradelines",
						"@_ID": "PT145",
						"@_Value": "1434",
					},
					{
						"@_Name": "PT146:Total balance on unsecured tradelines",
						"@_ID": "PT146",
						"@_Value": "20252",
					},
					{
						"@_Name":
							"PT147:Total amount on Tax Liens filed within the past 36 months",
						"@_ID": "PT147",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT148:Total amount on Judgements filed within the past 36 months",
						"@_ID": "PT148",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT149:Number of Public Records filed in past 24 months",
						"@_ID": "PT149",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT150:Number of non-federal Student Loan tradelines",
						"@_ID": "PT150",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT151:Number of repossessed auto loan tradelines",
						"@_ID": "PT151",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT153:Percent utilization on installment tradelines",
						"@_ID": "PT153",
						"@_Value": "10",
					},
					{
						"@_Name":
							"PT154:Number of revolving tradelines with balance gt 0",
						"@_ID": "PT154",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT155:Number of installment tradelines opened in past 12 months",
						"@_ID": "PT155",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT157:Number of revolving tradelines opened in past 12 months",
						"@_ID": "PT157",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT158:Number of revolving tradelines opened in past 24 months",
						"@_ID": "PT158",
						"@_Value": "0",
					},
					{
						"@_Name": "PT159:Number of credit union tradelines",
						"@_ID": "PT159",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT160:Percent utilization on all open tradelines",
						"@_ID": "PT160",
						"@_Value": "107",
					},
					{
						"@_Name":
							"PT162:Maximum balance on revolving tradelines",
						"@_ID": "PT162",
						"@_Value": "1434",
					},
					{
						"@_Name":
							"PT163:Number months since more recent installment tradeline opened",
						"@_ID": "PT163",
						"@_Value": "5",
					},
					{
						"@_Name":
							"PT165:Number of auto tradelines 30 days past due in past 6 months",
						"@_ID": "PT165",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT166:Number of auto tradelines opened in past 6 months",
						"@_ID": "PT166",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT167:Number of retail tradelines opened in past 6 months",
						"@_ID": "PT167",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT168:Number of student loans opened in past 12 months",
						"@_ID": "PT168",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT174:Total amount on Collections; excluding medical",
						"@_ID": "PT174",
						"@_Value": "7793",
					},
					{
						"@_Name": "PT175:Total amount on Tax Liens",
						"@_ID": "PT175",
						"@_Value": "-4",
					},
					{
						"@_Name": "PT176:Total amount on Judgements",
						"@_ID": "PT176",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT177:Total credit limit on open credit card trades",
						"@_ID": "PT177",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT178:Total credit limit on open retail trades",
						"@_ID": "PT178",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT179:Total balance on open credit card trades",
						"@_ID": "PT179",
						"@_Value": "0",
					},
					{
						"@_Name": "PT180:Total balance on open retail trades",
						"@_ID": "PT180",
						"@_Value": "0",
					},
					{
						"@_Name": "PT181:Age of oldest trade in months",
						"@_ID": "PT181",
						"@_Value": "259",
					},
					{
						"@_Name":
							"PT182:Total number of open credit card trades",
						"@_ID": "PT182",
						"@_Value": "0",
					},
					{
						"@_Name": "PT183:Total number of open retail trades",
						"@_ID": "PT183",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT184:Total number of trades ever delinquent",
						"@_ID": "PT184",
						"@_Value": "3",
					},
					{
						"@_Name":
							"PT185:Total number of tradelines delinquent in the last 6 months",
						"@_ID": "PT185",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT186:Total number of installment tradelines 60 days late or worse in the last 6 months",
						"@_ID": "PT186",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT187:Total balances on currently delinquent tradelines",
						"@_ID": "PT187",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT188:Worst current status on any open tradeline",
						"@_ID": "PT188",
						"@_Value": "9",
					},
					{
						"@_Name":
							"PT189:Worst status in the past 12 months on any mortgage tradeline",
						"@_ID": "PT189",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT190:Total number of closed credit card trades",
						"@_ID": "PT190",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT191:Total number of closed installment trades",
						"@_ID": "PT191",
						"@_Value": "12",
					},
					{
						"@_Name": "PT192:Percent of revolving credit available",
						"@_ID": "PT192",
						"@_Value": "71",
					},
					{
						"@_Name":
							"PT193:Number of loans or credit cards applied for in past 24 months",
						"@_ID": "PT193",
						"@_Value": "9",
					},
					{
						"@_Name":
							"PT194:Number of Installment tradelines not delinquent within the last 24 months",
						"@_ID": "PT194",
						"@_Value": "10",
					},
					{
						"@_Name":
							"PT195:Max credit limit on open bank credit cards",
						"@_ID": "PT195",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT196:Number of collections with amount gt 0",
						"@_ID": "PT196",
						"@_Value": "4",
					},
					{
						"@_Name":
							"PT197:Total Number of delinquent credit card and retail trades in last 6 months",
						"@_ID": "PT197",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT198:Total number of open credit card tradelines with utilization gt 90%",
						"@_ID": "PT198",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT199:Total number of open retail tradelines with utilization gt 90%",
						"@_ID": "PT199",
						"@_Value": "3",
					},
					{
						"@_Name":
							"PT200:Number of closed trades; no exclusions",
						"@_ID": "PT200",
						"@_Value": "14",
					},
					{
						"@_Name": "PT201:Number of open trades; no exclusions",
						"@_ID": "PT201",
						"@_Value": "4",
					},
					{
						"@_Name":
							"PT202:Total balance on all trades; no exclusions",
						"@_ID": "PT202",
						"@_Value": "33961",
					},
					{
						"@_Name": "Deceased Indicator",
						"@_ID": "AP009",
						"@_Value": "N",
					},
					{
						"@_Name": "Public Record Info",
						"@_ID": "AP010",
						"@_Value": "",
					},
				],
			},
			CREDIT_SUMMARY_XPN: {
				"@BorrowerID": "Borrower01",
				"@_Name": "Attributes",
				_DATA_SET: [
					{
						"@_Name": "Number of tradelines",
						"@_ID": "AP001",
						"@_Value": "14",
					},
					{
						"@_Name": "Average age of open tradelines",
						"@_ID": "AP002",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"Average age of open tradelines; exclude auth user and joint ecoa",
						"@_ID": "AP003",
						"@_Value": "N/A",
					},
					{
						"@_Name": "Number of hard inquiries",
						"@_ID": "AP004",
						"@_Value": "6",
					},
					{
						"@_Name": "Number of payments",
						"@_ID": "AP005",
						"@_Value": "218",
					},
					{
						"@_Name": "Revolving utilization on open credit cards",
						"@_ID": "AP006",
						"@_Value": "N/A",
					},
					{
						"@_Name": "Total occurrences of minor delinqs",
						"@_ID": "AP007",
						"@_Value": "13",
					},
					{
						"@_Name": "Total number of major derogatory tradelines",
						"@_ID": "AP008",
						"@_Value": "5",
					},
					{
						"@_Name":
							"Total number of major derogatory tradelines calculated by TU",
						"@_ID": "AP008_RAW",
						"@_Value": "6",
					},
					{
						"@_Name":
							"Average age in months of all open revolving accounts",
						"@_ID": "AP011",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"Average age in months of all open installment accounts",
						"@_ID": "AP012",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"Average age in months of all other open accounts (non-revolving non-installment)",
						"@_ID": "AP013",
						"@_Value": "N/A",
					},
					{
						"@_Name": "AT01S:Number of trades",
						"@_ID": "AT01S",
						"@_Value": "14",
					},
					{
						"@_Name": "AT02S:Number of open trades",
						"@_ID": "AT02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AT06S:Number of trades opened in past 6 months",
						"@_ID": "AT06S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"AT09S:Number of trades opened in past 24 months",
						"@_ID": "AT09S",
						"@_Value": "1",
					},
					{
						"@_Name": "AT20S:Months since oldest trade opened",
						"@_ID": "AT20S",
						"@_Value": "122",
					},
					{
						"@_Name":
							"AT28A:Total credit line of open trades verified in past 12 months",
						"@_ID": "AT28A",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AT28B:Total credit line of open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT28B",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AT33A:Total balance of open trades verified in past 12 months",
						"@_ID": "AT33A",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AT33B:Total balance of open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT33B",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AT34A:Utilization for open trades verified in past 12 months",
						"@_ID": "AT34A",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"AT34B:Utilization for open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT34B",
						"@_Value": "N/A",
					},
					{
						"@_Name": "AT36S:Months since most recent delinquency",
						"@_ID": "AT36S",
						"@_Value": "33",
					},
					{
						"@_Name":
							"AT57S:Total past due amount of open trades verified in past 12 months",
						"@_ID": "AT57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"AT103S:Percentage of satisfactory open trades to all open trades",
						"@_ID": "AT103S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AT104S:Percentage of all trades opened in past 24 months to all trades",
						"@_ID": "AT104S",
						"@_Value": "7",
					},
					{
						"@_Name":
							"ATAP01:Total scheduled monthly payment for all trades verified in past 12 months",
						"@_ID": "ATAP01",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AU28S:Total credit line of open auto trades verified in past 12 months",
						"@_ID": "AU28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AU33S:Total balance of open auto trades verified in past 12 months",
						"@_ID": "AU33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AU34S:Utilization for open auto trades verified in past 12 months",
						"@_ID": "AU34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"AU57S:Total past due amount of open auto trades verified in past 12 months",
						"@_ID": "AU57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "BC02S:Number of open credit card trades",
						"@_ID": "BC02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC06S:Number of credit card trades opened in past 6 months",
						"@_ID": "BC06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC102S:Average credit line of open credit card trades verified in past 12 months",
						"@_ID": "BC102S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC12S:Number of open credit card trades verified in past 12 months",
						"@_ID": "BC12S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC20S:Months since oldest credit card trade opened",
						"@_ID": "BC20S",
						"@_Value": "118",
					},
					{
						"@_Name":
							"BC28S:Total credit line of open credit card trades verified in past 12 months",
						"@_ID": "BC28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC30S:Percentage of open credit card trades > 50% of credit line verified in past 12 months",
						"@_ID": "BC30S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC31S:Percentage of open credit card trades > 75% of credit line verified in past 12 months",
						"@_ID": "BC31S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC33S:Total balance of open credit card trades verified in past 12 months",
						"@_ID": "BC33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC34S:Utilization for open credit card trades verified in past 12 months",
						"@_ID": "BC34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC57S:Total past due amount of open credit card trades verified in past 12 months",
						"@_ID": "BC57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"CO04S:Months since most recent charged-off trade was first reported",
						"@_ID": "CO04S",
						"@_Value": "55",
					},
					{
						"@_Name":
							"FC04S:Months since most recent foreclosure trade was first reported",
						"@_ID": "FC04S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"G020S:Number of trades with maximum delinquency of 30 days past due in past 24 months",
						"@_ID": "G020S",
						"@_Value": "0",
					},
					{
						"@_Name": "G051S:Percentage of trades ever delinquent",
						"@_ID": "G051S",
						"@_Value": "43",
					},
					{
						"@_Name": "G093S:Number of public records",
						"@_ID": "G093S",
						"@_Value": "0",
					},
					{
						"@_Name": "G094S:Number of public record bankruptcies",
						"@_ID": "G094S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G095S:Months since most recent public record",
						"@_ID": "G095S",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"G103S:Months since most recent credit inquiry",
						"@_ID": "G103S",
						"@_Value": "10",
					},
					{
						"@_Name":
							"G202A:Total open to buy of open trades verified in past 12 months (excl installs and morts)",
						"@_ID": "G202A",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"G215B:Number of non-medical third party collections with balance > $0",
						"@_ID": "G215B",
						"@_Value": "3",
					},
					{
						"@_Name":
							"G217S:Total past due amount of all trades verified in past 12 months",
						"@_ID": "G217S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G218B:Number of trades verified in the past 12 months that are currently 30+ DPD",
						"@_ID": "G218B",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G224A:Number of 90 days past due or worse items ever (excluding medical colls)",
						"@_ID": "G224A",
						"@_Value": "5",
					},
					{
						"@_Name":
							"G238S:Number of credit inquiries in past 12 months (excl coll inqs)",
						"@_ID": "G238S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"G244S:Number of inquiries (includes duplicates) in past 12 months",
						"@_ID": "G244S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"G250A:Number of 30 DPD or worse items ever (excluding medical colls)",
						"@_ID": "G250A",
						"@_Value": "6",
					},
					{
						"@_Name":
							"G250B:Number of 30 DPD or worse items in the past 12 months (excluding medical colls)",
						"@_ID": "G250B",
						"@_Value": "5",
					},
					{
						"@_Name":
							"G250C:Number of 30 DPD or worse items in the past 24 months (excluding medical colls)",
						"@_ID": "G250C",
						"@_Value": "5",
					},
					{
						"@_Name":
							"G251A:Number of 60 DPD or worse items ever (excluding medical colls)",
						"@_ID": "G251A",
						"@_Value": "5",
					},
					{
						"@_Name":
							"G302S:Worst rating on revolving trades in past 12 months",
						"@_ID": "G302S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"G304S:Worst rating on installment trades in past 12 months",
						"@_ID": "G304S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"G310S:Worst rating on all trades in past 12 months",
						"@_ID": "G310S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"GB311:Indicates if bankruptcies have been filed",
						"@_ID": "GB311",
						"@_Value": "0",
					},
					{
						"@_Name":
							"HI57S:Total past due amount of open home equity loan trades verified in past 12 months",
						"@_ID": "HI57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"HR57S:Total past due amount of open HELOC trades verified in past 12 months",
						"@_ID": "HR57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "IN02S:Number of open installment trades",
						"@_ID": "IN02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"IN06S:Number of installment trades opened in past 6 months",
						"@_ID": "IN06S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"IN28S:Total credit line of open installment trades verified in past 12 months",
						"@_ID": "IN28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"IN33S:Total balance of open installment trades verified in past 12 months",
						"@_ID": "IN33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"IN34S:Utilization for open installment trades verified in past 12 months",
						"@_ID": "IN34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"IN36S:Months since most recent installment delinquency",
						"@_ID": "IN36S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"IN57S:Total past due amount of open installment trades verified in past 12 months",
						"@_ID": "IN57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "MT02S:Number of open mortgage trades",
						"@_ID": "MT02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT06S:Number of mortgage trades opened in past 6 months",
						"@_ID": "MT06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT28S:Total credit line of open mortgage trades verified in past 12 months",
						"@_ID": "MT28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT33S:Total balance of open mortgage trades verified in past 12 months",
						"@_ID": "MT33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT34S:Utilization for open mortgage trades verified in past 12 months",
						"@_ID": "MT34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"MT36S:Months since most recent mortgage delinquency",
						"@_ID": "MT36S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"MT57S:Total past due amount of open mortgage trades verified in past 12 months",
						"@_ID": "MT57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "RE02S:Number of open revolving trades",
						"@_ID": "RE02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE06S:Number of revolving trades opened in past 6 months",
						"@_ID": "RE06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE12S:Number of open revolving trades verified in past 12 months",
						"@_ID": "RE12S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE20S:Months since oldest revolving trade opened",
						"@_ID": "RE20S",
						"@_Value": "118",
					},
					{
						"@_Name":
							"RE21S:Months since most recent revolving trade opened",
						"@_ID": "RE21S",
						"@_Value": "118",
					},
					{
						"@_Name":
							"RE28S:Total credit line of open revolving trades verified in past 12 months",
						"@_ID": "RE28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE30S:Percentage of open revolving trades > 50% of credit line verified in past 12 months",
						"@_ID": "RE30S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE31S:Percentage of open revolving trades > 75% of credit line verified in past 12 months",
						"@_ID": "RE31S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE33S:Total balance of open revolving trades verified in past 12 months",
						"@_ID": "RE33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE34S:Utilization for open revolving trades verified in past 12 months",
						"@_ID": "RE34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE34T:Utilization for all bureau open revolving trades verified in past 12 months",
						"@_ID": "RE34T",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE36S:Months since most recent revolving delinquency",
						"@_ID": "RE36S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"RE57S:Total past due amount of open revolving trades verified in past 12 months",
						"@_ID": "RE57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE102S:Average credit line of open revolving trades verified in past 12 months",
						"@_ID": "RE102S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RP04S:Months since most recent repossession trade was first reported",
						"@_ID": "RP04S",
						"@_Value": "59",
					},
					{
						"@_Name":
							"S004S:Average number of months trades have been on file",
						"@_ID": "S004S",
						"@_Value": "90",
					},
					{
						"@_Name":
							"S043S:Number of open trades > 50% of credit line verified in 12 mons (excl installs and morts)",
						"@_ID": "S043S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"S061S:Months since most recent 60 or more days past due",
						"@_ID": "S061S",
						"@_Value": "56",
					},
					{
						"@_Name":
							"S062S:Months since most recent 90 or more days past due",
						"@_ID": "S062S",
						"@_Value": "56",
					},
					{
						"@_Name": "S068A:Number of third party collections",
						"@_ID": "S068A",
						"@_Value": "2",
					},
					{
						"@_Name":
							"S114S:Number of deduped inquiries in past 6 months (excl auto and mortgage inquiries)",
						"@_ID": "S114S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"S204A:Total balance of non-medical third party collections verified in past 12 months",
						"@_ID": "S204A",
						"@_Value": "7533",
					},
					{
						"@_Name":
							"S207A:Months since most recent tradeline bankruptcy",
						"@_ID": "S207A",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"S207S:Months since most recent public record bankruptcy",
						"@_ID": "S207S",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"S209A:Months since most recent non-medical third party collection",
						"@_ID": "S209A",
						"@_Value": "5",
					},
					{
						"@_Name":
							"ST28S:Total credit line of open student loan trades verified in past 12 months",
						"@_ID": "ST28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"ST33S:Total balance of open student loan trades verified in past 12 months",
						"@_ID": "ST33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"ST34S:Utilization for open student loan trades verified in past 12 months",
						"@_ID": "ST34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"ST57S:Total past due amount of open student loan trades verified in past 12 months",
						"@_ID": "ST57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT014:Total Scheduled Monthly Payment",
						"@_ID": "PT014",
						"@_Value": "0",
					},
					{
						"@_Name": "PT016:Utilization on revolving trades",
						"@_ID": "PT016",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"PT017:Total balance on open revolving trades",
						"@_ID": "PT017",
						"@_Value": "0",
					},
					{
						"@_Name": "PT019:Total Mortgage Monthly Payment",
						"@_ID": "PT019",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT020:Total balance on open Mortgages",
						"@_ID": "PT020",
						"@_Value": "0",
					},
					{
						"@_Name": "PT021:Total Monthly Automobile Payment",
						"@_ID": "PT021",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT022:Date of oldest trade",
						"@_ID": "PT022",
						"@_Value": "042013",
					},
					{
						"@_Name": "PT023:Months since infile created at bureau",
						"@_ID": "PT023",
						"@_Value": "288",
					},
					{
						"@_Name":
							"PT027:Total occurrances of delinquencies in past 12 months",
						"@_ID": "PT027",
						"@_Value": "0",
					},
					{
						"@_Name": "PT038:Number of Inquiries in past 6 months",
						"@_ID": "PT038",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT054:Total Credit Limit/High Credit on open tradelines",
						"@_ID": "PT054",
						"@_Value": "0",
					},
					{
						"@_Name": "PT056:Total balance on all tradelines",
						"@_ID": "PT056",
						"@_Value": "22676",
					},
					{
						"@_Name":
							"PT063:Number of currently delinquent tradelines",
						"@_ID": "PT063",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT064:Number of currently delinquent revolving tradelines",
						"@_ID": "PT064",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT065:Number of currently delinquent installment tradelines",
						"@_ID": "PT065",
						"@_Value": "0",
					},
					{
						"@_Name": "PT068:Average balance on open tradelines",
						"@_ID": "PT068",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"PT069:Number of Chargeoffs in past 12 months",
						"@_ID": "PT069",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT071:Total occurrances of delinquencies in the past 2 years",
						"@_ID": "PT071",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT072:Total occurrances of delinquencies in the past 30 days",
						"@_ID": "PT072",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT073:Total occurrances of delinquencies in the past 60 days",
						"@_ID": "PT073",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT074:Total occurrances of delinquencies in the past 7 years",
						"@_ID": "PT074",
						"@_Value": "7",
					},
					{
						"@_Name": "PT076:Date of oldest trade",
						"@_ID": "PT076",
						"@_Value": "042013",
					},
					{
						"@_Name":
							"PT079:Number of months since oldest installment tradeline opened",
						"@_ID": "PT079",
						"@_Value": "122",
					},
					{
						"@_Name":
							"PT080:Number of months since oldest revolving tradeline opened",
						"@_ID": "PT080",
						"@_Value": "118",
					},
					{
						"@_Name":
							"PT082:Number of months since most recent tradeline opened",
						"@_ID": "PT082",
						"@_Value": "5",
					},
					{
						"@_Name": "PT083:Number of mortgage trades",
						"@_ID": "PT083",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT088:Number of months since 90+ late or worse derogatory",
						"@_ID": "PT088",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT089:Number of tradelines reported in past 2 months and currently 120 days past due",
						"@_ID": "PT089",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT090:Number of tradelines currently 30 days past due",
						"@_ID": "PT090",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT091:Number of tradelines 90+ days past due in past 24 months",
						"@_ID": "PT091",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT092:Number of tradelines opened in past 12 months",
						"@_ID": "PT092",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT093:Percentage of tradelines never delinquent",
						"@_ID": "PT093",
						"@_Value": "79",
					},
					{
						"@_Name":
							"PT094:Number of tradelines ever 120 days past due",
						"@_ID": "PT094",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT095:Number of months since oldest bank installment tradeline",
						"@_ID": "PT095",
						"@_Value": "122",
					},
					{
						"@_Name":
							"PT103:Total credit limit/high credit on open installment tradelines",
						"@_ID": "PT103",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT104:Number of currently satisfactory tradelines",
						"@_ID": "PT104",
						"@_Value": "10",
					},
					{
						"@_Name": "PT105:Number of revolving tradelines",
						"@_ID": "PT105",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT110:Number of revolving tradelines opened in past 7 years",
						"@_ID": "PT110",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT111:Total credit limit/high credit on open revolving tradelines",
						"@_ID": "PT111",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT112:Total available credit on open bankcard tradelines verified in the last 6 mons",
						"@_ID": "PT112",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"PT115:Percent of bankcard tradelines gt 75% of credit limit",
						"@_ID": "PT115",
						"@_Value": "100",
					},
					{
						"@_Name":
							"PT118:Total credit limit/high credit on open bankcard tradelines",
						"@_ID": "PT118",
						"@_Value": "0",
					},
					{
						"@_Name": "PT119:Number of bankcard tradelines",
						"@_ID": "PT119",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT120:Number of months since most recent bankcard tradeline opened",
						"@_ID": "PT120",
						"@_Value": "118",
					},
					{
						"@_Name":
							"PT121:Number of bankcard tradelines opened in the past 6 months",
						"@_ID": "PT121",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT122:Number of bankcard tradelines never delinquent",
						"@_ID": "PT122",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT125:Number of months since most recent bankcard delinquency",
						"@_ID": "PT125",
						"@_Value": "56",
					},
					{
						"@_Name":
							"PT126:Percent utilization on bankcard tradelines",
						"@_ID": "PT126",
						"@_Value": "143",
					},
					{
						"@_Name":
							"PT129:Number of Public Records with amount gt 100",
						"@_ID": "PT129",
						"@_Value": "-4",
					},
					{
						"@_Name": "PT130:Number of Tax Liens",
						"@_ID": "PT130",
						"@_Value": "0",
					},
					{
						"@_Name": "PT132:Total amount on Collections",
						"@_ID": "PT132",
						"@_Value": "7533",
					},
					{
						"@_Name": "PT133:Number of repossessions",
						"@_ID": "PT133",
						"@_Value": "1",
					},
					{
						"@_Name": "PT134:Number of foreclosures",
						"@_ID": "PT134",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT136:Number of Collections/Chargeoffs in past 24 months; excluding medical",
						"@_ID": "PT136",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT137:Total amount on Collections in past 36 months; excluding medical",
						"@_ID": "PT137",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT138:Number of tradelines active within the past 6 months",
						"@_ID": "PT138",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT139:Number of mortgage tradelines opened in past 6 months",
						"@_ID": "PT139",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT140:Number of open installment tradelines opened within the past 24 months",
						"@_ID": "PT140",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT141:Total occurrances of 30 days late within the past 12 months on Mortgage trades",
						"@_ID": "PT141",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT142:Number of mortgages passed due 30 days or more in the last 6 months",
						"@_ID": "PT142",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT143:Total occurrances of 30 days late within the past 12 months",
						"@_ID": "PT143",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT144:Number of collections with amount gt 500",
						"@_ID": "PT144",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT145:Total balance on unsecured credit card tradelines",
						"@_ID": "PT145",
						"@_Value": "1434",
					},
					{
						"@_Name": "PT146:Total balance on unsecured tradelines",
						"@_ID": "PT146",
						"@_Value": "8967",
					},
					{
						"@_Name":
							"PT147:Total amount on Tax Liens filed within the past 36 months",
						"@_ID": "PT147",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT148:Total amount on Judgements filed within the past 36 months",
						"@_ID": "PT148",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT149:Number of Public Records filed in past 24 months",
						"@_ID": "PT149",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT150:Number of non-federal Student Loan tradelines",
						"@_ID": "PT150",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT151:Number of repossessed auto loan tradelines",
						"@_ID": "PT151",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT153:Percent utilization on installment tradelines",
						"@_ID": "PT153",
						"@_Value": "7",
					},
					{
						"@_Name":
							"PT154:Number of revolving tradelines with balance gt 0",
						"@_ID": "PT154",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT155:Number of installment tradelines opened in past 12 months",
						"@_ID": "PT155",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT157:Number of revolving tradelines opened in past 12 months",
						"@_ID": "PT157",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT158:Number of revolving tradelines opened in past 24 months",
						"@_ID": "PT158",
						"@_Value": "0",
					},
					{
						"@_Name": "PT159:Number of credit union tradelines",
						"@_ID": "PT159",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT160:Percent utilization on all open tradelines",
						"@_ID": "PT160",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"PT162:Maximum balance on revolving tradelines",
						"@_ID": "PT162",
						"@_Value": "1434",
					},
					{
						"@_Name":
							"PT163:Number months since more recent installment tradeline opened",
						"@_ID": "PT163",
						"@_Value": "5",
					},
					{
						"@_Name":
							"PT165:Number of auto tradelines 30 days past due in past 6 months",
						"@_ID": "PT165",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT166:Number of auto tradelines opened in past 6 months",
						"@_ID": "PT166",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT167:Number of retail tradelines opened in past 6 months",
						"@_ID": "PT167",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT168:Number of student loans opened in past 12 months",
						"@_ID": "PT168",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT174:Total amount on Collections; excluding medical",
						"@_ID": "PT174",
						"@_Value": "7533",
					},
					{
						"@_Name": "PT175:Total amount on Tax Liens",
						"@_ID": "PT175",
						"@_Value": "-4",
					},
					{
						"@_Name": "PT176:Total amount on Judgements",
						"@_ID": "PT176",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT177:Total credit limit on open credit card trades",
						"@_ID": "PT177",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT178:Total credit limit on open retail trades",
						"@_ID": "PT178",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT179:Total balance on open credit card trades",
						"@_ID": "PT179",
						"@_Value": "0",
					},
					{
						"@_Name": "PT180:Total balance on open retail trades",
						"@_ID": "PT180",
						"@_Value": "0",
					},
					{
						"@_Name": "PT181:Age of oldest trade in months",
						"@_ID": "PT181",
						"@_Value": "122",
					},
					{
						"@_Name":
							"PT182:Total number of open credit card trades",
						"@_ID": "PT182",
						"@_Value": "0",
					},
					{
						"@_Name": "PT183:Total number of open retail trades",
						"@_ID": "PT183",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT184:Total number of trades ever delinquent",
						"@_ID": "PT184",
						"@_Value": "3",
					},
					{
						"@_Name":
							"PT185:Total number of tradelines delinquent in the last 6 months",
						"@_ID": "PT185",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT186:Total number of installment tradelines 60 days late or worse in the last 6 months",
						"@_ID": "PT186",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT187:Total balances on currently delinquent tradelines",
						"@_ID": "PT187",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT188:Worst current status on any open tradeline",
						"@_ID": "PT188",
						"@_Value": "9",
					},
					{
						"@_Name":
							"PT189:Worst status in the past 12 months on any mortgage tradeline",
						"@_ID": "PT189",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT190:Total number of closed credit card trades",
						"@_ID": "PT190",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT191:Total number of closed installment trades",
						"@_ID": "PT191",
						"@_Value": "13",
					},
					{
						"@_Name": "PT192:Percent of revolving credit available",
						"@_ID": "PT192",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT193:Number of loans or credit cards applied for in past 24 months",
						"@_ID": "PT193",
						"@_Value": "6",
					},
					{
						"@_Name":
							"PT194:Number of Installment tradelines not delinquent within the last 24 months",
						"@_ID": "PT194",
						"@_Value": "8",
					},
					{
						"@_Name":
							"PT195:Max credit limit on open bank credit cards",
						"@_ID": "PT195",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT196:Number of collections with amount gt 0",
						"@_ID": "PT196",
						"@_Value": "3",
					},
					{
						"@_Name":
							"PT197:Total Number of delinquent credit card and retail trades in last 6 months",
						"@_ID": "PT197",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT198:Total number of open credit card tradelines with utilization gt 90%",
						"@_ID": "PT198",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT199:Total number of open retail tradelines with utilization gt 90%",
						"@_ID": "PT199",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT200:Number of closed trades; no exclusions",
						"@_ID": "PT200",
						"@_Value": "14",
					},
					{
						"@_Name": "PT201:Number of open trades; no exclusions",
						"@_ID": "PT201",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT202:Total balance on all trades; no exclusions",
						"@_ID": "PT202",
						"@_Value": "22676",
					},
					{
						"@_Name": "Deceased Indicator",
						"@_ID": "AP009",
						"@_Value": "N",
					},
					{
						"@_Name": "Public Record Info",
						"@_ID": "AP010",
						"@_Value": "",
					},
				],
			},
			CREDIT_SUMMARY_TUI: {
				"@BorrowerID": "Borrower01",
				"@_Name": "Attributes",
				_DATA_SET: [
					{
						"@_Name": "Number of tradelines",
						"@_ID": "AP001",
						"@_Value": "15",
					},
					{
						"@_Name": "Average age of open tradelines",
						"@_ID": "AP002",
						"@_Value": "30",
					},
					{
						"@_Name":
							"Average age of open tradelines; exclude auth user and joint ecoa",
						"@_ID": "AP003",
						"@_Value": "30",
					},
					{
						"@_Name": "Number of hard inquiries",
						"@_ID": "AP004",
						"@_Value": "2",
					},
					{
						"@_Name": "Number of payments",
						"@_ID": "AP005",
						"@_Value": "151",
					},
					{
						"@_Name": "Revolving utilization on open credit cards",
						"@_ID": "AP006",
						"@_Value": "N/A",
					},
					{
						"@_Name": "Total occurrences of minor delinqs",
						"@_ID": "AP007",
						"@_Value": "0",
					},
					{
						"@_Name": "Total number of major derogatory tradelines",
						"@_ID": "AP008",
						"@_Value": "6",
					},
					{
						"@_Name":
							"Total number of major derogatory tradelines calculated by TU",
						"@_ID": "AP008_RAW",
						"@_Value": "6",
					},
					{
						"@_Name":
							"Average age in months of all open revolving accounts",
						"@_ID": "AP011",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"Average age in months of all open installment accounts",
						"@_ID": "AP012",
						"@_Value": "30",
					},
					{
						"@_Name":
							"Average age in months of all other open accounts (non-revolving non-installment)",
						"@_ID": "AP013",
						"@_Value": "N/A",
					},
					{
						"@_Name": "AT01S:Number of trades",
						"@_ID": "AT01S",
						"@_Value": "15",
					},
					{
						"@_Name": "AT02S:Number of open trades",
						"@_ID": "AT02S",
						"@_Value": "4",
					},
					{
						"@_Name":
							"AT06S:Number of trades opened in past 6 months",
						"@_ID": "AT06S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"AT09S:Number of trades opened in past 24 months",
						"@_ID": "AT09S",
						"@_Value": "2",
					},
					{
						"@_Name": "AT20S:Months since oldest trade opened",
						"@_ID": "AT20S",
						"@_Value": "122",
					},
					{
						"@_Name":
							"AT28A:Total credit line of open trades verified in past 12 months",
						"@_ID": "AT28A",
						"@_Value": "16976",
					},
					{
						"@_Name":
							"AT28B:Total credit line of open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT28B",
						"@_Value": "16976",
					},
					{
						"@_Name":
							"AT33A:Total balance of open trades verified in past 12 months",
						"@_ID": "AT33A",
						"@_Value": "18219",
					},
					{
						"@_Name":
							"AT33B:Total balance of open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT33B",
						"@_Value": "18219",
					},
					{
						"@_Name":
							"AT34A:Utilization for open trades verified in past 12 months",
						"@_ID": "AT34A",
						"@_Value": "107",
					},
					{
						"@_Name":
							"AT34B:Utilization for open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT34B",
						"@_Value": "107",
					},
					{
						"@_Name": "AT36S:Months since most recent delinquency",
						"@_ID": "AT36S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"AT57S:Total past due amount of open trades verified in past 12 months",
						"@_ID": "AT57S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AT103S:Percentage of satisfactory open trades to all open trades",
						"@_ID": "AT103S",
						"@_Value": "25",
					},
					{
						"@_Name":
							"AT104S:Percentage of all trades opened in past 24 months to all trades",
						"@_ID": "AT104S",
						"@_Value": "13",
					},
					{
						"@_Name":
							"ATAP01:Total scheduled monthly payment for all trades verified in past 12 months",
						"@_ID": "ATAP01",
						"@_Value": "280",
					},
					{
						"@_Name":
							"AU28S:Total credit line of open auto trades verified in past 12 months",
						"@_ID": "AU28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AU33S:Total balance of open auto trades verified in past 12 months",
						"@_ID": "AU33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AU34S:Utilization for open auto trades verified in past 12 months",
						"@_ID": "AU34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"AU57S:Total past due amount of open auto trades verified in past 12 months",
						"@_ID": "AU57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "BC02S:Number of open credit card trades",
						"@_ID": "BC02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC06S:Number of credit card trades opened in past 6 months",
						"@_ID": "BC06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC102S:Average credit line of open credit card trades verified in past 12 months",
						"@_ID": "BC102S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC12S:Number of open credit card trades verified in past 12 months",
						"@_ID": "BC12S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC20S:Months since oldest credit card trade opened",
						"@_ID": "BC20S",
						"@_Value": "118",
					},
					{
						"@_Name":
							"BC28S:Total credit line of open credit card trades verified in past 12 months",
						"@_ID": "BC28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC30S:Percentage of open credit card trades > 50% of credit line verified in past 12 months",
						"@_ID": "BC30S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC31S:Percentage of open credit card trades > 75% of credit line verified in past 12 months",
						"@_ID": "BC31S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC33S:Total balance of open credit card trades verified in past 12 months",
						"@_ID": "BC33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC34S:Utilization for open credit card trades verified in past 12 months",
						"@_ID": "BC34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC57S:Total past due amount of open credit card trades verified in past 12 months",
						"@_ID": "BC57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"CO04S:Months since most recent charged-off trade was first reported",
						"@_ID": "CO04S",
						"@_Value": "60",
					},
					{
						"@_Name":
							"FC04S:Months since most recent foreclosure trade was first reported",
						"@_ID": "FC04S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"G020S:Number of trades with maximum delinquency of 30 days past due in past 24 months",
						"@_ID": "G020S",
						"@_Value": "0",
					},
					{
						"@_Name": "G051S:Percentage of trades ever delinquent",
						"@_ID": "G051S",
						"@_Value": "40",
					},
					{
						"@_Name": "G093S:Number of public records",
						"@_ID": "G093S",
						"@_Value": "0",
					},
					{
						"@_Name": "G094S:Number of public record bankruptcies",
						"@_ID": "G094S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G095S:Months since most recent public record",
						"@_ID": "G095S",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"G103S:Months since most recent credit inquiry",
						"@_ID": "G103S",
						"@_Value": "14",
					},
					{
						"@_Name":
							"G202A:Total open to buy of open trades verified in past 12 months (excl installs and morts)",
						"@_ID": "G202A",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"G215B:Number of non-medical third party collections with balance > $0",
						"@_ID": "G215B",
						"@_Value": "4",
					},
					{
						"@_Name":
							"G217S:Total past due amount of all trades verified in past 12 months",
						"@_ID": "G217S",
						"@_Value": "15742",
					},
					{
						"@_Name":
							"G218B:Number of trades verified in the past 12 months that are currently 30+ DPD",
						"@_ID": "G218B",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G224A:Number of 90 days past due or worse items ever (excluding medical colls)",
						"@_ID": "G224A",
						"@_Value": "6",
					},
					{
						"@_Name":
							"G238S:Number of credit inquiries in past 12 months (excl coll inqs)",
						"@_ID": "G238S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G244S:Number of inquiries (includes duplicates) in past 12 months",
						"@_ID": "G244S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G250A:Number of 30 DPD or worse items ever (excluding medical colls)",
						"@_ID": "G250A",
						"@_Value": "6",
					},
					{
						"@_Name":
							"G250B:Number of 30 DPD or worse items in the past 12 months (excluding medical colls)",
						"@_ID": "G250B",
						"@_Value": "6",
					},
					{
						"@_Name":
							"G250C:Number of 30 DPD or worse items in the past 24 months (excluding medical colls)",
						"@_ID": "G250C",
						"@_Value": "6",
					},
					{
						"@_Name":
							"G251A:Number of 60 DPD or worse items ever (excluding medical colls)",
						"@_ID": "G251A",
						"@_Value": "6",
					},
					{
						"@_Name":
							"G302S:Worst rating on revolving trades in past 12 months",
						"@_ID": "G302S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"G304S:Worst rating on installment trades in past 12 months",
						"@_ID": "G304S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"G310S:Worst rating on all trades in past 12 months",
						"@_ID": "G310S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"GB311:Indicates if bankruptcies have been filed",
						"@_ID": "GB311",
						"@_Value": "0",
					},
					{
						"@_Name":
							"HI57S:Total past due amount of open home equity loan trades verified in past 12 months",
						"@_ID": "HI57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"HR57S:Total past due amount of open HELOC trades verified in past 12 months",
						"@_ID": "HR57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "IN02S:Number of open installment trades",
						"@_ID": "IN02S",
						"@_Value": "4",
					},
					{
						"@_Name":
							"IN06S:Number of installment trades opened in past 6 months",
						"@_ID": "IN06S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"IN28S:Total credit line of open installment trades verified in past 12 months",
						"@_ID": "IN28S",
						"@_Value": "16976",
					},
					{
						"@_Name":
							"IN33S:Total balance of open installment trades verified in past 12 months",
						"@_ID": "IN33S",
						"@_Value": "18219",
					},
					{
						"@_Name":
							"IN34S:Utilization for open installment trades verified in past 12 months",
						"@_ID": "IN34S",
						"@_Value": "107",
					},
					{
						"@_Name":
							"IN36S:Months since most recent installment delinquency",
						"@_ID": "IN36S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"IN57S:Total past due amount of open installment trades verified in past 12 months",
						"@_ID": "IN57S",
						"@_Value": "0",
					},
					{
						"@_Name": "MT02S:Number of open mortgage trades",
						"@_ID": "MT02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT06S:Number of mortgage trades opened in past 6 months",
						"@_ID": "MT06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT28S:Total credit line of open mortgage trades verified in past 12 months",
						"@_ID": "MT28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT33S:Total balance of open mortgage trades verified in past 12 months",
						"@_ID": "MT33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT34S:Utilization for open mortgage trades verified in past 12 months",
						"@_ID": "MT34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"MT36S:Months since most recent mortgage delinquency",
						"@_ID": "MT36S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"MT57S:Total past due amount of open mortgage trades verified in past 12 months",
						"@_ID": "MT57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "RE02S:Number of open revolving trades",
						"@_ID": "RE02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE06S:Number of revolving trades opened in past 6 months",
						"@_ID": "RE06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE12S:Number of open revolving trades verified in past 12 months",
						"@_ID": "RE12S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE20S:Months since oldest revolving trade opened",
						"@_ID": "RE20S",
						"@_Value": "118",
					},
					{
						"@_Name":
							"RE21S:Months since most recent revolving trade opened",
						"@_ID": "RE21S",
						"@_Value": "118",
					},
					{
						"@_Name":
							"RE28S:Total credit line of open revolving trades verified in past 12 months",
						"@_ID": "RE28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE30S:Percentage of open revolving trades > 50% of credit line verified in past 12 months",
						"@_ID": "RE30S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE31S:Percentage of open revolving trades > 75% of credit line verified in past 12 months",
						"@_ID": "RE31S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE33S:Total balance of open revolving trades verified in past 12 months",
						"@_ID": "RE33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE34S:Utilization for open revolving trades verified in past 12 months",
						"@_ID": "RE34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE34T:Utilization for all bureau open revolving trades verified in past 12 months",
						"@_ID": "RE34T",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE36S:Months since most recent revolving delinquency",
						"@_ID": "RE36S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"RE57S:Total past due amount of open revolving trades verified in past 12 months",
						"@_ID": "RE57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE102S:Average credit line of open revolving trades verified in past 12 months",
						"@_ID": "RE102S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RP04S:Months since most recent repossession trade was first reported",
						"@_ID": "RP04S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"S004S:Average number of months trades have been on file",
						"@_ID": "S004S",
						"@_Value": "27",
					},
					{
						"@_Name":
							"S043S:Number of open trades > 50% of credit line verified in 12 mons (excl installs and morts)",
						"@_ID": "S043S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"S061S:Months since most recent 60 or more days past due",
						"@_ID": "S061S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"S062S:Months since most recent 90 or more days past due",
						"@_ID": "S062S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "S068A:Number of third party collections",
						"@_ID": "S068A",
						"@_Value": "3",
					},
					{
						"@_Name":
							"S114S:Number of deduped inquiries in past 6 months (excl auto and mortgage inquiries)",
						"@_ID": "S114S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"S204A:Total balance of non-medical third party collections verified in past 12 months",
						"@_ID": "S204A",
						"@_Value": "7793",
					},
					{
						"@_Name":
							"S207A:Months since most recent tradeline bankruptcy",
						"@_ID": "S207A",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"S207S:Months since most recent public record bankruptcy",
						"@_ID": "S207S",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"S209A:Months since most recent non-medical third party collection",
						"@_ID": "S209A",
						"@_Value": "5",
					},
					{
						"@_Name":
							"ST28S:Total credit line of open student loan trades verified in past 12 months",
						"@_ID": "ST28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"ST33S:Total balance of open student loan trades verified in past 12 months",
						"@_ID": "ST33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"ST34S:Utilization for open student loan trades verified in past 12 months",
						"@_ID": "ST34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"ST57S:Total past due amount of open student loan trades verified in past 12 months",
						"@_ID": "ST57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT014:Total Scheduled Monthly Payment",
						"@_ID": "PT014",
						"@_Value": "280",
					},
					{
						"@_Name": "PT016:Utilization on revolving trades",
						"@_ID": "PT016",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"PT017:Total balance on open revolving trades",
						"@_ID": "PT017",
						"@_Value": "0",
					},
					{
						"@_Name": "PT019:Total Mortgage Monthly Payment",
						"@_ID": "PT019",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT020:Total balance on open Mortgages",
						"@_ID": "PT020",
						"@_Value": "0",
					},
					{
						"@_Name": "PT021:Total Monthly Automobile Payment",
						"@_ID": "PT021",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT022:Date of oldest trade",
						"@_ID": "PT022",
						"@_Value": "042013",
					},
					{
						"@_Name": "PT023:Months since infile created at bureau",
						"@_ID": "PT023",
						"@_Value": "288",
					},
					{
						"@_Name":
							"PT027:Total occurrances of delinquencies in past 12 months",
						"@_ID": "PT027",
						"@_Value": "0",
					},
					{
						"@_Name": "PT038:Number of Inquiries in past 6 months",
						"@_ID": "PT038",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT054:Total Credit Limit/High Credit on open tradelines",
						"@_ID": "PT054",
						"@_Value": "16976",
					},
					{
						"@_Name": "PT056:Total balance on all tradelines",
						"@_ID": "PT056",
						"@_Value": "33961",
					},
					{
						"@_Name":
							"PT063:Number of currently delinquent tradelines",
						"@_ID": "PT063",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT064:Number of currently delinquent revolving tradelines",
						"@_ID": "PT064",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT065:Number of currently delinquent installment tradelines",
						"@_ID": "PT065",
						"@_Value": "0",
					},
					{
						"@_Name": "PT068:Average balance on open tradelines",
						"@_ID": "PT068",
						"@_Value": "4555",
					},
					{
						"@_Name":
							"PT069:Number of Chargeoffs in past 12 months",
						"@_ID": "PT069",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT071:Total occurrances of delinquencies in the past 2 years",
						"@_ID": "PT071",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT072:Total occurrances of delinquencies in the past 30 days",
						"@_ID": "PT072",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT073:Total occurrances of delinquencies in the past 60 days",
						"@_ID": "PT073",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT074:Total occurrances of delinquencies in the past 7 years",
						"@_ID": "PT074",
						"@_Value": "0",
					},
					{
						"@_Name": "PT076:Date of oldest trade",
						"@_ID": "PT076",
						"@_Value": "042013",
					},
					{
						"@_Name":
							"PT079:Number of months since oldest installment tradeline opened",
						"@_ID": "PT079",
						"@_Value": "122",
					},
					{
						"@_Name":
							"PT080:Number of months since oldest revolving tradeline opened",
						"@_ID": "PT080",
						"@_Value": "118",
					},
					{
						"@_Name":
							"PT082:Number of months since most recent tradeline opened",
						"@_ID": "PT082",
						"@_Value": "5",
					},
					{
						"@_Name": "PT083:Number of mortgage trades",
						"@_ID": "PT083",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT088:Number of months since 90+ late or worse derogatory",
						"@_ID": "PT088",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT089:Number of tradelines reported in past 2 months and currently 120 days past due",
						"@_ID": "PT089",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT090:Number of tradelines currently 30 days past due",
						"@_ID": "PT090",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT091:Number of tradelines 90+ days past due in past 24 months",
						"@_ID": "PT091",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT092:Number of tradelines opened in past 12 months",
						"@_ID": "PT092",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT093:Percentage of tradelines never delinquent",
						"@_ID": "PT093",
						"@_Value": "100",
					},
					{
						"@_Name":
							"PT094:Number of tradelines ever 120 days past due",
						"@_ID": "PT094",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT095:Number of months since oldest bank installment tradeline",
						"@_ID": "PT095",
						"@_Value": "122",
					},
					{
						"@_Name":
							"PT103:Total credit limit/high credit on open installment tradelines",
						"@_ID": "PT103",
						"@_Value": "16976",
					},
					{
						"@_Name":
							"PT104:Number of currently satisfactory tradelines",
						"@_ID": "PT104",
						"@_Value": "9",
					},
					{
						"@_Name": "PT105:Number of revolving tradelines",
						"@_ID": "PT105",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT110:Number of revolving tradelines opened in past 7 years",
						"@_ID": "PT110",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT111:Total credit limit/high credit on open revolving tradelines",
						"@_ID": "PT111",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT112:Total available credit on open bankcard tradelines verified in the last 6 mons",
						"@_ID": "PT112",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"PT115:Percent of bankcard tradelines gt 75% of credit limit",
						"@_ID": "PT115",
						"@_Value": "100",
					},
					{
						"@_Name":
							"PT118:Total credit limit/high credit on open bankcard tradelines",
						"@_ID": "PT118",
						"@_Value": "0",
					},
					{
						"@_Name": "PT119:Number of bankcard tradelines",
						"@_ID": "PT119",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT120:Number of months since most recent bankcard tradeline opened",
						"@_ID": "PT120",
						"@_Value": "118",
					},
					{
						"@_Name":
							"PT121:Number of bankcard tradelines opened in the past 6 months",
						"@_ID": "PT121",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT122:Number of bankcard tradelines never delinquent",
						"@_ID": "PT122",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT125:Number of months since most recent bankcard delinquency",
						"@_ID": "PT125",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"PT126:Percent utilization on bankcard tradelines",
						"@_ID": "PT126",
						"@_Value": "143",
					},
					{
						"@_Name":
							"PT129:Number of Public Records with amount gt 100",
						"@_ID": "PT129",
						"@_Value": "-4",
					},
					{
						"@_Name": "PT130:Number of Tax Liens",
						"@_ID": "PT130",
						"@_Value": "0",
					},
					{
						"@_Name": "PT132:Total amount on Collections",
						"@_ID": "PT132",
						"@_Value": "7793",
					},
					{
						"@_Name": "PT133:Number of repossessions",
						"@_ID": "PT133",
						"@_Value": "0",
					},
					{
						"@_Name": "PT134:Number of foreclosures",
						"@_ID": "PT134",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT136:Number of Collections/Chargeoffs in past 24 months; excluding medical",
						"@_ID": "PT136",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT137:Total amount on Collections in past 36 months; excluding medical",
						"@_ID": "PT137",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT138:Number of tradelines active within the past 6 months",
						"@_ID": "PT138",
						"@_Value": "4",
					},
					{
						"@_Name":
							"PT139:Number of mortgage tradelines opened in past 6 months",
						"@_ID": "PT139",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT140:Number of open installment tradelines opened within the past 24 months",
						"@_ID": "PT140",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT141:Total occurrances of 30 days late within the past 12 months on Mortgage trades",
						"@_ID": "PT141",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT142:Number of mortgages passed due 30 days or more in the last 6 months",
						"@_ID": "PT142",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT143:Total occurrances of 30 days late within the past 12 months",
						"@_ID": "PT143",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT144:Number of collections with amount gt 500",
						"@_ID": "PT144",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT145:Total balance on unsecured credit card tradelines",
						"@_ID": "PT145",
						"@_Value": "1434",
					},
					{
						"@_Name": "PT146:Total balance on unsecured tradelines",
						"@_ID": "PT146",
						"@_Value": "33961",
					},
					{
						"@_Name":
							"PT147:Total amount on Tax Liens filed within the past 36 months",
						"@_ID": "PT147",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT148:Total amount on Judgements filed within the past 36 months",
						"@_ID": "PT148",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT149:Number of Public Records filed in past 24 months",
						"@_ID": "PT149",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT150:Number of non-federal Student Loan tradelines",
						"@_ID": "PT150",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT151:Number of repossessed auto loan tradelines",
						"@_ID": "PT151",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT153:Percent utilization on installment tradelines",
						"@_ID": "PT153",
						"@_Value": "11",
					},
					{
						"@_Name":
							"PT154:Number of revolving tradelines with balance gt 0",
						"@_ID": "PT154",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT155:Number of installment tradelines opened in past 12 months",
						"@_ID": "PT155",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT157:Number of revolving tradelines opened in past 12 months",
						"@_ID": "PT157",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT158:Number of revolving tradelines opened in past 24 months",
						"@_ID": "PT158",
						"@_Value": "0",
					},
					{
						"@_Name": "PT159:Number of credit union tradelines",
						"@_ID": "PT159",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT160:Percent utilization on all open tradelines",
						"@_ID": "PT160",
						"@_Value": "107",
					},
					{
						"@_Name":
							"PT162:Maximum balance on revolving tradelines",
						"@_ID": "PT162",
						"@_Value": "1434",
					},
					{
						"@_Name":
							"PT163:Number months since more recent installment tradeline opened",
						"@_ID": "PT163",
						"@_Value": "5",
					},
					{
						"@_Name":
							"PT165:Number of auto tradelines 30 days past due in past 6 months",
						"@_ID": "PT165",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT166:Number of auto tradelines opened in past 6 months",
						"@_ID": "PT166",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT167:Number of retail tradelines opened in past 6 months",
						"@_ID": "PT167",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT168:Number of student loans opened in past 12 months",
						"@_ID": "PT168",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT174:Total amount on Collections; excluding medical",
						"@_ID": "PT174",
						"@_Value": "7793",
					},
					{
						"@_Name": "PT175:Total amount on Tax Liens",
						"@_ID": "PT175",
						"@_Value": "-4",
					},
					{
						"@_Name": "PT176:Total amount on Judgements",
						"@_ID": "PT176",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT177:Total credit limit on open credit card trades",
						"@_ID": "PT177",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT178:Total credit limit on open retail trades",
						"@_ID": "PT178",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT179:Total balance on open credit card trades",
						"@_ID": "PT179",
						"@_Value": "0",
					},
					{
						"@_Name": "PT180:Total balance on open retail trades",
						"@_ID": "PT180",
						"@_Value": "0",
					},
					{
						"@_Name": "PT181:Age of oldest trade in months",
						"@_ID": "PT181",
						"@_Value": "122",
					},
					{
						"@_Name":
							"PT182:Total number of open credit card trades",
						"@_ID": "PT182",
						"@_Value": "0",
					},
					{
						"@_Name": "PT183:Total number of open retail trades",
						"@_ID": "PT183",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT184:Total number of trades ever delinquent",
						"@_ID": "PT184",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT185:Total number of tradelines delinquent in the last 6 months",
						"@_ID": "PT185",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT186:Total number of installment tradelines 60 days late or worse in the last 6 months",
						"@_ID": "PT186",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT187:Total balances on currently delinquent tradelines",
						"@_ID": "PT187",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT188:Worst current status on any open tradeline",
						"@_ID": "PT188",
						"@_Value": "9",
					},
					{
						"@_Name":
							"PT189:Worst status in the past 12 months on any mortgage tradeline",
						"@_ID": "PT189",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT190:Total number of closed credit card trades",
						"@_ID": "PT190",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT191:Total number of closed installment trades",
						"@_ID": "PT191",
						"@_Value": "10",
					},
					{
						"@_Name": "PT192:Percent of revolving credit available",
						"@_ID": "PT192",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT193:Number of loans or credit cards applied for in past 24 months",
						"@_ID": "PT193",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT194:Number of Installment tradelines not delinquent within the last 24 months",
						"@_ID": "PT194",
						"@_Value": "9",
					},
					{
						"@_Name":
							"PT195:Max credit limit on open bank credit cards",
						"@_ID": "PT195",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT196:Number of collections with amount gt 0",
						"@_ID": "PT196",
						"@_Value": "4",
					},
					{
						"@_Name":
							"PT197:Total Number of delinquent credit card and retail trades in last 6 months",
						"@_ID": "PT197",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT198:Total number of open credit card tradelines with utilization gt 90%",
						"@_ID": "PT198",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT199:Total number of open retail tradelines with utilization gt 90%",
						"@_ID": "PT199",
						"@_Value": "3",
					},
					{
						"@_Name":
							"PT200:Number of closed trades; no exclusions",
						"@_ID": "PT200",
						"@_Value": "11",
					},
					{
						"@_Name": "PT201:Number of open trades; no exclusions",
						"@_ID": "PT201",
						"@_Value": "4",
					},
					{
						"@_Name":
							"PT202:Total balance on all trades; no exclusions",
						"@_ID": "PT202",
						"@_Value": "33961",
					},
					{
						"@_Name": "Deceased Indicator",
						"@_ID": "AP009",
						"@_Value": "N",
					},
					{
						"@_Name": "Public Record Info",
						"@_ID": "AP010",
						"@_Value": "",
					},
				],
			},
			CREDIT_SUMMARY_EFX: {
				"@BorrowerID": "Borrower01",
				"@_Name": "Attributes",
				_DATA_SET: [
					{
						"@_Name": "Number of tradelines",
						"@_ID": "AP001",
						"@_Value": "13",
					},
					{
						"@_Name": "Average age of open tradelines",
						"@_ID": "AP002",
						"@_Value": "32",
					},
					{
						"@_Name":
							"Average age of open tradelines; exclude auth user and joint ecoa",
						"@_ID": "AP003",
						"@_Value": "32",
					},
					{
						"@_Name": "Number of hard inquiries",
						"@_ID": "AP004",
						"@_Value": "1",
					},
					{
						"@_Name": "Number of payments",
						"@_ID": "AP005",
						"@_Value": "14",
					},
					{
						"@_Name": "Revolving utilization on open credit cards",
						"@_ID": "AP006",
						"@_Value": "N/A",
					},
					{
						"@_Name": "Total occurrences of minor delinqs",
						"@_ID": "AP007",
						"@_Value": "12",
					},
					{
						"@_Name": "Total number of major derogatory tradelines",
						"@_ID": "AP008",
						"@_Value": "4",
					},
					{
						"@_Name":
							"Total number of major derogatory tradelines calculated by TU",
						"@_ID": "AP008_RAW",
						"@_Value": "6",
					},
					{
						"@_Name":
							"Average age in months of all open revolving accounts",
						"@_ID": "AP011",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"Average age in months of all open installment accounts",
						"@_ID": "AP012",
						"@_Value": "32",
					},
					{
						"@_Name":
							"Average age in months of all other open accounts (non-revolving non-installment)",
						"@_ID": "AP013",
						"@_Value": "N/A",
					},
					{
						"@_Name": "AT01S:Number of trades",
						"@_ID": "AT01S",
						"@_Value": "13",
					},
					{
						"@_Name": "AT02S:Number of open trades",
						"@_ID": "AT02S",
						"@_Value": "3",
					},
					{
						"@_Name":
							"AT06S:Number of trades opened in past 6 months",
						"@_ID": "AT06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AT09S:Number of trades opened in past 24 months",
						"@_ID": "AT09S",
						"@_Value": "1",
					},
					{
						"@_Name": "AT20S:Months since oldest trade opened",
						"@_ID": "AT20S",
						"@_Value": "259",
					},
					{
						"@_Name":
							"AT28A:Total credit line of open trades verified in past 12 months",
						"@_ID": "AT28A",
						"@_Value": "17159",
					},
					{
						"@_Name":
							"AT28B:Total credit line of open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT28B",
						"@_Value": "17159",
					},
					{
						"@_Name":
							"AT33A:Total balance of open trades verified in past 12 months",
						"@_ID": "AT33A",
						"@_Value": "18388",
					},
					{
						"@_Name":
							"AT33B:Total balance of open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT33B",
						"@_Value": "18388",
					},
					{
						"@_Name":
							"AT34A:Utilization for open trades verified in past 12 months",
						"@_ID": "AT34A",
						"@_Value": "107",
					},
					{
						"@_Name":
							"AT34B:Utilization for open trades verified in past 12 months (excl mort and home equity)",
						"@_ID": "AT34B",
						"@_Value": "107",
					},
					{
						"@_Name": "AT36S:Months since most recent delinquency",
						"@_ID": "AT36S",
						"@_Value": "57",
					},
					{
						"@_Name":
							"AT57S:Total past due amount of open trades verified in past 12 months",
						"@_ID": "AT57S",
						"@_Value": "7363",
					},
					{
						"@_Name":
							"AT103S:Percentage of satisfactory open trades to all open trades",
						"@_ID": "AT103S",
						"@_Value": "150",
					},
					{
						"@_Name":
							"AT104S:Percentage of all trades opened in past 24 months to all trades",
						"@_ID": "AT104S",
						"@_Value": "8",
					},
					{
						"@_Name":
							"ATAP01:Total scheduled monthly payment for all trades verified in past 12 months",
						"@_ID": "ATAP01",
						"@_Value": "280",
					},
					{
						"@_Name":
							"AU28S:Total credit line of open auto trades verified in past 12 months",
						"@_ID": "AU28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AU33S:Total balance of open auto trades verified in past 12 months",
						"@_ID": "AU33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"AU34S:Utilization for open auto trades verified in past 12 months",
						"@_ID": "AU34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"AU57S:Total past due amount of open auto trades verified in past 12 months",
						"@_ID": "AU57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "BC02S:Number of open credit card trades",
						"@_ID": "BC02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC06S:Number of credit card trades opened in past 6 months",
						"@_ID": "BC06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC102S:Average credit line of open credit card trades verified in past 12 months",
						"@_ID": "BC102S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC12S:Number of open credit card trades verified in past 12 months",
						"@_ID": "BC12S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC20S:Months since oldest credit card trade opened",
						"@_ID": "BC20S",
						"@_Value": "211",
					},
					{
						"@_Name":
							"BC28S:Total credit line of open credit card trades verified in past 12 months",
						"@_ID": "BC28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC30S:Percentage of open credit card trades > 50% of credit line verified in past 12 months",
						"@_ID": "BC30S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC31S:Percentage of open credit card trades > 75% of credit line verified in past 12 months",
						"@_ID": "BC31S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC33S:Total balance of open credit card trades verified in past 12 months",
						"@_ID": "BC33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"BC34S:Utilization for open credit card trades verified in past 12 months",
						"@_ID": "BC34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"BC57S:Total past due amount of open credit card trades verified in past 12 months",
						"@_ID": "BC57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"CO04S:Months since most recent charged-off trade was first reported",
						"@_ID": "CO04S",
						"@_Value": "102",
					},
					{
						"@_Name":
							"FC04S:Months since most recent foreclosure trade was first reported",
						"@_ID": "FC04S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"G020S:Number of trades with maximum delinquency of 30 days past due in past 24 months",
						"@_ID": "G020S",
						"@_Value": "0",
					},
					{
						"@_Name": "G051S:Percentage of trades ever delinquent",
						"@_ID": "G051S",
						"@_Value": "31",
					},
					{
						"@_Name": "G093S:Number of public records",
						"@_ID": "G093S",
						"@_Value": "0",
					},
					{
						"@_Name": "G094S:Number of public record bankruptcies",
						"@_ID": "G094S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G095S:Months since most recent public record",
						"@_ID": "G095S",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"G103S:Months since most recent credit inquiry",
						"@_ID": "G103S",
						"@_Value": "19",
					},
					{
						"@_Name":
							"G202A:Total open to buy of open trades verified in past 12 months (excl installs and morts)",
						"@_ID": "G202A",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"G215B:Number of non-medical third party collections with balance > $0",
						"@_ID": "G215B",
						"@_Value": "2",
					},
					{
						"@_Name":
							"G217S:Total past due amount of all trades verified in past 12 months",
						"@_ID": "G217S",
						"@_Value": "22506",
					},
					{
						"@_Name":
							"G218B:Number of trades verified in the past 12 months that are currently 30+ DPD",
						"@_ID": "G218B",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G224A:Number of 90 days past due or worse items ever (excluding medical colls)",
						"@_ID": "G224A",
						"@_Value": "4",
					},
					{
						"@_Name":
							"G238S:Number of credit inquiries in past 12 months (excl coll inqs)",
						"@_ID": "G238S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G244S:Number of inquiries (includes duplicates) in past 12 months",
						"@_ID": "G244S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"G250A:Number of 30 DPD or worse items ever (excluding medical colls)",
						"@_ID": "G250A",
						"@_Value": "2",
					},
					{
						"@_Name":
							"G250B:Number of 30 DPD or worse items in the past 12 months (excluding medical colls)",
						"@_ID": "G250B",
						"@_Value": "2",
					},
					{
						"@_Name":
							"G250C:Number of 30 DPD or worse items in the past 24 months (excluding medical colls)",
						"@_ID": "G250C",
						"@_Value": "2",
					},
					{
						"@_Name":
							"G251A:Number of 60 DPD or worse items ever (excluding medical colls)",
						"@_ID": "G251A",
						"@_Value": "4",
					},
					{
						"@_Name":
							"G302S:Worst rating on revolving trades in past 12 months",
						"@_ID": "G302S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"G304S:Worst rating on installment trades in past 12 months",
						"@_ID": "G304S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"G310S:Worst rating on all trades in past 12 months",
						"@_ID": "G310S",
						"@_Value": "9",
					},
					{
						"@_Name":
							"GB311:Indicates if bankruptcies have been filed",
						"@_ID": "GB311",
						"@_Value": "0",
					},
					{
						"@_Name":
							"HI57S:Total past due amount of open home equity loan trades verified in past 12 months",
						"@_ID": "HI57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"HR57S:Total past due amount of open HELOC trades verified in past 12 months",
						"@_ID": "HR57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "IN02S:Number of open installment trades",
						"@_ID": "IN02S",
						"@_Value": "3",
					},
					{
						"@_Name":
							"IN06S:Number of installment trades opened in past 6 months",
						"@_ID": "IN06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"IN28S:Total credit line of open installment trades verified in past 12 months",
						"@_ID": "IN28S",
						"@_Value": "17159",
					},
					{
						"@_Name":
							"IN33S:Total balance of open installment trades verified in past 12 months",
						"@_ID": "IN33S",
						"@_Value": "18388",
					},
					{
						"@_Name":
							"IN34S:Utilization for open installment trades verified in past 12 months",
						"@_ID": "IN34S",
						"@_Value": "107",
					},
					{
						"@_Name":
							"IN36S:Months since most recent installment delinquency",
						"@_ID": "IN36S",
						"@_Value": "2",
					},
					{
						"@_Name":
							"IN57S:Total past due amount of open installment trades verified in past 12 months",
						"@_ID": "IN57S",
						"@_Value": "7363",
					},
					{
						"@_Name": "MT02S:Number of open mortgage trades",
						"@_ID": "MT02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT06S:Number of mortgage trades opened in past 6 months",
						"@_ID": "MT06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT28S:Total credit line of open mortgage trades verified in past 12 months",
						"@_ID": "MT28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT33S:Total balance of open mortgage trades verified in past 12 months",
						"@_ID": "MT33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"MT34S:Utilization for open mortgage trades verified in past 12 months",
						"@_ID": "MT34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"MT36S:Months since most recent mortgage delinquency",
						"@_ID": "MT36S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"MT57S:Total past due amount of open mortgage trades verified in past 12 months",
						"@_ID": "MT57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "RE02S:Number of open revolving trades",
						"@_ID": "RE02S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE06S:Number of revolving trades opened in past 6 months",
						"@_ID": "RE06S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE12S:Number of open revolving trades verified in past 12 months",
						"@_ID": "RE12S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE20S:Months since oldest revolving trade opened",
						"@_ID": "RE20S",
						"@_Value": "211",
					},
					{
						"@_Name":
							"RE21S:Months since most recent revolving trade opened",
						"@_ID": "RE21S",
						"@_Value": "118",
					},
					{
						"@_Name":
							"RE28S:Total credit line of open revolving trades verified in past 12 months",
						"@_ID": "RE28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE30S:Percentage of open revolving trades > 50% of credit line verified in past 12 months",
						"@_ID": "RE30S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE31S:Percentage of open revolving trades > 75% of credit line verified in past 12 months",
						"@_ID": "RE31S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE33S:Total balance of open revolving trades verified in past 12 months",
						"@_ID": "RE33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"RE34S:Utilization for open revolving trades verified in past 12 months",
						"@_ID": "RE34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE34T:Utilization for all bureau open revolving trades verified in past 12 months",
						"@_ID": "RE34T",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE36S:Months since most recent revolving delinquency",
						"@_ID": "RE36S",
						"@_Value": "1",
					},
					{
						"@_Name":
							"RE57S:Total past due amount of open revolving trades verified in past 12 months",
						"@_ID": "RE57S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RE102S:Average credit line of open revolving trades verified in past 12 months",
						"@_ID": "RE102S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"RP04S:Months since most recent repossession trade was first reported",
						"@_ID": "RP04S",
						"@_Value": "3",
					},
					{
						"@_Name":
							"S004S:Average number of months trades have been on file",
						"@_ID": "S004S",
						"@_Value": "36",
					},
					{
						"@_Name":
							"S043S:Number of open trades > 50% of credit line verified in 12 mons (excl installs and morts)",
						"@_ID": "S043S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"S061S:Months since most recent 60 or more days past due",
						"@_ID": "S061S",
						"@_Value": "57",
					},
					{
						"@_Name":
							"S062S:Months since most recent 90 or more days past due",
						"@_ID": "S062S",
						"@_Value": "57",
					},
					{
						"@_Name": "S068A:Number of third party collections",
						"@_ID": "S068A",
						"@_Value": "1",
					},
					{
						"@_Name":
							"S114S:Number of deduped inquiries in past 6 months (excl auto and mortgage inquiries)",
						"@_ID": "S114S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"S204A:Total balance of non-medical third party collections verified in past 12 months",
						"@_ID": "S204A",
						"@_Value": "7363",
					},
					{
						"@_Name":
							"S207A:Months since most recent tradeline bankruptcy",
						"@_ID": "S207A",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"S207S:Months since most recent public record bankruptcy",
						"@_ID": "S207S",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"S209A:Months since most recent non-medical third party collection",
						"@_ID": "S209A",
						"@_Value": "44",
					},
					{
						"@_Name":
							"ST28S:Total credit line of open student loan trades verified in past 12 months",
						"@_ID": "ST28S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"ST33S:Total balance of open student loan trades verified in past 12 months",
						"@_ID": "ST33S",
						"@_Value": "0",
					},
					{
						"@_Name":
							"ST34S:Utilization for open student loan trades verified in past 12 months",
						"@_ID": "ST34S",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"ST57S:Total past due amount of open student loan trades verified in past 12 months",
						"@_ID": "ST57S",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT014:Total Scheduled Monthly Payment",
						"@_ID": "PT014",
						"@_Value": "280",
					},
					{
						"@_Name": "PT016:Utilization on revolving trades",
						"@_ID": "PT016",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"PT017:Total balance on open revolving trades",
						"@_ID": "PT017",
						"@_Value": "0",
					},
					{
						"@_Name": "PT019:Total Mortgage Monthly Payment",
						"@_ID": "PT019",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT020:Total balance on open Mortgages",
						"@_ID": "PT020",
						"@_Value": "0",
					},
					{
						"@_Name": "PT021:Total Monthly Automobile Payment",
						"@_ID": "PT021",
						"@_Value": "N/A",
					},
					{
						"@_Name": "PT022:Date of oldest trade",
						"@_ID": "PT022",
						"@_Value": "112001",
					},
					{
						"@_Name": "PT023:Months since infile created at bureau",
						"@_ID": "PT023",
						"@_Value": "288",
					},
					{
						"@_Name":
							"PT027:Total occurrances of delinquencies in past 12 months",
						"@_ID": "PT027",
						"@_Value": "0",
					},
					{
						"@_Name": "PT038:Number of Inquiries in past 6 months",
						"@_ID": "PT038",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT054:Total Credit Limit/High Credit on open tradelines",
						"@_ID": "PT054",
						"@_Value": "17159",
					},
					{
						"@_Name": "PT056:Total balance on all tradelines",
						"@_ID": "PT056",
						"@_Value": "33531",
					},
					{
						"@_Name":
							"PT063:Number of currently delinquent tradelines",
						"@_ID": "PT063",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT064:Number of currently delinquent revolving tradelines",
						"@_ID": "PT064",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT065:Number of currently delinquent installment tradelines",
						"@_ID": "PT065",
						"@_Value": "0",
					},
					{
						"@_Name": "PT068:Average balance on open tradelines",
						"@_ID": "PT068",
						"@_Value": "6129",
					},
					{
						"@_Name":
							"PT069:Number of Chargeoffs in past 12 months",
						"@_ID": "PT069",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT071:Total occurrances of delinquencies in the past 2 years",
						"@_ID": "PT071",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT072:Total occurrances of delinquencies in the past 30 days",
						"@_ID": "PT072",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT073:Total occurrances of delinquencies in the past 60 days",
						"@_ID": "PT073",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT074:Total occurrances of delinquencies in the past 7 years",
						"@_ID": "PT074",
						"@_Value": "6",
					},
					{
						"@_Name": "PT076:Date of oldest trade",
						"@_ID": "PT076",
						"@_Value": "112001",
					},
					{
						"@_Name":
							"PT079:Number of months since oldest installment tradeline opened",
						"@_ID": "PT079",
						"@_Value": "259",
					},
					{
						"@_Name":
							"PT080:Number of months since oldest revolving tradeline opened",
						"@_ID": "PT080",
						"@_Value": "211",
					},
					{
						"@_Name":
							"PT082:Number of months since most recent tradeline opened",
						"@_ID": "PT082",
						"@_Value": "7",
					},
					{
						"@_Name": "PT083:Number of mortgage trades",
						"@_ID": "PT083",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT088:Number of months since 90+ late or worse derogatory",
						"@_ID": "PT088",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT089:Number of tradelines reported in past 2 months and currently 120 days past due",
						"@_ID": "PT089",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT090:Number of tradelines currently 30 days past due",
						"@_ID": "PT090",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT091:Number of tradelines 90+ days past due in past 24 months",
						"@_ID": "PT091",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT092:Number of tradelines opened in past 12 months",
						"@_ID": "PT092",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT093:Percentage of tradelines never delinquent",
						"@_ID": "PT093",
						"@_Value": "85",
					},
					{
						"@_Name":
							"PT094:Number of tradelines ever 120 days past due",
						"@_ID": "PT094",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT095:Number of months since oldest bank installment tradeline",
						"@_ID": "PT095",
						"@_Value": "259",
					},
					{
						"@_Name":
							"PT103:Total credit limit/high credit on open installment tradelines",
						"@_ID": "PT103",
						"@_Value": "17159",
					},
					{
						"@_Name":
							"PT104:Number of currently satisfactory tradelines",
						"@_ID": "PT104",
						"@_Value": "11",
					},
					{
						"@_Name": "PT105:Number of revolving tradelines",
						"@_ID": "PT105",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT110:Number of revolving tradelines opened in past 7 years",
						"@_ID": "PT110",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT111:Total credit limit/high credit on open revolving tradelines",
						"@_ID": "PT111",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT112:Total available credit on open bankcard tradelines verified in the last 6 mons",
						"@_ID": "PT112",
						"@_Value": "N/A",
					},
					{
						"@_Name":
							"PT115:Percent of bankcard tradelines gt 75% of credit limit",
						"@_ID": "PT115",
						"@_Value": "50",
					},
					{
						"@_Name":
							"PT118:Total credit limit/high credit on open bankcard tradelines",
						"@_ID": "PT118",
						"@_Value": "0",
					},
					{
						"@_Name": "PT119:Number of bankcard tradelines",
						"@_ID": "PT119",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT120:Number of months since most recent bankcard tradeline opened",
						"@_ID": "PT120",
						"@_Value": "118",
					},
					{
						"@_Name":
							"PT121:Number of bankcard tradelines opened in the past 6 months",
						"@_ID": "PT121",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT122:Number of bankcard tradelines never delinquent",
						"@_ID": "PT122",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT125:Number of months since most recent bankcard delinquency",
						"@_ID": "PT125",
						"@_Value": "57",
					},
					{
						"@_Name":
							"PT126:Percent utilization on bankcard tradelines",
						"@_ID": "PT126",
						"@_Value": "29",
					},
					{
						"@_Name":
							"PT129:Number of Public Records with amount gt 100",
						"@_ID": "PT129",
						"@_Value": "-4",
					},
					{
						"@_Name": "PT130:Number of Tax Liens",
						"@_ID": "PT130",
						"@_Value": "0",
					},
					{
						"@_Name": "PT132:Total amount on Collections",
						"@_ID": "PT132",
						"@_Value": "7363",
					},
					{
						"@_Name": "PT133:Number of repossessions",
						"@_ID": "PT133",
						"@_Value": "1",
					},
					{
						"@_Name": "PT134:Number of foreclosures",
						"@_ID": "PT134",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT136:Number of Collections/Chargeoffs in past 24 months; excluding medical",
						"@_ID": "PT136",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT137:Total amount on Collections in past 36 months; excluding medical",
						"@_ID": "PT137",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT138:Number of tradelines active within the past 6 months",
						"@_ID": "PT138",
						"@_Value": "3",
					},
					{
						"@_Name":
							"PT139:Number of mortgage tradelines opened in past 6 months",
						"@_ID": "PT139",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT140:Number of open installment tradelines opened within the past 24 months",
						"@_ID": "PT140",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT141:Total occurrances of 30 days late within the past 12 months on Mortgage trades",
						"@_ID": "PT141",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT142:Number of mortgages passed due 30 days or more in the last 6 months",
						"@_ID": "PT142",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT143:Total occurrances of 30 days late within the past 12 months",
						"@_ID": "PT143",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT144:Number of collections with amount gt 500",
						"@_ID": "PT144",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT145:Total balance on unsecured credit card tradelines",
						"@_ID": "PT145",
						"@_Value": "1434",
					},
					{
						"@_Name": "PT146:Total balance on unsecured tradelines",
						"@_ID": "PT146",
						"@_Value": "19822",
					},
					{
						"@_Name":
							"PT147:Total amount on Tax Liens filed within the past 36 months",
						"@_ID": "PT147",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT148:Total amount on Judgements filed within the past 36 months",
						"@_ID": "PT148",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT149:Number of Public Records filed in past 24 months",
						"@_ID": "PT149",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT150:Number of non-federal Student Loan tradelines",
						"@_ID": "PT150",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT151:Number of repossessed auto loan tradelines",
						"@_ID": "PT151",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT153:Percent utilization on installment tradelines",
						"@_ID": "PT153",
						"@_Value": "11",
					},
					{
						"@_Name":
							"PT154:Number of revolving tradelines with balance gt 0",
						"@_ID": "PT154",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT155:Number of installment tradelines opened in past 12 months",
						"@_ID": "PT155",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT157:Number of revolving tradelines opened in past 12 months",
						"@_ID": "PT157",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT158:Number of revolving tradelines opened in past 24 months",
						"@_ID": "PT158",
						"@_Value": "0",
					},
					{
						"@_Name": "PT159:Number of credit union tradelines",
						"@_ID": "PT159",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT160:Percent utilization on all open tradelines",
						"@_ID": "PT160",
						"@_Value": "107",
					},
					{
						"@_Name":
							"PT162:Maximum balance on revolving tradelines",
						"@_ID": "PT162",
						"@_Value": "1434",
					},
					{
						"@_Name":
							"PT163:Number months since more recent installment tradeline opened",
						"@_ID": "PT163",
						"@_Value": "7",
					},
					{
						"@_Name":
							"PT165:Number of auto tradelines 30 days past due in past 6 months",
						"@_ID": "PT165",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT166:Number of auto tradelines opened in past 6 months",
						"@_ID": "PT166",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT167:Number of retail tradelines opened in past 6 months",
						"@_ID": "PT167",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT168:Number of student loans opened in past 12 months",
						"@_ID": "PT168",
						"@_Value": "-5",
					},
					{
						"@_Name":
							"PT174:Total amount on Collections; excluding medical",
						"@_ID": "PT174",
						"@_Value": "7363",
					},
					{
						"@_Name": "PT175:Total amount on Tax Liens",
						"@_ID": "PT175",
						"@_Value": "-4",
					},
					{
						"@_Name": "PT176:Total amount on Judgements",
						"@_ID": "PT176",
						"@_Value": "-4",
					},
					{
						"@_Name":
							"PT177:Total credit limit on open credit card trades",
						"@_ID": "PT177",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT178:Total credit limit on open retail trades",
						"@_ID": "PT178",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT179:Total balance on open credit card trades",
						"@_ID": "PT179",
						"@_Value": "0",
					},
					{
						"@_Name": "PT180:Total balance on open retail trades",
						"@_ID": "PT180",
						"@_Value": "0",
					},
					{
						"@_Name": "PT181:Age of oldest trade in months",
						"@_ID": "PT181",
						"@_Value": "259",
					},
					{
						"@_Name":
							"PT182:Total number of open credit card trades",
						"@_ID": "PT182",
						"@_Value": "0",
					},
					{
						"@_Name": "PT183:Total number of open retail trades",
						"@_ID": "PT183",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT184:Total number of trades ever delinquent",
						"@_ID": "PT184",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT185:Total number of tradelines delinquent in the last 6 months",
						"@_ID": "PT185",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT186:Total number of installment tradelines 60 days late or worse in the last 6 months",
						"@_ID": "PT186",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT187:Total balances on currently delinquent tradelines",
						"@_ID": "PT187",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT188:Worst current status on any open tradeline",
						"@_ID": "PT188",
						"@_Value": "9",
					},
					{
						"@_Name":
							"PT189:Worst status in the past 12 months on any mortgage tradeline",
						"@_ID": "PT189",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT190:Total number of closed credit card trades",
						"@_ID": "PT190",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT191:Total number of closed installment trades",
						"@_ID": "PT191",
						"@_Value": "8",
					},
					{
						"@_Name": "PT192:Percent of revolving credit available",
						"@_ID": "PT192",
						"@_Value": "71",
					},
					{
						"@_Name":
							"PT193:Number of loans or credit cards applied for in past 24 months",
						"@_ID": "PT193",
						"@_Value": "1",
					},
					{
						"@_Name":
							"PT194:Number of Installment tradelines not delinquent within the last 24 months",
						"@_ID": "PT194",
						"@_Value": "9",
					},
					{
						"@_Name":
							"PT195:Max credit limit on open bank credit cards",
						"@_ID": "PT195",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT196:Number of collections with amount gt 0",
						"@_ID": "PT196",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT197:Total Number of delinquent credit card and retail trades in last 6 months",
						"@_ID": "PT197",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT198:Total number of open credit card tradelines with utilization gt 90%",
						"@_ID": "PT198",
						"@_Value": "0",
					},
					{
						"@_Name":
							"PT199:Total number of open retail tradelines with utilization gt 90%",
						"@_ID": "PT199",
						"@_Value": "2",
					},
					{
						"@_Name":
							"PT200:Number of closed trades; no exclusions",
						"@_ID": "PT200",
						"@_Value": "10",
					},
					{
						"@_Name": "PT201:Number of open trades; no exclusions",
						"@_ID": "PT201",
						"@_Value": "3",
					},
					{
						"@_Name":
							"PT202:Total balance on all trades; no exclusions",
						"@_ID": "PT202",
						"@_Value": "33531",
					},
					{
						"@_Name": "Deceased Indicator",
						"@_ID": "AP009",
						"@_Value": "N",
					},
					{
						"@_Name": "Public Record Info",
						"@_ID": "AP010",
						"@_Value": "",
					},
				],
			},
		},
	},
	plan_id: "builder",
	authToken: "C8C76C5E-9865-4999-871E-25E64C302E4B",
	userToken: "CDDB5ADA-B6A5-42F6-9C92-138DE13938D7",
	clientKey: "94c4561d-9b4a-4c6e-b481-16d473d29f21",
	displayToken: "77BFCD1F-4EAA-4046-BA88-56ED2A56486E",
	reportKey: "66f00dff-f841-4b03-9ae6-ebf7d2bfad74",
	productCode: "credmo3bReportScore",
};

export const CreditReport = (credit_report) => {
	const value = () => credit_report;

	const liabilities = () =>
		pipe(get("CREDIT_RESPONSE", "CREDIT_LIABILITY"))(credit_report);

	const factors = () =>
		pipe(
			get("CREDIT_RESPONSE", "CREDIT_SCORE", all, "_FACTOR"),
			flatten,
			uniqBy((x) => x["@_Code"])
		)(credit_report);

	const inquiries = () =>
		pipe(
			get("CREDIT_RESPONSE")
			// flatten,
			// uniqBy((x) => x["@_Code"])
		)(credit_report);

	return {
		liabilities,
		inquiries,
		factors,
		value,
	};
};

export const Liabilities = (liabilities) => {
	const trade_lines = () =>
		pipe(
			mod(all)((value, index) => ({
				index,
				...value,
				source: get("CREDIT_REPOSITORY", "@_SourceType")(value),
			})),
			splitWhenever(
				(value) => value["@CreditTradeReferenceID"] == "Primary"
			)
		)(liabilities);

	return {
		trade_lines,
	};
};

export const TradeLine = (trade_line) => {
	const accounts = () => trade_line;
	// console.log("trade_line");
	// inspect(trade_line);

	const id = () =>
		pipe(
			mod(all)(pick(["@_AccountIdentifier", "source"])),
			// pick(["@_AccountIdentifier", "source"]),
			map((value) => ({
				source: value.source,
				value: value["@_AccountIdentifier"] || "",
			}))
		)(trade_line);

	const account_type = () =>
		pipe(
			// pick(["@_AccountType", "source"]),
			mod(all)(pick(["@_AccountType", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountType"] || "",
			}))
		)(trade_line);

	const loan_type = () =>
		pipe(
			// pick(["@CreditLoanType", "source"]),
			mod(all)(pick(["@CreditLoanType", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@CreditLoanType"] || "",
			}))
		)(trade_line);

	const status = () =>
		pipe(
			// pick(["@_AccountStatusType", "source"]),
			mod(all)(pick(["@_AccountStatusType", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountStatusType"] || "",
			}))
		)(trade_line);

	const payment_amount = () =>
		pipe(
			// pick(["@_MonthlyPaymentAmount", "source"]),
			mod(all)(pick(["@_MonthlyPaymentAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_MonthlyPaymentAmount"] || 0,
			}))
		)(trade_line);

	const opened_date = () =>
		pipe(
			// pick(["@_AccountOpenedDate", "source"]),
			mod(all)(pick(["@_AccountOpenedDate", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountOpenedDate"] || "",
			}))
		)(trade_line);

	const original_balance = () =>
		tryCatch(
			pipe(
				// pick(["@_OriginalBalanceAmount", "source"]),
				mod(all)(pick(["@_OriginalBalanceAmount", "source"])),
				map((value) => ({
					source: value.source,
					value: value["@_OriginalBalanceAmount"] || 0,
				}))
			),
			always(0)
		)(trade_line);

	const unpaid_balance = () =>
		pipe(
			// pick(["@_UnpaidBalanceAmount", "source"]),
			mod(all)(pick(["@_UnpaidBalanceAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_UnpaidBalanceAmount"] || 0,
			}))
		)(trade_line);

	const high_balance = () =>
		pipe(
			// pick(["@_HighBalanceAmount", "source"]),
			mod(all)(pick(["@_HighBalanceAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_HighBalanceAmount"] || 0,
			}))
		)(trade_line);

	const terms = () =>
		pipe(
			// pick(["@_TermsMonthsCount", "source"]),
			mod(all)(pick(["@_TermsMonthsCount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_TermsMonthsCount"] || 0,
			}))
		)(trade_line);

	const credit_limit = () =>
		pipe(
			// pick(["@_CreditLimitAmount", "source"]),
			mod(all)(pick(["@_CreditLimitAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_CreditLimitAmount"] || 0,
			}))
		)(trade_line);

	const past_due_amount = () =>
		pipe(
			// pick(["@_PastDueAmount", "source"]),
			mod(all)(pick(["@_PastDueAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_PastDueAmount"] || 0,
			}))
		)(trade_line);

	let current_rating_map = {
		CollectionOrChargeOff: "Charge Off",
	};

	const current_rating = () =>
		pipe(
			// pick(["_CURRENT_RATING", "source"]),
			mod(all)(pick(["_CURRENT_RATING", "source"])),
			map((value) => ({
				source: value.source,
				value: pipe(
					tryCatch(
						pipe(get("_CURRENT_RATING", "@_Type")),
						always("")
					),
					(value) => current_rating_map[value] || value
				)(value),
			}))
		)(trade_line);

	const account_reported_date = () =>
		pipe(
			// pick(["@_AccountReportedDate", "source"]),
			mod(all)(pick(["@_AccountReportedDate", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountReportedDate"] || "",
			}))
		)(trade_line);

	const comments = () =>
		pipe(
			// pick(["CREDIT_COMMENT", "source"]),
			mod(all)(pick(["CREDIT_COMMENT", "source"])),
			map((value) => ({
				source: value.source,
				value: value["CREDIT_COMMENT"] || "",
			}))
		)(trade_line);

	const last_activity_date = () =>
		pipe(
			// pick(["@_LastActivityDate", "source"]),
			mod(all)(pick(["@_LastActivityDate", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_LastActivityDate"] || "",
			}))
		)(trade_line);

	const last_payment_date = () =>
		pipe(
			// pick(["@LastPaymentDate", "source"]),
			mod(all)(pick(["@LastPaymentDate", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@LastPaymentDate"] || "",
			}))
		)(trade_line);

	const payment_pattern = () =>
		pipe(
			// pick(["_PAYMENT_PATTERN", "source"]),
			mod(all)(pick(["_PAYMENT_PATTERN", "source"])),
			map((value) => ({
				source: value.source,
				value: value["_PAYMENT_PATTERN"] || { "@_Data": "" },
			}))
		)(trade_line);

	const creditor = () =>
		pipe(
			// pick(["_CREDITOR", "source"]),
			mod(all)(pick(["_CREDITOR", "source"])),
			map((value) => ({
				source: value.source,
				value: value["_CREDITOR"],
			}))
		)(trade_line);

	const original_creditor = () =>
		pipe(
			// pick(["@_OriginalCreditorName", "source"]),
			mod(all)(pick(["@_OriginalCreditorName", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_OriginalCreditorName"] || "",
			}))
		)(trade_line);

	const values = () => {
		const payload = {
			id: id(),
			account_type: account_type(),
			loan_type: loan_type(),
			status: status(),
			payment_amount: payment_amount(),
			opened_date: opened_date(),
			original_balance: original_balance(),
			unpaid_balance: unpaid_balance(),
			high_balance: high_balance(),
			terms: terms(),
			credit_limit: credit_limit(),
			past_due_amount: past_due_amount(),
			current_rating: current_rating(),
			account_reported_date: account_reported_date(),
			comments: comments(),
			last_activity_date: last_activity_date(),
			last_payment_date: last_payment_date(),
			payment_pattern: payment_pattern(),
			creditor: creditor(),
			original_creditor: original_creditor(),
		};

		return payload;
	};

	return {
		id,
		accounts,
		account_type,
		loan_type,
		status,
		payment_amount,
		opened_date,
		original_balance,
		unpaid_balance,
		high_balance,
		terms,
		credit_limit,
		past_due_amount,
		current_rating,
		account_reported_date,
		comments,
		last_activity_date,
		last_payment_date,
		payment_pattern,
		creditor,
		original_creditor,
		values,
	};
};

export const TradeLineApi = {
	account_type: (source) =>
		tryCatch(
			pipe(get("account_type"), filter({ source }), head, get("value")),
			always("")
		),

	account_status: (source) =>
		tryCatch(
			pipe(get("status"), filter({ source }), head, get("value")),
			always("")
		),

	payment_amount: (source) =>
		tryCatch(
			pipe(
				get("payment_amount"),
				filter({ source }),
				head,
				get("value"),
				(value) => currency.format(value)
			),
			always("")
		),

	opened_date: (source) =>
		tryCatch(
			pipe(get("opened_date"), filter({ source }), head, get("value")),
			always("")
		),

	unpaid_balance: (source) =>
		tryCatch(
			pipe(
				get("unpaid_balance"),
				filter({ source }),
				head,
				get("value"),
				(value) => currency.format(value)
			),
			always("")
		),

	terms: (source) =>
		tryCatch(
			pipe(get("terms"), filter({ source }), head, get("value")),
			always("")
		),

	credit_limit: (source) =>
		tryCatch(
			pipe(
				get("credit_limit"),
				filter({ source }),
				head,
				get("value"),
				(value) => currency.format(value)
			),
			always("")
		),

	past_due_amount: (source) =>
		tryCatch(
			pipe(
				get("past_due_amount"),
				filter({ source }),
				head,
				get("value"),
				(value) => currency.format(value)
			),
			always("")
		),

	current_rating: (source) =>
		tryCatch(
			pipe(get("current_rating"), filter({ source }), head, get("value")),
			always("")
		),

	account_reported_date: (source) =>
		tryCatch(
			pipe(
				get("account_reported_date"),
				filter({ source }),
				head,
				get("value")
			),
			always("")
		),

	payment_pattern: (source) =>
		tryCatch(
			pipe(get("payment_pattern"), filter({ source }), head),
			always([])
		),
};

export const Array = {};

Array.experian = {};
Array.equifax = {};
Array.transunion = {};

Array.first_name = pipe(get("CREDIT_RESPONSE", "BORROWER", "@_FirstName"));
Array.last_name = pipe(get("CREDIT_RESPONSE", "BORROWER", "@_LastName"));
Array.dob = pipe(get("CREDIT_RESPONSE", "BORROWER", "@_BirthDate"));
Array.residence = pipe(
	get("CREDIT_RESPONSE", "BORROWER", "_RESIDENCE"),
	filter({ "@BorrowerResidencyType": "Current" }),
	head
);

Array.experian.score = tryCatch(
	pipe(
		get("CREDIT_RESPONSE", "CREDIT_SCORE"),
		filter({ "@CreditRepositorySourceType": "Experian" }),
		head,
		get("@_Value")
	),
	always(300)
);

Array.equifax.score = tryCatch(
	pipe(
		get("CREDIT_RESPONSE", "CREDIT_SCORE"),
		filter({ "@CreditRepositorySourceType": "Equifax" }),
		head,
		get("@_Value")
	),
	always(300)
);

Array.transunion.score = tryCatch(
	pipe(
		get("CREDIT_RESPONSE", "CREDIT_SCORE"),
		filter({ "@CreditRepositorySourceType": "TransUnion" }),
		head,
		get("@_Value")
	),
	always(0)
);

export const new_credit_report = async ({
	clientKey,
	productCode,
	userToken,
}) => {
	var data = JSON.stringify({
		clientKey,
		productCode,
	});

	var options = {
		method: "post",
		maxBodyLength: Infinity,
		url: report_url,
		headers: {
			"x-credmo-user-token": userToken,
			"Content-Type": "application/json",
		},
		data,
	};

	try {
		let response = await axios(options);
		console.log("response.data");
		console.log(response.data);

		let { displayToken = null, reportKey = null } = response.data;
		return { displayToken, reportKey };
	} catch (error) {
		console.log("error");
		return { error };
	}
};

export const authenticate_user = async ({
	appKey,
	clientKey,
	authToken,
	answers,
}) => {
	const options = {
		method: "POST",
		url: authenticate_url,
		headers: {
			accept: "application/json",
			"content-type": "application/json",
		},
		data: {
			appKey,
			clientKey,
			authToken,
			answers,
		},
	};

	try {
		let response = await axios(options);
		let { userToken = null } = response.data;
		return { userToken };
	} catch (error) {
		return { error };
	}
};

export const get_credit_report = async (reportKey, displayToken) => {
	console.log("get_credit_report");
	var options = {
		method: "get",
		maxBodyLength: Infinity,
		url: `${report_url}?reportKey=${reportKey}&displayToken=${displayToken}`,
		headers: {
			"Content-Type": "application/json",
		},
	};

	let response = await axios(options);

	let retry = async (delay_time_in_milliseconds) => {
		return new Promise((resolve, reject) => {
			setTimeout(async () => {
				let response = await get_credit_report(reportKey, displayToken);
				resolve(response);
			}, delay_time_in_milliseconds);
		});
	};

	if (response?.data) {
		return response.data;
	} else {
		let response = await retry(3000);
		return response;
	}
};
