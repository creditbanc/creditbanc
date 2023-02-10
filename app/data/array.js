import { get, filter, all, mod } from "shades";
import {
	pipe,
	map,
	addIndex,
	splitWhenever,
	head,
	pick,
	tryCatch,
	always,
} from "ramda";
import { inspect } from "~/utils/helpers";

const mapIndexed = addIndex(map);

const credmo3bReportScore = {
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

export const Liabilities = (liabilities) => {
	const trade_lines = () =>
		pipe(
			mapIndexed((value, index) => ({
				...value,
				index,
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

	const id = () =>
		pipe(
			mod(all)(pick(["@_AccountIdentifier", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountIdentifier"] || "",
			}))
		)(trade_line);

	const account_type = () =>
		pipe(
			mod(all)(pick(["@_AccountType", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountType"] || "",
			}))
		)(trade_line);

	const loan_type = () =>
		pipe(
			mod(all)(pick(["@CreditLoanType", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@CreditLoanType"] || "",
			}))
		)(trade_line);

	const status = () =>
		pipe(
			mod(all)(pick(["@_AccountStatusType", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountStatusType"] || "",
			}))
		)(trade_line);

	const payment_amount = () =>
		pipe(
			mod(all)(pick(["@_MonthlyPaymentAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_MonthlyPaymentAmount"] || 0,
			}))
		)(trade_line);

	const opened_date = () =>
		pipe(
			mod(all)(pick(["@_AccountOpenedDate", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountOpenedDate"] || "",
			}))
		)(trade_line);

	const original_balance = () =>
		pipe(
			mod(all)(pick(["@_OriginalBalanceAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_OriginalBalanceAmount"] || 0,
			}))
		)(trade_line);

	const unpaid_balance = () =>
		pipe(
			mod(all)(pick(["@_UnpaidBalanceAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_UnpaidBalanceAmount"] || 0,
			}))
		)(trade_line);

	const high_balance = () =>
		pipe(
			mod(all)(pick(["@_HighBalanceAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_HighBalanceAmount"] || 0,
			}))
		)(trade_line);

	const terms = () =>
		pipe(
			mod(all)(pick(["@_TermsMonthsCount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_TermsMonthsCount"] || 0,
			}))
		)(trade_line);

	const credit_limit = () =>
		pipe(
			mod(all)(pick(["@_CreditLimitAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_CreditLimitAmount"] || 0,
			}))
		)(trade_line);

	const past_due_amount = () =>
		pipe(
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
			mod(all)(pick(["@_AccountReportedDate", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountReportedDate"] || "",
			}))
		)(trade_line);

	const comments = () =>
		pipe(
			mod(all)(pick(["CREDIT_COMMENT", "source"])),
			map((value) => ({
				source: value.source,
				value: value["CREDIT_COMMENT"] || "",
			}))
		)(trade_line);

	const last_activity_date = () =>
		pipe(
			mod(all)(pick(["@_LastActivityDate", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_LastActivityDate"] || "",
			}))
		)(trade_line);

	const last_payment_date = () =>
		pipe(
			mod(all)(pick(["@LastPaymentDate", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@LastPaymentDate"] || "",
			}))
		)(trade_line);

	const payment_pattern = () =>
		pipe(
			mod(all)(pick(["_PAYMENT_PATTERN", "source"])),
			map((value) => ({
				source: value.source,
				value: value["_PAYMENT_PATTERN"] || { "@_Data": "" },
			}))
		)(trade_line);

	const creditor = () =>
		pipe(
			mod(all)(pick(["_CREDITOR", "source"])),
			map((value) => ({
				source: value.source,
				value: value["_CREDITOR"],
			}))
		)(trade_line);

	const original_creditor = () =>
		pipe(
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

export const liabilities_data = pipe(
	get("CREDIT_RESPONSE", "CREDIT_LIABILITY")
)(credmo3bReportScore);
