import { pipe, equals, join, curry, map, isEmpty, not, difference, keys } from "ramda";
import { all } from "shades";
import { json, redirect } from "@remix-run/node";
import { search_params, get } from "./helpers";

export const cache = curry((request, payload) => {
	let { cache_dependencies: dependencies } = payload;
	console.log("helpers.cache");
	console.log(dependencies);

	let url = new URL(request.url);
	let url_params = search_params(request);
	let url_param_keys = pipe(keys)(url_params);
	let dependency_params = pipe(get(all, "name"))(dependencies);
	let url_has_dependencies = pipe(difference(dependency_params), equals([]))(url_param_keys);

	let url_has_params = pipe(isEmpty, not)(url_params);

	const to_search_param_pairs = pipe(map((dependency) => `${dependency.name}=${dependency.value}`));

	let cache_string = (dependencies) =>
		url_has_params
			? pipe(to_search_param_pairs, join("&"), (value) => `&${value}`)(dependencies)
			: pipe(to_search_param_pairs, join("&"), (value) => `?${value}`)(dependencies);

	let redirect_link = `${url.href}${cache_string(dependencies)}`;

	if (url_has_dependencies) {
		// console.log("url_has_dependencies");
		// console.log(payload);
		// return payload;
		return json(payload, {
			headers: {
				"Cache-Control": "private, max-age=31536000",
			},
		});
	} else {
		return redirect(redirect_link);
	}
});
