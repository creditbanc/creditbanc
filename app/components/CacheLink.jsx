import { de } from "@faker-js/faker";
import { Link } from "@remix-run/react";
import murmurhash from "murmurhash";
import {
	filter,
	includes,
	isEmpty,
	join,
	keys,
	map,
	pipe,
	__,
	head,
	defaultTo,
	uniq,
	split,
	last,
	uniqBy,
	not,
} from "ramda";
import { useEffect, useState } from "react";
import { all, get, mod } from "shades";
import { create } from "zustand";
let tap = (value) => {
	console.log("tap");
	console.log(value);
	return value;
};
export const use_cache = create((set) => ({
	keys: {},
	routes: {},
	set_state: (path, value) => set((state) => pipe(mod(...path)(() => `${murmurhash(value)}`))(state)),

	set_dependencies: ({ path, dependencies = [] }) => {
		// console.log("set_dependencies");
		// console.log(dependencies);
		// console.log(path);

		let create_keys = (dependencies) => {
			let keys = {};
			pipe(
				map((dependency) => {
					keys[dependency.name] = dependency.value;
				})
			)(dependencies);
			return keys;
		};

		const update_routes = pipe(mod("routes", path)(() => pipe(get(all, "name"))(dependencies)));

		const update_keys = pipe(
			mod("keys")((keys) => pipe(create_keys, (path_keys) => ({ ...keys, ...path_keys }))(dependencies))
		);

		return set((state) => pipe(update_routes, update_keys)(state));
	},
}));

export default function CacheLink({ to, id = "", className = "", children }) {
	let cache = use_cache((state) => state);
	let [href, setHref] = useState(to);

	const create_cache_string = (path, cache) => {
		// console.log("create_cache_string");
		// console.log(path);
		// console.log(cache);
		let get_route_key = pipe(get("routes"), keys, filter(includes(__, path)), head, defaultTo(""));

		let res = pipe(get_route_key, (route_key) =>
			pipe(
				get("routes", route_key),

				defaultTo([]),
				uniq,
				map((dependency) => ({ key: dependency, value: cache.keys[dependency] }))
				// map((dependency) => `${dependency}=${cache.keys[dependency]}`)
				// join("&")
			)(cache)
		)(cache);

		return res;
	};

	useEffect(() => {
		if (!isEmpty(cache.keys)) {
			let cache_params = create_cache_string(to, cache);
			let cache_string_keys = pipe(get(all, "key"))(cache_params);
			// let link = to.includes("?") ? `${to}&${cache_params}` : `${to}?${cache_params}`;

			let url_path = pipe(split("?"), head, defaultTo(""))(to);
			let path_params = pipe(split("?"), (value) => {
				if (value.length < 2) return [];
				return pipe(last, split("&"), map(split("=")))(value);
			});

			let other_params = pipe(
				path_params,
				filter((value) => not(includes(value[0], cache_string_keys))),
				map((param) => ({ key: param[0], value: param[1] }))
			)(to);

			let params = pipe(
				map((param) => `${param.key}=${param.value}`),
				join("&")
			)([...other_params, ...cache_params]);

			let link = `${url_path}?${params}`;

			console.log("cache_string");
			console.log(cache_params);
			console.log(other_params);
			console.log(params);
			console.log(url_path);
			console.log(link);

			setHref(link);
		}
	}, [cache.keys]);

	return (
		<Link key={id} className={className} to={href}>
			{children}
		</Link>
	);
}
