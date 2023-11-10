export const course = {
	title: "Foundation",
	id: "foundations",
	description: "",
	sections: [
		{
			title: "Fundability Foundation",
			id: "1",
			resources: [
				{
					title: "Fundability",
					id: "1",
					type: "video",
					duration: "15:07",
					url: `https://player.vimeo.com/video/874826758`,
				},
				{
					title: "Business Name",
					id: "2",
					type: "",
				},
				{
					title: "Business Address",
					id: "3",
					type: "",
				},
				{
					title: "Business Entity",
					id: "4",
					type: "",
				},
				{
					title: "EIN Number",
					id: "5",
					type: "",
				},
				{
					title: "Business Phone Number & 411 Listing",
					id: "6",
					type: "",
				},
				{
					title: "Website & Email",
					id: "7",
					type: "",
				},
				{
					title: "Business License",
					id: "8",
					type: "",
				},
				{
					title: "Business Bank Account",
					id: "9",
					type: "",
				},
				{
					title: "Business Merchant Account",
					id: "10",
					type: "",
				},
			],
		},
		{
			title: "Estabilishng Business Reports",
			id: "establishbusinessreports",
			resources: [
				{
					title: "Establishing Credit Reports",
					id: "23",
					type: "video",
					duration: "9:17",
					url: "https://player.vimeo.com/video/877041039",
				},
				{
					title: "Dun & Bradstreet",
					id: "11",
					type: "",
				},
				{
					title: "Business Experian",
					id: "12",
					type: "",
				},
				{
					title: "Business Equifax",
					id: "13",
					type: "",
				},
				{
					title: "Business Credit Reporting",
					id: "14",
					type: "",
				},
			],
		},
		{
			title: "Building Credit",
			id: "buildingcredit",
			resources: [
				{
					title: "Apply with 3 trade accounts",
					id: "15",
					type: "",
				},
			],
		},
		{
			title: "Monitor",
			id: "monitor",
			resources: [
				{
					title: "Building Business Credit",
					id: "16",
					type: "video",
					duration: "7:37",
					url: "https://player.vimeo.com/video/877045815",
				},
				// {
				// 	title: "Credit Monitoring",
				// 	id: "17",
				// },
				{
					title: "Monitor Dun & Bradstreet",
					id: "18",
				},
				{
					title: "Monitor Business Experian",
					id: "19",
				},
				{
					title: "Monitor Business Equifax",
					id: "20",
				},
				{
					title: "Request LexisNexis Report",
					id: "21",
				},
				{
					title: "Request Chex Systems",
					id: "22",
				},
			],
		},
	],
};

export const resources = [
	{
		step: 15,
		name: "KeyBank Business Rewards Mastercard",
		status: "Recommended",
		reports_to: ["Experian", "Equifax"],
		terms: "Revolving",
		is_pg_required: true,
		img: "https://www.key.com/content/experience-fragments/kco/header/personal/_jcr_content/header/logo.coreimg.svg/1644846310200/kb-logo.svg",
		url: "https://www.key.com/small-business/index.html",
		site: "https://www.key.com/small-business/index.html",
		phone: "888-539-4249",
		description: `Since our earliest days, we’ve strived to find new ways to enrich our customers’ lives, have their backs, and provide our special brand of service, in ways both big and small. Our business is helping small businesses grow theirs. KeyBank offers the KeyBank Business Card, KeyBank Business Reward Card, and KeyBank Business Reward Cash card. You can choose the best card for your business needs.`,
		instructions: [
			`Cash advances are available with business credit card approval, the amount of cash advance depends upon the approval amount.`,
			`Key Bank considers both business and personal credit histories. An inquiry may occur, but it will not be reflected as a hard or soft pull on personal credit.`,
		],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			"Business address- matching everywhere.",
			"D & B number",
			"Business phone number listed to 411",
			"Business license- if applicable",
			"Business bank account",
			"2 years in business, can apply with a personal guarantee(PG) if less than 2 years in business.",
		],
	},
	{
		step: 15,
		name: "Kum & Go",
		status: "Recommended",
		reports_to: ["D&B", "Experian", "Equifax"],
		terms: "Net 15",
		is_pg_required: true,
		img: "https://cdn.brandfolder.io/9I9LN923/at/3tf6xqncpw4tx6pg6x5r3/kumandgo-500x250.png",
		phone: "888-539-4249",
		url: "https://www.kumandgofleet.com/",
		site: "https://www.kumandgofleet.com/",
		description: `Business owners handle a ton of responsibilities. With so much to think about, it can be easy to miss opportunities to save money. The right fleet card can help your company generate big savings, at the pump and beyond.
			Kum & Go’s fleet card partner is WEX Inc., a leading provider of corporate payment solutions.`,
		instructions: [`Kum & Go Universal Card – $40 set-up fee and $2 per card/mo.`],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			"Business address - matching everywhere.",
			"D & B number",
			"Business phone number listed to 411",
			"Business license - if applicable",
			"Business bank account",
			"A Social Security number for the business owner(s) will be required for informational purposes",
		],
	},
	{
		step: 15,
		name: "Maverick office supplies",
		status: "Recommended",
		reports_to: ["Equifax"],
		terms: "Net 30",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/j7wxffc88zrjrq66kbh2fgr/maverick-500x250.png",
		phone: "866-502-7414",
		url: "https://maverickofficesupplies.com/",
		site: "https://maverickofficesupplies.com/",
		description: `Maverick Office Supplies is the ultimate source for all of your business needs. We specialize in Business documents, Courses, Training, Educational videos, office supplies, and office furniture. We are ready to provide you and your team with the tools you need to succeed.`,
		instructions: [`The minimum order is $80 for the first order, then $40 for consecutive orders`],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			"Business address - matching everywhere.",
			"D & B number",
			"Business phone number listed to 411",
			"Business license - if applicable",
			"Business bank account",
			"Business phone number should be listed to 411 Directory",
			"3 months in business",
		],
	},
	{
		step: 15,
		name: "ecredable",
		status: "Recommended",
		reports_to: ["D&B", "Experian", "Equifax"],
		terms: "Net 30",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/7zwxtv9qgnck566vpsnr399n/ecredable-250x500.png",
		phone: "888-732-7337",
		url: "https://www.ecredable.com/",
		site: "https://www.ecredable.com/",
		description: `With eCredable, build business credit by reporting your business utility and telecom payments to credit bureaus that maintain your business credit reports and scores. Report your business utilities (power, water, gas, waste, mobile phone, TV services, internet, landline phone), business rent/lease, virtual office, vendors, suppliers, business insurance, and numerous business services (accounting, marketing, web and technology services).`,
		instructions: [
			`Business Lift costs $19.95 per month or $29.95 per month for Business Lift Plus.`,
			`There is a $24.95 fee to verify and add a utility provider if it is not already in their database. To see if the utility provider is in the database: https://business.ecredable.com/resources/utility-search`,
		],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			"Business address - matching everywhere.",
			"D & B number",
			"Business phone number listed to 411",
			"Business license - if applicable",
			"Business bank account",
		],
	},
	{
		step: 15,
		name: "JJ Gold",
		status: "Recommended",
		reports_to: ["D&B", "Equifax"],
		terms: "Net 30",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/csjphmx9ct2p59wt45kcwp7t/JJ-Gold-500x250.png",
		phone: "800-514-5351",
		url: "https://jjgold.com/",
		site: "https://jjgold.com/",
		description: `JJ Gold International started as a primary jewelry brand, and after almost 30 years in business, it now offers a wide variety of personal products and accessories. Most of our products are handmade and finely crafted. You will find quality products including decor, eyewear, fragrances, and gift baskets.`,
		instructions: [`Minimum purchase of $80 to report.`],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			"Business address - matching everywhere.",
			"D&B Number is optional",
			"Business license - if applicable",
			"Business bank account",
			`Copy of Driver's License`,
			`1 month in business`,
			`Current business utility bill`,
			`Bank statement showing correct company name and address`,
		],
	},
	{
		step: 15,
		name: "OFFICE GARNER",
		status: "Recommended",
		reports_to: ["Equifax"],
		terms: "Net 30",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/tqxmtnwhq9v4ww7gsf3p5mx/office-garner-500x250.png",
		phone: "800-421-0911",
		url: "https://officegarner.com/",
		site: "https://officegarner.com/",
		description: `Just like you, we are a proud small business company, hoping to carve our way into a success story through this overwhelming, noisy competition. We both know how difficult it can be. So we decided to help and sell our office materials and supplies on Net 30 terms. Buy now, pay later within 30 days. We offer top-quality goods for your office needs, your partners, and your loved ones.`,
		instructions: [`Membership fee of $69.`, `Minimum purchase of $45.`],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			"Business address - matching everywhere.",
			"D&B Number",
			"Business license - if applicable",
			"Business bank account",
			`Business address on the D&B should match with the Secretary of State and IRS records.`,
			`Must not have any derogatory business reporting or delinquencies`,
		],
	},
	{
		step: 15,
		name: "BREX",
		status: "Recommended",
		reports_to: ["D&B", "Experian", "Equifax"],
		terms: "Net Daily",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/gt37kmfs3gjhkxvb6t68hbtb/brex-500x250.png",
		phone: "844-725-9569",
		url: " https://brex.com/ ",
		site: " https://brex.com/ ",
		description: `Brex is rebuilding B2B financial products, starting with a corporate card for technology companies. We help startups of all sizes (from recently incorporated to later-stage companies) to instantly get a card that has 20x higher limits, completely automates expense management, kills receipt tracking and magically integrates with their accounting systems.`,
		// instructions: [`Membership fee of $69.`, `Minimum purchase of $45.`],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			"Business address - matching everywhere.",
			"D&B Number",
			"Business license - if applicable",
			"Business bank account",
			`The card is paid daily from money deposited on your Brex Cash account balance.`,
			`Provide or have plans to provide services and products to US customers.`,
			`Employ contract or have plans to employ contract US personnel`,
			`Must have professional investors like Venture Capital backing and Private Equity.`,
		],
	},
	{
		step: 15,
		name: "CREATIVE ANALYTICS",
		status: "Recommended",
		reports_to: ["Equifax"],
		terms: "Net 30",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/t9877xx4hckn9978cbgbqxx4/Creative-Analytics-500x250.png",
		phone: "202-688-3932",
		url: "https://creativeanalyticsdc.com/",
		site: "https://creativeanalyticsdc.com/",
		description: `A digital marketing agency and management consulting firm offers office products such as small electronics, desk and office decor/accessories, fitness items, beauty professional tools, kitchen items, etc., as well as monthly digital marketing services (e.g., websites and social media plans).`,
		instructions: [
			`The minimum first purchase to report is $100; the annual fee of $79.00 counts toward that minimum.`,
			`Payments received by the 28th of the month will be reported that month.`,
		],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			"Business address - matching everywhere.",
			"D&B Number",
			"Business license - if applicable",
			"Business bank account",
			`Established business for at least 30 days`,
			`The business phone number must match what D&B has as the business phone`,
			`The business address on the D&B should match the Secretary of State and IRS records.`,
			`Must not have any derogatory business reporting or delinquencies`,
		],
	},
	{
		step: 15,
		name: "THE CEO CREATIVE",
		status: "Recommended",
		reports_to: ["Equifax"],
		terms: "Net 30",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/fmsjqx66bbqjfscv3p9hvcnj/the-ceo-creative-500x250.png",
		phone: "754-755-0445",
		url: " https://theceocreative.com",
		site: " https://theceocreative.com",
		description: `The CEO Creative is the place to get low-priced electronics with great quality. Wireless buds, cameras for cars and trucks, speakers, and more We offer quality custom design and branding services. Create your own logo, business cards, business accessories, and more.`,
		instructions: [`Annual fee of $49`, `Minimum order of $60 to report.`],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			"Business address - matching everywhere.",
			`Business license- if applicable`,
			`Business bank account`,
			`1 month in business`,
			`Copy of your IRS Articles of Incorporation showing your Tax ID`,
			`Copy of your driver’s license or state ID`,
		],
	},
	{
		step: 15,
		name: "MURPHY USA",
		status: "Recommended",
		reports_to: ["D&B", "Experian", "Equifax"],
		terms: "Net 15",
		is_pg_required: true,
		img: "https://cdn.brandfolder.io/9I9LN923/at/mcm6t89nhpv8pcn9f97fvrfj/murphyusa-500x250.png",
		phone: "800-950-6128",
		url: "https://www.murphyusafleet.com/",
		site: "https://www.murphyusafleet.com/",
		description: `Murphy USA operates more than 1,400 stores in 27 states and employs more than 10,000 people. The stores provide quality, low-priced fuels, and outstanding service to nearly 2 million customers every day to get them where they need to go. Murphy USA’s fleet card partner is WEX Inc., a leading provider of corporate payment solutions.`,
		// instructions: [`Annual fee of $49`, `Minimum order of $60 to report.`],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			`Business address- matching everywhere.`,
			`D & B number`,
			`Business license - if applicable`,
			`Business bank account`,
			`Business phone number listed in 411`,
			`A Social Security number for the business owner(s) will be required for informational purposes`,
		],
	},
	{
		step: 15,
		name: "76",
		status: "Recommended",
		reports_to: ["D&B", "Experian", "Equifax"],
		terms: "Net 15",
		is_pg_required: true,
		img: "https://cdn.brandfolder.io/9I9LN923/at/4ngmpvfrrrr993mgt7hg6nt/76-250x500.png",
		phone: "855-241-1818",
		url: "https://www.76fleet.com",
		site: "https://www.76fleet.com",
		description: `76 has been on the driver’s side for more than 80 years now. The brand’s history traces its original company roots all the way back to Santa Paula, California, and Lyman Stewart, a co-founder of Union Oil Company of California. Today 76 is owned by Phillips 66 Company providing you with TOP TIER® gas in more than 1,800 retail fuel sites in the United States, and giving you its trademark customer service from day one. 76’s fleet card partner is Wex, Inc., a leading provider of corporate payment solutions.`,
		instructions: [`An accounting fee of $10 is charged based on the usage of the account.`],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			`Business address- matching everywhere.`,
			`D & B number`,
			`Business license - if applicable`,
			`Business bank account`,
			`A Social Security number for the business owner(s) will be required for informational purposes`,
		],
	},
	{
		step: 15,
		name: "ULINE",
		status: "Recommended",
		reports_to: ["D&B", "Experian"],
		terms: "Net 30",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/gz769r6h9835wmjsmwqmxp9/Uline-250x500.png",
		phone: "800-295-5510",
		url: "https://www.uline.com",
		site: "https://www.uline.com",
		description: `Uline is the leading distributor of Shipping, Industrial, Packing materials, Industrial and Janitorial Products. Uline offers many products for your household, as well as your business. 99.5% of Uline’s orders ship the same day, with no backorders. Uline brand products combine the best quality with the best value. Our buyers search worldwide for the finest products available at competitive prices.`,
		instructions: [
			`If they are not approved for Net 30 during the initial phase of the application, they must first place 5-7 prepaid orders for a period of 1-2 months before they can apply again for Net 30. No minimum orders are required. They report prepaid orders to the credit bureaus as well.`,
		],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			`Business address - matching everywhere.`,
			`D & B number`,
			`Business license - if applicable`,
			`Business bank account`,
			`Prefers business to have a good credit profile with D&B but not required`,
			`Business address on the D&B should match with the Secretary of State and IRS records.`,
		],
	},
	{
		step: 15,
		name: "WEX FLEET",
		status: "Recommended",
		reports_to: ["D&B", "Experian", "Equifax"],
		terms: "Net 15, 22 or Revolving",
		is_pg_required: true,
		img: "https://cdn.brandfolder.io/9I9LN923/at/5vg9brfvqhrxj6m52r5j3f2v/wex-500x250.png",
		phone: "800-395-0812",
		url: "https://www.wexinc.com/solutions/fleet-management/",
		site: "https://www.wexinc.com/solutions/fleet-management/",
		description: `Wrights Express (WEX Card) offers universal fleet cards, heavy truck cards, and universally accepted business fleet cards designed with features that support the small business, including a rewards program.`,
		// instructions: [``],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			`Business address - matching everywhere.`,
			`D & B number`,
			`Business license - if applicable`,
			`Business bank account`,
			`Business phone number listed in 411`,
			`A Social Security number for the business owner(s) will be required for informational purposes`,
		],
	},
	{
		step: 15,
		name: "GRAINGER INDUSTRIAL SUPPLY",
		status: "Recommended",
		reports_to: ["D&B"],
		terms: "Net 30",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/8wcjw7252bph7b8bc8572scc/Grainger-500x250.png",
		phone: "800-472-4643",
		url: "https://www.grainger.com/",
		site: "https://www.grainger.com/",
		description: `Grainger works with more than 1,300 suppliers to provide customers with electrical, fasteners, fleet maintenance, HVACR, hardware, janitorial, material handling, pneumatics, power tools, pumps, and much more.`,
		instructions: [`No min. order to report but prefers to have at least $50 order amount`],
		qualifications: [
			"Entity in good standing with Secretary of State for at least 60 days old",
			"EIN number with IRS",
			`Business address- matching everywhere.`,
			`D & B number`,
			`Business license - if applicable`,
			`Business bank account`,
			`Business address on the D&B should match with the Secretary of State and IRS records.`,
			` If a business doesn’t have an established credit, they will require additional documents like accounts payable, income statement, and balance sheets`,
		],
	},
	{
		step: 15,
		name: "FULTON BANK",
		status: "Recommended",
		reports_to: ["D&B"],
		terms: "Revolving",
		is_pg_required: true,
		img: "https://cdn.brandfolder.io/9I9LN923/at/k96r4g3z6r9kghmvjr3p6qh/Fulton-Bank-500x250.png",
		phone: "800-385-8664",
		url: "https://www.fultonbank.com/",
		site: "https://www.fultonbank.com/",
		description: `Since Fulton Bank opened its doors in 1882, we have striven to deliver the best banking experience for our customers. Our focus on customers has allowed us to grow along with you.

		Today, as part of Fulton Financial Corporation, a $21.3 billion financial services holding company, Fulton Bank offers a broad array of financial products and services in Pennsylvania, New Jersey, Maryland, Delaware, and Virginia.`,
		instructions: [
			`Applicants must live within these specific states: DE, MD, NJ, PA, and VA.`,
			`Cash advances are available with business credit card approval; the amount of the cash advance depends on the approval amount.`,
		],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			`Business address - matching everywhere.`,
			`D & B number`,
			`Business license - if applicable`,
			`Business bank account`,
			`3 years in business`,
			`Business address on the D&B should match with the Secretary of State and IRS records.`,
			`A personal guarantee (PG) is required- minimum credit score of 650, does a hard pull`,
		],
	},
	{
		step: 15,
		name: "GENERAL MOTORS",
		status: "Recommended",
		reports_to: ["Experian", "Equifax"],
		terms: "Revolving",
		is_pg_required: true,
		img: "https://cdn.brandfolder.io/9I9LN923/at/99kx5m57fkfmkvncfc3kkws/general-motors-500x250.png",
		phone: "833-773-0990",
		url: "https://www.buypowercard.com/",
		site: "https://www.buypowercard.com/",
		description: `As a cardmember, you build earnings you can use to save toward your next GM vehicle* with everything you buy. But there’s a world of other GM benefits available to all GM owners, that can make your journey even more rewarding. Explore them all and connect with the perks of being part of the GM family. The GM Business™ Mastercard® rewards small business owners with special benefits. Build earnings toward an eligible, new Chevrolet, Buick, GMC, or Cadillac vehicle for the job.`,
		instructions: [
			`Cash advances are available with business credit card approval, the amount of cash advance depends upon the approval amount.`,
		],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			`Business address - matching everywhere.`,
			`D & B number`,
			`Business license - if applicable`,
			`Business bank account`,
			`Bank references`,
			`Trade/credit references`,
			`3 months of business bank statement`,
			`6 months in business`,
			`A personal guarantee (PG) is required- does a soft pull`,
		],
	},
	{
		step: 15,
		name: "FLYING J",
		status: "Recommended",
		reports_to: ["D&B"],
		terms: "Net 1",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/v96j6cs8xc24nc9nfww6rf6/pilot-flyingj-500x250.png",
		phone: "865-474-2953",
		url: "https://www.pilotflyingj.com",
		site: "https://www.pilotflyingj.com",
		description: `With over 60 years in business, Flying J is one of the leading fuel companies in the country. If you’re looking for a small business fuel card or a mixed fuel fleet card, we’ve got you covered. Axle Fuel Card™, an affiliate of Pilot, is for any business looking to save money and time when fueling their vehicles. Whether you run a fleet of landscaping trucks, moving vans, or even a fleet of box trucks – Axle Fuel Card has the features you need. Gas-only fleets are not eligible for approval.`,
		instructions: [
			`We require a DOT if they’re leased or under the control of a company. We need a lease agreement just to show that they have the authority to actually drive and have the insurance. If there’s no DOT, we will ask for documentation for a lease agreement from the company they possibly lease to. and they are insured with the other company. If you have a commercial vehicle and you are not going to cross state lines, then all you need is a DOT.`,
		],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			`Business address- matching everywhere.`,
			`D & B number`,
			`Business license - if applicable`,
			`Business bank account`,
			`Most recent bank statement`,
			`Truckers and diesel accounts require DOT Registration`,
			`A driver’s license is required`,
			`Has a DOT number or lease or contract agreement from the company that you will be leasing the authority from.`,
			`Customers without DOT Registration will be referred to Axel for gasoline card`,
		],
	},
	{
		step: 15,
		name: "ZORO",
		status: "Recommended",
		reports_to: ["D&B"],
		terms: "Net 30",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/9r68cmqp3fk7nk7q8cmh5r4/Zoro-500x250.png",
		phone: "855-289-9676",
		url: "https://www.zoro.com/",
		site: "https://www.zoro.com/",
		description: `Shop at Zoro and find millions of premium products from thousands of trusted brands, including tools, office supplies, industrial equipment, safety products, and much more. We offer Net 30 terms to qualified businesses. These lines of credit give you time to pay off orders and easily track monthly expenses.`,
		// instructions: [``],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			`Business address - matching everywhere.`,
			`D & B number and some established credit history with D&B`,
			`Business license - if applicable`,
			`Business bank account`,
		],
	},
	{
		step: 15,
		name: "MARATHON",
		status: "Recommended",
		reports_to: ["D&B", "Experian", "Equifax"],
		terms: "Net 15",
		is_pg_required: true,
		img: "https://cdn.brandfolder.io/9I9LN923/at/wrk6wcgtcmbx4jmv3n6pg7/marathon-500x250.png",
		phone: "866-562-1045",
		url: "https://www.marathonbrand.com",
		site: "https://www.marathonbrand.com",
		description: `Earn savings for miles with Marathon Business Fleet Cards. Maximize your time and money while keeping your drivers moving and your business fueled up.
		Marathon Petroleum Company LP’s (MPC’s) marketing organization is recognized as a consistent leader in the petroleum industry. MPC provides transportation fuels, asphalt, and specialty products throughout the United States. Our comprehensive product line supports commercial, industrial, and retail operations. Marathon’s fleet card partner is WEX Inc., a leading provider of corporate payment solutions.`,
		// instructions: [``],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			`Business address - matching everywhere.`,
			`D & B number`,
			`Business license - if applicable`,
			`Business bank account`,
			`A Social Security number for the business owner(s) will be required for informational purposes`,
		],
	},
	{
		step: 15,
		name: "CREDIT STRONG",
		status: "Recommended",
		reports_to: ["Equifax"],
		terms: "Loan",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/r5z37kj53cz6r4v9vqp5jq4/Credit-Strong-500x250.png",
		phone: "833-850-0850",
		url: "https://www.creditstrong.com/",
		site: "https://www.creditstrong.com/",
		description: `Credit Strong is a division of Austin Capital Bank, a 5-star rated independent community bank and member of the FDIC. We have grown to be one of the preeminent community banks in Central Texas and a national leader in responsible financial services innovation. When you open a credit-builder account, we open an installment account and savings account for your company. The loan proceeds are deposited in the savings account to secure the loan. Every monthly payment builds savings and credit history.`,
		instructions: [`Not eligible in WI or VT`],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			`Business address - matching everywhere.`,
			`D & B number`,
			`Business license - if applicable`,
			`Business bank account`,
			`3 months in business`,
			`Must be an LLC, Partnership, or Corporation`,
			`own at least 25% of the business`,
			`have no co-owner(s) that individually own 25% or more of the business`,
			`have a physical U.S residence, valid social security number (SSN), or individual taxpayer identification number (ITIN) and valid ID`,
		],
	},
	{
		step: 15,
		name: "BRANDED APPAREL CLUB",
		status: "Recommended",
		reports_to: ["Equifax"],
		terms: "Net 30",
		is_pg_required: false,
		img: "https://cdn.brandfolder.io/9I9LN923/at/cx7nxtmq57j7xkgqk34qnbgp/business-tshirt-club-500x250.png",
		phone: "866-571-5040",
		url: "https://brandedapparelclub.com/",
		site: "https://brandedapparelclub.com/",
		description: `Branded Apparel Club is a wholesale t-shirt and apparel-buying club exclusively for business owners & entrepreneurs. Membership grants you access to premium apparel brands at wholesale rates for all your apparel needs!`,
		instructions: [
			`
						The annual membership fee of $69.00 will not be reported to the credit bureaus; they only report the purchases.

						The minimum order quantity for custom-printed apparel is 12 items per design. For pre-decorated items, a minimum order of $100 before shipping and taxes is required. For blank apparel orders, there is a minimum order of 12 per color and an amount of $250 before a shipping fee is required.
						
						STANDARD
						Credit Limit: $2500
						50% Order Deposit Required
						$100 Minimum Order Requirement
						
						PREMIUM
						Credit Limit: $5000
						No Order Deposit Required
						$1000 Minimum Order Requirement
		`,
		],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			`Business address - matching everywhere.`,
			`D & B number`,
			`Business license - if applicable`,
			`Business bank account`,
		],
	},
];
