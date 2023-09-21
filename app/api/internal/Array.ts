import { pipe, splitWhenever, curry, tryCatch, flatten, always, map, pick, of, uniqBy, head, identity } from "ramda";
import { get, mod, all, filter } from "shades";

const falsyTryCatch = curry((successFn, errorFn, data) => {
	let result = tryCatch(successFn, errorFn)(data);
	if (!result) return errorFn(data);
	return result;
});

interface ArrayReport {
	CREDIT_RESPONSE?: {
		CREDIT_LIABILITY?: any[];
	};
}

class TradeLine {
	constructor(public trade_line: any) {}

	accounts = () => this.trade_line;

	id = () =>
		pipe(
			mod(all)(pick(["@_AccountIdentifier", "source"])),
			// pick(["@_AccountIdentifier", "source"]),
			map((value) => ({
				source: value.source,
				value: value["@_AccountIdentifier"] || "",
			}))
		)(this.trade_line);

	account_type = () =>
		pipe(
			// pick(["@_AccountType", "source"]),
			mod(all)(pick(["@_AccountType", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountType"] || "",
			}))
		)(this.trade_line);

	loan_type = () =>
		pipe(
			// pick(["@CreditLoanType", "source"]),
			mod(all)(pick(["@CreditLoanType", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@CreditLoanType"] || "",
			}))
		)(this.trade_line);

	status = () =>
		pipe(
			// pick(["@_AccountStatusType", "source"]),
			mod(all)(pick(["@_AccountStatusType", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountStatusType"] || "",
			}))
		)(this.trade_line);

	payment_amount = () =>
		pipe(
			// pick(["@_MonthlyPaymentAmount", "source"]),
			mod(all)(pick(["@_MonthlyPaymentAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_MonthlyPaymentAmount"] || 0,
			}))
		)(this.trade_line);

	opened_date = () =>
		pipe(
			// pick(["@_AccountOpenedDate", "source"]),
			mod(all)(pick(["@_AccountOpenedDate", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountOpenedDate"] || "",
			}))
		)(this.trade_line);

	original_balance = () =>
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
		)(this.trade_line);

	unpaid_balance = () =>
		pipe(
			// pick(["@_UnpaidBalanceAmount", "source"]),
			mod(all)(pick(["@_UnpaidBalanceAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_UnpaidBalanceAmount"] || 0,
			}))
		)(this.trade_line);

	high_balance = () =>
		pipe(
			// pick(["@_HighBalanceAmount", "source"]),
			mod(all)(pick(["@_HighBalanceAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_HighBalanceAmount"] || 0,
			}))
		)(this.trade_line);

	terms = () =>
		pipe(
			// pick(["@_TermsMonthsCount", "source"]),
			mod(all)(pick(["@_TermsMonthsCount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_TermsMonthsCount"] || 0,
			}))
		)(this.trade_line);

	credit_limit = () =>
		pipe(
			// pick(["@_CreditLimitAmount", "source"]),
			mod(all)(pick(["@_CreditLimitAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_CreditLimitAmount"] || 0,
			}))
		)(this.trade_line);

	past_due_amount = () =>
		pipe(
			// pick(["@_PastDueAmount", "source"]),
			mod(all)(pick(["@_PastDueAmount", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_PastDueAmount"] || 0,
			}))
		)(this.trade_line);

	current_rating = () => {
		let current_rating_map = {
			CollectionOrChargeOff: "Charge Off",
		};

		pipe(
			// pick(["_CURRENT_RATING", "source"]),
			mod(all)(pick(["_CURRENT_RATING", "source"])),
			map((value) => ({
				source: value.source,
				value: pipe(
					tryCatch(pipe(get("_CURRENT_RATING", "@_Type")), always("")),
					(value) => current_rating_map[value] || value
				)(value),
			}))
		)(this.trade_line);
	};

	account_reported_date = () =>
		pipe(
			// pick(["@_AccountReportedDate", "source"]),
			mod(all)(pick(["@_AccountReportedDate", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_AccountReportedDate"] || "",
			}))
		)(this.trade_line);

	comments = () =>
		pipe(
			// pick(["CREDIT_COMMENT", "source"]),
			mod(all)(pick(["CREDIT_COMMENT", "source"])),
			map((value) => ({
				source: value.source,
				value: value["CREDIT_COMMENT"] || "",
			}))
		)(this.trade_line);

	last_activity_date = () =>
		pipe(
			// pick(["@_LastActivityDate", "source"]),
			mod(all)(pick(["@_LastActivityDate", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_LastActivityDate"] || "",
			}))
		)(this.trade_line);

	last_payment_date = () =>
		pipe(
			// pick(["@LastPaymentDate", "source"]),
			mod(all)(pick(["@LastPaymentDate", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@LastPaymentDate"] || "",
			}))
		)(this.trade_line);

	payment_pattern = () =>
		pipe(
			// pick(["_PAYMENT_PATTERN", "source"]),
			mod(all)(pick(["_PAYMENT_PATTERN", "source"])),
			map((value) => ({
				source: value.source,
				value: value["_PAYMENT_PATTERN"] || { "@_Data": "" },
			}))
		)(this.trade_line);

	creditor = () =>
		pipe(
			// pick(["_CREDITOR", "source"]),
			mod(all)(pick(["_CREDITOR", "source"])),
			map((value) => ({
				source: value.source,
				value: value["_CREDITOR"],
			}))
		)(this.trade_line);

	original_creditor = () =>
		pipe(
			// pick(["@_OriginalCreditorName", "source"]),
			mod(all)(pick(["@_OriginalCreditorName", "source"])),
			map((value) => ({
				source: value.source,
				value: value["@_OriginalCreditorName"] || "",
			}))
		)(this.trade_line);

	values = () => {
		const payload = {
			id: this.id(),
			account_type: this.account_type(),
			loan_type: this.loan_type(),
			status: this.status(),
			payment_amount: this.payment_amount(),
			opened_date: this.opened_date(),
			original_balance: this.original_balance(),
			unpaid_balance: this.unpaid_balance(),
			high_balance: this.high_balance(),
			terms: this.terms(),
			credit_limit: this.credit_limit(),
			past_due_amount: this.past_due_amount(),
			current_rating: this.current_rating(),
			account_reported_date: this.account_reported_date(),
			comments: this.comments(),
			last_activity_date: this.last_activity_date(),
			last_payment_date: this.last_payment_date(),
			payment_pattern: this.payment_pattern(),
			creditor: this.creditor(),
			original_creditor: this.original_creditor(),
		};

		return payload;
	};
}

export class ArrayInternal {
	constructor(public report: ArrayReport) {}

	response = () => {
		return pipe(identity)(this.report);
	};

	experian_score = () => {
		return falsyTryCatch(
			pipe(
				get("CREDIT_RESPONSE", "CREDIT_SCORE"),
				filter({ "@CreditRepositorySourceType": "Experian" }),
				head,
				get("@_Value")
			),
			always(300)
		)(this.report);
	};

	equifax_score = () => {
		return falsyTryCatch(
			pipe(
				get("CREDIT_RESPONSE", "CREDIT_SCORE"),
				filter({ "@CreditRepositorySourceType": "Equifax" }),
				head,
				get("@_Value")
			),
			always(300)
		)(this.report);
	};

	transunion_score = () => {
		return falsyTryCatch(
			pipe(
				get("CREDIT_RESPONSE", "CREDIT_SCORE"),
				filter({ "@CreditRepositorySourceType": "TransUnion" }),
				head,
				get("@_Value")
			),
			always(300)
		)(this.report);
	};

	first_name = () => {
		return falsyTryCatch(pipe(get("CREDIT_RESPONSE", "BORROWER", "@_FirstName")), always(""))(this.report);
	};

	last_name = () => {
		return falsyTryCatch(pipe(get("CREDIT_RESPONSE", "BORROWER", "@_LastName")), always(""))(this.report);
	};

	residence = () => {
		return falsyTryCatch(
			pipe(
				get("CREDIT_RESPONSE", "BORROWER", "_RESIDENCE"),
				filter({ "@BorrowerResidencyType": "Current" }),
				head
			),
			always({})
		)(this.report);
	};

	street = () => {
		return falsyTryCatch(pipe(get("@_StreetAddress")), always(""))(this.residence());
	};

	city = () => {
		return falsyTryCatch(pipe(get("@_City")), always(""))(this.residence());
	};

	state = () => {
		return falsyTryCatch(pipe(get("@_State")), always(""))(this.residence());
	};

	zip = () => {
		return falsyTryCatch(pipe(get("@_PostalCode")), always(""))(this.residence());
	};

	dob = () => {
		return falsyTryCatch(pipe(get("CREDIT_RESPONSE", "BORROWER", "@_BirthDate")), always(""))(this.report);
	};

	trade_lines = () => {
		return falsyTryCatch(
			pipe(
				get("CREDIT_RESPONSE", "CREDIT_LIABILITY"),
				mod(all)((value: any, index: number) => ({
					index,
					...value,
					source: get("CREDIT_REPOSITORY", "@_SourceType")(value),
				})),
				splitWhenever((value) => value["@CreditTradeReferenceID"] == "Primary"),
				map((value) => new TradeLine(flatten([value]))),
				map((tradeline) => tradeline.values())
			),
			always([])
		)(this.report);
	};

	factors = () =>
		pipe(
			get("CREDIT_RESPONSE", "CREDIT_SCORE", all, "_FACTOR"),
			flatten,
			uniqBy((x) => x["@_Code"])
		)(this.report);
}
