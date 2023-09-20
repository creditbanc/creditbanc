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
} from "ramda";
import { useEffect, useState } from "react";
import { all, get, mod } from "shades";
import { create } from "zustand";

export const use_cache = create((set) => ({
	keys: {},
	routes: {},
	set_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => `${murmurhash(value)}`))(state)),

	set_dependencies: ({ path, dependencies }) => {
		let create_keys = (dependencies) => {
			let keys = {};
			pipe(
				map((dependency) => {
					keys[dependency.name] = dependency.value;
				})
			)(dependencies);
			return keys;
		};

		const update_routes = pipe(
			mod("routes", path)(() => pipe(get(all, "name"))(dependencies))
		);

		const update_keys = pipe(
			mod("keys")((keys) =>
				pipe(create_keys, (path_keys) => ({ ...keys, ...path_keys }))(
					dependencies
				)
			)
		);

		return set((state) => pipe(update_routes, update_keys)(state));
	},
}));

export default function CacheLink({ to, children }) {
	let cache = use_cache((state) => state);
	let [href, setHref] = useState("");

	const create_cache_string = (path, cache) => {
		let get_route_key = pipe(
			get("routes"),
			keys,
			filter(includes(__, path)),
			head
		);

		let res = pipe(get_route_key, (route_key) =>
			pipe(
				get("routes", route_key),
				map((dependency) => `${dependency}=${cache.keys[dependency]}`),
				join("&")
			)(cache)
		)(cache);

		return res;
	};

	useEffect(() => {
		if (!isEmpty(cache.keys)) {
			// console.log(cache);
			let cache_string = create_cache_string(to, cache);
			let link = to.includes("?")
				? `${to}&${cache_string}`
				: `${to}?${cache_string}`;
			setHref(link);
		}
	}, [cache.keys]);

	return <Link to={href}>{children}</Link>;
}
